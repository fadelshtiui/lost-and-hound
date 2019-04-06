"use strict";

function $(id) {
	return document.getElementById(id);
}

var map, infoWindow;

function initMap() {
	map = new google.maps.Map(document.getElementById('map'), {
		center: {
			lat: -34.397,
			lng: 150.644
		},
		zoom: 6
	});
	infoWindow = new google.maps.InfoWindow;

	// Try HTML5 geolocation.
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			var pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};
			$("lat").value = position.coords.latitude;
			$("lon").value = position.coords.longitude;

			infoWindow.setPosition(pos);
			infoWindow.setContent('Location found.');
			infoWindow.open(map);
			map.setCenter(pos);
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
		'Error: The Geolocation service failed.' :
		'Error: Your browser doesn\'t support geolocation.');
	infoWindow.open(map);
}

(function () {

	let sizeSelected = false;
	let colorSelected = false;
	let silhouetteSelected = false;
	let silhouette;
	const cards = document.querySelectorAll(".card");
	const nextButtons = document.querySelectorAll(".card__button--next");
	const specialButtons = document.querySelectorAll(".card__button--next--special");
	const prevButtons = document.querySelectorAll(".card__button--prev");
	const progress = document.querySelector(".progress__bar");
	const progressNums = document.querySelectorAll(".progress__num");
	let currCard = 0;

	window.onload = function () {
		let colors = document.doggyProfile.hatColor;
		for (let i = 0; i < colors.length; i++) {
			colors[i].onchange = colorChosen;
		}
		let switches = document.doggyProfile.switchTwo;
		for (let i = 0; i < switches.length; i++) {
			switches[i].onchange = sizeChosen;
		}
		let containers = document.querySelectorAll(".image-container");
		for (let i = 0; i < containers.length; i++) {
			containers[i].onclick = silhouetteChosen;
		}
		$("submit").onclick = submit;
	};

	function silhouetteChosen() {
		let containers = document.querySelectorAll(".image-container");
		for (let i = 0; i < containers.length; i++) {
			containers[i].style.borderColor = "white";
		}
		silhouette = this.firstElementChild.src;
		silhouetteSelected = true;
		this.style.borderColor = "#0168b3";
	}

	function colorChosen() {
		colorSelected = true;
	}

	function sizeChosen() {
		sizeSelected = true;
		let containers = document.querySelectorAll(".image-container");
		for (let i = 0; i < containers.length; i++) {
			if (containers[i].firstElementChild.classList.contains(this.value)) {
				containers[i].classList.remove("hidden");
			} else {
				containers[i].classList.add("hidden");
			}
		}
		let categories = document.querySelectorAll("h2");
		for (let i = 0; i < categories.length; i++) {
			if (categories[i].classList.contains(this.value)) {
				categories[i].classList.remove("hidden");
			} else {
				categories[i].classList.add("hidden");
			}
		}
	}

	nextButtons.forEach(button => {
		button.addEventListener("click", () => {
			if (colorSelected && sizeSelected) {
				let current = cards.item(currCard);
				let next = cards.item(currCard + 1);

				current.classList.remove("card--show");
				current.classList.add("card--hide");

				setTimeout(() => current.classList.add("card--none"), 1000);

				next.classList.remove("card--none");
				setTimeout(() => next.classList.remove("card--off-screen"), 10);

				currCard++;

				progressNums.item(currCard).classList.add("progress__num--filled");
				moveProgressBar();
			} else {
				alert("Please pick a color and size.")
			}
		});
	});

	specialButtons.forEach(button => {
		button.addEventListener("click", () => {
			if (silhouetteSelected) {
				let current = cards.item(currCard);
				let next = cards.item(currCard + 1);

				current.classList.remove("card--show");
				current.classList.add("card--hide");

				setTimeout(() => current.classList.add("card--none"), 1000);

				next.classList.remove("card--none");
				setTimeout(() => next.classList.remove("card--off-screen"), 10);

				currCard++;

				progressNums.item(currCard).classList.add("progress__num--filled");
				moveProgressBar();
			} else {
				alert("Please pick a silhouette.")
			}
		});
	});

	prevButtons.forEach(button => {
		button.addEventListener("click", () => {
			let current = cards.item(currCard);
			let prev = cards.item(currCard - 1);

			prev.classList.remove("card--hide", "card--none");

			setTimeout(() => prev.classList.add("card--show"), 10);

			current.classList.remove("card--show");
			current.classList.add("card--off-screen");

			setTimeout(() => {
				current.classList.add("card--none")
			}, 1000);

			currCard--;

			progressNums.item(currCard + 1).classList.remove("progress__num--filled");

			moveProgressBar();
		});
	});

	function submit() {
		$("submit").disabled = true;
		let data = new FormData();
		let lat = $("lat").value;
		let lon = $("lon").value
		let color = document.doggyProfile.hatColor.value;
		let size = document.doggyProfile.switchTwo.value;
		let spots = $("spots").checked;
		let collar = $("collar").checked;
		let email = "";
		if ($("email").value) {
			email = $("email").value;
		}
		let phone = "";
		if ($("phone").value) {
			phone = $("phone").value;
		}
		data.append("lat", lat);
		data.append("lon", lon);
		data.append("color", color);
		data.append("size", size);
		data.append("spots", spots);
		data.append("collar", collar);
		data.append("silhouette", silhouette);
		data.append("email", email);
		data.append("phone", phone);
		let url = "php/upload.php";
		fetch(url, {
				method: "POST",
				body: data,
				mode: 'cors',
				credentials: 'include'
			})
			.then(checkStatus)
			.then(handleResponse)
			.catch(console.log);
	}

	function handleResponse() {
		alert("Thank you!");
		window.location.href = "index.html";
	}

	function moveProgressBar() {
		progress.style.width = (100 / (cards.length - 1) * currCard) + "%";
	}

	function checkStatus(response) {
		if (response.status >= 200 && response.status < 300) {
			return response.text();
		} else {
			return Promise.reject(new Error(response.status + ": " + response.statusText));
		}
	}

	function $(id) {
		return document.getElementById(id);
	}

})();