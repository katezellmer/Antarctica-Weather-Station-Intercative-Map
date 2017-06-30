// this script will add the basemap and the data points on map
/* GLOBAL VARIABLES */
var zoomlevel = 1;
var categoryArray = ["overview", "meanTemp", "minTemp", "maxTemp", "meanWind", "meanPressure"];
var keyArray = ["2009_1","2009_2","2009_3","2009_4","2009_5","2009_6","2009_7",
"2009_8","2009_9","2009_10","2009_11","2009_12","2010_1","2010_2","2010_3",
"2010_4","2010_5","2010_6","2010_7","2010_8","2010_9","2010_10","2010_11",
"2010_12","2011_1","2011_2","2011_3","2011_4","2011_5","2011_6","2011_7","2011_8"
,"2011_9","2011_10","2011_11","2011_12","2012_1","2012_2","2012_3","2012_4","2012_5","2012_6"
,"2012_7","2012_8","2012_9","2012_10","2012_11","2012_12","2013_1","2013_2","2013_3",
"2013_4","2013_5","2013_6","2013_7","2013_8","2013_9","2013_10","2013_11",
"2013_12","2014_1","2014_2",'2014_3','2014_4','2014_5','2014_6','2014_7',
'2014_8','2014_9','2014_10','2014_11','2014_12','2015_1','2015_2','2015_3',
'2015_4','2015_5','2015_6','2015_7','2015_8','2015_9','2015_10','2015_11',
'2015_12','2016_1','2016_2','2016_3','2016_4','2016_5','2016_6','2016_7',
'2016_8','2016_9','2016_10','2016_11','2016_12'];
var keyArraySimp=["2009-1","09-2","09-3","09-4","09-5","09-6","09-7","09-8","09-9","09-10","09-11","09-12","2010-1",
"10-2","10-3","10-4","10-5","10-6","10-7","10-8","10-9","10-10","10-11","10-12","2011-1","11-2","11-3","11-4","11-5","11-6","11-7","11-8","11-9","11-10","11-11","11-12",
"2012-1","12-2","12-3","12-4","12-5","12-6","12-7","12-8","12-9","12-10","12-11","12-12","2013-1","13-2","13-3","13-4","14-5","14-6","14-7","14-8","14-9","14-10","14-11","14-12",
"2014-1","14-2","14-3","14-4","14-5","14-6","14-7","14-8","14-9","14-10","14-11","14-12","2015-1","15-2","15-3","15-4","15-5","15-6","15-7","15-8","15-9","15-10","15-11","15-12",
"2016-1","16-2","16-3","16-4","16-5","16-6","16-7","16-8","16-9","16-10","16-11","16-12"];
var years = ['2009', '2010','2011','2012', '2013', '20104', '2015', '2016'];
var months_full = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var fullMonths
var fullCategory = ["Overview", "Mean Temperature", "Minimum Temperature", "Maximum Temperature", "Mean Wind Speed", "Mean Air Pressure"];
var yearExpressed;
var scale;
var menuWidth = 200, menuHeight = 300;
var menuInfoWidth = 250, menuInfoHeight = 100;
var numFound;
var dateScale, sliderScale, slider;

window.onload=setMap();

function setMap(){
	var width=window.innerWidth*0.7,
		height=window.innerHeight*0.9;

	var map=d3.select(".mapdiv")
		.append("svg")
		.attr("class","map")
		.attr("width",width)
		.attr("height",height+200)
		.attr('viewBox',"0 -80 1300 700")  //the view box and preserveAspectRadio tags allows to locate the map and preserve the ratio whenresize the screen
		.attr('preserveAspectRatio',"xMidYMid meet");

	var projection=d3.geoAzimuthalEqualArea()
		//.center(0,0)
		
		//.(0,-90)
		.scale(1100)
		.translate([width/2,height/2])
		.rotate([0,90]);

	// var svg = d3.select("body").appen
	//console.log(projection);

	var path=d3.geoPath()
		.projection(projection);

	//console.log(path);

	creatLegend();

	d3.queue()
		.defer(d3.csv,"data/aws_coords_with_links.csv")
		.defer(d3.csv,"data/uw_aws_coords_2017.csv")
		.defer(d3.json, "data/seamaskPoly.topojson")
		.defer(d3.json,"data/coastPoly2.topojson")
		.defer(d3.json,"data/iceshelf.topojson")
		.defer(d3.csv, "data/minTemp.csv")
		.defer(d3.csv, "data/meanTemp.csv")
		.defer(d3.csv, "data/maxTemp.csv")
		.defer(d3.csv, "data/meanWind.csv")
		.defer(d3.csv, "data/meanPressure.csv")
		.await(callback);

	function callback(error,allCoords,uwCoords,seamask,coastline,iceshelf, 
		minTemp, meanTemp, maxTemp, meanWind, meanPressure){

		// DIFFERENT VARIABLE

		var stations = []
		var stationlat = []
		var stationlong = []
	    for (var i = 0; i < allCoords.length; i++){
	     	stations.push(allCoords[i].sitename);
	     	stationlat.push(allCoords[i].latitude);
	     	stationlong.push(allCoords[i].longitude);
	    }

    	//autoFillForm(stations, stationlat, stationlong);

		/**** Link that data **/
		var currAttribute;
		// create array w/ csv's loaded
		var csvArray = [meanTemp, minTemp, maxTemp, meanWind, meanPressure];
		// names for the overall label
		var attributeNames = ["meanTemp", "minTemp", "maxTemp", 
		"meanWind", "meanPressure"];

		var linkStations = ["Henry", "Byrd"];

		for (csv in csvArray) {
			currAttribute = attributeNames[csv];
			allCoords = LinkData(allCoords, csvArray[csv], attributeNames[csv]); 
		}

		console.log(allCoords);

		var numFound = 0;

				// loop through the csv and tie it to the coords CSV
		function LinkData(coordsCSV, csvData, attribute) {
			// loop through coords csv
			// update this value when we add more stations
			for (var i = 0; i < 9; i++) {
				// create a property to hold csvData
				var csvStation = coordsCSV[i];
				var csvLink = csvStation.sitename;

				// find the correct station
					numFound = numFound + 1;
					//console.log("length " + csvData.length);

					for (var j = 0; j < csvData.length; j++) {
						//console.log('in j for loop');
						//console.log(csvLink);
						//console.log(csvData[i].sitename);
						if (csvLink == csvData[i].sitename) {
							for (var key in keyArray) {

								var attr = currAttribute + "_" + keyArray[key];
								//console.log(csvData[i], keyArray[key]);
								var val = csvData[i][keyArray[key]];
								//console.log("attr " + attr);
								//console.log("val " + val);
								
								csvStation[attr] = val;
							}
						}
					}
				if (numFound == 2) {
					break;
				}
			}
			return coordsCSV;
		}

		console.log(allCoords);

		clickMenu(allCoords);

		

		//for (var i = 0; i )
		var graticule = d3.geoGraticule()
            .step([30, 30]);

        var gratBackground = map.append("path")
            .datum(graticule.outline()) //bind graticule background
            .attr("class", "gratBackground") //assign class for styling
            .attr("d", path)
            .attr("fill","black"); //project graticule

        //console.log(gratBackground);

        var gratLines = map.selectAll(".gratLines") //select graticule elements that will be created
            .data(graticule.lines()) //bind graticule lines to each element to be created
            .enter() //create an element for each datum
            .append("path") //append each element to the svg as a path element
            .attr("class", "gratLines") //assign class for styling
            .attr("d", path); //project graticule lines
		
			var sea=topojson.feature(seamask,seamask.objects.ne_50m_ocean).features, 
			land=topojson.feature(coastline,coastline.objects.ant_reg2).features,
			ice=topojson.feature(iceshelf,iceshelf.objects.ne_50m_antarctic_ice_shelves_polys).features;

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

		var prevStation="";

		var aws=map.selectAll(".circle")
			.data(allCoords)
			.enter()
			.append("circle")
			.attr('gid', function(d){
				return d['gid'];
			})
			.attr('class',function(d){
				return d['sitename'].replace(/[ () !]/g, '-')//+" "+d['mapcode'].replace(/ /g, '-');
			})
			.attr('mapcode',function(d){
				return d['mapcode']
			})
			.attr('website',function(d){
				return d['website']
			})
			.attr('description',function(d){
				return d['description']
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
			.attr("r", "8px")
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
				if (d['mapcode']=='Other US program'){
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
				dehighlight(prevStation);
				prevStation=d['sitename'];
				highlight(d['sitename']);
			})
			// .on("mouseout",function(d){
			// 	dehighlight(d['sitename']);

			//.on("mousemove",moveLabel)
			.transition()
			.duration(1000);
	};

	function highlight(stationName){
		//var circleAttrs=
		//console.log(stationName);
		var selected=d3.selectAll('.'+stationName.replace(/[ () !]/g, '-'))
			.attr("r","17px");
		//console.log(selected);
		
			//.style("stroke")
		setLabel(stationName, selected);
	};

	function dehighlight(stationName){
		if (stationName.length==0){
			return false;
		};
		var selected=d3.selectAll('.'+stationName.replace(/[ () !]/g, '-'))
			.attr("r","8px");
		d3.select(".infoLabel")
			.remove();
		//setLabel(stationName, selected);
		//d3.select(".infoLabel");
	};

	function setLabel(stationName,selected){
		console.log(selected);
		var labelAttribute="<h1>"+stationName+"</h1>"+"<h2>operated by "+selected.attr('mapcode')+"</h2>";
		console.log(labelAttribute);

		var infoLabel=d3.select("body")
			.append("div")
			.attr("class","infoLabel")
			.attr("id",selected.attr('gid'))
			.html(labelAttribute)
			// .node()
			// .getBoundingClientRect()
			// .width;
			//.attr('viewBox',"900 -700 300 700")  //the view box and preserveAspectRadio tags allows to locate the map and preserve the ratio whenresize the screen
			//.attr('preserveAspectRatio',"xMidYMid meet");
		//console.log(infoLabel);

		//var x=window.innerWidth-100;
		//var y=window.innerHeight;
		//console.log(x);

		infoLabel = d3.selectAll(".infoLabel")
			.style("width","300px")
			.style("height", "620px")//window.innerWidth-500+"px")
			.style("right","0px")
			.style("top","70px");

		console.log(infoLabel);

		var contextContent1="<h2>Data URL: </h2>"+selected.attr('website');

		var contextContent2="<h2>More about the station: </h2>"+selected.attr('description');

		var context=infoLabel.append("div")
			.attr("class","context")
			.html(contextContent1+contextContent2);
	//console.log(countryName);*/
	};


	/*function moveLabel(){

		var labelWidth=d3.selectAll(".infoLabel");
			.node()
			.getBoundingClientRect()
			.width;

		console.log(labelWidth);

		var x1=d3.event.clientX+10,
			y1=d3.event.clientY-75,
			x2=d3.event.clientX-labelWidth-10,
			y2=d3.event.clientY+25;

		var x=d3.event.clientX>window.innerWidth-labelWidth-20 ? x2 : x1;

		var y=d3.event.clientY<75 ? y2 : y1;



		d3.selectAll(".infoLabel")
			.style("left",x+"px")
			.style("right",y+"px");
	};*/

	function creatLegend(){

		var colorClasses=["#e31a1c","#fa9fb5","#fd8d3c","#00441b","#3182bd","#6a51a3"];

		var legendClasses=["UW AWS","South American AWS","Oceanian AWS","European AWS","Asian AWS","Other American AWS"];
		/*function legendClass(legendClasses){
			for (i=0;i<legendClasses.length;i++){
				console.log(legendClasses[1]);
				return legendClasses[i];
			};
		};*/
		var legendTop="510px", legendLeft="0px";
		var ls_w=220, ls_h=220;
		var legend=d3.select("body")
			.append("svg")
			.attr("class","legend")
			.attr("width",ls_w)
			.attr("height",ls_h)
			.style("top",legendTop)
			.style("left",legendLeft);
			// .attr('viewBox',"-200 -100 300 100")  //the view box and preserveAspectRadio tags allows to locate the map and preserve the ratio whenresize the screen
			// .attr('preserveAspectRatio',"xMidYMid meet");;
			
			

		var legendDots=legend.selectAll("g.legend")
			.data(colorClasses)
			.enter().append("g")
			.attr("class","legendDots")
			.attr("transform","translate("+ls_w/6+" "+ls_h/6+")");

		
		var ld_h=100, ld_w=100;
		legendDots.append("circle")
			.attr("cx",5)
			.attr("cy",function(d,i){

				return i*31+4;
			})
			.attr("r","8px")
			.style("fill",function(d,i){return colorClasses[i];})
			.style("fill-opacity","0.9")
			.style("background","#d6eaf8");
		console.log(legend);

		legendDots.append("text")
			.attr("class","legendText")
			.attr("x",30)
			.attr("y",function(d,i){return i*32+5;})
			.text(function(d,i){
				return legendClasses[i];
			})
			//.attr("fill","white");
		console.log(legendClasses[1]);


	};

};

// change year
function changeYear() {

}

function getTitle(attribute){
	var labelArray = attribute.split("-");
	var month;
	var year;
	var properAtt;
	var label;

	if (labelArray[2] == 1) month = "January ";
	if (labelArray[2] == 2) month = "February ";
	if (labelArray[2] == 3) month = "March ";
	if (labelArray[2] == 4) month = "April ";
	if (labelArray[2] == 5) month = "May ";
	if (labelArray[2] == 6) month = "June ";
	if (labelArray[2] == 7) month = "July ";
	if (labelArray[2] == 8) month = "August ";
	if (labelArray[2] == 9) month = "September ";
	if (labelArray[2] == 10) month = "October ";
	if (labelArray[2] == 11) month = "November ";
	if (labelArray[2] == 12) month = "December ";

	if (labelArray[0] == "minTemp") {
		properAtt =  fullCategory[2] + " ";
	}
	if (labelArray[0] == "maxTemp") {
		properAtt =  fullCategory[3] + " ";
	}
	if (labelArray[0] == "meanTemp") {
		properAtt =  fullCategory[1] + " ";
	}
	if (labelArray[0] == "meanPressure") {
		properAtt =  fullCategory[5]+ " ";
	}
	if (labelArray[0] == "meanWind") {
		properAtt =  fullCategory[4]+ " ";
	}

	label.concat(month);
	return label;
}

function circleSize(d, attribute){
	console.log(d[attribute]);
	if ( isNaN(d[attribute]) ) {
		d[attribute] = 0;
	}
	console.log(parseFloat(d[attribute]));
	var radius = Math.sqrt( 10 * Math.abs(parseFloat(d[attribute]))) + "px";
	console.log(radius);
  	return radius;
};

// change attribute
function changeAttribute(attribute, csvData) {
	console.log(d3.selectAll("circle"));

	var aws = d3.selectAll("circle")
		.transition()
		.duration(800)
		.attr("fill", function (d, i){
			if (isNaN(parseFloat(d[attribute]))) {
				return "grey";
			}
			else {
				return "#e31a1c";
			}
		})
		.attr("r", function(d){
			// console.log(d[attribute]);
			var foo;
			if (typeof d[attribute] == 'undefined' || isNaN(parseFloat(d[attribute]))) {
				
				foo = 0+"px";
			}
			else {
				console.log(d[attribute]);
				console.log(circleSize(d, attribute));
				foo = circleSize(d, attribute);
			}
			console.log(foo);
			return foo;
		})
	console.log(aws);
}

// create side menu to change to different attributes
function clickMenu(currData) {
	var currAttribute;
	var circle = d3.selectAll(".circle");
	console.log(circle);
	$(".Overview").click(function(){
		expressed = categoryArray[0];
		yearExpressed = keyArray[66];
		d3.selectAll("circle")
			.transition()
			.duration(800)
			.attr("r", function(d){
				return "8px";
			})
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
				if (d['mapcode']=='Other US program'){
					return "#6a51a3";
				};
				if (d['mapcode']=='SPAWAR'){
					return "#807dba";
				};
				if (d['mapcode']=='Commercial'){
					return "#9e9ac8";
				};
			})
	})
	$(".Mean-Temp").click(function(){
		yearExpressed = keyArray[0];
		currAttribute = categoryArray[1] + "_" + yearExpressed;
		changeAttribute(currAttribute, currData);
	})
	$(".Min-Temp").click(function(){
		yearExpressed = keyArray[0];
		currAttribute = categoryArray[2] + "_" + yearExpressed;
		changeAttribute(currAttribute, currData);
	})
	$(".Max-Temp").click(function(){
		yearExpressed = keyArray[0];
		currAttribute = categoryArray[3] + "_" + yearExpressed;
		changeAttribute(currAttribute, currData);
	})

	$(".Mean-Wind").click(function(){
		yearExpressed = keyArray[0];
		currAttribute = categoryArray[4] + "_" + yearExpressed;
		changeAttribute(currAttribute, currData);
	})
	$(".Mean-Pressure").click(function(){
		yearExpressed = keyArray[0];
		currAttribute = categoryArray[5] + yearExpressed;
		changeAttribute(currAttribute, currData);
	});
}



function sliderBar(){

	var sliderSvgWidth=window.innerWidth-220, sliderSvgHeight=100;
	var svg=d3.select("body").append("svg")
		.attr("class","sliderSVG")
		.attr("width",sliderSvgWidth)
		.attr("height",sliderSvgHeight)
		.style("background-color","white");
		
		console.log(keyArraySimp);
	var x = d3.scalePoint()
	    .domain(keyArraySimp)
	    .range([0, sliderSvgWidth-50]);
	    //.clamp(true);
	    console.log(x.domain());

	var quantX=d3.scaleQuantile()
		.domain([0, sliderSvgWidth-50])
		.range(keyArraySimp);

	var xAxis=d3.axisBottom()
		.scale(x);

	svg.append("g")
		.attr("class","x axis")
		.attr("transform","translate(0,"+18+")")
		.call(xAxis)
	   .selectAll("text")
	    .attr("transform","rotate(-90)");

	var slider = svg.append("g")
	    .attr("class", "slider")
	    .attr("transform", "translate(" + 30 + "," + sliderSvgHeight / 2 + ")");

	slider.append("line")
	    .attr("class", "track")
	    .attr("x1", x.range()[0])
	    .attr("x2", x.range()[1])
	  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
	    .attr("class", "track-inset")
	  .select(function() { return this.parentNode.appendChild(this.cloneNode(true)); })
	    .attr("class", "track-overlay")
	    .call(d3.drag()
	        .on("start.interrupt", function() { slider.interrupt() })
	        .on("start drag", function() { 
	        	console.log(x.range(), quantX.domain(), quantX.range(), d3.event.x);
	        	var year=quantX(d3.event.x);
	        	console.log(year);
	        	handle.attr("cx", x(year)+"px") ;
	        }));

	// slider.insert("g",".track-overlay")
	// 	.attr("class","ticks")
	// 	.attr("transform","translate(0,"+18+")")
	//   .selectAll("text")
	//   .data(keyArraySimp)
	//   .enter().append("text")
	//     .attr("x",function(d){
	//     	console.log(d);
	//     	return x(d);
	//     })
	//     // .attr('transform','rotate(-90)')
	//     .style("text-anchor","middle")
	//     .text(function(d){
	//     	//console.log(d);
	//     	return d;
	//     });

	var handle=slider.insert("circle",".track-overlay")
		.attr("class","handle")
		.attr("r",9);

	slider.transition() // Gratuitous intro!
	    .duration(750)
	    .tween("hue", function() {
	       var i = d3.interpolate(0, 70);
	       return function(t) { hue(i(t)); };
	     });

	 function hue(h) {
	   handle.attr("cx", x(h));
	   svg.style("background-color", d3.rgb(0, 0, 0,0));
	 };

};

function autoFillForm(stations, stationlat, stationlong) {
  $("#tags").autocomplete({
    source: stations, 
    select: function(event, ui){
    	zoomlevel = 2
    	for (station in stations) {
    		d3.select(".map").attr("transform", "scale("+ zoomlevel + " " + zoomlevel + ") translate(" + (-956.2*0.1) + ", " + (-355.5*0.1) + ") center(" + stationlat + ", " + stationlong + ")")
	}
    }
  });
}

function zoomed() {
	if (zoomlevel < 2) {
		zoomlevel += 0.1
	}
  	d3.select(".map").attr("transform", "scale("+ zoomlevel + " " + zoomlevel + ") translate(" + (-956.2*0.1) + ", " + (-355.5*0.1) + ")"); 
};


function zoomedOut() {
	if (zoomlevel > 1){
		zoomlevel += -0.1
	}
		d3.select(".map").attr("transform", "scale(" + zoomlevel + " " + zoomlevel + ") translate(" + (-956.2*0.1) + ", " + (-355.5*0.1) + ")"); 
}

function resetZoom() {
	zoomlevel = 1
	d3.select(".map").attr("transform", "scale(" + zoomlevel + " " + zoomlevel + ") translate(" + (-956.2*0.1) + ", " + (-355.5*0.1) + ")" + ") center(0,0)"); 
}


function dragstarted(d){
	d3.event.sourceEvent.stopPropagation();
}
			
//Called when the drag event occurs (object should be moved)
function dragged(d){
	d.x = d3.event.x;
	d.y = d3.event.y;
	//Translate the object on the actual moved point
	d3.select(this).attr({
		transform: "translate(" + d.x + "," + d.y + ")"
	});
}
