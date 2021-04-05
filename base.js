let text = document.getElementById('text').innerHTML;
let info = {
  example_word: {
    pronounciation: "",
    meaning: "",
    translation: "",
    audio: "/static/sound"
  },
};

function InitTextLinks() {
    links = document.getElementsByClassName("info");
    for (let i = 0; i < links.length; i++) {
        links[i].addEventListener("click", function(e) {
        e.preventDefault();
        console.log(e.target.innerText);
        FindWord(e.target.innerText);
        return false;
    })
  };
}

InitTextLinks();

function FindWord(word) {
	word = word.toLowerCase();
	document.getElementById('text').innerHTML = "<div class='top-level'><h2 class='top-level'id='word'></h2><p class='top-level' id='pronounciation'></p><p class='top-level' id='meaning'></p><p class='top-level' id='translation'></p><a href='' id='audio-link' target='_blank'>Listen Audio with pronounciation</a><button onclick='normalizePage()'>Go back</button></div>";
    document.getElementById('word').innerText = word;
    document.getElementById('pronounciation').innerText = info[word]['pronounciation'];
    document.getElementById('meaning').innerText = info[word]['meaning']
    document.getElementById('translation').innerText = info[word]['translation'];
    document.getElementById('audio-link').href = info[word]['audio'];
  
}

function normalizePage() {
	document.getElementById('text').innerHTML = text;
    InitTextLinks();
}