boot.def('ui/bgmap', [], function (exports) {
	console.log('test');
	var me = {},
		mapBg = document.createElement('div');

	mapBg.style.width = '100%';
	mapBg.style.height = '100%';
	mapBg.style.zIndex = '-2';
	document.body.appendChild(mapBg);

	var geocoder = new google.maps.Geocoder();

	var options = {};

    options.styles = [{"featureType":"water","stylers":[{"color":"#021019"}]},{"featureType":"landscape","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"transit","stylers":[{"color":"#146474"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]}];

	options.disableDefaultUI = true;
	options.zoom = options.zoom || 11;
	options.center = options.center || new google.maps.LatLng(40.6700, -73.9400);

    me.map = new google.maps.Map(mapBg,
        options);

    mapBg.style.position = 'fixed';

    me.setLocation = function (address) {
    	/*geocoder.geocode( { 'address': address }, function(results, status) { 
    		var first = results[0];
    		me.map.panTo(first.geometry.location);
    	});*/
    }

    navigator.geolocation.getCurrentPosition(function (position) {
    	me.map.panTo(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
    });

	return me;
});