landcover();
function landcover(){
var w = 600,
    h = 500,
    x = d3.scale.linear().range([0, w]),
    y = d3.scale.linear().range([0, h]),
    color = d3.scale.category10(),//d3.scale.ordinal().range(["#1f77b4", "#ff7f0e", "#2ca02c", "#d62728", "#9467bd", "#8c564b", "#e377c2"]).domain([0,1,2,3,4,5,6]),;
    root,
    node;

var treemap = d3.layout.treemap()
    .round(false)
    .size([w, h])
    .sticky(true)
    .value(function(d) { return d.size; });

var svg = d3.select("#treediv").append("div")
    .attr("class", "chart")
    .style("width", w + "px")
    .style("height", h + "px")
  .append("svg:svg")
    .attr("width", w)
    .attr("height", h)
	.attr("background", "blue")
  .append("svg:g")
    .attr("transform", "translate(.5,.5)");

d3.json("flare.json", function(data) {
  node = root = data;

  var nodes = treemap.nodes(root)
      .filter(function(d) { return !d.children; });

  var cell = svg.selectAll("g")
      .data(nodes)
    .enter().append("svg:g")
      .attr("class", "cell")
      .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; })
      .on("click", function(d) { return zoom(node == d.parent ? root : d.parent); });

  cell.append("svg:rect")
      .attr("width", function(d) { return d.dx - 1; })
      .attr("height", function(d) { return d.dy - 1; })
	  .attr("desc", function(d) { return d.dist; })
      .style("fill", function(d) { return color(d.parent.name); })
	  .on("mouseover", mouseOver)
	  .on("mouseout", mouseOut);

  cell.append("svg:text")
      .attr("x", function(d) { return d.dx / 2; })
      .attr("y", function(d) { return d.dy / 2; })
      .attr("dy", ".35em")
      .attr("text-anchor", "middle")
      .text(function(d) { return d.name; })
	  .style("pointer-events","none")
      .style("opacity", function(d) { d.w = this.getComputedTextLength(); return d.dx > d.w ? 1 : 0; });

  d3.select(window).on("click", function() { zoom(root); });
});

function zoom(d) {
  var kx = w / d.dx, ky = h / d.dy;
  x.domain([d.x, d.x + d.dx]);
  y.domain([d.y, d.y + d.dy]);

  var t = svg.selectAll("g.cell").transition()
      .duration(d3.event.altKey ? 7500 : 750)
      .attr("transform", function(d) { return "translate(" + x(d.x) + "," + y(d.y) + ")"; });

  t.select("rect")
      .attr("width", function(d) { return kx * d.dx - 1; })
      .attr("height", function(d) { return ky * d.dy - 1; })

  t.select("text")
      .attr("x", function(d) { return kx * d.dx / 2; })
      .attr("y", function(d) { return ky * d.dy / 2; })
      .style("opacity", function(d) { return kx * d.dx > d.w ? 1 : 0; });

  node = d;
  d3.event.stopPropagation();
}

function mouseOver() {
	drawbars(d3.select(this).attr("desc").split(",").map(Number));
}

function mouseOut() {
	drawbars(available);
}

//Width and height
	var barw = 400;
	var barh = 500;
	var barPadding = 1;
	
	var labels = ["Cabo Delgado", "Niassa", "Nampula", "Zambézia", "Tete", "Manica", "Sofala", "Inhambane", "Gaza", "Maputo"];
	var available = [ 26900/6723530, 1220400/6723530, 709160/6723530, 1365300/6723530, 661730/6723530, 381950/6723530, 408650/6723530, 1071660/6723530, 866780/6723530, 11000/6723530];
	
	//Create SVG element
	var barsvg = d3.select("#infodiv")
				.append("svg")
				.attr("width", barw)
				.attr("height", barh);
	
	function drawbars(dataset){
		//Compute the join
		var bars = barsvg.selectAll("rect")
			.data(dataset);
		
		//enter	
		bars.enter().append("rect");
		
		//exit
		bars.exit().remove();
		
		//update
		bars.attr("y", function(d, i) {
				return i * (h / dataset.length);
		   })
		   .attr("x", 160)
		   .attr("height", h / dataset.length - barPadding)
		   .attr("width", function(d) {
				return d * 1000;
		   })
		   .style("fill", "#F96302");
		   
	   }
	drawbars(available);
	
	barsvg.selectAll("text")
	   .data(labels)
	   .enter().append("text")
	   .attr("y", function(d, i) {
			return i * (h / labels.length);
	   })
	   .attr("x", 50)
	   .attr("dy", h/labels.length/2 + 6)
	   .style("fill", "black")
	   .text(function(d){return d;});
	   }