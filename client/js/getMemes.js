function getMemes() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', 'getmemes');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.readyState != 200) {
                document.getElementById('errormsg').innerHTML = 
                    "Sorry! Could not load the memes right now.";
            } else {
                document.getElementById('errormsg').innerHTML = "";
                var memes = document.getElementById('memes');
                var memeshtml = "";
                memes.innerHTML = memeshtml;
            }
        }
    }
    xhr.send();
}