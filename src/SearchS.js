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

    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200){
            currentBook = xhr.responseText;

            debugger;
            docStats(currentBook);

            // remove line breaks and replace wih a <br>
            currentBook = currentBook.replace(/(?:\r\n|\n|\r)/g, '<br>');

            document.getElementById("fileContent").innerHTML = currentBook;

            var elmt = document.getElementById("fileContent");
            elmt.scrollTop = 0;

        }
    };
}

function docStats(fileContent){

    var docLength = document.getElementById("docLength");
    var wordCount = document.getElementById("wordCount");
    var charCount = document.getElementById("charCount");

    let txt = fileContent.toLowerCase();
    let warray = txt.match(/\b\S+\b/g);
    let wordDict = {};

    //Count every word
    for(let word in warray){
        let wordValue = warray[word];
        if(wordDict[wordValue] > 0){
            wordDict[wordValue] += 1;
        }
        else{
            wordDict[wordValue] = 1;
        }
    }

    let worList = sortprop(wordDict);

    var top5 = worList.slice(0, 6);
    var last5 = worList.slice(-6, worList.length);

    //Write values to diplay
    ULtemp(top5,document.getElementById("mostUsed"));
    ULtemp(last5,document.getElementById("leastUsed"));

}

function ULtemp(items, element){
    let rowTemplate = document.getElementById("template-items");
    let templateHTML = rowTemplate.innerHTML;
    let results = "";
    
    for(let i=0; i < items.length - 1; i++){
        results += templateHTML.replace('{{val}}',items[i][0] + " : " + items[i][1] + "times(s)");
    }

    element.innerHTML = results;    
}

function sortprop(obj){
    //Convert obj to array
    let rtnArray = Object.entries(obj);

    //Sort the Array
    rtnArray.sort(function (first, second){
        return second[1] - first[1];
    });

    return rtnArray;
}