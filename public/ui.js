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

document.addEventListener('DOMContentLoaded', (event) => {
    let playerOneLoginLogoutButton = document.getElementById('playerOneLoginLogoutButton');
    let playerTwoLoginLogoutButton = document.getElementById('playerTwoLoginLogoutButton');
    let customLogin = document.getElementById('customLogin');
    let customLoginButton = document.getElementById('customLoginButton');
    let customLoginLabels = document.getElementById('customLoginLabels');
    let customLoginForms = document.getElementById('customLoginForms');
    let formOne = document.getElementById('formOne');
    let formTwo = document.getElementById('formTwo');
    let customLoginRegisterLabel = document.getElementById('customLoginRegisterLabel');
    let customLoginLoginLabel = document.getElementById('customLoginLoginLabel');

    playerOneLoginLogoutButton.addEventListener('click', function() {
        customLogin.style.display = 'block';
    });

    playerTwoLoginLogoutButton.addEventListener('click', function() {
        customLogin.style.display = 'block';
    });

    customLoginButton.addEventListener('click', function() {
        customLoginLabels.style.display = 'grid';
        customLoginForms.style.display = 'grid';
        formOne.style.display = 'block';
        customLoginLoginLabel.style.color = 'black';
        customLoginLoginLabel.style.backgroundColor = 'white';
    });

    customLoginRegisterLabel.addEventListener('click', function() {
        formTwo.style.display = 'block';
        formOne.style.display = 'none';
        customLoginRegisterLabel.style.color = 'black';
        customLoginRegisterLabel.style.backgroundColor = 'white';
        customLoginLoginLabel.style.color = '';
        customLoginLoginLabel.style.backgroundColor = '';
    });

    customLoginLoginLabel.addEventListener('click', function() {
        formOne.style.display = 'block';
        formTwo.style.display = 'none';
        customLoginLoginLabel.style.color = 'black';
        customLoginLoginLabel.style.backgroundColor = 'white';
        customLoginRegisterLabel.style.color = '';
        customLoginRegisterLabel.style.backgroundColor = '';
    });
});
