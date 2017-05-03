//window.onload = initialize();

// this script will add the basemap and the data points on map
/* GLOBAL VARIABLES */
var Category = ["overview, meanTemp, minTemp, maxTemp, meanWind, meanPressure"];
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
var years = ['2009', '2010','2011','2012', '2013', '20104', '2015', '2016']
var expressed;
var yearExpressed;
var scale;
var menuWidth = 200, menuHeight = 300;
var menuInfoWidth = 250, menuInfoHeight = 100;
var numFound;
var dateScale, sliderScale, slider;

function circleSize(d){
  return Math.sqrt( .02 * Math.abs(d) );
};

window.onload=setMap();

function setMap(){
	var width=window.innerWidth*0.7,
		height=window.innerHeight*0.9;

	var map=d3.select("body")
		.append("svg")
		.attr("class","map")
		.attr("width",width)
		.attr("height",height+30)
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
		/*console.log(error);
		console.log(allCoords);
		console.log(uwCoords);
		console.log(seamask);
		console.log(coastline);
		console.log(iceshelf);*/

		console.log(minTemp);
		console.log(meanTemp);
		console.log(maxTemp);
		console.log(meanWind);
		console.log(meanPressure);

		// DIFFERENT VARIABLE

		/**** Link that data **/
		// create array w/ csv's loaded
		var csvArray = [meanTemp, minTemp, maxTemp, meanWind, meanPressure];
		// names for the overall label
		var attributeNames = ["meanTemp", "minTemp", "maxTemp", 
		"meanWind", "meanPressure"];

		for (csv in csvArray) {
			LinkData(allCoords, csvArray[csv], attributeNames[csv]); 
		}

		numFound = 0;
		// loop through the csv and tie it to the coords CSV
		function LinkData(coordsCSV, csvData, attribute) {
			console.log(coordsCSV);
			// loop through coords csv
			// update this value when we add more stations
			for (var i = 0; i < 2; i++) {
				// create a property to hold csvData

				var csvStation = coordsCSV[i];
				var csvLink = csvStation.sitename;
				console.log(csvLink);
				console.log(numFound);

				if (csvLink == 'Henry' || csvLink == 'Byrd') {
					console.log("i'm in the if statement");
					numFound = numFound + 1;
					console.log("length " + csvData.length);
					for (var i = 0; i < csvData.length; i++) {
						console.log(csvData[i]);
						if (csvLink == csvData[i]) {
							console.log("i'm in the tiny if statement");
							attrObj = {};
							for (var key in keyArray) {
								console.log(key);
								var attr = keyArray[key];
								var val = csvStation[attr];
								console.log(val);
								console.log(attr);
								attrObj[attr] = val;
							}
						}
					
					}
				}
				if (numFound == 2) {
					break;
				}
				// loop through stations and assign data to right station
			}
		}
		//for (var i = 0; i )
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
				highlight(d['sitename']);
			})
			.on("mouseout",function(d){
				dehighlight(d['sitename']);

			})
			//.on("mousemove",moveLabel)
			.transition()
			.duration(1000);
		//console.log(allCoords);
		//aws=joinData(aws,allCoords);
		//setLabel(allCoords);
		//highlight(props);

			//});
			//.attr('d', path.pointRadius(function(d) { return radius(d.properties.latitude); }));


			//.attr('d', path.pointRadius(function(d) { return radius(d.properties.latitude); }));
			//console.log(allCoords);
			//aws=joinData(aws,allCoords);
			//setLabel(allCoords);
			//highlight(props);
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
		var selected=d3.selectAll('.'+stationName.replace(/[ () !]/g, '-'))
			.attr("r","8px");
		d3.select(".infoLabel")
			.remove();
		//setLabel(stationName, selected);
		//d3.select(".infoLabel");
	};

	function setLabel(stationName,selected){
		console.log(selected);
		var labelAttribute="<h1>"+stationName+"</h1>"+"<h2><b>operated by "+selected.attr('mapcode')+"</b></h2>";
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
			.style("width","240px")
			.style("height", "620px")//window.innerWidth-500+"px")
			.style("right","0px")
			.style("top","70px");

		console.log(infoLabel);

		var contextContent1="<h2>Website: </h2>"+selected.attr('website');

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


	//function legend

};

// change year
function changeYear() {

}

// change attribute
function changeAttribute() {

}

function createSlider(){
  sliderScale = d3.scaleLinear().domain([0,126]);

  var val = slider ? slider.value() : 0;

  slider = d3.slider()
    .scale( sliderScale )
    .on("slide",function(event,value){
      if ( isPlaying ){
        clearInterval(interval);
      }
      currentFrame = value;
      drawMonth( orderedColumns[value], d3.event.type != "drag" );
    })
    .on("slideend",function(){
      if ( isPlaying ) animate();
      d3.select("#slider-div").on("mousemove",sliderProbe)
    })
    .on("slidestart",function(){
      d3.select("#slider-div").on("mousemove",null)
    })
    .value(val);

  d3.select("#slider-div").remove();

  d3.select("#slider-container")
    .append("div")
    .attr("id","slider-div")
    .style("width",dateScale.range()[1] + "px")
    .on("mousemove",sliderProbe)
    .on("mouseout",function(){
      d3.select("#slider-probe").style("display","none");
    })
    .call( slider );

  d3.select("#slider-div a").on("mousemove",function(){
    d3.event.stopPropagation();
  })

  var sliderAxis = d3.svg.axis()
    .scale( dateScale )
    .tickValues( dateScale.ticks(orderedColumns.length).filter(function(d,i){
      // ticks only for beginning of each year, plus first and last
      return d.getMonth() == 0 || i == 0 || i == orderedColumns.length-1;
    }))
    .tickFormat(function(d){
      // abbreviated year for most, full month/year for the ends
      if ( d.getMonth() == 0 ) return "'" + d.getFullYear().toString().substr(2);
      return months[d.getMonth()] + " " + d.getFullYear();
    })
    .tickSize(10)

  d3.select("#axis").remove();

  d3.select("#slider-container")
    .append("svg")
    .attr("id","axis")
    .attr("width",dateScale.range()[1] + sliderMargin*2 )
    .attr("height",25)
    .append("g")
      .attr("transform","translate(" + (sliderMargin+1) + ",0)")
      .call(sliderAxis);

  d3.select("#axis > g g:first-child text").attr("text-anchor","end").style("text-anchor","end");
  d3.select("#axis > g g:last-of-type text").attr("text-anchor","start").style("text-anchor","start");
}

// create side menu to change to different attributes
function clickMenu(currData) {
	$(".Overview").click(function(){
		expressed = Category[0];
		yearExpressed = keyArray[0];
		/*d3.selectAll(".menu-options div")
		 .style('background-color', '#fff')
		 .style('color', '#9C0D08');
		d3.select("Overview")
			.style('background-color', '#CCCCCC')
			.style('color', '#333333');*/
	})
	$(".Mean-Temp").click(function(){
		console.log('you clicked mean temp');
		expressed = Category[1];
		yearExpressed = keyArray[0];
		/*d3.selectAll(".menu-options div")
		 .style('background-color', '#fff')
		 .style('color', '#9C0D08');
		d3.select("Mean-Temp")
			.style('background-color', '#9C0D08')
			.style('color', '#fff');*/
	})
	$(".Min-Temp").click(function(){
		expressed = Category[2];
		yearExpressed = keyArray[0];
		/*d3.selectAll(".menu-options div")
		 .style('background-color', '#fff')
		 .style('color', '#9C0D08');
		d3.select("Min-Temp")
			.style('background-color', '#CCCCCC')
			.style('color', '#333333');
		d3.selectAll(".circles");*/
	})
	$(".Max-Temp").click(function(){
		expressed = Category[3];
		yearExpressed = keyArray[0];
		/*d3.selectAll(".menu-options div")
		 .style('background-color', '#fff')
		 .style('color', '#9C0D08');
		d3.select("Mean-Pressure")
			.style('background-color', '#CCCCCC')
			.style('color', '#333333');*/
		d3.selectAll(".circles");
	})
	$(".Mean-Wind").click(function(){
		expressed = Category[4];
		yearExpressed = keyArray[0];
		/*d3.selectAll(".menu-options div")
		 .style('background-color', '#fff')
		 .style('color', '#9C0D08');
		d3.select("Mean-Pressure")
			.style('background-color', '#CCCCCC')
			.style('color', '#333333');*/
		d3.selectAll(".circles");
	})
	$(".Mean-Pressure").click(function(){
		expressed = Category[5];
		yearExpressed = keyArray[0];
		/*d3.selectAll(".menu-options div")
		 .style('background-color', '#fff')
		 .style('color', '#9C0D08');
		d3.select("Mean-Pressure")
			.style('background-color', '#CCCCCC')
			.style('color', '#333333');*/
		d3.selectAll(".circles");
	})
}

/*function createLineGraph(csvData) {
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
}*/

