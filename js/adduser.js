function addUser() {

	var addusername		= document.getElementById("addusername").value;
	if ( addusername.length < 10 || addusername.length > 40 ) {
		alert('please enter a username between 10 and 40 characters long');
		return false;
	}

//	var bridgeIpAddress = "192.168.1.144";
	var bridgeIpAddress = document.getElementById("bridgeIpAddress").value;
	if ( bridgeIpAddress.length > 15 ) {
		alert('please enter an IP address, 15 characters long');
		return false;
	}

	var apiUrl 			= "http://" + bridgeIpAddress + "/api";
	var data 			= '{"devicetype": "KaeduITDevice", "username": "' + addusername + '"}';

	//create a new XML Http Request object for performing an AJAX call.
	var xmlhttp=new XMLHttpRequest();

	xmlhttp.open("POST", apiUrl, false);
	xmlhttp.setRequestHeader("Content-Type", "text/plain");
	xmlhttp.send(data);

	//check HTTP status of the response
	if (xmlhttp.status == 200) {

	  //a successful response - though this doesn't mean the device was successful executing the command
	  //cast the respponse to a JavaScript object, this code will work in Firefox but browsers will vary
	  var response = JSON.parse(xmlhttp.response);

//	  console.log(response);
	  var respDiv = document.getElementById("adduserresp");
          respDiv.innerHTML = "adding User";

	  if(response[0].success) {
	    respDiv.innerHTML = "User Added";
	    respDiv.innerHTML += xmlhttp.response;
	  }
	  else {
	    respDiv.innerHTML = "Error adding user";
	    respDiv.innerHTML += xmlhttp.response;
	  }
	}
	else {
	  respDiv.innerHTML = "Error " + xmlhttp.status + " during request: " + xmlhttp.statusText;
	  respDiv.innerHTML += xmlhttp.response;
	}

}