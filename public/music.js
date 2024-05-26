document.addEventListener('DOMContentLoaded', function() {

//For the soundtrack

var myAudio = document.getElementById('myAudio');
var soundButton = document.getElementById('soundButton');

soundButton.addEventListener('click', function() {
    if (myAudio.paused) {
        myAudio.play();
        soundButton.textContent = 'Pause';
    } else {
        myAudio.pause();
        soundButton.textContent = 'Music';
    }
});

}); 
