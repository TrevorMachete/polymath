firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    console.log('User is signed in:', user.uid);
    let username = user.displayName; // Assuming displayName contains the username

    // Fetch and display scores for player1
    displayPlayerOneScores(username);

    // Fetch and display scores for player2
    displayPlayerTwoScores(username);

    // Set up real-time listeners for currentRound updates
    setupRealTimeListeners(username);
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

    // Update the currentRound field in Firebase Firestore
    let user = firebase.auth().currentUser;
    if (user) {
      let username = user.displayName; // Assuming displayName contains the username
      let player1Query = db.collection("ongoingChallenges").where("player1", "==", username);
      let player2Query = db.collection("ongoingChallenges").where("player2", "==", username);

      // Update the currentRound field for player1
      player1Query.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          doc.ref.update({
            currentRound: gameRound.currentRound
          });
        });
      });

      // Update the currentRound field for player2
      player2Query.get().then(function(querySnapshot) {
        querySnapshot.forEach(function(doc) {
          doc.ref.update({
            currentRound: gameRound.currentRound
          });
        });
      });
    }
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

// Function to set up real-time listeners for currentRound updates
function setupRealTimeListeners(username) {
  let user = firebase.auth().currentUser;
  if (user) {
    let player1Query = db.collection("ongoingChallenges").where("player1", "==", username);
    let player2Query = db.collection("ongoingChallenges").where("player2", "==", username);

    // Listen for changes to currentRound for player1
    player1Query.onSnapshot(function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        if (change.type === "modified") {
          gameRound.currentRound = change.doc.data().currentRound;
          localStorage.setItem('currentRound', gameRound.currentRound);
          document.getElementById('currentRoundDisplay').innerText = 'Round ' + gameRound.currentRound;
        }
      });
    });

    // Listen for changes to currentRound for player2
    player2Query.onSnapshot(function(snapshot) {
      snapshot.docChanges().forEach(function(change) {
        if (change.type === "modified") {
          gameRound.currentRound = change.doc.data().currentRound;
          localStorage.setItem('currentRound', gameRound.currentRound);
          document.getElementById('currentRoundDisplay').innerText = 'Round ' + gameRound.currentRound;
        }
      });
    });
  }
}

// Call the function when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
  handleRoundDisplay('getQuestionsButtonP1');
  handleRoundDisplay('getQuestionsButtonP2');
  
  // Update the round display when the page loads
  document.getElementById('currentRoundDisplay').innerText = 'Round ' + gameRound.getCurrentRound();
});
