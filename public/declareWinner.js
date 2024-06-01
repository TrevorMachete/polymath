let timeoutScheduled = false;

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in, now it's safe to access user.uid
        console.log('User is signed in:', user.uid);
        let username = user.displayName; // Assuming displayName contains the username

        // Query to find the ongoing challenge document(s) where the current user is either player1 or player2
        let player1Query = db.collection("ongoingChallenges").where("player1", "==", username);
        let player2Query = db.collection("ongoingChallenges").where("player2", "==", username);

        player1Query.onSnapshot(function(snapshot) {
            snapshot.docChanges().forEach(function(change) {
                if (change.type === "added" || change.type === "modified") {
                    handleChallengeUpdate(change.doc.data(), change.doc.id);
                }
            });
        });

        player2Query.onSnapshot(function(snapshot) {
            snapshot.docChanges().forEach(function(change) {
                if (change.type === "added" || change.type === "modified") {
                    handleChallengeUpdate(change.doc.data(), change.doc.id);
                }
            });
        });

        function handleChallengeUpdate(challengeData, docId) {
            let currentRound = challengeData.currentRound;
            let maxGameRounds = parseInt(challengeData.gameRounds, 10);

            // Proceed only if currentRound matches maxGameRounds and timeout hasn't been scheduled yet
            if (currentRound === maxGameRounds && !timeoutScheduled) {
                timeoutScheduled = true; // Set the flag to true

                // Get the limit value from the input field
                let limitElement = document.getElementById('limit');
                let limit = parseInt(limitElement.value, 10); // Ensure parsing is done in base 10

                // Validate the limit value
                if (isNaN(limit)) {
                    console.error('Invalid limit value.');
                    return; // Exit the function if limit is not a valid number
                }

                // Create a new Promise that resolves after a delay
                new Promise((resolve) => {
                    setTimeout(resolve, 5000 * limit + 10000);
                }).then(() => {
                    // Fetch the latest challenge data from Firebase
                    db.collection("ongoingChallenges").doc(docId).get().then((doc) => {
                        if (doc.exists) {
                            let updatedChallengeData = doc.data();

                            let player1TotalPoints = 0;
                            let player2TotalPoints = 0;

                            // Calculate total points for player1
                            const playerOneScores = updatedChallengeData.playerOneScores;
                            Object.values(playerOneScores).forEach(score => {
                                player1TotalPoints += score.points;
                            });

                            // Calculate total points for player2
                            const playerTwoScores = updatedChallengeData.playerTwoScores;
                            Object.values(playerTwoScores).forEach(score => {
                                player2TotalPoints += score.points;
                            });

                            // Determine the winner
                            if (player1TotalPoints > player2TotalPoints) {
                                alert(`${username} wins`);
                            } else if (player1TotalPoints < player2TotalPoints) {
                                alert(`Opponent wins`);
                            } else {
                                alert(`It's a tie`);
                            }
                        } else {
                            console.log("No such document!");
                        }
                    }).catch((error) => {
                        console.log("Error getting document:", error);
                    });
                });
            } 
        }
    } else {
        // No user is signed in, handle accordingly
        console.log('No user is signed in.');
    }
});

