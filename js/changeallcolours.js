//Description: sets a light's state to specific parameters and reports the outcome to the user

function changeAllColors() {

	if(document.getElementById("lightcount").value == '') {
		alert('Please click on the \'Get All Lights button\' to detect the connected lights.');
		return false;
	}

	var lightcount = document.getElementById("lightcount").value != '' ? document.getElementById("lightcount").value : 3;

	//create variables to store the IP address of the bridge, username and the light id that will be changed
	var username		= document.getElementById("addusername").value;
	if ( username.length < 10 || username.length > 40 ) {
		alert('please enter a username between 10 and 40 characters long');
		return false;
	}

	// make sure this is entered
	var bridgeIpAddress = document.getElementById("bridgeIpAddress").value;
	if ( bridgeIpAddress.length > 15 ) {
		alert('please enter an IP address, 15 characters long');
		return false;
	}

	//build a variable for the API URL
	var apiUrl = "http://" + bridgeIpAddress + "/api";

	for(var lightid = 1; lightid <=lightcount; lightid++) {

		//create a new XML Http Request object for performing an AJAX call.
		var xmlhttp=new XMLHttpRequest();

		//build the URL require to set the light's state
		var commandUrl= apiUrl + "/" + username + "/lights/" + lightid + "/state";
		//build a data object for setting the light's state
		var data = '{"on":true, "sat":255, "bri":110,"hue":46920,"effect":"none","transitiontime":2}';

		//Alternative values for the light state
		//var data = '{"on":true, "effect":"colorloop"}';

		//Send a PUT request to the specified URL, sending the data object in the request
		xmlhttp.onload = function(e)  {

			//alert('done');
			  var respDiv = document.getElementById("changeallcolorsresp");

			//check HTTP status of the response
			if (xmlhttp.status == 200) {
			  //a successful response - though this doesn't mean the device was successful executing the command

			  //cast the respponse to a JavaScript object, this code will work in Firefox but browsers will vary
			  var response = JSON.parse(xmlhttp.response);
//			  console.log(response);
			  respDiv.innerHTML = "changing Color";


			  if(response[0].success) {
			    respDiv.innerHTML = "changed Color";
			    respDiv.innerHTML += xmlhttp.response;
			  }
			  else {
			    respDiv.innerHTML = "Error changing Color";
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