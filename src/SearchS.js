//Load book from disk
function loadB(filename, displayName) {
    let currentBook = "";
    let url = "/src/Books/" + filename;

    //Reset UI
    document.getElementById("fileName").innerHTML = displayName;
    document.getElementById("searchstat").innerHTML = "";
    document.getElementById("keyword").value = "";

    //create a server request to load our book
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.send();

    xhr.onreadystatechange = function(){
        if(xhr.readyState == 4 && xhr.status == 200){
            currentBook = xhr.responseText;

            // remove line breaks and replace wih a <br>
            currentBook = currentBook.replace(/(?:\r\n|\n|\r)/g, '<br>');

            document.getElementById("fileContent").innerHTML = currentBook;

            var elmt = document.getElementById("fileContent");
            elmt.scrollTop = 0;

        }
    };
}
