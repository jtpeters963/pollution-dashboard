// Creating map object
var myMap = L.map("map", {
  center: [34.0522, -118.2437],
  zoom: 5
});

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
         layer.bindPopup("CountyName: " + feature.properties.NAME + "<br>Avg  Air Quality index<br>" +
            + feature.properties.aqi_avg);
       }
     }).addTo(myMap);
     L.geoJson(data, {style: style,
    onEachFeature: function(feature, layer) {
      layer.bindPopup("CountyName: " + feature.properties.NAME + "<br>Avg  Air Quality index<br>" +
         + feature.properties.aqi_avg);
          }
      }).addTo(myMap);
  //  L.geoJson(data,{
  //   pointToLayer: function(feature,latlng){
  //     var marker = L.marker(latlng);
  //     marker.bindPopup(feature.properties.STATE );
  //     return marker;
  //   }
  // }).addTo(myMap);

  //  var ratIcon = L.icon({
  //   iconUrl: 'http://andywoodruff.com/maptime-leaflet/rat.png',
  //   iconSize: [60,50]
  // });
  // L.geoJson(data,{
  //   pointToLayer: function(feature,latlng){
  //     var marker = L.marker(latlng,{icon: ratIcon});
  //     marker.bindPopup(feature.properties.NAME + '<br/>' + feature.properties.aqi_avg);
  //     return marker;
  //   }
  // }).addTo(myMap);
 
   // Set up the legend
  //  var legend = L.control({ position: "bottomright" });
  //  legend.onAdd = function() {
  //    var div = L.DomUtil.create("div", "info legend");
  //    var limits = geojson.options.limits;
  //    var colors = geojson.options.colors;
  //    var labels = [];
 
  //    // Add min & max
  //    var legendInfo = "<h1>Median Income</h1>" +
  //      "<div class=\"labels\">" +
  //        "<div class=\"min\">" + limits[0] + "</div>" +
  //        "<div class=\"max\">" + limits[limits.length - 1] + "</div>" +
  //      "</div>";
 
  //    div.innerHTML = legendInfo;
 
  //    limits.forEach(function(limit, index) {
  //      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
  //    });
 
  //    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
  //    return div;
  //  };
 
  //  // Adding legend to the map
  //  legend.addTo(myMap);
 
  // Adding a search into the map using leaflet search
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

//play sounds based on the aqu value on mouseclick working on this
// function getsoundtoplay(d){
//   return 
// }
// var sound = new Howl({
//   src: ['static/sounds/applause.mp3']
// });

// sound.play();