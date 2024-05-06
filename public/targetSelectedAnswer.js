//target selectedAnswer

// Suppose you have a form with radio buttons for each answer
let form = document.getElementById('answerForm');

form.addEventListener('submit', function(event) {
    event.preventDefault();

    // Get the selected radio button
    let selectedAnswer = document.querySelector('input[name="answer"]:checked').value;

    handleAnswerSubmission(question, selectedAnswer, questionDiv);
});
