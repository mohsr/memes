function submitMeme() {
    var name = $('#memename').val();
    var txt  = $('#memetxt').val();
    if (name == '' || txt == '') {
        return;
    }
    var data = ('name=' + name + '&txt=' + txt);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/submitmeme');
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                document.getElementById('ty').innerHTML = 
                    "Thanks for the meme!";
            } else {
                document.getElementById('ty').innerHTML = "";
            }
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.send(data);
}