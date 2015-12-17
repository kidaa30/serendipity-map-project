'use strict';

// Tool Tip
var div = d3.select("body").append("div")   
    .attr("class", "tooltip")               
    .style("opacity", 0);

var s = 1.5; // scale

var width = 800 * s,
    height = 500 * s,
    _data;

// set projection
var projection = d3.geo.albersUsa();

projection.scale(1000 * s);
projection.translate([400*s,250*s]); 

var path = d3.geo.path()
        		.projection(projection);

var svg = d3.select("body").append("svg")
        .attr("width", width)
        .attr("height", height);

var g = svg.append('g')
        .call(
          d3.behavior.zoom()
                  .scaleExtent([1, 10])
                  .on("zoom", zoom)
        );

d3.csv( 'data/stations3.csv' , function(error, data) {

  if (error) {
    console.log(error);
  } else {
    _data = data;
    render();
  }

});

function render(){

	var dots = svg.selectAll("circle").data(_data);

	var max = d3.max(_data, function(d) {
    return Number(d.TSR);
	});

	var min = d3.min(_data, function(d) {
    return Number(d.TSR);
	});

	var scale = d3.scale.linear(),
			domain = scale.domain([min, max]),
			range = scale.range([5, 30]);
	 
	dots.enter()
	  .append("circle")
	  .attr("cx", function (d) { return projection([d.longitude,d.latitude])[0]; })
	  .attr("cy", function (d) { return projection([d.longitude,d.latitude])[1]; })
	  .attr("r", function(d) {
	  	return scale(d.TSR);
	  })
	  .attr("fill", "hsla(205,75%,60%,1");

	dots
	  .on("mouseover", function(d){ 
      d3.select(this).classed('active', true);
      div.transition()        
        .duration(200)      
        .style("opacity", .9); 
      div.html("<h3>" + d.name + 
          "</h3><img src='http://media.npr.org/images/stations/logos/" + 
          d.name.toLowerCase().replace('-','_') + ".gif'>")  
        .style("left", (d3.event.pageX) + "px")     
        .style("top", (d3.event.pageY - 28) + "px");    
	  })
	  .on("mouseout", function(d){
      d3.select(this).classed('active', false);
      div.transition()        
        .duration(200)      
        .style("opacity", 0); 
	  });

	dots.transition()
    .delay(function(d, i){
        return i*4;
    })
    .ease("bounce")
    .duration(500)
    .attr("r", function(d) {
	  	return scale(d.TSR);
	  	});

  dots.each(function(d,i){
  	var node = d3.select(this);
  	var r = node.attr("r"),
      nx1 = node.attr("cx") - r,
      nx2 = node.attr("cx") + r,
      ny1 = node.attr("cy") - r,
      ny2 = node.attr("cy") + r;
    console.log(r);
  })

};

d3.json("data/us.json", function (error, topology) {

    g.selectAll("path")
            .data(topojson.feature(topology, topology.objects.states).features)
            .enter().append("path")
            .attr("d", path);

});


function zoom() {
    g.attr("transform", "translate("
            + d3.event.translate
            + ")scale(" + d3.event.scale + ")");
}