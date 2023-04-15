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

d3.json("https://data.cityofchicago.org/api/geospatial/cauq-8yn6?method=export&format=GeoJSON").then(function(data) {
  projection.fitSize([width,height],data); // fit the projection to the data

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
      .attr("cx", function(d) { return path.centroid(d.geometry)[0]; })
      .attr("cy", function(d) { return path.centroid(d.geometry)[1]; })
      .attr("r", function(d) { return d.properties.numCrimes / 100; })
      .style("fill", "red")
      .style("opacity", 0.5)
      .style("stroke", "none");
  });
});