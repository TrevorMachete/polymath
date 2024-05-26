document.addEventListener('DOMContentLoaded', function() {

    // Hamburger menu
    document.getElementById('hamburger').addEventListener('click', function() {
        var navBar = document.getElementById('nav-bar');
        navBar.classList.toggle('show');
    });    
});

//Hide the midElement when the hamburger is clicked
document.addEventListener('DOMContentLoaded', function() {
    var midElement = document.getElementById('midElement');
    var hamburger = document.getElementById('hamburger');

    hamburger.addEventListener('click', function() {
        if (midElement.style.visibility === 'hidden' || midElement.style.visibility === '') {
            midElement.style.visibility = 'hidden';
            midElement.style.opacity = 0;
        } else {
            midElement.style.visibility = 'visible';
            midElement.style.opacity = 0;
        }
    });
});

