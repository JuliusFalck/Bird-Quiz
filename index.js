


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
    generate();
});


// start

read_songs();

generate();


// functions
function play_sound(){
    if (!audio_element.paused){
        audio_element.pause();
        document.querySelector('.play-button').innerHTML = "Play";

    }
    else {

        document.querySelector('.play-button').innerHTML = "Pause";
        /* the audio is now playable; play it if permissions allow */
        audio_element.play();


    }
}


function generate(){
    
    answered = false;

    // stop sound
    audio_element.pause();

    // pick a sound
    c_index = Math.floor(Math.random()*all_sounds.length);

    let rest_sounds = Array.from(Array(all_english_names.length).keys());

    rest_sounds.splice(all_english_names.indexOf(sound_dict[all_sounds[c_index]][0]), 1);
    console.log(rest_sounds);

    // set the incorecct options
    for (let i = 0; i < options.length; i++) {

        // reset color
        document.querySelector('#opt-' + String(i)).style.backgroundColor = "black";

        let o_index = Math.floor(Math.random()*rest_sounds.length);
        options[i] = o_index;
        document.querySelector('#opt-' + String(i)).innerHTML = 
        "<span>" + all_english_names[rest_sounds[o_index]] + "</span> <span>" +
        all_species_names[rest_sounds[o_index]] + "</span>";
        console.log(rest_sounds);
        rest_sounds.splice(rest_sounds.indexOf(o_index), 1);
    }

    // set the correct option
    c_opt = Math.floor(Math.random()*6);
    options[c_opt] = c_index;
    document.querySelector('#opt-' + c_opt.toString()).innerHTML = 
    "<span>" + sound_dict[all_sounds[c_index]][0] + "</span> <span>" +
    sound_dict[all_sounds[c_index]][1] + "</span>";

    // play the song
    audio_element = new Audio("data/audio/" + all_sounds[c_index]);
    audio_element.addEventListener("canplaythrough", event => {
        /* the audio is now playable; play it if permissions allow */
        audio_element.play();
        });

    document.querySelector('.play-button').innerHTML = "Pause";

    // set the spectrogram

    document.querySelector('.spectro-view').src = 
    "data/spectrograms/" + all_sounds[c_index].split('.')[0] + ".webp"
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
        let english_name = item.split('- ')[1];
        let species_name = item.split('- ')[2];
        species_name = species_name.split('.')[0];
        all_english_names.push(english_name);
        all_species_names.push(species_name);
        sound_dict[item] = [english_name, species_name];
    })
    all_english_names = [... new Set(all_english_names)];
    all_species_names = [... new Set(all_species_names)];
}