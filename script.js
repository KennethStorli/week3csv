var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

  
var x = d3.scale.linear()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);


var color = d3.scale.category10();

var axisNames = { 
                    petalWidth: 'Petal Width', 
                    petalLength: 'Petal Length', 
                    sepalWidth: 'Sepal Width', 
                    sepalLength: 'Sepal Length' 
                };

var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");


d3.csv(urlcsv, function(error, data) {
  data.forEach(function(d) {
    d.petalLength = +d.petal_length;
    d.petalWidth = +d.petal_width;
    d.sepalLength = +d.sepal_length;
    d.sepalWidth = +d.sepal_width;
  });

  x.domain(d3.extent(data, function(d) { return d.petalWidth; })).nice();
  y.domain(d3.extent(data, function(d) { return d.petalLength; })).nice();

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .attr("class", "label")
      .attr("x", width)
      .attr("y", -6)
      .style("text-anchor", "end")
      .text("Petal Width (cm)");

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
    .append("text")
      .attr("class", "label")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Petal Length (cm)")

 var circles = svg.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function(d) { return x(d.petalWidth); })
      .attr("cy", function(d) { return y(d.petalLength); })
      .style("fill", function(d) { return color(d.species); });


  var legend = svg.selectAll(".legend")
      .data(color.domain())
      .enter().append("g")
      .attr("class", "legend")
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });


  legend.append("rect")
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);


  legend.append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function(d) { return d; });



  d3.selectAll("[name=v]").on("change", function() {
      var selected = this.value;
      display = this.checked ? "inline" : "none";


  svg.selectAll(".dot")
      .filter(function(d) {return selected == d.species;})
      .attr("display", display);
      });



  d3.selectAll("[name=sepal]").on("change", function(d) {
     radius = this.value;

     svg.selectAll(".dot")
     console.log(radius);
     circles.attr("r", function(d) { return d[radius]; });
  });



  d3.select("[name=xAX]").on("change", function(){
    xAxy = this.value;
    console.log(xAxy)
    x.domain(d3.extent(data, function(d) { return d[xAxy]; })).nice();

    svg.select(".x.axis").transition().call(xAxis);

    svg.selectAll(".dot").transition().attr("cx", function(d) { 
        return x(d[xAxy]);
    });
    svg.selectAll(".x.axis").selectAll("text.label").text(axisNames[xAxy] + " (cm)");
  });

  d3.select("[name=yAX]").on("change", function(){
    yAxy = this.value;
    console.log(yAxy)
    y.domain(d3.extent(data, function(d) { return d[yAxy]; })).nice();
    svg.select(".y.axis").transition().call(yAxis);
    svg.selectAll(".dot").transition().attr("cy", function(d) { 
        return y(d[yAxy]);
    });
    svg.selectAll(".y.axis").selectAll("text.label").text(axisNames[yAxy] + " (cm)");
  });

});