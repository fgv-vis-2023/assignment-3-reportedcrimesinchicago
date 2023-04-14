var width = 800;
var height = 600;

var projection = d3.geoMercator()
  .center([-87.6298, 41.8781])
  .scale(80000)
  .translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

var svg = d3.select("#map").append("svg")
  .attr("width", width)
  .attr("height", height);

d3.json("communityareas.geojson").then(function(data) {
  svg.selectAll("path")
    .data(data.features)
    .enter()
    .append("path")
    .attr("d", path)
    .style("fill", "gray")
    .style("stroke", "white");
});