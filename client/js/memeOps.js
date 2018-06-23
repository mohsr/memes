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

function submitMeme() {
    var name = $('#memename').val();
    var txt  = $('#memetxt').val();
    if (name == '' || txt == '') {
        document.getElementById('ty').innerHTML = "";
        document.getElementById('errormsg').innerHTML = 
            "Please include a name and a meme!";
        return;
    }
    document.getElementById('errormsg').innerHTML = "";
    var data = ('name=' + name + '&txt=' + txt);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/submitmeme');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                document.getElementById('ty').innerHTML = 
                    "Thanks for the meme!";
                getMemes();
            } else {
                document.getElementById('ty').innerHTML = "";
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(data);
}

$(document).ready(function() {
    getMemes();
});