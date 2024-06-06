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
                            let winner;
                            let winnerMessage;
                            if (player1TotalPoints > player2TotalPoints) {
                                winner = updatedChallengeData.player1;
                                winnerMessage = `${updatedChallengeData.player1} wins`;
                            } else if (player1TotalPoints < player2TotalPoints) {
                                winner = updatedChallengeData.player2;
                                winnerMessage = `${updatedChallengeData.player2} wins`;
                            } else {
                                winner = 'Tie';
                                winnerMessage = `It's a tie`;
                            }

                            // Create a document in the 'winnerSub' subcollection
                            db.collection("ongoingChallenges").doc(docId).collection('winnerSub').doc('message').set({
                                player1: updatedChallengeData.player1,
                                player2: updatedChallengeData.player2,
                                winner: winner,
                                communication: winnerMessage,
                                seen: 'false'
                            }).then(() => {
                                console.log("Document successfully written!");
                            }).catch((error) => {
                                console.error("Error writing document: ", error);
                            });



                            // Listen for changes in the 'winnerSub' subcollection's 'message' 

                            db.collection("ongoingChallenges").doc(docId).collection('winnerSub').doc('message').onSnapshot((doc) => {
                                if (doc.exists) {
                                    let messageData = doc.data();

                                    // Check if the message has been seen
                                    if (messageData.seen === 'false') {

                                        // Get the dialog box elements

                                        // Create an audio object
                                        let winnerConfirmationAudio = new Audio('https://firebasestorage.googleapis.com/v0/b/polymathquest00.appspot.com/o/music%2FwinnerConfirmation.mp3?alt=media&token=e669671a-fb2c-4b8b-81d7-cb9948cfde3c');

                                        let dialogBoxWinnerConfirmation = document.getElementById('dialogBoxWinnerConfirmation');

                                        let dialogBoxWinnerConfirmationText = document.getElementById('dialogBoxWinnerConfirmationText');

                                        // Get the closeDialogBoxStartGameBtn element
                                        let closeDialogBoxWinnerConfirmationBtn = document.getElementById('closeDialogBoxWinnerConfirmationBtn');

                                        // Update the dialog box text
                                        dialogBoxWinnerConfirmationText.textContent = messageData.communication;

                                        // Display the dialog box
                                        dialogBoxWinnerConfirmation.style.display = 'block';
                                        //Play audio
                                        winnerConfirmationAudio.play();

                                        // Add confetti
                                        const end = Date.now() + (1 * 5000);
                                        const colors = [
                                        '#ffcc00',
                                        '#ff9900',
                                        '#ff6600',
                                        '#ff3300',
                                        '#ff0000'
                                        ];
                                        (function frame() {
                                        confetti({
                                            particleCount: 2,
                                            angle: 60,
                                            spread: 55,
                                            origin: { x: 0 },
                                            colors: colors
                                        });
                                        confetti({
                                            particleCount: 2,
                                            angle: 120,
                                            spread: 55,
                                            origin: { x: 1 },
                                            colors: colors
                                        });
                                        if (Date.now() < end) {
                                            requestAnimationFrame(frame);
                                        }
                                        }());

                                        // Add an event listener to the closeDialogBoxStartGameBtn
                                        closeDialogBoxWinnerConfirmationBtn.addEventListener('click', function() {

                                            // Get the dialogBoxWinnerConfirmation element
                                            let dialogBoxWinnerConfirmation = document.getElementById('dialogBoxWinnerConfirmation');

                                            // Set the display style of dialogBoxWinnerConfirmation to 'none'
                                            dialogBoxWinnerConfirmation.style.display = 'none';

                                        });

                                        // Update the 'seen' field to 'true'
                                        db.collection("ongoingChallenges").doc(docId).collection('winnerSub').doc('message').update({
                                            seen: 'true'
                                        }).then(() => {
                                            console.log("Document successfully updated!");
                                        }).catch((error) => {
                                            console.error("Error updating document: ", error);
                                        });
                                    }
                                } else {
                                    console.log("No such document!");
                                }
                            });

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
