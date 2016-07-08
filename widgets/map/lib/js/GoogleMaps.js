
//https://maps.googleapis.com/maps/api/js?key=AIzaSyAcObBQ5OjIT5o8pOrMvYT8TBsoxBeU9FE&signed_in=true&callback=initMap

// google.maps.MapTypeId.ROADMAP
// google.maps.MapTypeId.SATELLITE
// google.maps.MapTypeId.HYBRID
// google.maps.MapTypeId.TERRAIN
   
// drag_cross_67_16.png
// measle.png
// measle_blue.png
// dd-via.png
// dd-via-transparent.png
// arrowshadow.png
// arrow.png
// arrowtransparent.png
// shadow50.png
// marker_sprite.png
// icon_green.png
// marker.png
// boost-marker-mapview.png

var zoom = 15;
var markers = [{
	  lon: 13.41,
    lat: 52.52,
    image: 'marker.png',
    width: 22,
    height: 40,
    //label: '1',
    text: 'Hallo'
},
{
	lon: '13.42, 52.52',
    text: 'Super',
    label: '2',
    opacity: 0.5
}];
var options = {
	mapTypeId: google.maps.MapTypeId.HYBRID,
	hideControls: true,
	noZoomAndPan: true
};


function text2position(text) {
  var parts = text.split(';');
  if (parts.length < 2) parts = text.split(',');
  if (parts.length < 2) return null;
  var lon = parseFloat(parts[0].replace(',', '.').trim());
  var lat = parseFloat(parts[1].replace(',', '.').trim());
  return new google.maps.LatLng(lat, lon);
}

function setCenter(map, oMarkers) {
 	var bounds = new google.maps.LatLngBounds();
  for (var m = 0; m < oMarkers.length; m++) {
		bounds.extend(oMarkers[m].getPosition());
  }
  if (oMarkers.length > 1) {
  	map.fitBounds(bounds); 
  } else if (oMarkers.length) {
  	map.panTo(oMarkers[0].getPosition());
  }
}
function setMarkers(map, markers) {
  var result = [];
  for (var m = 0; m < markers.length; m++) {
  	var width  = parseFloat(markers[m].width  || 25);
  	var height = parseFloat(markers[m].height || 25);
    var opacity = (markers[m].opacity === '' || markers[m].opacity === null || markers[m].opacity === undefined) ? 1 : parseFloat(markers[m].opacity);
    /*var offsetX = (markers[m].offsetX === '' || markers[m].offsetX === null || markers[m].offsetX === undefined) ? -(width / 2) : (-1) * parseFloat(markers[m].offsetX);
    var offsetY = (markers[m].offsetY === '' || markers[m].offsetY === null || markers[m].offsetY === undefined) ? -height : (-1) * parseFloat(markers[m].offsetY); */
    
    var image = markers[m].image ? {
      url: 		markers[m].image.indexOf('/') === -1 ? '//maps.gstatic.com/mapfiles/markers2/' + markers[m].image : markers[m].image,
      size: 	new google.maps.Size(width, height),
      origin: new google.maps.Point(0, 0),
      //anchor: new google.maps.Point(offsetX, offsetY)
    } : undefined;
    
      var marker = new google.maps.Marker({
        position: text2position(markers[m].lon.toString() + (markers[m].lat ? ';' + markers[m].lat : '')),
        icon: 		image,
        label: 		markers[m].label || undefined,
        map: 			map,
        title:    markers[m].text || undefined
      });
      if (opacity !== 1) marker.setOpacity(opacity)
			result.push(marker);
  }
  return result;
}
function showMap(divElem, markerList, maxZoom, options) {
	var options = options || {};
  options.mapTypeId = options.mapTypeId || google.maps.MapTypeId.ROADMAP;

  var map = new google.maps.Map(divElem, {
    zoom: 			maxZoom,
    center: 		new google.maps.LatLng(52.52, 13.41),
    mapTypeId: 	options.mapTypeId,
    disableDefaultUI: !!options.hideControls,
    scrollwheel:  !options.noZoomAndPan,
    disableDoubleClickZoom:  !!options.noZoomAndPan,
    panControl:  !options.noZoomAndPan
  });

  var markers = setMarkers(map, markerList);
  setCenter(map, markers);
  return {map: map, markers: markers};
}

var obj = showMap(document.getElementById('map'), markers, zoom, options);

setInterval(function () {
	markers[0].lon += 0.0001;
	obj.markers[0].setPosition(text2position(markers[0].lon.toString() + (markers[0].lat ? ';' + markers[0].lat : '')));
  setCenter(obj.map, obj.markers);
}, 500);
