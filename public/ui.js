document.addEventListener('DOMContentLoaded', function() {

// Get the buttons and the elements to show/hide
let chatButtonP1 = document.getElementById('chatButtonP1');
let questionsButtonP1 = document.getElementById('questionsButtonP1');
let scoreButtonP1 = document.getElementById('scoreButtonP1');

let chatBoxP1 = document.getElementById('chatBoxP1');
let textOutput = document.getElementById('textOutput');
let playerScoreHistory = document.getElementById('playerScoreHistory');
  

    // Toggle the chat, questions and score in mobile view
    chatButtonP1.addEventListener('click', function() {
        chatBoxP1.style.display = 'block';
        textOutput.style.display = 'none';
        playerScoreHistory.style.display = 'none';
        this.classList.add('active');
        questionsButtonP1.classList.remove('active');
        scoreButtonP1.classList.remove('active');
    });

    questionsButtonP1.addEventListener('click', function() {
        chatBoxP1.style.display = 'none';
        textOutput.style.display = 'block';
        playerScoreHistory.style.display = 'none';
        this.classList.add('active');
        chatButtonP1.classList.remove('active');
        scoreButtonP1.classList.remove('active');
    });


    scoreButtonP1.addEventListener('click', function() {
        playerScoreHistory.style.display = 'block';
        chatBoxP1.style.display = 'none';
        textOutput.style.display = 'none';
        this.classList.add('active');
        questionsButtonP1.classList.remove('active');
        chatButtonP1.classList.remove('active');
    });

    //New chat dot
    let chatContentP1 = document.getElementById('chatContentP1');
    let chatsButtonP1 = document.getElementById('chatButtonP1');

    chatContentP1.addEventListener('input', function() {
        chatsButtonP1.classList.add('red-dot');
    });

    chatsButtonP1.addEventListener('click', function() {
        chatsButtonP1.classList.remove('red-dot');
    });


}); 

  //For the back to top button
  window.onscroll = function() {scrollFunction()};

  function scrollFunction() {
      if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
          document.getElementById("myBtn").style.display = "block";
      } else {
          document.getElementById("myBtn").style.display = "none";
      }
  }


    //The back to top button continued
    function topFunction() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    }

    window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);

function updateOnlineStatus(event) {
  var hamburger = document.querySelector('.hamburger::before');
  if (navigator.onLine) {
    // The browser is online
    hamburger.style.backgroundColor = '#04AA6D'; // Green
  } else {
    // The browser is offline
    hamburger.style.backgroundColor = '#FF0000'; // Red
  }
}


