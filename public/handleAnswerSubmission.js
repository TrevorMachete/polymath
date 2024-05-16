function handleAnswerSubmission(question, userAnswer, questionDiv) {
    // Check if the user's answer is correct
    let isCorrect = userAnswer === question.correctAnswer;

    // Provide feedback to the user
    let feedbackMessage;
    if (isCorrect) {
        feedbackMessage = 'Correct! Well done.';
    } else {
        feedbackMessage = `Incorrect. The correct answer was: ${question.correctAnswer}`;
    }

    // Remove the question from the page
    questionDiv.remove();

    // Get the limit value from the input field
    let limit = parseInt(document.getElementById('limit').value);

    // Display the feedback message after 5 seconds * limit + 3 seconds
    setTimeout(function() {
        document.getElementById('textOutput').innerText = feedbackMessage;
    }, 5000 * limit + 3000);

    // Rest of your code...
}

