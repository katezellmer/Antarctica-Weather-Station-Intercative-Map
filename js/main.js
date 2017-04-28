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
		.await(callback);


	function callback(error,allCoords,uwCoords,seamask,coastline){
		console.log(error);
		console.log(allCoords);
		console.log(uwCoords);
		console.log(seamask);
		console.log(coastline);


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

		

		


		var sea=topojson.feature(seamask,seamask.objects.ne_50m_ocean), 
			land=topojson.feature(coastline,coastline.objects.ne_50m_land).features;

		console.log(land);
		//console.log(sea);
		

		var seaArea=map.append("path")
			.datum(sea)
			.attr("class","seaArea")
			.attr("d",path);

		var landArea=map.selectAll(".land")
			.data(land)
			.enter()
			.append("path")
			.attr("class",function(d){
				//console.log(d);
				return d.arcs;
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
			
			.attr("r","8px")
			.attr("fill","#900")
			.attr("stroke","#999")
			//.attr("d",path);
			//.attr("class","station");
		//console.log(aws);


		


	};
};


