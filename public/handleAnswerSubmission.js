function handleAnswerSubmission(question, userAnswer, questionDiv) {
    // Check if the user's answer is correct
    let isCorrect = userAnswer === question.correctAnswer;

    // Provide feedback to the user
    let feedbackMessage;
    if (isCorrect) {
        feedbackMessage = 'Correct Well done.';
    } else {
        feedbackMessage = `Incorrect. The correct answer was: ${question.correctAnswer}`;
    }

    // Remove the question from the page
    questionDiv.remove();

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

    // Additional logic to update the userAnswer in the database
    // Assuming 'userId' and 'username' are available in this scope
    let userId = firebase.auth().currentUser.uid;
    let username = firebase.auth().currentUser.displayName;

    // Find the index of the question in the questions array
    let questionIndex = data.findIndex(q => q.question === question.question);

    // Update the userAnswer field of the selected question
    data[questionIndex].userAnswer = userAnswer;

    // Update the Firestore document with the new userAnswer
    doc.ref.update({
        questions: data
    }).then(() => {
        console.log("User answer successfully updated!");
    }).catch((error) => {
        console.error("Error updating user answer: ", error);
    });
}
