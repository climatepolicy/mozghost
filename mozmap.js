(function (){
    var width = 375,
    height = 650,
    north = "blue",
    center = "red",
    south = "green",
    z = d3.scale.ordinal().range([north, south, south, center, south, north, north, center, center, north]),
    centered;
    
var projection = d3.geo.mercator()
    .scale(1700)
    .translate([-855, -315]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#mozmap").append("svg")
    .attr("width", width)
    .attr("height", height)
    .attr("border-style","solid");
    
d3.json("moz.json", function(error, moz) {
    
 //draw provinces          
  var provinces = svg.selectAll("path")
    .data(topojson.feature(moz, moz.objects.provinces).features);
    
  /*
     //add district boundaries 
  svg.selectAll("path")
    .data(topojson.feature(moz, moz.objects.districts).features)
  .enter().append("path")
    .attr("d", path)
    .attr("class", "district")
    .attr("pointer-events", "none");
  */  
    
  provinces.enter().append("path")
    .attr("d", path)
    .attr("class", "province")
    .style("fill", function(d){return z(d.properties.pid);})
    .style("opacity","0.5")
    .on("click", clicked)
    .on("mouseover", mouseOver)
    .on("mouseout", mouseOut);
    
  function mouseOver(){
    d3.select(this).style("opacity","1");
  }
  
  function mouseOut(){
    d3.select(this).style("opacity","0.5"); 
  }
    
 
  //add province labels
  provinces.enter().append("text")
    .attr("class", "province-label")
    .attr("transform", function(d) { return "translate(" + path.centroid(d) + ") rotate(330)"; })
    .attr("dy", ".35em")
    .attr("pointer-events", "none")
    .style("text-anchor", "middle")
    .text(function(d) { return d.properties.pname; });
  

});

function clicked(d) {
  var x, y, k;

  if (d && centered !== d) {
    var centroid = path.centroid(d);
    x = centroid[0];
    y = centroid[1];
    k = 4;
    centered = d;
  } else {
    x = width / 2;
    y = height / 2;
    k = 1;
    centered = null;
  }

  g.selectAll("path")
      .classed("active", centered && function(d) { return d === centered; });

  g.transition()
      .duration(750)
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")scale(" + k + ")translate(" + -x + "," + -y + ")")
      .style("stroke-width", 1.5 / k + "px");
}
})();
