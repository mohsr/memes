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
                var data = JSON.parse(xhr.responseText);
                document.getElementById('errormsg').innerHTML = "";
                window.localStorage.setItem('memetkn', data.tokenid);
                window.location.href = ('/' + data.url);
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(pwd);
}