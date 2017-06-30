(function(){

var zoomlevel = 1;
var categoryArray = ["overview", "meanTemp", "minTemp", "maxTemp", "meanWind", "meanPressure"];
var g;

var stations;
var r = "8px";
var zoom=d3.zoom()
	.scaleExtent([1,16])
	.on("zoom",zoomed);

console.log(zoom);

var mapWidth=window.innerWidth*0.6,
	mapHeight=window.innerHeight*0.8;

window.onload=setMap();


function setMap(){

	

	map=d3.select("body")
		.append("svg")
		.attr("class","map")
		.attr("width",mapWidth)
		.attr("height",mapHeight)
		.append("g");

	g=map.append("g")
		.attr("transform", "translate(0,0)scale(1,1)");



	map.call(zoom);
		// .call(d3.event);

	var projection=d3.geoAzimuthalEqualArea()
		.scale(800)
		.translate([mapWidth/2,mapHeight/2])
		.rotate([0,90]);

	var path=d3.geoPath()
		.projection(projection);

	
	d3.queue()
		.defer(d3.csv,"data/aws_coords_with_links.csv")
		.defer(d3.json, "data/seamaskPoly.topojson")
		.defer(d3.json,"data/coastPoly2.topojson")
		.defer(d3.json,"data/iceshelf.topojson")
		.await(callback);

	function callback(error,allCoords,seamask,coastline,iceshelf){
		var sea=topojson.feature(seamask,seamask.objects.ne_50m_ocean).features, 
			land=topojson.feature(coastline,coastline.objects.ant_reg2).features,
			ice=topojson.feature(iceshelf,iceshelf.objects.ne_50m_antarctic_ice_shelves_polys).features;


		var seaArea=g.append("path")
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

		var landArea=g.selectAll(".land")
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

		var iceArea=g.selectAll(".ice")
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
		var aws=g.selectAll(".aws")
			.data(allCoords)
			.enter()
			.append("circle")
			.attr('gid', function(d){
				return d['gid'];
			})
			.attr('class',function(d){
				return "stations "+d['sitename'].replace(/[ () !]/g, '-')//+" "+d['mapcode'].replace(/ /g, '-');
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
			.attr("r", r)
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
			.style("stroke","white")
			.style("stroke-width","2px")
			// .style("stroke","#fff")
			// .style("stroke-width","1px")
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

		var desc=g.selectAll(".stations").append("desc")
			.text(' {"stroke-width":"0px"}');


		console.log(desc);

		creatLegend();


	};

	d3.select('#zoomin').on('click', clickZoomin());
	d3.select('#zoomout').on('click', clickZoomout());

    
};

//create a function to highlight the station being hovered and retrived
function highlight(stationName, allCoords){
	highlighted = true;
	//console.log(stationName);
	var selected=d3.selectAll('.'+stationName.replace(/[ () !]/g, '-'))
		.attr("r",(parseFloat(r.split("px")[0])*1.5)+"px")
		.style("stroke","#dce8f7")
		.style("stroke-width",(parseFloat(r.split("px")[0])*4)+"px")
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
		.attr("r",r)
		.style("stroke","white")
		.style("stroke-width",function(){
			return getStyle(this,"stroke-width");
		})
		.style("stroke-opacity","1");
	d3.select(".infoLabel")
		.remove();



	function getStyle(element,styleName){
		var styleText=d3.select(element)
			.select("desc")
			.text();

		var styleObject=JSON.parse(styleText);

		return styleObject[styleName];
		
	};
	//setLabel(stationName, selected);
	//d3.select(".infoLabel");
};

//this function sets the informtaion panel taht is being retrieved after hovering
function setLabel(stationName,selected, csvData){
	var labelAttribute="<h1>"+stationName+"</h1>"+"<h2><b>operated by "+selected.attr('mapcode')+"</b></h2>";

	var infoLabel=d3.select("body")
			.append("div")
			.attr("class","infoLabel")
			.attr("id",selected.attr('gid'))
			.html(labelAttribute)

		infoLabel = d3.selectAll(".infoLabel")
			.style("max-width","25%")
			.style("min-height", "50%")//window.innerWidth-500+"px")
			.style("right","0px")
			.style("top","100px");

		//console.log(infoLabel);

		//console.log(expressed);

		var currValue = "";

		//console.log(expressed);
		

		if (expressed != 'overview') {
			console.log(getTitle(expressed));
			currValue = getTitle(expressed);
			//console.log(csvData);
			//console.log(csvData.stationName.expressed);
			currValue = "<h2>" + currValue + "</h2>5.6";
		}

		url=selected.attr('website');

		var contextContent1="<h2>Data URL: </h2>"+"<a href='"+url+"' target='_blank'>"+url+"</a>";

		var contextContent2="<p>More about the station: </p>"+selected.attr('description');

		var context=infoLabel.append("div")
			.attr("class","context")
			.html(currValue + contextContent2+contextContent1);
		//console.log(countryName);*/
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
	var legend=d3.select(".legend")
		.append("svg")
		.attr("class","legend")
		.attr("width",ls_w)
		.attr("height",ls_h);

		// .attr('viewBox',"-200 -100 300 100")  //the view box and preserveAspectRadio tags allows to locate the map and preserve the ratio whenresize the screen
		// .attr('preserveAspectRatio',"xMidYMid meet");

	var legendDots=legend.selectAll("g.legend")
		.data(colorClasses)
		.enter().append("g")
		.attr("class","legendDots")
		.attr("transform","translate("+ls_w/6+" "+ls_h/6+")");

	
	var ld_h=100, ld_w=100;
	legendDots.append("circle")
		.attr("cx",0)
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


function zoomed(){
	//console.log(d3.event);
	g.attr("transform", "translate(" + d3.event.transform.x+","+ d3.event.transform.y + ")scale(" + d3.event.transform.k+","+ d3.event.transform.k+ ")");
	r = (8*(1/d3.event.transform.k))+"px"; //use for highlight and dehighlight
	sw=(2*(1/d3.event.transform.k))+"px"; //this is for changing the circle stroke width
	//console.log((5*(1/d3.event.transform.k))+"px");
	d3.selectAll(".stations")
		.attr("r",  r)
		.style("stroke-width",sw);

};

function clickZoomin(element){
	console.log(element);
	var tf = element.attr("tranform"); //will only work if there IS a transform on the g element--so you need to add one when it is created
	console.log(tf);


	var tflist = tf.split("scale(");
	var translate = tflist[0];
	var currentscale = tflist[1].split(",")[0];

	var newscale = parseInt(currentscale)+0.5;
	g.attr("transform", translate+"scale("+newscale+","+newscale+")");
	d3.selectAll(".stations").attr("transform", "scale("+1/newscale+","+1/newscale+")");

};

function clickZoomout(element){
	console.log(element);
	var tf = element.attr("tranform"); //will only work if there IS a transform on the g element--so you need to add one when it is created
	console.log(tf);


	var tflist = tf.split("scale(");
	var translate = tflist[0];
	var currentscale = tflist[1].split(",")[0];

	var newscale = parseInt(currentscale)-0.5;
	g.attr("transform", translate+"scale("+newscale+","+newscale+")");
	d3.selectAll(".feature").attr("transform", "scale("+1/newscale+","+1/newscale+")");

};




})();