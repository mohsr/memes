function loginRequest() {
	var xhr = new XMLHttpRequest();
	var pwd = ('pwd=' + $('#pwdinput').val());
	xhr.open('POST', '/login');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status != 200) {
				document.getElementById('errormsg').innerHTML = 
					"Woops! Wrong password :(";
			} else {
				document.getElementById('errormsg').innerHTML = "";
				window.location.href = ('/' + xhr.responseText);
			}
		}
	}
	xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
	xhr.send(pwd);
}