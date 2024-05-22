// Function to handle round display
function handleRoundDisplay(buttonId) {
    // Check if the button exists
    var button = document.getElementById(buttonId);
    if (button) {
      button.addEventListener('click', function() {
        if (firebase.auth().currentUser) {
          // If a user is currently logged in, increment the round
          gameRound.incrementRound();
  
          // Get the current user's username
          let username = firebase.auth().currentUser.displayName;
  
          // Get the ongoing challenges where the current user is either player1 or player2
          let player1Query = db.collection("ongoingChallenges").where("player1", "==", username);
          let player2Query = db.collection("ongoingChallenges").where("player2", "==", username);
  
          Promise.all([player1Query.get(), player2Query.get()]).then((querySnapshots) => {
            querySnapshots.forEach((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                // Update the currentRound field in Firestore
                doc.ref.update({
                  currentRound: gameRound.getCurrentRound()
                })
                .then(() => {
                  console.log("Round successfully updated!");
                })
                .catch((error) => {
                  console.error("Error updating round: ", error);
                });
              });
            });
          });
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
  });
  