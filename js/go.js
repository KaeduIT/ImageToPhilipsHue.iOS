//Description: sets a light's state to specific parameters and reports the outcome to the user
//Fishkin, Ken, A Fast HSL-to-RGB Transform, p. 448-449, code: p. 763-764, HSLtoRGB.c.

var getHSV = function(lightid) {

var quotient = 182.04166666666666666666666666667;
var img 	 = document.getElementById("imagetosend");
var canvas 	 = document.getElementById("progresscopy");

canvas.getContext('2d').clearRect(0,0,canvas.width,canvas.height);
canvas.getContext('2d').drawImage(img,0,0,img.width,img.height);
var imgData  = canvas.getContext('2d').getImageData(0,0,img.width,img.height);
//console.log(imgData);

var retVal  = '"sat":0, "bri":255,"hue":0';

lightid -=1;
lightid *=4;

var h=0, s=0, l=0;
var r=0, g=0, b=0;

	for (var i=lightid; i<imgData.data.length; i+=4) {

		r=imgData.data[i];
		g=imgData.data[i+1];
		b=imgData.data[i+2];
		var alpha=imgData.data[i+3];

		var rPercent = r/255;
		var gPercent = g/255;
		var bPercent = b/255;
		var Cmax 	 = Math.max(rPercent, gPercent, bPercent);
		var Cmin 	 = Math.min(rPercent, gPercent, bPercent);
		var delta  	 = Cmax - Cmin;

//		Hue calculation:
		if (Cmax == rPercent) {
			h = 60 * (((gPercent - bPercent)/delta) % 6);
			if(h < 0) h = 360 + h;
		} else if (Cmax == gPercent) {
			h = 60 * (((bPercent - rPercent)/delta) + 2);
			//if(h < 0) h *= -1;
		} else if (Cmax == bPercent) {
			h = 60 * (((rPercent - gPercent)/delta) + 4);
			//if(h < 0) h *= -1;
		}

//		Saturation calculation:
		if (delta == 0)
			s = 0 / Cmax;
		else
			s = delta / Cmax;

//		Value calculation:
			v = Cmax;

		break;
	}

	retVal = '"sat":' + Math.ceil(s*255) + ', "bri": ' + Math.ceil(v*255) + ', "hue":' + Math.ceil(h*quotient);
	canvas.getContext('2d').putImageData(imgData,0,0);

	//console.log('r='+r+',g='+g+',b='+b);
	//console.log(retVal);

	return retVal;
}


function go() {


/////////////////////////////////////////////////////////////testing for the CORS issue//////////////////////////////////////////////////////////////////////////////////////////////////
//alert('test');
//lightcount = 64;
//var img 	 = document.getElementById("imagetosend");
//document.getElementById("lightcount").value=img.width*img.height;
/////////////////////////////////////////////////////////////testing for the CORS issue//////////////////////////////////////////////////////////////////////////////////////////////////

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

	var bridgeIpAddress = document.getElementById("bridgeIpAddress").value;
	if ( bridgeIpAddress.length > 15 ) {
		alert('please enter an IP address, 15 characters long');
		return false;
	}

	//build a variable for the API URL
	var apiUrl = "http://" + bridgeIpAddress + "/api";

	for(var lightid = 1; lightid <=lightcount; lightid++) {

		var data = '{"on":true, ' + getHSV(lightid) + ',"effect":"none","transitiontime":2}';
//continue;
		//create a new XML Http Request object for performing an AJAX call.
		var xmlhttp=new XMLHttpRequest();

		//build the URL require to set the light's state
		var commandUrl= apiUrl + "/" + username + "/lights/" + lightid + "/state";
		//build a data object for setting the light's state
		//Alternative values for the light state
		//var data = '{"on":true, "effect":"colorloop"}';

		//Send a PUT request to the specified URL, sending the data object in the request
		xmlhttp.onload = function(e)  {

			//alert('done');
			var respDiv = document.getElementById("sendimageresp");

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
			    respDiv.innerHTML = "error changing Color";
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

	//$(".alert").alert().css({ 'display': 'none' });
	//$(".alert").alert('close');
}