
//window.onload = initialize();
d3.text("/data/q1h/1997/dc2199701q1h.txt", function(error, text) {
  if (error) throw error;
});

function initialize() {
	// stacked bar chart
	var svg = d3.select("svg"),
	    width = +svg.attr("width"),
	    height = +svg.attr("height"),
	    innerRadius = 180,
	    outerRadius = Math.min(width, height) * 0.77,
	    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height * 0.78 + ")");

	var x = d3.scaleBand()
	    .range([0, 2 * Math.PI])
	    .align(0);

	var y = d3.scaleRadial()
	    .range([innerRadius, outerRadius]);

	var z = d3.scaleOrdinal()
	    .range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);
}

function createLineGraph(csvData) {
    var height = 200;
    var width = 500;
    var svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    var parseTime = d3.timeParse("%d-%b-%y");

    var x = d3.scaleTime()
        .rangeRound([0, width]);

    var y = d3.scaleLinear()
        .rangeRound([height, 0]);

    var line = d3.line()
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.close); });

    d3.tsv("data.tsv", function(d) {
      d.date = parseTime(d.date);
      d.close = +d.close;
      return d;
    },

    function(error, csvData) {
      if (error) throw error;

      x.domain(d3.extent(csvData, function(d) { return d.date; }));
      y.domain(d3.extent(csvData, function(d) { return d.close; }));

      g.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(d3.axisBottom(x))
        .select(".domain")
          .remove();

      g.append("g")
          .call(d3.axisLeft(y))
        .append("text")
          .attr("fill", "#000")
          .attr("transform", "rotate(-90)")
          .attr("y", 6)
          .attr("dy", "0.71em")
          .attr("text-anchor", "end")
          .text("Price ($)");

      g.append("path")
          .datum(csvData)
          .attr("fill", "none")
          .attr("stroke", "steelblue")
          .attr("stroke-linejoin", "round")
          .attr("stroke-linecap", "round")
          .attr("stroke-width", 1.5)
          .attr("d", line);
    });
}

