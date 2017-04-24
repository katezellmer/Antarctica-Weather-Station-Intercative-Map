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
