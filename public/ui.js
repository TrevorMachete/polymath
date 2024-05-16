document.addEventListener('DOMContentLoaded', function() {
  //For player one
  var scoreButtonP1 = document.getElementById('scoreButtonP1');
  var chatButtonP1 = document.getElementById('chatButtonP1');

  scoreButtonP1.addEventListener('click', function() {
      document.getElementById('playerOneScoreHistory').style.display = 'block';
      document.getElementById('chatBoxP1').style.display = 'none';
      this.classList.add('active');
      chatButtonP1.classList.remove('active');
  });

  chatButtonP1.addEventListener('click', function() {
      document.getElementById('chatBoxP1').style.display = 'block';
      document.getElementById('playerOneScoreHistory').style.display = 'none';
      this.classList.add('active');
      scoreButtonP1.classList.remove('active');
  });

  //For player two
  var scoreButtonP2 = document.getElementById('scoreButtonP2');
  var chatButtonP2 = document.getElementById('chatButtonP2');

  scoreButtonP2.addEventListener('click', function() {
      document.getElementById('playerTwoScoreHistory').style.display = 'block';
      document.getElementById('chatBoxP2').style.display = 'none';
      this.classList.add('active');
      chatButtonP2.classList.remove('active');
  });

  chatButtonP2.addEventListener('click', function() {
      document.getElementById('chatBoxP2').style.display = 'block';
      document.getElementById('playerTwoScoreHistory').style.display = 'none';
      this.classList.add('active');
      scoreButtonP2.classList.remove('active');
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
});

//...the back to top button continued
function topFunction() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}
