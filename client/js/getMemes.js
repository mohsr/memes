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
                var data = JSON.parse(responseText);
                for (var i = 0; i < data.length; i++) {
                    memeshtml += ('<div class="meme">' + data[i].name + ' ' + data[i].txt + '</div>')
                }

                memes.innerHTML = memeshtml;
            }
        }
    }
    xhr.send();
}