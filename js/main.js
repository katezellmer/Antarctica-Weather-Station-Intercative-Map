// Author Kate Zellmer, Mengyu Liang, and Laura Scott
// This script set the basemap, add the functionality and designs to the AWS interactive map


(function(){
//initialize the gloabl varibales
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
var keyArraySimp=["2009_1","09_2","09_3","09_4","09_5","09_6","09_7","09_8","09_9","09_10","09_11","09_12","2010_1",
"10_2","10_3","10_4","10_5","10_6","10_7","10_8","10_9","10_10","10_11","10_12","2011_1","11_2","11_3","11_4","11_5","11_6","11-7","11-8","11-9","11-10","11-11","11-12",
"2012_1","12_2","12_3","12_4","12_5","12_6","12_7","12_8","12_9","12_10","12_11","12_12","2013_1","13_2","13_3","13_4","14_5","14_6","14_7","14_8","14_9","14_10","14_11","14_12",
"2014_1","14_2","14_3","14_4","14_5","14_6","14_7","14_8","14_9","14_10","14_11","14_12","2015_1","15_2","15_3","15_4","15_5","15_6","15_7","15_8","15_9","15_10","15_11","15_12",
"2016_1","16_2","16_3","16_4","16_5","16_6","16_7","16_8","16_9","16_10","16_11","16_12"];
var years = ['2009', '2010','2011','2012', '2013', '20104', '2015', '2016'];

var months_full = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var fullMonths;
var fullCategory = ["Overview", "Mean Temperature", "Minimum Temperature", "Maximum Temperature", "Mean Wind Speed", "Mean Air Pressure"];
var yearExpressed;
var scale;
var menuWidth = 200, menuHeight = 300;
var menuInfoWidth = 250, menuInfoHeight = 100;
var numFound;
var expressed;
var categoryExpressed;
var dateScale, sliderScale, slider;
var highlighted;
var xStart = 0;
var yStart = 0;

//set the map when window is loaded
window.onload=setMap();

//fucniton to set the map svg
function setMap(){

	var width=window.innerWidth*0.7,
		height=window.innerHeight*0.95;

	//set the properties of the map svg
	var map=d3.select("body")
		.append("svg")
		.attr("class","map")
		.attr("width",width)
		.attr("height",height+30)
		.attr('viewBox',"0 -80 1300 700")  //the view box and preserveAspectRadio tags allows to locate the map and preserve the ratio whenresize the screen
		.attr('preserveAspectRatio',"xMidYMid meet")
		.call(d3.drag()
    		.on("start", dragstarted)
    		.on("drag", dragged)
    		.on("end", dragended));

		//define the projection for basemp
	var projection=d3.geoAzimuthalEqualArea()
		.scale(1100)
		.translate([width/2,height/2])
		.rotate([0,90]);

	// var svg = d3.select("body").appen
	//console.log(projection);

	//create a path generator
	var path=d3.geoPath()
		.projection(projection);

	//console.log(path);
	//call the function to create legend
	// creatLegend();

	//load in the dataset
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


	// call the datasets that are loaded in
	function callback(error,allCoords,uwCoords,seamask,coastline,iceshelf, 
		minTemp, meanTemp, maxTemp, meanWind, meanPressure){
		// DIFFERENT VARIABLE

		//initalize vairbales for this function
		categoryExpressed = "overview";
		var stations = [];
		var stationlat = [];
		var stationlong = [];
	    for (var i = 0; i < allCoords.length; i++){
	     	stations.push(allCoords[i].sitename);
	     	stationlat.push(allCoords[i].latitude);
	     	stationlong.push(allCoords[i].longitude);
	    };

    	//autoFillForm(stations, stationlat, stationlong);

		/**** Link that data **/
		var currAttribute;
		// create array w/ csv's loaded
		var csvArray = [meanTemp, minTemp, maxTemp, meanWind, meanPressure];
		// names for the overall label
		var attributeNames = ["meanTemp", "minTemp", "maxTemp", 
		"meanWind", "meanPressure"];

		var linkStations = ["Henry", "Byrd"];

		//define the arrtributes in the csv data for linking
		for (csv in csvArray) {
			currAttribute = attributeNames[csv];
			allCoords = LinkData(allCoords, csvArray[csv], attributeNames[csv]); 
		};

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
		};

		console.log(allCoords);

		//call the functions to craete map objects
		clickMenu(allCoords);
		
		creatLegend();
		setTitleBox();
		

		//create graticules and gratilines, but later decided it is not actually necessary
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
		
		//convert the topojson objects to geojson
			var sea=topojson.feature(seamask,seamask.objects.ne_50m_ocean).features, 
			land=topojson.feature(coastline,coastline.objects.ant_reg2).features,
			ice=topojson.feature(iceshelf,iceshelf.objects.ne_50m_antarctic_ice_shelves_polys).features;

		//draw the land and ocean and ice shelf using the path generator defiend above
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

		expressed = categoryArray[0];

		//add the stations onto the basemap based on the csv data and style them based on the country of opertaion
		var aws=map.selectAll(".aws")
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
				highlight(d['sitename'], allCoords);
			})
			// .on("mouseout",function(d){
			// 	dehighlight(d['sitename']);

			//.on("mousemove",moveLabel)
			.transition()
			.duration(1000);

		//call the zoomin and zoom out funtions
		var zoom = d3.select("#zoomin")
			.on("click", zoomed);
			console.log(zoom);
		

		var zoom2 = d3.select("#zoomout")
			.on("click", zoomedOut);

		var resetMap = d3.select("#reset")
			.on("click", resetZoom);

			
	};

//create a function to highlight the station being hovered and retrived
function highlight(stationName, allCoords){
	highlighted = true;
	//console.log(stationName);
	var selected=d3.selectAll('.'+stationName.replace(/[ () !]/g, '-'))
		.attr("r","14px")
		.style("stroke","#dce8f7")
		.style("stroke-width","14px")
		.style("stroke-opacity","0.6");

	//console.log(selected);

		//.style("stroke")
	setLabel(stationName, selected, allCoords);
};

//dehighlight the fucntions that is not being hovered or hightlighted
function dehighlight(stationName){
	highlighted = false;
	if (stationName.length==0){
		return false;
	};
	var selected=d3.selectAll('.'+stationName.replace(/[ () !]/g, '-'))
		.attr("r","8px")
		.style("stroke","white")
		.style("stroke-width","1px");
	d3.select(".infoLabel")
		.remove();
	//setLabel(stationName, selected);
	//d3.select(".infoLabel");
};

	

//this funciton creates a legend for aws operated by each continent
	function creatLegend(){
		var colorClasses=["#e31a1c","#fa9fb5","#fd8d3c","#00441b","#3182bd","#6a51a3"];

		var legendClasses=["UW AWS","South American AWS","Oceanian AWS","European AWS","Asian AWS","Other American AWS"];
		/*function legendClass(legendClasses){
			for (i=0;i<legendClasses.length;i++){
				console.log(legendClasses[1]);
				return legendClasses[i];
			};
		};*/
		var ls_w=220, ls_h=240;
		var legend=d3.select(".main-manu")
			.append("svg")
			.attr("class","legend")
			.attr("width",ls_w)
			.attr("height",ls_h)
			.style("top","540px")
			.style("left","-20px")
			// .attr('viewBox',"-200 -100 300 100")  //the view box and preserveAspectRadio tags allows to locate the map and preserve the ratio whenresize the screen
			// .attr('preserveAspectRatio',"xMidYMid meet");

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

		legendDots.append("text")
			.attr("class","legendText")
			.attr("x",30)
			.attr("y",function(d,i){return i*32+5;})
			.text(function(d,i){
				return legendClasses[i];
			});
		console.log(legendClasses[1]);
	};
};


//this funcitons strives to craete a dynamic labeling to give user feedback on the time and varibale selected, but is not successful
function setTitleBox(){
	var categoryLabel=d3.select("body")
			.append("div")
			.attr("class","categorylabel");

		categoryLabel = d3.selectAll(".categoryLabel")
			.style("width","240px")
			.style("height", "170px")//window.innerWidth-500+"px")
			.style("left","100px")
			.style("top","70px");

		console.log(categoryExpressed);

		var title = getTitle(categoryExpressed);

		title = "<h2>" + title + "</h2>";

		var currLabel=categoryLabel.append("div")
			.attr("class","currLabel")
			.html(title);
};

//this function sets the title of the attribute to be expresssed 
function getTitle(currAttribute){
	var labelArray = currAttribute.split("_");
	console.log(labelArray);
	var month;
	var year = labelArray[1];
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
		properAtt =  fullCategory[2] + " (Degrees Celsius)";
	}
	if (labelArray[0] == "maxTemp") {
		properAtt =  fullCategory[3] + " (Degrees Celsius)";
	}
	if (labelArray[0] == "meanTemp") {
		properAtt =  fullCategory[1] + " (Degrees Celsius)";
	}
	if (labelArray[0] == "meanPressure") {
		properAtt =  fullCategory[5]+ " (mb)";
	}
	if (labelArray[0] == "meanWind") {
		properAtt =  fullCategory[4]+ " (meters/s)";
	}

	label= month +  year + " " + properAtt;
	return label;
};
//chnages the circles size based on the attribue values
function circleSize(d, attribute){
	//console.log(d[attribute]);
	if ( isNaN(d[attribute]) ) {
		d[attribute] = 0;
	}
	//console.log(parseFloat(d[attribute]));
	var value = Math.sqrt(Math.abs(d[attribute]) + 45 );
	//value = d[attribute] + 45;
	var radius = value + "px";
	console.log(radius);
  	return radius;
};

// change attribute expressed on the map 
function changeAttribute(attribute, csvData) {
	console.log(d3.selectAll("circle"));
	console.log(csvData);
	expressed = attribute;
	//select the circles and manipulate the ones without values to none 
	var aws = d3.selectAll("circle")
		.transition()
		.duration(800)
		.attr("fill", function (d, i){
			if (typeof d == "undefined") return "white";
			if (isNaN(parseFloat(d[attribute]))) {
				return "none";
			}
			else {
				return "#e31a1c";
			}
		})

		.attr("r", function(d){
			// console.log(d[attribute]);
			var foo;
			if (typeof d != "undefined"){
				if (typeof d[attribute] == 'undefined' || isNaN(parseFloat(d[attribute]))) {
				
				// foo = 5+"px";
				// foo.attr("fill","grey");
				foo=5+"px";

			}
			else {
				//console.log(d[attribute]);
				//console.log(circleSize(d, attribute));
				foo = circleSize(d, attribute);
			};
			console.log(foo);
			return foo;
			};
		});

	
	d3.select("#date").html(setTitleBox(getTitle));
	//setLabel();
		//sliderBar(csvData);
	//console.log(aws);
};

// create side menu to change to different attributes
function clickMenu(currData) {
	var currAttribute;
	var circle = d3.selectAll(".circle");
	console.log(circle);
	$(".Overview").click(function(){
		categoryExpressed = categoryArray[0];
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
				};
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
			});
		creatLegend();
	});
	//reset the proportional symbol map after each time the tab get clciked
	$(".Mean-Temp").click(function(){
		categoryExpressed = categoryArray[1];
		yearExpressed = keyArray[0];
		currAttribute = categoryArray[1] + "_" + yearExpressed;
		expressed = currAttribute;
		console.log(expressed);
		changeAttribute(currAttribute, currData);
		//sliderBar(currData);
	});
	$(".Min-Temp").click(function(){
		categoryExpressed = categoryArray[2];
		yearExpressed = keyArray[0];
		currAttribute = categoryArray[2] + "_" + yearExpressed;
		expressed = currAttribute;
		changeAttribute(currAttribute, currData);
		//sliderBar(currData);
	});
	$(".Max-Temp").click(function(){
		categoryExpressed = categoryArray[3];
		yearExpressed = keyArray[0];
		currAttribute = categoryArray[3] + "_" + yearExpressed;
		expressed = currAttribute;
		changeAttribute(currAttribute, currData);
		//sliderBar(currData);
	});

	$(".Mean-Wind").click(function(){
		categoryExpressed = categoryArray[4];
		yearExpressed = keyArray[0];
		currAttribute = categoryArray[4] + "_" + yearExpressed;
		expressed = currAttribute;
		changeAttribute(currAttribute, currData);
		//sliderBar(currData);
	});
	$(".Mean-Pressure").click(function(){
		categoryExpressed = categoryArray[5];
		yearExpressed = keyArray[0];
		currAttribute = categoryArray[5] + yearExpressed;
		expressed = currAttribute;
		changeAttribute(currAttribute, currData);
		//sliderBar(currData);
	});
};


// the function creates the slider bar to the bottom of the page; it functions when other vairbales are clicked to be visualized


//this is the zooming in function
function zoomed() {
	if (zoomlevel < 2) {
	zoomlevel += 0.1;
	};
	  d3.select(".map").attr("transform", "scale("+ zoomlevel + " " + zoomlevel + ") translate(" + (-956.2*0.1) + ", " + (-355.5*0.1) + ")"); 
};

//this function zooms out 
function zoomedOut() {
	if (zoomlevel > 1){
	zoomlevel += -0.1;
	};
	d3.select(".map").attr("transform", "scale(" + zoomlevel + " " + zoomlevel + ") translate(" + (-956.2*0.1) + ", " + (-355.5*0.1) + ")"); 
};

//this function is resetiing the zoom level to inital zoom level of 1
function resetZoom() {
	zoomlevel = 1;
	d3.select(".map").attr("transform", "scale(" + zoomlevel + " " + zoomlevel + ") translate(" + (-956.2*0.1) + ", " + (-355.5*0.1) + ")" + ") center(0,0)"); 
};

//this function enables dragging of the entire map svg
function dragstarted() {
console.log(d3.event);
 d3.select(this).raise().classed("active", true);
  xStart = d3.event.x;
  yStart = d3.event.y;
  return xStart, yStart;
  //capture d3.event.x, d3.event.y as global vars xStart, yStart
};

//this function resets the map after the dragging action
function dragged() {
  d3.select(this).attr("transform",  function() {
  var diffX = d3.event.x - xStart;
  var diffY = d3.event.y - yStart;

  return "scale(" + zoomlevel + " " + zoomlevel + ") translate("+diffX+" "+diffY+")";
    });
};

//this sets the state after the dragging action
function dragended() {
  d3.select(this).classed("active", false);
};




})();
