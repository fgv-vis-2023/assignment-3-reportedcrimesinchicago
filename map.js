var width = 700;
var height = 800;

var projection = d3.geoMercator()
  .center([-87.6298, 41.8781])
  .scale(50000);
  //.translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

var svg = d3.select(".container-fluid").append("svg")
  .attr('class', 'map')
  .attr("width", width)
  .attr("height", height);

var mouseover = function(event, d) {
  Tooltip
    .style("opacity", 1)
    //.html("<h3>" + d.school_name_long + "</h3>" +
    //      "School Type: " + d.school_type + "<br/>"
    //)
    d3.select(this)
      .style("stroke", "grey")
      .attr("stroke-width", 2)
      .style("opacity", 0.8)
  }

var mouseleave = function(d) {
  Tooltip.style("opacity", 0)
  //gradRateTooltip.selectAll('text').remove()
  //gradRateTooltip.selectAll('svg').remove()
  d3.select(this)
    .style("stroke", "#5e5e5e")
    .attr("stroke-width", 1)
    .style("opacity", 0.7)
    .transition()		
    .duration(500)
}

d3.json("https://data.cityofchicago.org/api/geospatial/cauq-8yn6?method=export&format=GeoJSON").then(function(data) {
  projection.fitSize([width,height],data); // fit the projection to the data

  // Draw the map
  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", "#ccc")
    .style("stroke", "white");

  // Group crimes by community area and count the number of crimes per area
  var crimeData = d3.csv("https://data.cityofchicago.org/api/views/xguy-4ndq/rows.csv?accessType=DOWNLOAD").then(function(crimes) {
    crimes.forEach(function(d) {
      const coords = projection([+d.Longitude, +d.Latitude]);
      d.x = coords[0];
      d.y = coords[1];
    });

    //var crimeTypes = [...new Set(crimes.map(d => d["Primary Type"]))];
  
    var crimesByArea = d3.rollup(crimes, v => v.length, d => d["Community Area"]);

    // Join the crime data with the GeoJSON data
    data.features.forEach(function(d) {
      var area = d.properties.area_num_1;
      if (crimesByArea.has(area)) {
        d.properties.numCrimes = crimesByArea.get(area);
      } else {
        d.properties.numCrimes = 0;
      }
    });

    // Draw a circle for each area with size proportional to the number of crimes
    svg.selectAll("circle")
      .data(data.features)
      .enter()
      .append("circle")
        //.attr("class" , function(d){ return d.crimetype.concat(" ") })
        .attr("cx", function(d) { return path.centroid(d.geometry)[0]; })
        .attr("cy", function(d) { return path.centroid(d.geometry)[1]; })
        .attr("r", function(d) { return d.properties.numCrimes / 80; })
        .style("fill", "red")
        .style("opacity", 0.5)
        .style("stroke", "none");
        //.on("mouseover", mouseover)
        //.on("mouseleave", mouseleave);
  });
});

//     Size Legend     //
var valuesToShow = [100, 500, 1500, 3000];
var xCircle = 580;
var xLabel = 650;
var yCircle = 100;
var radius = d3.scaleSqrt().domain([0, 3200]).range([0, 38]);
    
  svg.append("text")
    .attr('x', 550)
    .attr('y', 10)
    .text("# Crimes")
    .attr('alignment-baseline', 'middle')

    // circles
    svg.selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("circle")
      .attr("class", "legend")
      .attr("cx", xCircle)
      .attr("cy", d => yCircle -radius(d))
      .attr("r", radius)

    // line
    svg.selectAll("legend")
    .data(valuesToShow)
    .enter()
    .append("line")
      .attr("class", "legend")
      .attr('x1', d => xCircle + radius(d))
      .attr('x2', xLabel)
      .attr('y1', d => yCircle -radius(d))
      .attr('y2', d => yCircle -radius(d))
      .style('stroke-dasharray', ('2, 2'))

    // lables
    svg.selectAll("legend")
      .data(valuesToShow)
      .enter()
      .append("text")
        .attr("id", "legend-text")
        .attr('x', xLabel + 10)
        .attr('y', d => yCircle -radius(d) )
        .text( function(d){ return d } )