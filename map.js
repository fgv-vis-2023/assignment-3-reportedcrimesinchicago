var width = 1024; //80% de 1280
var height = 550; //50% de 720

//Projection centered in chicago
var projection = d3.geoMercator()
  .center([-87.6298, 41.8781])
  .scale(40000)
  .translate([width / 2, height / 2]);

var path = d3.geoPath().projection(projection);

var colorScale = d3.scaleQuantize()
  .domain([1, 15000])
  .range(d3.schemeReds[9]);

var SVG = d3.select("#chicagoMap")
  .append("svg")
  .attr("class", "map")
  .attr("width", 500)
  .attr("height", height);

var sidebar = d3.select("#chicagoMap")
  .append("svg")
  .attr("class", "sidebar")
  .attr("width", width-500)
  .attr("height", height);

var beginYear = 2014;
const playButton = document.getElementById("playButton");
let intervalId;

d3.json("https://raw.githubusercontent.com/fgv-vis-2023/assignment-3-reportedcrimesinchicago/main/crimes.geojson")
.then(data => {
  //Fit projection
  projection.fitSize([width/2, height], data);
  const dataMap = data.features;

  //Add legend scale
  var legenda = SVG.append("g")
    .attr('class', 'caption')
    .attr("width", 30)
    .attr("height", height/2)
    .attr("transform", `translate(70,260)`);

  legenda.selectAll("rect")
  .data(colorScale.range().map(function(d) {
    d = colorScale.invertExtent(d);
    return d;
  }))
  .enter()
    .append("rect")
      .attr("height", 25)
      .attr("y", function(d, i) { return 25 * i; })
      .attr("width", 10)
      .attr("fill", function(d) { return colorScale(d[0]); });

  legenda.append("text")
    .attr("class", "caption")
    .attr("x", 45)
    .attr("y", 265)
    .text("Number of crimes");

  // tick numbers on legend in same style as text on legend
  legenda.call(d3.axisLeft()
    .scale(d3.scaleLinear()
      .domain(d3.extent(colorScale.domain()))
      .rangeRound([0, 25 * 9]))
    .tickSize(13)
    .tickFormat(function(x, i) { return i ? x : x; })
    .tickValues([0, 5000, 10000, 15000]))
    .select(".domain")
      .remove(); 
     
  //Plot map
  map = SVG.selectAll("path")
    .data((dataMap).filter(d=>d.properties["Year"]===beginYear))
    .join(
      function(enter) {
        return enter
          .append("path")
          .attr("d", path)
          .attr("fill", d => {
            var numCrimes = d.properties["Number of Crimes"];
            return colorScale(numCrimes);})  
          .attr("stroke", "grey")
      },
    )

  //Add a tooltip
  map.append("title")
  .text(d => `${d.properties['Community Name']}: ${d.properties['Number of Crimes']} crimes.`);     

  map
  .on("mouseover", function (d) {
    d3.select(this)
      .style("stroke", "red")
      .attr("stroke-width", 2)
      .attr("paint-order", "markers");
    //sidebar
    sidebar.select(".regionInfo")
      .append("text")
      .text(d.target.__data__.properties["Community Name"] + ": " + d.target.__data__.properties["Number of Crimes"] + " crimes in " + d.target.__data__.properties["Year"])
      .attr("fill", "black");
  })
  .on("mouseout", function (d) {
    d3.select(this).style("stroke", null).attr("stroke-width", 1);
    // clear sidebar
    sidebar.select(".regionInfo").selectAll("*").remove();
  })

  map
    .on("click", function (d) {
      arr = d.target.__data__.properties["Description"].split(',');
      descriptionCount =  Object.entries(arr.reduce((acc, curr) => 
      {acc[curr] = (acc[curr] || 0) + 1; 
        return acc;
      }, {})).sort((a,b) => b[1]-a[1]);
      var data = descriptionCount.slice(0,5);
    
      var values = []
      data.forEach(entry => {
        values.push(entry.at(1))
      })
      size = d3.scaleLinear()
        .domain(d3.extent(values))
        .range([10, 40]);
      y = d3.scaleLinear()
        .domain([0, 35*5])  
        .range([70, height]);
      var i = 0;
      data.forEach(entry => {
        var key = entry.at(0);
        var value = entry.at(1);
        sidebar.select(".regionInfo")
        .append("text")
        .text(key)
          .attr("x", 0)
          .attr("y", y(i))
          .attr("font-size", `${size(value)/20}em`);
          i+=25;
      })
    })  

});    

//Listener to update graph
const slider = document.getElementById("yearSlider");
slider.addEventListener("input", function() {
  updateMap(parseInt(slider.value));
});

//Listener to play button
playButton.addEventListener("click", () => {
  const playFunction = () => {
    beginYear++; 
    if (beginYear > 2022) { 
      clearInterval(intervalId);
    }
    document.getElementById("yearSlider").value = beginYear; 
    updateMap(beginYear); 
  };

  intervalId = setInterval(playFunction, 2000); // Executa a função a cada 1 segundo
});

playButton.addEventListener("click", function() {
  let year = parseInt(slider.value);
  const intervalId = setInterval(function() {
    year++;
    if (year >= 2022) {
      clearInterval(intervalId);
    }
    slider.value = year;
    updateMap(year);
    rangeValue.innerText = year;
  }, 2000); 
});

function updateMap(year) {
  d3.json("https://raw.githubusercontent.com/fgv-vis-2023/assignment-3-reportedcrimesinchicago/main/crimes.geojson")
    .then(data => {
    const dataMap = data.features;
    beginYear = year;
    map = SVG.selectAll("path")
      .data((dataMap).filter(d=>d.properties["Year"]===year))

    map.join(
      enter => enter.append("path")
        .attr("d", path)
        .attr("fill", d => {
          var numCrimes = d.properties["Number of Crimes"];
          return colorScale(numCrimes);
        })
        .attr("stroke", "grey")
        .append("title")
        .text(d => {
          const community = d.properties['Community Name'];
          const numCrimes = dataMap.find(d => d.properties['Community Name'] === community && d.properties['Year'] === selectedYear).properties['Number of Crimes'];
          return `${community}: ${numCrimes} crimes.`;
        }),  
      update => update
        .attr("fill", d => {
          var numCrimes = d.properties["Number of Crimes"];
          return colorScale(numCrimes);
        })
        .select("title")
        .text(d => `${d.properties['Community Name']}: ${d.properties['Number of Crimes']} crimes.`),
      exit => exit.remove()
    );

    map
    .on("click", function (d) {
      arr = d.target.__data__.properties["Description"].split(',');
      descriptionCount =  Object.entries(arr.reduce((acc, curr) => 
      {acc[curr] = (acc[curr] || 0) + 1; 
        return acc;
      }, {})).sort((a,b) => b[1]-a[1]);
      var data = descriptionCount.slice(0,5);
    
      var values = []
      data.forEach(entry => {
        values.push(entry.at(1))
      })
      size = d3.scaleLinear()
        .domain(d3.extent(values))
        .range([10, 40]);
      y = d3.scaleLinear()
        .domain([0, 35*5])  
        .range([70, height]);
      var i = 0;
      data.forEach(entry => {
        var key = entry.at(0);
        var value = entry.at(1);
        sidebar.select(".regionInfo")
        .append("text")
        .text(key)
          .attr("x", 0)
          .attr("y", y(i))
          .attr("font-size", `${size(value)/20}em`);
          i+=25;
      })
    })  
   
  map
  .on("mouseover", function (d) {
    d3.select(this)
      .style("stroke", "red")
      .attr("stroke-width", 2)
      .attr("paint-order", "markers");
    //sidebar
    sidebar.select(".regionInfo")
      .append("text")
      .text(d.target.__data__.properties["Community Name"] + ": " + d.target.__data__.properties["Number of Crimes"] + " crimes in " + d.target.__data__.properties["Year"])
      .attr("fill", "black");
  })
  .on("mouseout", function (d) {
    d3.select(this).style("stroke", "grey").attr("stroke-width", 1);
    // clear sidebar
    sidebar.select(".regionInfo").selectAll("*").remove();
    });
  })
}

// sidebar
sidebar.append("rect")
  .attr("width", 400)
  .attr("height", 60)
  .attr("fill", "white");

sidebar.append("text")
  .text("Hover over a region to see more information about it.")
  .attr("transform", `translate(10, 20)`);

sidebar.append("text")
  .text("Then, click on the region to see the most 5 popular crimes descriptions.")
  .attr("transform", `translate(10, 40)`);

sidebar.append("g")
  .attr("class", "regionInfo")
  .attr("transform", `translate(10, 60)`);