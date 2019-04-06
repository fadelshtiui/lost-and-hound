"use strict";

(function () {

	window.onload = function () {
		json();
	}

	function json() {
		let url = "https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=" + currentPos.lat + "," + currentPos.lng + "&destinations=" + pos.lat + "," + pos.lng + "key=AIzaSyCipmY1QToFcQ-Dne9zSC-16GeL9mBk9u0";
		fetch(url, {
				mode: '',
				credentials: 'include'
			})
			.then(checkStatus)
			.then(JSON.parse)
			.then(handleResponse)
			.catch(console.log);
	}

	function handleResponse(response) {
		console.log(response);
	}

	function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response.text();
		} else {
			return Promise.reject(new Error(response.status + ": " + response.statusText));
		}
	}
})();