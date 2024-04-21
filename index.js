


// vars
let c_index = 0;

let c_opt = 0;

let score = 0;

let options = ["n", "n", "n", "n", "n", "n"];

let answered = false;

let all_english_names = [];

let all_species_names = [];

let sound_dict = {};

let audio_element = new Audio();

let runs = 0;

let spectrogram = document.querySelector('.spectro-view');

let start = 0;

let c_lang = "English";

let c_category = "All";

let c_sounds = [];

let c_species = [];

// buttons
document.querySelector('.play-button').addEventListener('click', event => {
    play_sound();
  });



document.querySelector('#opt-0').addEventListener('click', event => {
    answer(0);
});

document.querySelector('#opt-1').addEventListener('click', event => {
    answer(1);
});

document.querySelector('#opt-2').addEventListener('click', event => {
    answer(2);
});

document.querySelector('#opt-3').addEventListener('click', event => {
    answer(3);
});

document.querySelector('#opt-4').addEventListener('click', event => {
    answer(4);
});

document.querySelector('#opt-5').addEventListener('click', event => {
    answer(5);
});

document.querySelector('.next-button').addEventListener('click', event => {
    generate(true);
});

// top-right-menu

document.querySelector('#gbr-flag-button').addEventListener('click', event => {
    switchLanguage("English");
});

document.querySelector('#swe-flag-button').addEventListener('click', event => {
    switchLanguage("Swedish");
});


// top-left-menu

document.querySelector('.search-box').addEventListener('input', event => {
    search();
})

document.querySelector('.category-button').addEventListener('click', event =>{
    show_category();
})

document.querySelector('.x-button').addEventListener('click', event =>{
    document.querySelector('.search-box').value = "";
    search();
})


// start

read_songs();

generate(false);

switchLanguage("English");

add_categories();

// functions
function play_sound(){
    if (!audio_element.paused){
        audio_element.pause();
        document.querySelector('.play-icon').src = "res/play-icon.svg";
    }
    else {

        document.querySelector('.play-icon').src = "res/pause-icon.svg";
        /* the audio is now playable; play it if permissions allow */
        audio_element.play();
        spectro_slide();


    }
}


function generate(play){
    
    answered = false;

    // stop sound
    audio_element.pause();

    // set allowed songs for the category
    if (c_category == "All"){
        c_species = [...all_species_names];
    }
    else {
        c_species = [];
        for (let i = 0; i < all_species_names.length; i++) {

            if (categories[c_category].includes(all_species_names[i])){
                c_species.push(all_species_names[i]);
            }
            
        }
    }

    // pick a species
    let c_spec = c_species[Math.floor(Math.random()*c_species.length)]

    let species_sounds = []
    for (let i = 0; i < Object.keys(sound_dict).length; i++) {
        if (c_spec == (sound_dict[Object.keys(sound_dict)[i]][1])){
            species_sounds.push(Object.keys(sound_dict)[i]);
        }
        
    }

    // pick sound
    let c_sound  =  species_sounds[Math.floor(Math.random()*species_sounds.length)]

    c_species.splice(c_species.indexOf(c_spec), 1);

    // set the incorecct options
    for (let i = 0; i < options.length; i++) {

        // reset color
        document.querySelector('#opt-' + String(i)).style.backgroundColor = "black";

        let o_index = Math.floor(Math.random()*c_species.length);

        options[i] = c_species[o_index];

        c_species.splice(o_index, 1);
    }

    // set the correct option
    c_opt = Math.floor(Math.random()*6);
    options[5] = options[c_opt];
    options[c_opt] = c_spec;



    // set language
    switchLanguage(c_lang);

    set_audio(c_sound, play);
}


function set_audio(audio, play){
    audio_element.pause();
    // play the song
    audio_element = new Audio("data/audio/" + audio);
    
    audio_element.addEventListener("canplaythrough", event => {
        /* the audio is now playable; play it if permissions allow */
        if (play){audio_element.play();
            spectro_slide();
            if (!audio_element.paused){
                document.querySelector('.play-icon').src = "res/pause-icon.svg";}
        
        }
        });

    

    // set the spectrogram

    spectrogram.src = "data/spectrograms/" + 
    audio.split('.')[0] + ".webp"
    spectrogram.style.left = "50%";
    start = spectrogram.offsetLeft;
}


function answer(a){
    if (!answered){
        runs += 1;
        if (a == c_opt){
            score += 1;
            
        }
        document.querySelector('.score-label').innerHTML = "Score: "
             + score.toString() + "/" + runs.toString(); 
        answered = true;
        document.querySelector('#opt-' + a.toString()).style.backgroundColor = "red";
        document.querySelector('#opt-' + c_opt.toString()).style.backgroundColor = "green";
    }

}



// load data

function read_songs(){

    all_sounds.forEach((item, index)=>{
        let english_name = item.split(' - ').at(-2);
        english_name = english_name.replace(/[^a-zA-Z\s]/g,"").trim();
       console.log(item);
        let species_name = item.split(' - ').at(-1);
        species_name = species_name.split('.')[0];
        species_name = species_name.split(' ')[0] + " " + species_name.split(' ')[1];
        console.log(species_name);
        all_english_names.push(english_name);
        all_species_names.push(species_name);
        sound_dict[item] = [english_name, species_name];
    })
    all_english_names = [... new Set(all_english_names)];
    all_species_names = [... new Set(all_species_names)];
}


function add_categories(){
    let category_selector = document.querySelector('.category-selector');
    
    let new_category_item = document.createElement('button');
    new_category_item.classList.add('category-item', 'underlined');
    new_category_item.innerHTML = "All";
    new_category_item.id = "category-All";
    new_category_item.style.color = 'green';
    category_selector.appendChild(new_category_item);
    new_category_item.addEventListener('click', event => {
        console.log("catttt");
        set_category(new_category_item.innerHTML);
    })

    for (let i = 0; i < Object.keys(categories).length; i++) {
        let new_category_item = document.createElement('button');
        new_category_item.classList.add('category-item');
        new_category_item.innerHTML = Object.keys(categories)[i];
        category_selector.appendChild(new_category_item);
        new_category_item.id = "category-" + Object.keys(categories)[i];
        new_category_item.addEventListener('click', event => {
            set_category(new_category_item.innerHTML);
        })
        
    }


}

function set_category(cat){
    c_category = cat;
    const elements = Array.from(document.getElementsByClassName('category-item'));
    elements.forEach(element =>{
        element.style.color = "white";
    })
    document.querySelector('#category-' + cat).style.color = "green";

    generate(true);
}

function spectro_slide(){
    let id = null;
    let pos = 0;
    
    
    clearInterval(id);
    id = setInterval(frame, 5);

    function frame() {
      if (audio_element.paused) {
        clearInterval(id);
        document.querySelector('.play-icon').src = "res/play-icon.svg";
      } else {
        spectrogram.style.left = 
        (start - 2*spectrogram.width*audio_element.currentTime / 
        audio_element.duration) + 'px';
      }
    }
  }
  


  function switchLanguage(lang){
    c_lang = lang;
    if (lang === "English"){
        document.querySelector('#gbr-flag-img').style.borderBottom = '0.4vw groove green';
        document.querySelector('#swe-flag-img').style.borderBottom = '0.4vw groove transparent';
        for (let i = 0; i < options.length; i++) {
            if (options[i]){
            document.querySelector('#opt-' + String(i)).innerHTML = 
            "<span>" + all_english_names[all_species_names.indexOf(options[i])] + "</span> <span>" +
            options[i] + "</span>";
            }
            else{
                document.querySelector('#opt-' + String(i)).innerHTML = 
            "<span>" + "-" + "</span> <span>" +
            "-" + "</span>";
            }


        }
    
    }

    else{
        document.querySelector('#swe-flag-img').style.borderBottom = '0.4vw groove green';
        document.querySelector('#gbr-flag-img').style.borderBottom = '0.4vw groove transparent';
        
        for (let i = 0; i < options.length; i++) {
            if (options[i]){
            document.querySelector('#opt-' + String(i)).innerHTML = 
            "<span>" + sweDict[options[i]].charAt(0).toUpperCase() + sweDict[options[i]].slice(1) + "</span> <span>" +
            options[i] + "</span>";
            }
            else{
                document.querySelector('#opt-' + String(i)).innerHTML = 
            "<span>" + "-" + "</span> <span>" +
            "-" + "</span>";
            }


        }
    
    
    }
  }




function search(){
    console.log("search");
    let search_box = document.querySelector('.search-box');
    let search_results = document.querySelector('.search-results');
    let x_button = document.querySelector('.x-button');

    console.log(search_box.value);
    if (search_box.value != ""){
        search_results.style.visibility = 'visible';
        x_button.style.visibility = 'visible';
    }

    else{
        search_results.style.visibility = 'hidden';
        x_button.style.visibility = 'hidden';
    }


    search_results.innerHTML = "";

    let results = [];

    for (let i = 0; i < all_sounds.length; i++) {
        if (all_sounds[i].toUpperCase().includes(search_box.value.toUpperCase())){
            results.push(all_sounds[i]);
        }
        
    }

    for (let i = 0; i < results.length; i++) {
        let new_result_item = document.createElement('button');
        new_result_item.classList.add('result-item');
        new_result_item.innerHTML = results[i];
        search_results.appendChild(new_result_item);
        new_result_item.id = "result-" + i;
        new_result_item.addEventListener('click', event => {
            set_audio(results[i], true);
            const elements = Array.from(document.getElementsByClassName('result-item'));
            elements.forEach(element =>{
            element.style.color = "white";
            })
            document.querySelector('#result-' + i).style.color = "green";

        })
        
    }




}



function show_category(){
    let category_selector = document.querySelector('.category-selector');
    if (category_selector.style.visibility == 'visible'){
        category_selector.style.visibility = 'hidden';
    }
    else{
        category_selector.style.visibility = 'visible';
    }
}