firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      console.log('User is signed in:', user.uid);
      let username = user.displayName; // Assuming displayName contains the username

      // Fetch and display scores for player1
      displayPlayerOneScores(username);

      // Fetch and display scores for player2
      displayPlayerTwoScores(username);
  } else {
      console.log('No user is signed in.');
  }
});


let gameRound = {
  currentRound: localStorage.getItem('currentRound') || 0,
  incrementRound: function() {
    this.currentRound++;
    localStorage.setItem('currentRound', this.currentRound);
    document.getElementById('currentRoundDisplay').innerText = 'Round ' + this.currentRound;
  },
  getCurrentRound: function() {
    return this.currentRound;
  }
};

// Function to handle round display
function handleRoundDisplay(buttonId) {
  // Check if the button exists
  var button = document.getElementById(buttonId);
  if (button) {
    button.addEventListener('click', function() {
      if (firebase.auth().currentUser) {
        // If a user is currently logged in, increment the round
        gameRound.incrementRound();
      } else {
        console.log('User not logged in');
      }
    });
  } else {
    console.error('Element with ID "' + buttonId + '" not found');
  }
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  handleRoundDisplay('getQuestionsButtonP1');
  handleRoundDisplay('getQuestionsButtonP2');
  
  // Update the round display when the page loads
  document.getElementById('currentRoundDisplay').innerText = 'Round ' + gameRound.getCurrentRound();
});
