"use strict";

var map, infoWindow;
let globallat = 0;
let globallng = 0;
let markers = [];

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: 47.655930,
			lng: -122.309472
		},
		zoom: 17
	});
	infoWindow = new google.maps.InfoWindow;

	// my code

	let url = "php/map.php";
	fetch(url, {
			mode: 'cors',
			credentials: 'include'
		})
		.then(checkStatus)
		.then(JSON.parse)
		.then(handleResponse)
		.catch(console.log);

	function handleResponse(response) {

		// response = response.split("$");
		console.log(response)
		for (let i = 0; i < response.length; i += 10) {

			var image = 'images/pawmarker-small.png';
			let lat = parseFloat(response[i]);
			let lon = parseFloat(response[i + 1]);
			let color = response[i + 2].charAt(0).toUpperCase() + response[i + 2].slice(1);
			let size = response[i + 3].charAt(0).toUpperCase() + response[i + 3].slice(1);
			let spots = "None";
			if (response[i + 4] == "true") {
				spots = "Yes";
			}
			let collar = "None";
			if (response[i + 5] == "true") {
				collar = "Yes";
			}

			let breed = response[i + 6].split('/').reverse()[0];
			breed = breed.substr(0, breed.lastIndexOf('.'));
			breed = breed.split("-");
			let result = "";
			for (let i = 0; i < breed.length; i++) {
				result += breed[i].charAt(0).toUpperCase() + breed[i].slice(1) + " ";
			}
			breed = result;

			var contentString = '<div id="content" style="width: 400px;">' +
				'</div>' +
				'<div id="bodyContent">' +
				'<div>' +
				'<p style="font-family: Roboto, Arial, sans-serif; font-size: 14px"><strong>Breed:</strong> ' + breed + '</p>' +
				'<p style="font-family: Roboto, Arial, sans-serif; font-size: 14px"><strong>Color:</strong> ' + color + '</p>' +
				'<p style="font-family: Roboto, Arial, sans-serif; font-size: 14px"><strong>Size:</strong> ' + size + '</p>' +
				'<p style="font-family: Roboto, Arial, sans-serif; font-size: 14px"><strong>Spots:</strong> ' + spots + '</p>' +
				'<p style="font-family: Roboto, Arial, sans-serif; font-size: 14px"><strong>Collar:</strong> ' + collar + '</p>' +
				'<p style="font-family: Roboto, Arial, sans-serif; font-size: 14px"><strong>Email:</strong> ' + response[i + 7] + '</p>' +
				'<p style="font-family: Roboto, Arial, sans-serif; font-size: 14px"><strong>Phone:</strong> ' + response[i + 8] + '</p>' +
				'<p style="font-family: Roboto, Arial, sans-serif; font-size: 14px"><strong>Time:</strong> ' + response[i + 9] + '</p>' +
				'</div>' +
				'<div>' +
				'<img class="silhouette" style="width:200px; padding: auto; text-align: center; height:200px; margin:0px;" src="' + response[i + 6] + '"></img>' +
				'</div>' +
				'</div>';

			var pawMarker = new google.maps.Marker({
				position: {
					lat: lat,
					lng: lon
				},
				map: map,
				icon: image,
				// added
				content: contentString,
			});

			var infowindow = new google.maps.InfoWindow({
				content: contentString
			});


			pawMarker.addListener('click', function () {
				var infowindow = new google.maps.InfoWindow({
					content: this.content
				});
				infowindow.open(map, this);
			});
			// console.log(lat);
			// console.log(lon);
			// markers[i] = beachMarker;
		}
	}

	function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response.text();
		} else {
			return Promise.reject(new Error(response.status + ": " + response.statusText));
		}
	}

	// end my code

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};

			globallat = position.coords.latitude,
				globallng = position.coords.longitude

			map.setCenter(pos);

			var image = 'images/personmarker.png';
			var marker = new google.maps.Marker({
				position: {
					lat: globallat,
					lng: globallng
				},
				map: map,
				icon: image
			});

		}, function () {
			handleLocationError(true, infoWindow, map.getCenter());
		});
	} else {
		// Browser doesn't support Geolocation
		handleLocationError(false, infoWindow, map.getCenter());
	}

}


function handleLocationError(browserHasGeolocation, infoWindow, pos) {
	infoWindow.setPosition(pos);
	infoWindow.setContent(browserHasGeolocation ?
		'Error: The Geolocation service failed.Please reload and allow location services.' :
		'Error: Please reload and allow location services');
	infoWindow.open(map);
};