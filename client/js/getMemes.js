$(document).ready(function() {
    getMemes();
}

function getMemes() {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/getmemes');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status != 200) {
                document.getElementById('errormsg').innerHTML = 
                    "Sorry! Could not load the memes right now.";
            } else {
                document.getElementById('errormsg').innerHTML = "";
                var memes = document.getElementById('memes');
                var memeshtml = "";
                var data = JSON.parse(xhr.responseText);
                for (var i = 0; i < data.length; i++) {
                    memeshtml += ('<div class="meme"><div class="mtxt">' + 
                                  data[i].txt + 
                                  '</div><br/><div class="mname">' +
                                  'by ' + data[i].name + '</div></div><br/>');
                }

                memes.innerHTML = memeshtml;
            }
        }
    }
    xhr.send();
};