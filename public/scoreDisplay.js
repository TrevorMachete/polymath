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


function displayPlayerOneScores(username) {
    // Query for challenges where the current user is player1
    let playerOneQuery = db.collection("ongoingChallenges").where("player1", "==", username);

    playerOneQuery.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const playerOneUsername = data.player1;
            const playerTwoUsername = data.player2;
            const playerOneScores = data.playerOneScores || [];
            const playerTwoScores = data.playerTwoScores || [];

            // Find the score for player1 and player2
            const playerOneScore = playerOneScores.find(score => score.username === username)?.points || 0;
            const playerTwoScore = playerTwoScores.find(score => score.username === playerTwoUsername)?.points || 0;

            // Display the scores for player1 and player2
            document.getElementById("playerOneScore").textContent = playerOneScore;
            document.getElementById("playerTwoScore").textContent = playerTwoScore;
            document.getElementById("playerOneLabel").textContent = playerOneUsername;
            document.getElementById("playerTwoLabel").textContent = playerTwoUsername;
        });
    }).catch((error) => {
        console.error("Error retrieving scores for player1: ", error);
    });
}

function displayPlayerTwoScores(username) {
    // Query for challenges where the current user is player2
    let playerTwoQuery = db.collection("ongoingChallenges").where("player2", "==", username);

    playerTwoQuery.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const playerOneUsername = data.player1;
            const playerTwoUsername = data.player2;
            const playerOneScores = data.playerOneScores || [];
            const playerTwoScores = data.playerTwoScores || [];

            // Find the score for player1 and player2
            const playerOneScore = playerOneScores.find(score => score.username === playerOneUsername)?.points || 0;
            const playerTwoScore = playerTwoScores.find(score => score.username === username)?.points || 0;

            // Display the scores for player1 and player2
            document.getElementById("playerOneScore").textContent = playerOneScore;
            document.getElementById("playerTwoScore").textContent = playerTwoScore;
            document.getElementById("playerOneLabel").textContent = playerOneUsername;
            document.getElementById("playerTwoLabel").textContent = playerTwoUsername;
        });
    }).catch((error) => {
        console.error("Error retrieving scores for player2: ", error);
    });
}


firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
      console.log('User is signed in:', user.uid);
      displayScores(); // Call displayScores here
    } else {
      console.log('No user is signed in.');
    }
});
