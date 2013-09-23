function button2() {
	var resp = '{"1": {"name": "Bedroom"},"2": {"name": "Kitchen"}}';
//	var resp 	= '{"1": {"name": "Bedroom"},"2": {"name": "Kitchen"},"3": {"name": "Parlor"},"4": {"name": "Balcony"},"5": {"name": "DiningRoom"},"6": {"name": "Toilet"},"7": {"name": "Bedroom2"}}';

//	console.log(JSON.parse(resp));
//	console.log(Object.keys(JSON.parse(resp)).length);

	var lightcountCtl   = document.getElementById("lightcount");
	lightcountCtl.value = Object.keys(JSON.parse(resp)).length;

	var respDiv = document.getElementById("sendimageresp");
	respDiv.innerHTML = resp;
	return resp;
}


