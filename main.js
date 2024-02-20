
var mapOptions = {
    center: [28, 84],
    zoom: 7,
    scrollWheelZoom: false,
    measureControl: true
 }
 var map = new L.map('map',
    mapOptions);



 var one = L.tileLayer.wms('http://localhost:8080/geoserver/geoWork/wms', {
    layers: 'geoWork:province',
    format: 'image/png',
    transparent: true,
    version: '1.1.0',
 

 });

 var layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

 var street = L.tileLayer(
    "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}", {
       maxZoom: 20,
       subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
 );

 var sat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
 });

 map.on('click', function (e) {

    var formHtml = '<form>' +
       '<div class="form-group">' +
       '<label for="exampleInputEmail1">Radius</label>' +
       '<input class="form-control" id="radius" placeholder="Enter Radius">' +
       '</div>' +
       '<br>' +
       '<button type="submit" onclick=test() class="btn btn-primary">Submit</button>' +
       '</form>';


    var marker = L.marker([e.latlng.lat, e.latlng.lng], {
       draggable: true
    }).bindPopup(formHtml, {
       closeOnClick: true
    }).addTo(map);

    window.testMarker = marker;
 });


 function test() {
    if (window.testMarker) {
       var radiusInput = document.getElementById('radius');
       var radius = parseFloat(radiusInput.value) || 0;

       var lat = window.testMarker.getLatLng().lat;
       var lng = window.testMarker.getLatLng().lng;

       L.circleMarker([lat, lng], {
          radius: radius
       }).addTo(map);
    }

    event.preventDefault();
 }



 map.on('mousemove', function (e) {
    document.getElementById('txt').innerHTML = e.latlng.lat + ' ' + e.latlng.lng;
 })



 var baseLayers = {
    'admin': one
 }

 var layer_2 = {
    'StreetMap':street,
    'SatelliteMap':sat,
    'Osm':layer
 }

 L.control.layers(layer_2,baseLayers).addTo(map);

 

  var searchControl = L.esri.Geocoding.geosearch().addTo(map);
  var results = L.layerGroup().addTo(map);
  
  var p =[[]];
  searchControl.on('results', function(data) {
    for (var i = data.results.length - 1; i >= 0; i--) {
       
      results.addLayer(L.marker(data.results[i].latlng));
    }
  });



  L.Routing.control({
    waypoints: [[27,83],[28,83]],
    routeWhileDragging: true
  }).addTo(map);


 map.addLayer(layer);