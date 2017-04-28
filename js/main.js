//window.onload = initialize();

// this script will add the basemap and the data points on map

window.load=setMap();

function setMap(){



	var width=window.innerWidth*0.7,
		height=window.innerHeight*0.9;

	var map=d3.select("body")
		.append("svg")
		.attr("class","map")
		.attr("width",width)
		.attr("height",height);

	var projection=d3.geoAzimuthalEqualArea()
		//.center(0,0)
		
		//.(0,-90)
		.scale(900)
		.translate([width/2,height/2])
		.rotate([0,90]);

	//console.log(projection);

	var path=d3.geoPath()
		.projection(projection);

	//console.log(path);


	d3.queue()
		.defer(d3.csv,"data/aws_coords_2017.csv")
		.defer(d3.csv,"data/uw_aws_coords_2017.csv")
		.defer(d3.json, "data/seamaskPoly.topojson")
		.defer(d3.json,"data/coastPoly.topojson")
		.defer(d3.json,"data/iceshelf.topojson")
		.await(callback);


	function callback(error,allCoords,uwCoords,seamask,coastline,iceshelf){
		/*console.log(error);
		console.log(allCoords);
		console.log(uwCoords);
		console.log(seamask);
		console.log(coastline);
		console.log(iceshelf);*/


		var graticule = d3.geoGraticule()
            .step([30, 30]);

        var gratBackground = map.append("path")
            .datum(graticule.outline()) //bind graticule background
            .attr("class", "gratBackground") //assign class for styling
            .attr("d", path)
            .attr("fill","black"); //project graticule
        console.log(gratBackground);

        var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
            .data(graticule.lines()) //bind graticule lines to each element to be created
            .enter() //create an element for each datum
            .append("path") //append each element to the svg as a path element
            .attr("class", "gratLines") //assign class for styling
            .attr("d", path); //project graticule lines
		
		console.log(graticule.outline());
		

		var sea=topojson.feature(seamask,seamask.objects.ne_50m_ocean).features, 
			land=topojson.feature(coastline,coastline.objects.ne_50m_land).features,
			ice=topojson.feature(iceshelf,iceshelf.objects.ne_50m_antarctic_ice_shelves_polys).features;

		console.log(ice);
		//console.log(sea);
		

		var seaArea=map.append("path")
			.datum(sea)
			.enter()
			.attr("class",function(d){
				return "sea "+ d.arcs;
			})
			.attr("d",function(d){
				if (d.geometry){
					//console.log(d,path(d));
					return path(d);
				};
			});
			//.attr("fill","#1a3757");

		var landArea=map.selectAll(".land")
			.data(land)
			.enter()
			.append("path")
			.attr("class",function(d){
				//console.log(d);
				return "land "+ d.arcs;
			})
			.attr("d",function(d){
				if (d.geometry){
					//console.log(d,path(d));
					return path(d);
				};
			});

		var iceArea=map.selectAll(".ice")
			.data(ice)
			.enter()
			.append("path")
			.attr("class",function(d){
				return "ice "+d.arcs;
			})
			.attr("d",function(d){
				if (d.geometry){
					//console.log(d,path(d));
					return path(d);
				};
			});


		//var x=projection(function(d))

		var aws=map.selectAll("circle")
			.data(allCoords)
			.enter()
			.append("circle")
			.attr("cx",function(d){
				console.log(d['latitude']);
				//console.log(projection(d['latitude']));
				return projection([d['longitude'],d['latitude']])[0];
			})
			.attr("cy",function(d){
				//console.log(projection(d));
				
				return projection([d['longitude'],d['latitude']])[1];
			})
			
			.attr("r","6px")
			
			//.attr("d",path);
			//.attr("class","station");
		//console.log(aws);


		


	};
};

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


