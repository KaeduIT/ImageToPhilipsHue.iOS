function getAllLights() {

	var addusername		= document.getElementById("addusername").value;
	if ( addusername.length < 10 || addusername.length > 40 ) {
		alert('please enter a username between 10 and 40 characters long');
		return false;
	}

	var bridgeIpAddress = document.getElementById("bridgeIpAddress").value;
	if ( bridgeIpAddress.length > 15 ) {
		alert('please enter an IP address, 15 characters long');
		return false;
	}

	//build a variable for the API URL
	var apiUrl 			= "http://" + bridgeIpAddress + "/api/" + addusername + "/lights";

	//create a new XML Http Request object for performing an AJAX call.
	var xmlhttp=new XMLHttpRequest();

	xmlhttp.open("GET", apiUrl, false);
	xmlhttp.setRequestHeader("Content-Type", "text/plain");
	xmlhttp.send();

	//check HTTP status of the response
	if (xmlhttp.status == 200) {

	  //a successful response - though this doesn't mean the device was successful executing the command
	  //cast the respponse to a JavaScript object, this code will work in Firefox but browsers will vary
	  var response = JSON.parse(xmlhttp.response);

	  var respDiv = document.getElementById("getalllightsresp");
          respDiv.innerHTML = "getting lights";

	  if(response !== null) {

	    respDiv.innerHTML = "got Lights";
	    respDiv.innerHTML += xmlhttp.response;
		var lightcountCtl = document.getElementById("lightcount");
	    lightcountCtl.value=Object.keys(JSON.parse(response)).length;

	  }
	  else {
	    respDiv.innerHTML = "Error getting Lights";
	    respDiv.innerHTML += xmlhttp.response;
	  }
	}
	else {
	  respDiv.innerHTML = "Error " + xmlhttp.status + " during request: " + xmlhttp.statusText;
	  respDiv.innerHTML += xmlhttp.response;
	}

}