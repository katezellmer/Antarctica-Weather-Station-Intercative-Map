<<<<<<< Updated upstream
//window.onload = initialize();
// this script will add the basemap and the data points on map
=======
/** Global Variables **/
var keyArray = [];
var Category = ["minTemp", "maxTemp", "meanTemp", "meanWindSpeed", "meanPressure"];
>>>>>>> Stashed changes

window.load=setMap();
var zoomlevel = 1;

function setMap(){
<<<<<<< HEAD
	 var width=window.innerWidth*0.7,
	 height=window.innerHeight*0.9;
=======
	var width=window.innerWidth*0.7,
		height=window.innerHeight*0.9;
>>>>>>> refs/remotes/origin/master

	var map=d3.select("body")
		.append("svg")
		.attr("class","map")
		.attr("width",width)
		.attr("height",height)
		.attr('viewBox',"0 -70 1300 700")  //the view box and preserveAspectRadio tags allows to locate the map and preserve the ratio whenresize the screen
		.attr('preserveAspectRatio',"xMidYMid meet");

	var projection=d3.geoAzimuthalEqualArea()
<<<<<<< Updated upstream
		//.center(0,0)
		
		//.(0,-90)
		.scale(1100)
=======
		.scale(900)
>>>>>>> Stashed changes
		.translate([width/2,height/2])
		.rotate([0,90]);

	var path=d3.geoPath()
		.projection(projection);



	//console.log(path);
	d3.queue()
		.defer(d3.csv,"data/aws_coords_2017.csv")
		.defer(d3.csv,"data/uw_aws_coords_2017.csv")
		//.defer(d3.csv, "data/Henry.csv")
		.defer(d3.json, "data/seamaskPoly.topojson")
		.defer(d3.json,"data/coastPoly2.topojson")
		.defer(d3.json,"data/iceshelf.topojson")
		.await(callback);

<<<<<<< Updated upstream

	function callback(error,allCoords,uwCoords,seamask,coastline,iceshelf){
		//console.log(error);
		console.log(allCoords);
    var stations = []
    for (var i = 0; i < allCoords.length; i++){
      stations.push(allCoords[i].sitename);
    }
    autoFillForm(stations)
		// console.log(uwCoords);
		// console.log(seamask);
		// console.log(coastline);
		// console.log(iceshelf);*/

=======
	function callback(error,allCoords,uwCoords,seamask,coastline){
		console.log(error);
		//console.log(allCoords);
		//console.log(uwCoords);
		//console.log(seamask);
		//console.log(coastline);
>>>>>>> Stashed changes

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
		
		//console.log(graticule.outline());
<<<<<<< Updated upstream
		

		var sea=topojson.feature(seamask,seamask.objects.ne_50m_ocean).features, 
			land=topojson.feature(coastline,coastline.objects.ant_reg2).features,
			ice=topojson.feature(iceshelf,iceshelf.objects.ne_50m_antarctic_ice_shelves_polys).features;

		//console.log(ice);
		//console.log(sea);
=======

		var sea=topojson.feature(seamask,seamask.objects.ne_50m_ocean), 
			land=topojson.feature(coastline,coastline.objects.ne_50m_land).features;
>>>>>>> Stashed changes
		
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

<<<<<<< Updated upstream
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

		var aws=map.selectAll(".circle")
=======
		var aws=map.selectAll("circle")
>>>>>>> Stashed changes
			.data(allCoords)
			.enter()
			.append("circle")
			.attr('gid', function(d){
				return d['gid'];
			})
			.attr('class',function(d){
				return d['sitename'].replace(/[ ()]/g, '-')//+" "+d['mapcode'].replace(/ /g, '-');
			})
			.attr('mapcode',function(d){
				return d['mapcode']
			})
			.attr("cx",function(d){
				//console.log(d['latitude']);
				//console.log(projection(d['latitude']));
				return projection([d['longitude'],d['latitude']])[0];
			})
			.attr("cy",function(d){
				//console.log(projection(d));
				
				return projection([d['longitude'],d['latitude']])[1];
			})
			
<<<<<<< Updated upstream
			.attr("r", "6px")
			.attr("fill", function(d){
				//console.log(d['mapcode']);
				if (d['mapcode']=='UW'){
					return "#e31a1c";
				} ;
				if (d['mapcode']=='UW/Australia'){
					return "#de2d26";
				};
				if (d['mapcode']=='UW/China'){
					return "#fb6a4a";
				};
				if (d['mapcode']=='UW/France'){
					return "#fc9272";
				};
				if (d['mapcode']=='UW/Japan'){
					return "#fcbba1";
				};
				if (d['mapcode']=='UW/UK'){
					return "#df65b0";
				};
				if (d['mapcode']=='Australia'){
					return "#3182bd";
				};
				if (d['mapcode']=='New Zealand'){
					return "#9ecae1";
				};
				if (d['mapcode']=='China/Australia'){
					return "#fb8d3c";
				};
				if (d['mapcode']=='South Korea'){
					return "#fecc5c";
				};
				if (d['mapcode']=='Japan'){
					return "#ffffb2";
				};
				if (d['mapcode']=='Belgium/Netherlands'){
					return "#00441b";
				};
				if (d['mapcode']=='Finland'){
					return "#006d2c";
				};
				if (d['mapcode']=='France'){
					return "#238b45";
				};
				if (d['mapcode']=='Germany'){
					return "#41ab5d";
				};
				if (d['mapcode']=='Italy'){
					return "#74c476";
				};
				if (d['mapcode']=='Netherlands'){
					return "#a1d99b";
				};
				if (d['mapcode']=='Norway'){
					return "#c7e9c0";
				};
				if (d['mapcode']=='Russia'){
					return "#a8ddb5";
				};
				if (d['mapcode']=='United Kingdom'){
					return "#005a32";
				};
				if (d['mapcode']=='Brazil'){
					return "#fa9fb5";
				};
				if (d['mapcode']=='Other US'){
					return "#6a51a3";
				};
				if (d['mapcode']=='SPAWAR'){
					return "#807dba";
				};
				if (d['mapcode']=='Commercial'){
					return "#9e9ac8";
				};
			


			})
			.attr("stroke","#fff")
			.on("mouseover",function(d){
				//console.log(d['sitename']);
				highlight(d['sitename']);
			})
			.on("mouseout",function(d){
				dehighlight(d['sitename']);
			});

		
		var zoom = d3.select("#zoomin") 
			.on("click", zoomed);
		

		var zoom2 = d3.select("#zoomout")
			.on("click", zoomedOut);
		//console.log(allCoords);
		//aws=joinData(aws,allCoords);
		//setLabel(allCoords);
		//highlight(props);

		var drag = d3.select(".map")
	    .origin(function(d) { return d; })
	    .on("dragstart", dragstarted)
	    .on("drag", dragged)
	    .on("dragend", dragended);
  
function zoomed() {
	if (zoomlevel < 2){
		console.log(zoomlevel)
		zoomlevel += 0.1
	}
  	d3.select(".map").attr("transform", "scale("+ zoomlevel + " " + zoomlevel + ") translate(" + (-956.2*0.08) + ", " + (-355.5*0.08) + ")"); 
}

function zoomedOut() {
	if (zoomlevel > 1){
		console.log(zoomlevel)
		zoomlevel += -0.1
	}
		d3.select(".map").attr("transform", "scale(" + zoomlevel + " " + zoomlevel + ") translate(" + (-956.2*0.08) + ", " + (-355.5*0.08) + ")"); 
}



	};




	/*function joinData(aws, allCoords){
		for (var i=0;i<allCoords.length;i++){
			var csvStation=allCoords[i];
			var csvKey=csvStation.gid;

			for (var a=0; a<aws.length;i++){
				var stationProps=aws[a].properties;
				var stationKey=geojson.id;

				if (csvKey==stationKey){
					attrArray.forEach(function(attr){
						var val=parseFloat(csvStation[attr]);
						stationProps[attr]=val;
					});
				};
			};
		};
	};*/

	function highlight(stationName){
		//var circleAttrs=
		//console.log(stationName);
		var selected=d3.selectAll('.'+stationName.replace(/[ ()]/g, '-'))
			.attr("r","12px");
		//console.log(selected);
		
			//.style("stroke")
		setLabel(stationName, selected);
	};

	function dehighlight(stationName){
		var selected=d3.selectAll('.'+stationName.replace(/[ ()]/g, '-'))
			.attr("r","6px");
		d3.select(".infoLabel")
			.remove();

=======
			.attr("r","8px")
			.attr("fill","#900")
			.attr("stroke","#999")
>>>>>>> Stashed changes
	};

	function setLabel(stationName,selected){
		//console.log(selected);
		var labelAttribute="<h1>"+stationName+"</h1>"+selected.attr('mapcode');
		//console.log(labelAttribute);

		/*for (i=0; i<allCoords.length; i++) {
			labelAttribute=allCoords[i].sitename;
			//console.log(i);
			//console.log(labelAttribute);
		};*/
		//="<h1>"+allCoords[0:169].sitename+"</h1>";
		


		var infoLabel=d3.select("body")
			.append("div")
			.attr("class","infoLabel")
			.attr("id",selected.attr('gid'))
			.html(labelAttribute);
		//console.log(infoLabel);

		var countryName=infoLabel.append("div")
			.attr("class","countryName")
			.html(selected.attr('mapcode'));
		//console.log(countryName);
	};

};

<<<<<<< Updated upstream





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
<<<<<<< HEAD
 

}

function autoFillForm(stations) {
  $("#tags").autocomplete({
    source: stations
  });
};


function dragstarted(d) {
  d3.event.sourceEvent.stopPropagation();
  d3.select(this).classed("dragging", true);
}

function dragged(d) {
  d3.select(this).attr("cx", d.x = d3.event.x).attr("cy", d.y = d3.event.y);
}
=======
=======
function yearChange(){
  //litearlize this: return row["Year"] == "2007" || row["Year"] == "2009"
  //console.log(d3.map.values(filterTypesSignal))
  currentYears = []
  for (var n =0; n< filterTypesYear.length; n++){
    if (filterTypesSignal[filterTypesYear[n]] == "on"){
        currentYears.push(filterTypesYear[n])
    } else {
      currentYears.push("0")
    } 
  }
  //obj = "return"+obj
  //obj = obj.slice(0, obj.length-3)
  setData(phase, currentYears, view)
>>>>>>> Stashed changes
}

function createLineGraph(csvData) {
    var height = 200;
    var width = 500;
    var svg = d3.select("svg"),
        margin = {top: 20, right: 20, bottom: 30, left: 50},
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom,
        g = svg.append("g").attr("transform", 
        	"translate(" + margin.left + "," + margin.top + ")");

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
<<<<<<< Updated upstream
}*/

=======
}
>>>>>>> Stashed changes
>>>>>>> refs/remotes/origin/master

function dragended(d) {
  d3.select(this).classed("dragging", false);
}
