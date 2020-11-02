import axios from 'axios';
import {$} from './bling.js';

function loadPlaces(lat=43.2, lng=-79.8){


	const mapOptions = {
		center: [lng, lat],
		zoom:12,
		style: 'mapbox://styles/mapbox/light-v10',
	}

	mapboxgl.accessToken = 'pk.eyJ1IjoiamVuYXJvOTQiLCJhIjoiY2pzbnBpajh3MGV5MTQ0cnJ3dmJlczFqbiJ9.Aktxa1EqTzpy7yEaBDM1xQ'; // replace this with your access token
	mapOptions.container = $('#map');


	const map = new mapboxgl.Map(mapOptions);



	axios.get(`/api/stores/near?lat=${lat}&lng=${lng}`)
	.then(res => {
		const places = res.data;
		if(!places.length){
			alert('no places found');
			return;
		}

		const bounds = new mapboxgl.LngLatBounds();

		places.map(place => {
			const html = `
				<div class="popup">
					<a href="/store/${place.slug}">
						<img src="/uploads/${place.photo || 'store.png'}" alt="${place.name}" width="100%">
						<p><strong>${place.name}</strong> - <small>${place.location.address}</small></p>
					</a>
				</div>
			`;
			const marker = new mapboxgl.Marker()
			.setLngLat(place.location.coordinates)
			.setPopup(new mapboxgl.Popup().setHTML(html))
			.addTo(map);
			marker.place = place;
			bounds.extend(place.location.coordinates)
			return marker;
		})
		map.fitBounds(bounds, {padding:100});

	})
}

export default loadPlaces;