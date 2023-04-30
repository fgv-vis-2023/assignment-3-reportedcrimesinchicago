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
  .attr("width", 400)
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
    }) 
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

sidebar.append("g")
  .attr("class", "regionInfo")
  .attr("transform", `translate(10, 50)`);

// wordcloud
var stopwords = new Set(["10,18,30,300,-,/,$,p,o,i,me,my,myself,we,us,our,ours,ourselves,you,your,yours,yourself,yourselves,he,him,his,himself,she,her,hers,herself,it,its,itself,they,them,their,theirs,themselves,what,which,who,whom,whose,this,that,these,those,am,is,are,was,were,be,been,being,have,has,had,having,do,does,did,doing,will,would,should,can,could,ought,i'm,you're,he's,she's,it's,we're,they're,i've,you've,we've,they've,i'd,you'd,he'd,she'd,we'd,they'd,i'll,you'll,he'll,she'll,we'll,they'll,isn't,aren't,wasn't,weren't,hasn't,haven't,hadn't,doesn't,don't,didn't,won't,wouldn't,shan't,shouldn't,can't,cannot,couldn't,mustn't,let's,that's,who's,what's,here's,there's,when's,where's,why's,how's,a,an,the,and,but,if,or,because,as,until,while,of,at,by,for,with,about,against,between,into,through,during,before,after,above,below,to,from,up,upon,down,in,out,on,off,over,under,again,further,then,once,here,there,when,where,why,how,all,any,both,each,few,more,most,other,some,such,no,nor,not,only,own,same,so,than,too,very,say,says,said,shall"
.split(",")]);

var descriptions = ["ARMED - OTHER DANGEROUS WEAPON", "TO VEHICLE", "TELEPHONE THREAT", "TO VEHICLE", "ARMED - HANDGUN", "TO PROPERTY"];

var words = String(descriptions)
  .split(/[\s.,]+/g)
  .map((w) => w.replace(/^[“‘"\-—()\[\]{}]+/g, ""))
  .map((w) => w.replace(/[;:.!?()\[\]{},"'’”\-—]+$/g, ""))
  .map((w) => w.replace(/['’]s$/g, ""))
  .map((w) => w.toLowerCase())
  .filter((w) => w && !stopwords.has(w));

var wordCloud = sidebar
    .append("g")
    .attr("class", "wordcloud")
    .attr("transform", `translate(10, 100)`);

const cloud = WordCloud(descriptions, {
  width: 350,
  height: 300});
  
wordCloud.node().appendChild(cloud);

function WordCloud(
  text,
  {
    size = (group) => group.length, // Given a grouping of words, returns the size factor for that word
    word = (d) => d, // Given an item of the data array, returns the word
    marginTop = 0, // top margin, in pixels
    marginRight = 0, // right margin, in pixels
    marginBottom = 0, // bottom margin, in pixels
    marginLeft = 0, // left margin, in pixels
    width = 550, // outer width, in pixels
    height = 380, // outer height, in pixels
    maxWords = 200, // maximum number of words to extract from the text
    fontFamily = "sans-serif", // font family
    fontScale = 3, // base font size
    padding = 0, // amount of padding between the words (in pixels)
    rotate = 0, // a constant or function to rotate the words
    invalidation // when this promise resolves, stop the simulation
  } = {}
) {
  const words =
    typeof text === "string" ? text.split(/\W+/g) : Array.from(text);

  const data = d3
    .rollups(words, size, (w) => w)
    .sort(([, a], [, b]) => d3.descending(a, b))
    .slice(0, maxWords)
    .map(([key, size]) => ({ text: word(key), size }));

  const svg = d3
    .create("svg")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("font-family", fontFamily)
    .attr("text-anchor", "middle")
    .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  const g = svg
    .append("g")
    .attr("transform", `translate(${marginLeft},${marginTop})`);

  const cloud = d3Cloud()
    .size([width - marginLeft - marginRight, height - marginTop - marginBottom])
    .words(data)
    .padding(padding)
    .rotate(rotate)
    .font(fontFamily)
    .fontSize((d) => Math.sqrt(d.size) * fontScale)
    .on("word", ({ size, x, y, rotate, text }) => {
      g.append("text")
        .attr("font-size", size)
        .attr("transform", `translate(${x},${y}) rotate(${rotate})`)
        .text(text);
    });

  cloud.start();
  invalidation && invalidation.then(() => cloud.stop());
  return svg.node();
};