function login() {
	var xhr = new XMLHttpRequest();
	var pwd = document.getElementById('loginbox').val();
	xhr.open('POST', '/login');
	xhr.onreadystatechange = function() {
		if (xhr.readyState == 4) {
			if (xhr.status == 404) {
				document.getElementById('errortext').innerHTML = 
					"Woops! Wrong password :(";
			} else {
				/* Load the returned URL. */
			}
		}
	}
	xhr.send('pwd=' + pwd);
}