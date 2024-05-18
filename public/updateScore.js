document.addEventListener('DOMContentLoaded', function() {
// Initialize player scores and turn
let playerOneScoreHistory = [];
let playerTwoScoreHistory = [];
let playerOneTurn = true;

document.getElementById('getQuestionsButton').addEventListener('click', function() {
    // Check if the user is authenticated
    if (!firebase.auth().currentUser) {
        console.error('User is not authenticated');
        return;
    }

    getQuestions().then(questions => {
        displayQuestions(questions);
    }).catch(error => {
        console.error('Error fetching questions:', error);
    });
});

function handleAnswerSubmission(question, userAnswer, questionDiv) {
    // Check if the user's answer is correct
    let isCorrect = userAnswer === question.correctAnswer;

    // Update the score history of the current player
    if (playerOneTurn) {
        playerOneScoreHistory.push(isCorrect ? 1 : 0);
    } else {
        playerTwoScoreHistory.push(isCorrect ? 1 : 0);
    }

    // Switch turns
    playerOneTurn = !playerOneTurn;

}
});