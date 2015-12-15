boot.def('app/location/maps', ['core', 'ui/window'], function (exports, core, Window) {
	var me = {},
		geocoder = new google.maps.Geocoder(),
		directionsService = new google.maps.DirectionsService();

	me.open = function (options) {
		var target = new Window ({
			title: 'Contact: Morten Olsen',
			resizable: false,
			width: '500px',
			height: '400px',
			html: '<div style="width:100%; height: 100%"></div>'
		});

		target.show();

		options = options || {};

		//options.center: { lat: -34.397, lng: 150.644};
        //options.zoom: 8;

options.styles = [{"featureType":"water","stylers":[{"color":"#021019"}]},{"featureType":"landscape","stylers":[{"color":"#08304b"}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#0c4152"},{"lightness":5}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#0b434f"},{"lightness":25}]},{"featureType":"road.arterial","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"road.arterial","elementType":"geometry.stroke","stylers":[{"color":"#0b3d51"},{"lightness":16}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"}]},{"elementType":"labels.text.fill","stylers":[{"color":"#ffffff"}]},{"elementType":"labels.text.stroke","stylers":[{"color":"#000000"},{"lightness":13}]},{"featureType":"transit","stylers":[{"color":"#146474"}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#144b53"},{"lightness":14},{"weight":1.4}]}];

		options.zoom = options.zoom || 11;
		options.center = options.center || new google.maps.LatLng(40.6700, -73.9400);

        var map = new google.maps.Map(target.el.querySelector('div'),
            options);

        target.setAddress = function (address) {
	    	geocoder.geocode( { 'address': address }, function(results, status) { 
	    		var first = results[0];
	    		target.map.panTo(first.geometry.location);
	    		
	    		navigator.geolocation.getCurrentPosition(function (position) {
					var request = {
						origin:new google.maps.LatLng(position.coords.latitude, position.coords.longitude),
						destination:first.geometry.location,
						travelMode: google.maps.TravelMode.DRIVING
						
					};
					directionsService.route(request, function(result, status) {
					
						var directionsDisplay = new google.maps.DirectionsRenderer();
						directionsDisplay.setMap(map);
						
						var styledMap = new google.maps.StyledMapType([{"featureType":"water","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"road.highway","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":17}]},{"featureType":"road.highway","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":29},{"weight":0.2}]},{"featureType":"road.arterial","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":18}]},{"featureType":"road.local","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":16}]},{"featureType":"poi","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":21}]},{"elementType":"labels.text.stroke","stylers":[{"visibility":"on"},{"color":"#000000"},{"lightness":16}]},{"elementType":"labels.text.fill","stylers":[{"saturation":36},{"color":"#000000"},{"lightness":40}]},{"elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"transit","elementType":"geometry","stylers":[{"color":"#000000"},{"lightness":19}]},{"featureType":"administrative","elementType":"geometry.fill","stylers":[{"color":"#000000"},{"lightness":20}]},{"featureType":"administrative","elementType":"geometry.stroke","stylers":[{"color":"#000000"},{"lightness":17},{"weight":1.2}]}],
    {name: "Styled Map"});
						
						if (status == google.maps.DirectionsStatus.OK) {
							directionsDisplay.setDirections(result);
							map.mapTypes.set('map_style', styledMap);
							
							map.setMapTypeId('map_style');
						}
					});
			    });
	    	});
	    }

        target.map = map;

		return target;
	}

	return me;
});