window.onload = initialize();

function initialize() {
	var svg = d3.select("svg"),
	    width = 500,
	    height = 500,
	    innerRadius = 180,
	    outerRadius = Math.min(width, height) * 0.77,
	    g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height * 0.78 + ")");

	var x = d3.scaleBand()
    	.range([0, 2 * Math.PI])
    	.align(0);

    var y = d3.scaleRadial()
    	.range([innerRadius, outerRadius]);

	var z = d3.scaleOrdinal()
    	.range(["#2E5DAB", "#5C6778", "#52D0DE", "#E2A48C", "#AB3F2E", "#d0743c", "#ff8c00"]);

	d3.csv("data/stationData.csv", function(d, i, columns) {

	for (i = 1, t = 0; i < 12; ++i) t += d[columns[i]] = +d[columns[i]];
	  	d.total = t;

		// console.log(d.total);

	  	return d;
	}, function(error, data) {
	  if (error) throw error;

	  weave(data, function(a, b) { return b[data.columns[6]] -  a[data.columns[6]]; });
	  x.domain(data.map(function(d) { return d.State; }));
	  y.domain([0, d3.max(data, function(d) { return d.total; })]);
	  z.domain(data.columns.slice(1));

	  g.append("g")
	    .selectAll("g")
	    .data(d3.stack().keys(data.columns.slice(1))(data))
	    .enter().append("g")
	      .attr("fill", function(d) { return z(d.key); })
	    .selectAll("path")
	    .data(function(d) { return d; })
	    .enter().append("path")
	      .attr("d", d3.arc()
	          .innerRadius(function(d) { return y(d[0]); })
	          .outerRadius(function(d) { return y(d[1]); })
	          .startAngle(function(d) { return x(d.data.State); })
	          .endAngle(function(d) { return x(d.data.State) + x.bandwidth(); })
	          .padAngle(0.01)
	          .padRadius(innerRadius));
});

}

function weave(array, compare) {
  var i = -1, j, n = array.sort(compare).length, weave = new Array(n);
  while (++i < n) weave[i] = array[(j = i << 1) >= n ? (n - i << 1) - 1 : j];
  while (--n >= 0) array[n] = weave[n];
}
