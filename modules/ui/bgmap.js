boot.def('ui/bgmap', [], function (exports) {
	console.log('test');
	var me = {},
		mapBg = document.createElement('div');

	mapBg.style.width = '100%';
	mapBg.style.height = '100%';
	mapBg.style.zIndex = '-2';
	mapBg.id = 'new-map';
	document.body.appendChild(mapBg);

	mapboxgl.accessToken = 'pk.eyJ1IjoibW9ydGVub2xzZW4iLCJhIjoiY2lpZHBhaTNnMDAweXdlbTBhcTdkcWVnbSJ9.yah6Klt4jMYlkEmpC6PLKQ';
	var map = new mapboxgl.Map({
	    container: 'new-map', // container id
	    style: 'mapbox://styles/mortenolsen/ciidqy8kt002dbrkm9ai9n9ev', //stylesheet location
	    center: [-74.50, 40], // starting position
	    zoom: 9 // starting zoom
	});

  mapBg.style.position = 'fixed';
	mapBg.style.transform = 'none';

  navigator.geolocation.getCurrentPosition(function (position) {
		console.log('located', position.coords.latitude, position.coords.longitude);
		map.flyTo({center: [position.coords.longitude, position.coords.latitude], zoom: 12, pitch: 92});
  });

	me.setLocation = function() {};

	return me;
});
