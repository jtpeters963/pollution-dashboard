

var mysiteMap =10;
// Creating map object
var myMap = L.map("map", {
  center: [39, -98],
  zoom: 4
});

// Another map for the sites
    // Adding a map for the site data
  

// Adding tile layer
var tile = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/satellite-streets-v11",
  accessToken: API_KEY
}).addTo(myMap)

// // Load in geojson data for temporary use
//  var geoData = "static/data/geojson_withNAs.json";
//  console.log(geoData);
//Creating the layer
 var geojson;


 // Grab data with d3 use the then function  since we have version 5
 d3.json('/aqidata').then (function(data) {
  console.log(data)
   // Create a new choropleth layer
   geojson = L.geoJson(data, {
    //    style: style,
        style: style,
        onEachFeature: function(feature, layer) {
          if (feature.properties.aqi_avg !=NaN) {
         layer.bindPopup("CountyName: " + feature.properties.NAME + "<br>Avg  Air Quality index<br>" +
            + feature.properties.aqi_avg);
          }
       }
     }).addTo(myMap);
     L.geoJson(data, {style: style,
    onEachFeature: function(feature, layer) {
  if (feature.properties.aqi_avg != NaN) {
      layer.bindPopup("US County Name: " + feature.properties.NAME + "<br>Avg  Air Quality index<br>" +
         + feature.properties.aqi_avg);
          }
         
          // layer.on({
          //   click: sound.stop()
            
          // });
        }
      }).addTo(myMap);
 
      //geojson.on('click',playSound(feature.properties.aqi_avg)).addTo(myMap);
  

//play sounds based on the aqui value on mouseclick working on this
function getSound(d) {
  return d > 50   ? 'Explosion+3.mp3' :
        //  d > 40   ?  '#FC4E2A':
        //  d > 30   ?  'orange':
        //  d > 20   ? 'yellow' :
       //  d < 50    ? 'applause.mp3' :
       'applause.mp3';
}


function playSound(d){

  soundFile = getSound(d)
  console.log(soundFile)
var sound = new Howl({
  src: ['static/sounds/'+soundFile]
});

sound.play();
}

  var legend = L.control({ position: "bottomright" });
   legend.onAdd = function() {
     var div = L.DomUtil.create("div", "info legend");
     var limits = ['Good(0-20)','Moderate(20-30)','Unhealthy for Sensitive(30-40)','Unhealthy(40-50)','Extremely Unhealthy(50+)'];
     var colors = ['green','yellow','orange','#FC4E2A','red'];
     var labels = ['Relative AQI Rankings'];
 
     // Add min & max
     var legendInfo = "<h3></h3>" 
    //    "<div class=\"labels\">" +
    //      "<div class=\"min\">" + limits[0] + "</div>" +
    //      "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
    //    "</div>";
 
     div.innerHTML = legendInfo;
 
     limits.forEach(function(limit, index) {
       labels.push("<li style=\"background-color: " + colors[index] + "\">"+limits[index]+"</li>");
     });
     whiteColor='white'
     div.innerHTML += "<ul style=\"background-color: " + whiteColor + ";list-style-type:none;padding:0px; font-size: 15px;\">" + labels.join("") + "</ul>";
     return div;
   };
 
  //  // Adding legend to the map
   legend.addTo(myMap);
 
  //Adding a search into the map using leaflet search
  var searchControl = new L.Control.Search({
    collapsed: false,
		layer: geojson,
		propertyName: 'NAME',
		marker: false,
		moveToLocation: function(latlng, title, map) {
			//map.fitBounds( latlng.layer.getBounds() );
			var zoom = map.getBoundsZoom(latlng.layer.getBounds());
  			map.setView(latlng, zoom); // access the zoom
		}
	});

	searchControl.on('search:locationfound', function(e) {
		
		console.log('search:locationfound', );

		//map.removeLayer(this._markerSearch)

		e.layer.setStyle({fillColor: '#3f0', color: '#0f0',text:'Type a county name'});
		if(e.layer._popup)
			e.layer.openPopup();

	}).on('search:collapsed', function(e) {

		geojson.eachLayer(function(layer) {	//restore feature color
			geojson.resetStyle(layer);
		});	
	});
  
 
	myMap.addControl( searchControl );  //inizialize search control

 });
 

 function style(feature) {
  return {
      fillColor: getColor(feature.properties.aqi_avg),
      weight: 1,
      opacity: 0.8,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
  };
}
 function getColor(d) {
  return d > 50   ? 'red' :
         d > 40   ?  '#FC4E2A':
         d > 30   ?  'orange':
         d > 20   ? 'yellow' :
         d > 0    ? 'green' :
                    'black';
}





// Getting the value of the state county when the user Click the submit button
var dropdown = d3.select("#selDataset");
var selectstate;
var selectcounty;
var fips;
var statecountyselect = dropdown.node().value;
console.log(statecountyselect);

function optionChanged(id) {
  var statecountyselect = dropdown.node().value;
  selectstate = statecountyselect.split(",")[1];
  console.log(selectstate);
  selectcounty = statecountyselect.split(",")[0];
  console.log(selectcounty);

  selectfips = statecountyselect.split(":")[1].split(")")[0];
  console.log(selectfips);
  createAqiPlot();
  createOtherPollutantsPlot(selectfips);
}

function createAqiPlot(){
var aqi = createDynamicURL()
d3.json(aqi).then (function(data) {
  
console.log(data)

var aqiData = data[0]["date"];
var x = Object.keys(aqiData);
var y = Object.values(aqiData);
var data = [{x:x,y:y, type:"scatter",mode:"marker"}]
var layout={title:"AQI"}
Plotly.newPlot("aqiplot",data,layout)


});
}

function createOtherPollutantsPlot(fips){
  
  var url = '/ozone/'+fips
  console.log(url)
  d3.json(url).then(function(countyData){
    var siteCoord ={};
    var siteKeys =[];
    console.log(countyData)
    var ozoneData = countyData.ozone;
    var ozoneTraces =[]
    for (var i in ozoneData){
      var j = ozoneData[i] ;
      if (typeof siteCoord.i==="undefined" ){
        var coord = j.site_coord;
        siteCoord[i]=[coord.lat,coord.lon];
        siteKeys.push(i);
      }

      var station = j.data;
      var dates= Object.keys(station);
      console.log(dates);
      var x = dates.map(ds => new Date(ds))
      console.log(x)
      var y = Object.values(station);
      var trace = {x:x,y:y,type:'scatter',mode:'markers',name:i};  
      ozoneTraces.push(trace);
    }
    ozoneLayout={title:'Ozone',
            xaxis:{title:"date"},
            yaxis:{title:"Ozone:ppm",rangemode:'nonnegative'}}
    Plotly.newPlot("ozone_plot",ozoneTraces,ozoneLayout)
    var coData = countyData.CO;
    var coTraces =[]
    for (var i in coData){
      var j = coData[i] ;
      if (typeof siteCoord.i==="undefined" ){
        var coord = j.site_coord;
        siteCoord[i]=[coord.lat,coord.lon];
        siteKeys.push(i);
      }
      var station = j.data;
      var dates= Object.keys(station);
      console.log(dates);
      var x = dates.map(ds => new Date(ds))
      console.log(x)
      var y = Object.values(station);
      var trace = {x:x,y:y,type:'scatter',mode:'markers',name:i};  
      coTraces.push(trace);
    }
    coLayout={title:'CO',
              xaxis:{title:'Date'},
              yaxis:{title:'CO:ppm',rangemode:'nonnegative'}}
    Plotly.newPlot("co_plot",coTraces,coLayout)
    var soData = countyData.SO2;
    var soTraces =[]
    for (var i in soData){
      var j = soData[i] ;
      if (typeof siteCoord.i==="undefined" ){
        var coord = j.site_coord;
        siteCoord[i]=[coord.lat,coord.lon];
        siteKeys.push(i);
      }
      var station = j.data;
      var dates= Object.keys(station);
      console.log(dates);
      var x = dates.map(ds => new Date(ds))
      console.log(x)
      var y = Object.values(station);
      var trace = {x:x,y:y,type:'scatter',mode:'markers', name:i};  
      soTraces.push(trace);
    }
    soLayout={title:'SO2',
              xaxis:{title:"Date"},
              yaxis:{title:"SO2:ppb", rangemode:'nonnegative'}}
    Plotly.newPlot("so_plot",soTraces,soLayout)
    var pmData = countyData.pm_25;
    var pmTraces =[]
    for (var i in pmData){
      var j = pmData[i] ;
      if (typeof siteCoord.i==="undefined" ){
        var coord = j.site_coord;
        siteCoord[i]=[coord.lat,coord.lon];
        siteKeys.push(i);
      }
      var station = j.data;
      var dates= Object.keys(station);
      console.log(dates);
      var x = dates.map(ds => new Date(ds))
      console.log(x)
      var y = Object.values(station);
      var trace = {x:x,y:y,type:'scatter',mode:'markers',name:i};  
      pmTraces.push(trace);
    }
    pmLayout={title:'PM 2.5',yaxis:{title:"PM 2.5 micrograms/cubic meter",rangemode:'nonnegative'}}
    Plotly.newPlot("pm_plot",pmTraces,pmLayout)
    var noData = countyData.NO2;
    var noTraces =[];
    for (var i in noData){
      var j = noData[i] ;
      if (typeof siteCoord.i==="undefined" ){
        var coord = j.site_coord;
        siteCoord[i]=[coord.lat,coord.lon];
        siteKeys.push(i);
      }
      var station = j.data;
      var dates= Object.keys(station);
      var x = dates.map(ds => new Date(ds))
      var y = Object.values(station);
      var trace = {x:x,y:y,type:'scatter',mode:'markers',name:i};  
      noTraces.push(trace);
    }
    noLayout={title:'NO2',
              xaxis:{title:"Date"},
              yaxis:{title:"NO2:ppb",rangemode:'nonnegative'}}
    Plotly.newPlot("no_plot",noTraces,noLayout)

var siteOne = siteKeys[0];
var centerCoord = siteCoord[siteOne]
console.log('center coordinates');
console.log(centerCoord);
// Adding tile layer
if (mysiteMap!=10){
  mysiteMap.off();
  mysiteMap.remove();
}
 mysiteMap = L.map("sitemap", {
    center: centerCoord,
    zoom: 10
   });
   var tile = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/satellite-streets-v11",
    accessToken: API_KEY
  }).addTo(mysiteMap)




for(var i in siteCoord){

var location = siteCoord[i]

//location = [-41.29042, 174.78219]
L.marker(location)
  .bindPopup("<h1> Site ID:" +i+ "</h1>")
  .addTo(mysiteMap);
}


  });


}



// Grab state and county and generate the URL dynamically
function createDynamicURL()
{
    //The variable to be returned
    var URL ="plotstatecounty/";
    //Forming the variable to return    
    //URL+="county=";
    URL+=selectstate.trim();
    URL+="/";
    URL+=selectcounty.trim();
  
    return URL;
}

function RedirectURL()
{
    //window.location= createDynamicURL();
    window.open(createDynamicURL());
}










