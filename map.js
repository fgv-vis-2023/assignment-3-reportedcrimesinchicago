var width = 670;
var height = 780;

var projection = d3.geoMercator()
  .center([-87.6298, 41.8781])
  .scale(40000)
  .translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

var svg = d3.select(".container-fluid").append("svg")
  .attr('class', 'map')
  .attr("width", width)
  .attr("height", height);

var crimeData;
// create a tooltip
var tooltip = d3.select(".tooltip");

// create a color scale
var colorScale = d3.scaleQuantize().domain([1, 3000]).range(d3.schemeReds[9]);

d3.json("https://data.cityofchicago.org/api/geospatial/cauq-8yn6?method=export&format=GeoJSON").then(function(data) {
  projection.fitSize([width,height],data); // fit the projection to the data

  // Group crimes by community area and count the number of crimes per area
  d3.csv("https://data.cityofchicago.org/api/views/xguy-4ndq/rows.csv?accessType=DOWNLOAD").then(function(crimes) {
    crimes.forEach(function(d) {
      const coords = projection([+d.Longitude, +d.Latitude]);
      d.x = coords[0];
      d.y = coords[1];
    });
      
    crimeData = d3.rollup(crimes, v => v.length, d => d["Community Area"]);

    // Join the crime data with the GeoJSON data
    data.features.forEach(function(d) {
      var area = d.properties.area_num_1;
      if (crimeData.has(area)) {
        d.properties.numCrimes = crimeData.get(area);
      } else {
        d.properties.numCrimes = 0;
      }
    });    
    console.log(data);

    // Color the map according to the number of crimes per area and add a tooltip
    svg.selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("d", path)
      .style("fill", function(d) {
        var numCrimes = d.properties.numCrimes;
        return colorScale(numCrimes);
      })
      .style("stroke", "white")
      .on("mouseover", function(data) { 
        d3.select(this).style("stroke", "black").attr("stroke-width", 2);
          tooltip.transition()
            .duration(200)
            .style("opacity", .9);
          tooltip.html("Number of crimes: ")// + data.properties.numCrimes)
            .style("visibility", "visible")
            .style("left", (d3.mouse(this) + 10) + "px")
            .style("top", (d3.mouse(this) - 28) + "px");
      })
      .on("mouseout", function() {
        d3.select(this).style("stroke", "white");
        tooltip.transition()
          .duration(500)
          .style("opacity", 0);
      });
  });
});

// Create a sidebar
var sidebar = d3.select(".container-fluid").append("svg")
  .attr('class', 'sidebar')
  .attr("width", 1040-width)
  .attr("height", height);

// Add a legend
legenda = sidebar.append("g")
  .attr("class", "legend")
  .attr("transform", "translate(30,20)");

legenda.selectAll("rect")
  .data(colorScale.range().map(function(d) {
    d = colorScale.invertExtent(d);
    if (d[0] == null) d[0] = colorScale.domain()[0];
    if (d[1] == null) d[1] = colorScale.domain()[1];
    return d;
  }))
  .enter().append("rect")
  .attr("height", 8)
  .attr("x", function(d, i) { return 25 * i; })
  .attr("width", 25)
  .attr("fill", function(d) { return colorScale(d[0]); });

legenda.append("text")
  .attr("class", "caption")
  .attr("x", 1)
  .attr("y", -6)
  .text("Number of crimes");

legenda.call(d3.axisBottom()
  .scale(d3.scaleLinear()
    .domain(d3.extent(colorScale.domain()))
    .rangeRound([0, 25 * 9]))
  .tickSize(13)
  .tickFormat(function(x, i) { return i ? x : x; })
  .tickValues([0, 1000, 2000, 3000]))
  .select(".domain")
    .remove();