var langsJSON = {
    "BG": "Bulgarian",
    "CS": "Czech",
    "DA": "Danish",
    "DE": "German",
    "EL": "Greek",
    "EN-GB": "English (British)",
    "EN-US": "English (American)",
    "EN": "English",
    "ES": "Spanish",
    "ET": "Estonian",
    "FI": "Finnish",
    "FR": "French",
    "HU": "Hungarian",
    "IT": "Italian",
    "JA": "Japanese",
    "LT": "Lithuanian",
    "LV": "Latvian",
    "NL": "Dutch",
    "PL": "Polish",
    "PT-PT": "Portuguese (European)",
    "PT-BR": "Portuguese (Brazilian)",
    "PT": "Portuguese",
    "RO": "Romanian",
    "RU": "Russian",
    "SK": "Slovak",
    "SL": "Slovenian",
    "SV": "Swedish",
    "ZH": "Chinese",
}

function init() {
}

// EX: request("milk", "ES").then(n=>console.log(n.text));
// Returns promise of json with detected_source_language & text 
async function request(text, target_lang, source_lang="") {
    return fetch("https://api-free.deepl.com/v2/translate",
        {
            body: `auth_key=c26019af-ba30-8c74-e501-a88141f4b3f7:fx&text=${text}&source_lang=${source_lang}&target_lang=${target_lang}`,
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            method: "POST",
        }
    ).then(n=>n.json().then(n=>n.translations[0]));
}


async function run() {
    var words = document.getElementById("words").value
    var langs = document.getElementById("langs").value.split("\n");
    var output = document.getElementById("output");

    // var res = "";
    // for (var lang in langsJSON) {
    //     // This skips the English/Portuguese variants which are very similar
    //     if (lang.length > 2) { continue; } 
    //     res += `<h3>${langsJSON[lang]}</h3>`
    //     for (const word of words.split("\n")) {
    //         console.log(word);
    //         var response = await(request(word, lang));
    //         res+=response.text += "<br>";
    //     }
    // }
    var res = "";
    // So far "0" seems to be a char which isn't changed in DeepL translation and so can be used as a word sep
    // In Japanese, and sometimes in Chinese, none of these other chars worked: "+-*." 
    // And linebreaks broke in a bunch of, or all the, langs. They weren't preserved at all
    // But the surrounding whitespace *is* needed in map(n=>n+' '+sep+' ') to make sure the words are translated separately
    var sep="0";
    words = words.split("\n").map(n=>n+' '+sep+' ').join('');
    for (var lang in langsJSON) {
        if (!langs.includes(lang)) { continue; }
    // This skips the English/Portuguese variants which are very similar
        if (lang.length > 2) { continue; }  
        res += `<h3>${langsJSON[lang]}</h3>` 
        var response = await(request(words, lang));
        console.log(response.text);
        res += response.text.split(sep).map(n=>n+'<br>').join('') + "<br>"; 
        // In loop to get feedback as it gets populated. Can be moved out later
        output.innerHTML = res;
    }

}