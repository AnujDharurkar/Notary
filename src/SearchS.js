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

    var uncommonWords = [];

    //filter uncommon words
    uncommonWords = filterStopwords(warray);

    //Count every word
    for(let word in uncommonWords){
        let wordValue = uncommonWords[word];
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

    docLength.innerHTML = "Document Length:" + txt.length;
    wordCount.innerHTML = "Word Count" + warray.length;

}

function ULtemp(items, element){
    let rowTemplate = document.getElementById("template-items");
    let templateHTML = rowTemplate.innerHTML;
    let results = "";
    
    for(let i=0; i < items.length - 1; i++){
        results += templateHTML.replace('{{val}}',items[i][0] + " : " + items[i][1] + " times(s)");
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

function filterStopwords(warray){
    var commonWords = getStopWords();
    var commonObj = {};
    var uncommonAr = [];

    for(let i=0; i<commonWords.length; i++){
        commonObj[commonWords[i].trim()] = true;
    }

    for(let i=0; i<warray.length; i++){
        words = warray[i].trim().toLowerCase();
        if(!commonObj[words]){
            uncommonAr.push(words);
        }
    }

    return uncommonAr;
}

function getStopWords() {
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}

//highlight the words in search
function performMark() {

    //read the keyword
    var keyword = document.getElementById("keyword").value;
    var display = document.getElementById("fileContent");

    var newContent = "";

    //find all the currently marked items
    let spans = document.querySelectorAll('mark');

    for (var i = 0; i < spans.length; i++) {
        spans[i].outerHTML = spans[i].innerHTML;
    }

    var re = new RegExp(keyword, "gi");
    var replaceText = "<mark id='markme'>$&</mark>";
    var bookContent = display.innerHTML;

    //add the mark to the book content
    newContent = bookContent.replace(re, replaceText);

    display.innerHTML = newContent;
    var count = document.querySelectorAll('mark').length;
    document.getElementById("searchstat").innerHTML = "found " + count + " matches";

    if (count > 0) {
        var element = document.getElementById("markme");
        element.scrollIntoView();
    };

}