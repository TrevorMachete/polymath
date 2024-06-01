function handleAnswerFeedback(question, userAnswer, questionDiv) {

    
    // Check if the user's answer is correct
    let isCorrect = userAnswer === question.correctAnswer;

    // Provide feedback to the user
    let feedbackMessage;
    if (isCorrect) {
        feedbackMessage = 'Your answer was: ' + userAnswer + '. ' +'Correct, well done';
    } else {
        feedbackMessage = `Incorrect. The correct answer was: ${question.correctAnswer}`;
    }

    // Get the limit value from the input field
    let limitElement = document.getElementById('limit');
    let limit = parseInt(limitElement.value, 10); // Ensure parsing is done in base 10

    // Validate the limit value
    if (isNaN(limit)) {
        console.error('Invalid limit value.');
        return; // Exit the function if limit is not a valid number
    }

    // Display the feedback message after 5 seconds * limit + 3 seconds
    setTimeout(function() {
        document.getElementById('textOutput').innerText = feedbackMessage;
    }, 5000 * limit + 3000);

}
