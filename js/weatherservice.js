//Description: sets a light's state to specific parameters from weather API and reports the outcome to the user

var geocoder;
var map;
var loaded;
var loadedToSendIcon;
var fourDayIntervalID, timeoutID = [];
var indexedDBItemCount = 0;
var forecastTimeoutInterval = 0;


var IconToHue =
{
	sunny:	 		'{"on":true, "sat":255, "bri":110,  "hue":0,      "effect":"none",  "transitiontime":2}',
	mostlysunny: 	'{"on":true, "sat":255, "bri":110,  "hue":10000,  "effect":"none",  "transitiontime":2}',
	partlysunny: 	'{"on":true, "sat":255, "bri":110,  "hue":14000,  "effect":"none",  "transitiontime":2}',
	rain: 			'{"on":true, "sat":255, "bri":110,  "hue":46920,  "effect":"none",  "transitiontime":2}',
	chancerain: 	'{"on":true, "sat":255, "bri":160,  "hue":46920,  "effect":"none",  "transitiontime":2}',
	clear: 			'{"on":true, "sat":0,   "bri":255,  "hue":0,      "effect":"none",  "transitiontime":2}',
	fog: 			'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	hazy: 			'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	chanceflurries: '{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	flurries: 		'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	chancetstorms:  '{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	tstorms: 		'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	mostlycloudy: 	'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	partlycloudy: 	'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	cloudy: 		'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	chancesnow: 	'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	snow: 			'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	chancesleet: 	'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}',
	sleet: 			'{"on":true, "sat":0,   "bri":120,  "hue":0,      "effect":"none",  "transitiontime":2}'
};


var IconSet =
{
	sunny:	 			"/ImageToPhilipsHue/style/images/sunny.gif",
	mostlysunny: 		"/ImageToPhilipsHue/style/images/mostlysunny.gif",
	partlysunny: 		"/ImageToPhilipsHue/style/images/partlysunny.gif",
	rain: 				"/ImageToPhilipsHue/style/images/rain.gif",
	chancerain: 		"/ImageToPhilipsHue/style/images/chancerain.gif",
	clear: 				"/ImageToPhilipsHue/style/images/clear.gif",
	fog: 				"/ImageToPhilipsHue/style/images/fog.gif",
	hazy: 				"/ImageToPhilipsHue/style/images/hazy.gif",
	chanceflurries: 	"/ImageToPhilipsHue/style/images/chanceflurries.gif",
	flurries: 			"/ImageToPhilipsHue/style/images/flurries.gif",
	chancetstorms:  	"/ImageToPhilipsHue/style/images/chancetstorms.gif",
	tstorms: 			"/ImageToPhilipsHue/style/images/tstorms.gif",
	mostlycloudy: 		"/ImageToPhilipsHue/style/images/mostlycloudy.gif",
	partlycloudy: 		"/ImageToPhilipsHue/style/images/partlycloudy.gif",
	cloudy: 			"/ImageToPhilipsHue/style/images/cloudy.gif",
	chancesnow: 		"/ImageToPhilipsHue/style/images/chancesnow.gif",
	snow: 				"/ImageToPhilipsHue/style/images/snow.gif",
	chancesleet: 		"/ImageToPhilipsHue/style/images/chancesleet.gif",
	sleet: 				"/ImageToPhilipsHue/style/images/sleet.gif",
	nt_sunny:	 		"/ImageToPhilipsHue/style/images/nt_sunny.gif",
	nt_mostlysunny: 	"/ImageToPhilipsHue/style/images/nt_mostlysunny.gif",
	nt_partlysunny: 	"/ImageToPhilipsHue/style/images/nt_partlysunny.gif",
	nt_rain: 			"/ImageToPhilipsHue/style/images/nt_rain.gif",
	nt_chancerain: 		"/ImageToPhilipsHue/style/images/nt_chancerain.gif",
	nt_clear: 			"/ImageToPhilipsHue/style/images/nt_clear.gif",
	nt_fog: 			"/ImageToPhilipsHue/style/images/nt_fog.gif",
	nt_hazy: 			"/ImageToPhilipsHue/style/images/nt_hazy.gif",
	nt_chanceflurries:  "/ImageToPhilipsHue/style/images/nt_chanceflurries.gif",
	nt_flurries: 		"/ImageToPhilipsHue/style/images/nt_flurries.gif",
	nt_chancetstorms:   "/ImageToPhilipsHue/style/images/nt_chancetstorms.gif",
	nt_tstorms: 		"/ImageToPhilipsHue/style/images/nt_tstorms.gif",
	nt_mostlycloudy: 	"/ImageToPhilipsHue/style/images/nt_mostlycloudy.gif",
	nt_partlycloudy: 	"/ImageToPhilipsHue/style/images/nt_partlycloudy.gif",
	nt_cloudy: 			"/ImageToPhilipsHue/style/images/nt_cloudy.gif",
	nt_chancesnow: 		"/ImageToPhilipsHue/style/images/nt_chancesnow.gif",
	nt_snow: 			"/ImageToPhilipsHue/style/images/nt_snow.gif",
	nt_chancesleet: 	"/ImageToPhilipsHue/style/images/nt_chancesleet.gif",
	nt_sleet: 			"/ImageToPhilipsHue/style/images/nt_sleet.gif"
};




function initialize() {
	geocoder = new google.maps.Geocoder();
	var mapOptions = {zoom: 12,center: new google.maps.LatLng(-34.397, 150.644),mapTypeId: google.maps.MapTypeId.ROADMAP}
  	map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);
  	codeAddress();
}

function codeAddress() {
	var address = document.getElementById('userpostcode').value;
	if (address == undefined || address == '') {
		alert('Please enter postcode');
		return false;
	}

  	geocoder.geocode( { 'address': address}, function(results, status) {
    	if (status == google.maps.GeocoderStatus.OK) {
      		map.setCenter(results[0].geometry.location);
      		var marker = new google.maps.Marker({map: map,position: results[0].geometry.location});
			getWeatherData(results[0].geometry.location);
			var weatherLayer = new google.maps.weather.WeatherLayer({ temperatureUnits: google.maps.weather.TemperatureUnit.CELSIUS });
			weatherLayer.setMap(map);
    	} else {
      		alert('Geocode was not successful for the following reason: ' + status);
    	}
  	});
}

function loadGoogleAPIs() {

	//create the necessary variables before going any further
	if(document.getElementById("lightcount").value == '') {
		alert('Please click on the \'Get All Lights button\' to detect the connected lights.');
		return false;
	}

	var username = document.getElementById("addusername").value;
	if ( username.length < 10 || username.length > 40 ) {
		alert('please enter a username between 10 and 40 characters long');
		return false;
	}

	if ( document.getElementById("bridgeIpAddress").value.length > 15 ) {
		alert('please enter an IP address, maximum 15 characters long');
		return false;
	}

	if(loaded != undefined) {
	  	codeAddress();
	  	return false;
	}

	var address = document.getElementById('userpostcode').value;
	if (address == undefined || address == '') {
		alert('Please enter postcode');
		return false;
	}

	var script  = document.createElement("script");
	script.type = "text/javascript";
	script.src  = "http://maps.googleapis.com/maps/api/js?libraries=weather&key=AIzaSyAzXTZuQDR7IrRkIbdDbK3ifa6rfMey6_4&sensor=false&callback=initialize";
	document.body.appendChild(script);

	loaded = true;
}

function loadToSendIcon() {

	var script  = document.createElement("script");
	script.type = "text/javascript";
	script.src  = "js/go.js";
	document.body.appendChild(script);

	loadedToSendIcon = true;
}

function getWeatherData(location) {

		var weatherApiUrl = "http://api.wunderground.com/api/bd1c30b5b39f3dce/geolookup/conditions/forecast/lang:EN/q/"+location.lat()+","+location.lng()+".json";
		var jqxhr = $.ajax({
					async: 			true,
					type: 			"GET",
					dataType: 		"jsonp",
					crossDomain:	true,
					contentType: 	"application/javascript",
					url: 			weatherApiUrl,
					jsonpCallback: 	"callback"
		});
}

function additem(forecast) {
	forecastTimeoutInterval = 43200000 * indexedDBItemCount;
	timeoutID[indexedDBItemCount] = setTimeout(function () { sendImage(forecast); }, forecastTimeoutInterval);		//every 12HRS

	if (indexedDBItemCount == 7) {
		//
		//set interval for the reminders, call the server for the new data every 4 days, put this in the queue
		//
		forecastTimeoutInterval+=43200000;
		fourDayIntervalID = setInterval(codeAddress, forecastTimeoutInterval);	//every 4Days
	}

	indexedDBItemCount++;
}

function callback(result) {

	indexedDBItemCount = 0;

	forecastDB.open( function () {

			forecastDB.fetchForecastArray(function(forecastArray) {
				for(var i = 0; i < forecastArray.length; i++) {
					forecastDB.deleteForecast(forecastArray[i].timestamp, function () {} );
				}
			});

			for (var i=0; i<result.forecast.txt_forecast.forecastday.length; i++) {
				forecastDB.createForecast(result.forecast.txt_forecast.forecastday[i], additem);
			}

	});

}

function sendImage(forecastdayresult) {

	var forecastDay = document.getElementById('forecastDay');
	var imagetosend = document.getElementById('imagetosend');

	forecastDay.innerHTML = forecastdayresult.forecast.title;
	forecastDay.title 	  = forecastdayresult.forecast.fcttext_metric;
	imagetosend.src 	  = IconSet[forecastdayresult.forecast.icon];
	imagetosend.title 	  = forecastdayresult.forecast.fcttext_metric;
	var data = IconToHue[forecastdayresult.forecast.icon];

/////////////////////////////////////////////////////////////testing for the CORS issue//////////////////////////////////////////////////////////////////////////////////////////////////
//var img 	 = document.getElementById("imagetosend");
//document.getElementById("lightcount").value=imagetosend.width*imagetosend.height;
/////////////////////////////////////////////////////////////testing for the CORS issue//////////////////////////////////////////////////////////////////////////////////////////////////

	//create variables to store the IP address of the bridge, username and the light id that will be changed
	if(document.getElementById("lightcount").value == '') {
		alert('Please click on the \'Get All Lights button\' to detect the connected lights.');
		return false;
	}

	var lightcount = document.getElementById("lightcount").value != '' ? document.getElementById("lightcount").value : 3;

	var username = document.getElementById("addusername").value;
	if ( username.length < 10 || username.length > 40 ) {
		alert('please enter a username between 10 and 40 characters long');
		return false;
	}

	var bridgeIpAddress = document.getElementById("bridgeIpAddress").value;
	if ( bridgeIpAddress.length > 15 ) {
		alert('please enter an IP address, maximum 15 characters long');
		return false;
	}

	//build a variable for the API URL
	var apiUrl = "http://" + bridgeIpAddress + "/api";

	// contact the weather service and get the current weather information
	// if there are enough lights for the weather.com icon grid, send the icon
	if (lightcount >= imagetosend.width*imagetosend.height) {
		if(loadedToSendIcon == undefined) { loadToSendIcon(); }
		go();
		return false;
	}

	for(var lightid = 1; lightid <=lightcount; lightid++) {

		//create a new XML Http Request object for performing an AJAX call.
		var xmlhttp=new XMLHttpRequest();

		//build the URL require to set the light's state
		var commandUrl= apiUrl + "/" + username + "/lights/" + lightid + "/state";
		//build a data object for setting the light's state
		//var data = '{"on":true, "sat":255, "bri":110,"hue":46920,"effect":"none","transitiontime":2}';

		//Alternative values for the light state
		//var data = '{"on":true, "effect":"colorloop"}';

		//Send a PUT request to the specified URL, sending the data object in the request
		xmlhttp.onload = function(e)  {

			//alert('done');
			  var respDiv = document.getElementById("weatherserviceresp");

			//check HTTP status of the response
			if (xmlhttp.status == 200) {
			  //a successful response - though this doesn't mean the device was successful executing the command

			  //cast the respponse to a JavaScript object, this code will work in Firefox but browsers will vary
			  var response = JSON.parse(xmlhttp.response);
//			  console.log(response);
			  respDiv.innerHTML = "updating weather information";


			  if(response[0].success) {
			    respDiv.innerHTML = "updated weather information";
			    respDiv.innerHTML += xmlhttp.response;
			  }
			  else {
			    respDiv.innerHTML = "Error";
			    respDiv.innerHTML += xmlhttp.response;
			  }
			}
			else {
			  respDiv.innerHTML = "Error " + xmlhttp.status + " during request: " + xmlhttp.statusText;
			  respDiv.innerHTML += xmlhttp.response;
			}
		}

		xmlhttp.open("PUT", commandUrl, true);
		xmlhttp.setRequestHeader("Content-Type", "text/plain");
		xmlhttp.send(data);
	}
}

function stopAlerts() {
	for(var i=0; i<timeoutID.length; i++){
		clearTimeout(timeoutID[i]);
	}
	clearInterval(fourDayIntervalID);
	timeoutID 		  = undefined;
	fourDayIntervalID = undefined;
	alert('Unsubscribed from weather forecasts.');
}


