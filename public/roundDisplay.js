
// Initialize current round
let currentRound = 0;

// Function to handle round display
function handleRoundDisplay() {
  // Check if the button exists
  var button = document.getElementById('getQuestionsButton');
  if (button) {
    button.addEventListener('click', function() {
      if (firebase.auth().currentUser) {
        // If a user is currently logged in, increment the round and update the display
        currentRound++;
        document.getElementById('currentRoundDisplay').innerText = 'Current Round: ' + currentRound;
      } else {
        console.log('User not logged in');
      }
    });
  } else {
    console.error('Element with ID "getQuestionsButton" not found');
  }
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', handleRoundDisplay);
