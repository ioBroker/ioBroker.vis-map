var zoom = 15;
var markers = [{
    lon: 13.401,
    lat: 52.52,
    image: 'widgets/map/img/pin.png',
    width: 25,
    height: 25,
    offsetX: 12,
    offsetY: 25,
    opacity: 1,
    text: '1'
},
{
    lon: '13.41, 52.52',
    width: 20,
    height: '40',
    offsetX: 10,
    offsetY: '40',
    opacity: 0.5,
    text: '1'
}];

function getMarkers(markers) {
    var result = new OpenLayers.Layer.Markers('Markers');
    var list = [];
    
    for (var m = 0; m < markers.length; m++) {
        var width  = parseFloat(markers[m].width  || 25);
        var height = parseFloat(markers[m].height || 25);
        var size   = new OpenLayers.Size(width, height);
        var url    = markers[m].image || 'widgets/map/img/pin.png';
        var opacity = (markers[m].opacity === '' || markers[m].opacity === null || markers[m].opacity === undefined) ? 1 : parseFloat(markers[m].opacity);
        var offsetX = (markers[m].offsetX === '' || markers[m].offsetX === null || markers[m].offsetX === undefined) ? -(size.w/2) : (-1) * parseFloat(markers[m].offsetX);
        var offsetY = (markers[m].offsetY === '' || markers[m].offsetY === null || markers[m].offsetY === undefined) ? -size.h : (-1) * parseFloat(markers[m].offsetY); 
        var offset = new OpenLayers.Pixel(offsetX, offsetY);
        var offset = new OpenLayers.Pixel(offsetX, offsetY);
            
        var icon   = new OpenLayers.Icon(url, size, offset);
        var marker = new OpenLayers.Marker(text2position(markers[m].lon.toString() + (markers[m].lat ? ';' + markers[m].lat : '')), icon);
        if (opacity == 0) marker.display(opacity != 0);
        if (opacity != 1 && opacity != 0) marker.setOpacity(opacity);
            
        list.push(marker);
        result.addMarker(marker);
    }
    
    return {layer: result, list: list};
}

var fromProjection = new OpenLayers.Projection("EPSG:4326");   // Transform from WGS 1984
var toProjection   = new OpenLayers.Projection("EPSG:900913"); // to Spherical Mercator Projection

function setCenter(map, markers, maxZoom) {
	var bound = markers.getDataExtent();
	var zoom = Math.min(map.getZoomForExtent(bound), maxZoom === undefined ? 30 : parseFloat(maxZoom));
	map.setCenter(bound.getCenterLonLat(), zoom);
}

function text2position (text) {
	var parts = text.split(';');
	if (parts.length < 2) parts = text.split(',');
	if (parts.length < 2) return null;
	var lon = parseFloat(parts[0].replace(',', '.').trim());
	var lat = parseFloat(parts[1].replace(',', '.').trim());
	return new OpenLayers.LonLat(lon, lat).transform(fromProjection, toProjection);
}

function showMap(divName, markerList, maxZoom) {
  var map = new OpenLayers.Map(divName);
  var mapnik = new OpenLayers.Layer.OSM();
  map.addLayer(mapnik);

  var oObj = getMarkers(markerList);
  map.addLayer(oObj.layer);

  setCenter(map, oObj.layer, maxZoom);
  
  return {map: map, markers: oObj.list, layer: oObj.layer};
}
var obj = showMap('basicMap', markers, zoom);

setInterval(function () {
	markers[0].lon += 0.001;
	obj.markers[0].lonlat = text2position(markers[0].lon.toString() + (markers[0].lat ? ';' + markers[0].lat : ''))

	obj.layer.removeMarker(obj.markers[0]);
	obj.layer.addMarker(obj.markers[0]);
	setCenter(obj.map, obj.layer, zoom);
}, 500);