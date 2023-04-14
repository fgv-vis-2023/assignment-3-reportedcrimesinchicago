var width = 960;
var height = 500;

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("background-color", "#ccc");

var projection = d3.geo.albers()
    .scale(1000)
    .rotate([87.6, 0])
    .center([0, 41.8])
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

chicagoNeighborhoods = d3.json("chicago.geojson")

chicagoCrimes = d3.csv("crimes.csv")

svg.append("path")
    .data(chicagoNeighborhoods.features)
    .enter()
    .append("path")
    .attr("fill", "#ccc")
    .attr("stroke", "#000")
    .attr("d", path);