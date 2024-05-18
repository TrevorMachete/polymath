// Get the ongoing challenges where the current user is either player1 or player2
// Example answer submission function

function submitAnswer(username, questionIndex, userAnswer) {
    // Assuming you have an array of questions and their correct answers
    const correctAnswer = questions[questionIndex].correctAnswer;
    const isCorrect = userAnswer === correctAnswer;

    // Calculate the score (you can adjust this logic as needed)
    const score = isCorrect ? 1 : -1;

    // Update the scores
    updateScores(username, [{ score }]); // Pass an array with the calculated score
}


function updateScores(username, data) {
    const db = firebase.firestore();

    const player1Query = db.collection("ongoingChallenges").where("player1", "==", username);
    const player2Query = db.collection("ongoingChallenges").where("player2", "==", username);

    Promise.all([player1Query.get(), player2Query.get()]).then((querySnapshots) => {
        querySnapshots.forEach((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const scores = doc.data().scores || [];

                data.forEach((score, index) => {
                    scores.push({
                        player1: doc.data().player1,
                        player2: doc.data().player2,
                        scores: score.score,  // Assuming you have a 'score' field in your data
                        timestamp: new Date(),  // Add a timestamp
                    });
                });

                // Update the scores array in Firestore
                doc.ref.set({
                    scores: scores
                }, { merge: true })
                .then(() => {
                    console.log("Scores successfully written!");
                    // Resolve the promise with the updated scores
                    resolve(scores);
                })
                .catch((error) => {
                    console.error("Error writing scores: ", error);
                    // Reject the promise with the error
                    reject(error);
                });
            });
        });
    });
}
