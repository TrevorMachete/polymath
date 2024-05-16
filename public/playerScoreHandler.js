document.addEventListener('DOMContentLoaded', function() {

// Variables to track player scores and turns
let playerOneScore = 0;
let playerTwoScore = 0;
let currentPlayerTurn = 'playerOne';

// Function to handle answer submission
function handleAnswerSubmission(question, answer, questionDiv) {
    if (answer === question.correctAnswer) {
        if (currentPlayerTurn === 'playerOne') {
            playerOneScore++;
        } else {
            playerTwoScore++;
        }
    }

    // Display the result
    let resultDiv = document.createElement('p');
    resultDiv.textContent = `${currentPlayerTurn} answered correctly`;
    document.getElementById(`scoreHistory${currentPlayerTurn}`).appendChild(resultDiv);

    // Switch turns
    currentPlayerTurn = currentPlayerTurn === 'playerOne'? 'playerTwo' : 'playerOne';
    displayQuestions([], currentPlayerTurn); // Pass empty array since no new questions are fetched here
}

// Function to display score histories
function displayScoreHistories() {
    document.getElementById('playerOneScoreHistory').textContent = `Player One Score: ${playerOneScore}`;
    document.getElementById('playerTwoScoreHistory').textContent = `Player Two Score: ${playerTwoScore}`;
}

// Example usage within the context of the game flow
document.getElementById('getQuestionsButton').addEventListener('click', function() {
    if (!firebase.auth().currentUser) {
        console.error('User is not authenticated');
        return;
    }

    getQuestions().then(questions => {
        displayQuestions(questions, currentPlayerTurn);
    }).catch(error => {
        console.error('Error fetching questions:', error);
    });

    // Optionally, call displayScoreHistories() at appropriate times to update the UI
    displayScoreHistories();
});

});
