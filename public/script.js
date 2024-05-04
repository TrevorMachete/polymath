document.addEventListener('DOMContentLoaded', function() {

    document.getElementById('difficulty').addEventListener('change', function() {
        localStorage.setItem('difficulty', this.value);
    });

    document.getElementById('categories').addEventListener('change', function() {
        localStorage.setItem('categories', this.value);
    });

    document.getElementById('limit').addEventListener('change', function() {
        localStorage.setItem('limit', this.value);
    });

    // Load the stored values when the page loads
    
    if (localStorage.getItem('difficulty')) {
        document.getElementById('difficulty').value = localStorage.getItem('difficulty');
    }
    if (localStorage.getItem('categories')) {
        document.getElementById('categories').value = localStorage.getItem('categories');
    }
    if (localStorage.getItem('limit')) {
        document.getElementById('limit').value = localStorage.getItem('limit');
    }

    // Attach an event listener to the "Get Questions" button
    document.getElementById('getQuestionsButton').addEventListener('click', function() {

        // Then, call the getQuestions function to fetch the questions
        getQuestions();
    });
    
});

// Function to get questions from The Trivia API
function getQuestions() {
    let params = {
        
        difficulty: document.getElementById('difficulty').value,
        categories: document.getElementById('categories').value,
        limit: document.getElementById('limit').value,
        
    };

    let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');

    $.ajax({
        url: 'https://the-trivia-api.com/api/questions?' + queryString,
        method: 'GET',
        dataType: 'json',
        success: function(data) {
            console.log('API Response:', data); // Log the API response
            document.getElementById('textOutput').innerHTML = '';
            if (Array.isArray(data)) {
                data.forEach(question => {
                    let questionDiv = document.createElement('div');
                    questionDiv.innerHTML = `<p>${question.question}</p>`;

                    let answersDiv = document.createElement('div');
                    question.incorrectAnswers.forEach(answer => {
                        let answerButton = document.createElement('button');
                        answerButton.textContent = answer;
                        answerButton.addEventListener('click', function() {
                            handleAnswerSubmission(question, answerButton.textContent, questionDiv);
                        });
                        answersDiv.appendChild(answerButton);
                    });

                    let correctAnswerButton = document.createElement('button');
                    correctAnswerButton.textContent = question.correctAnswer;
                    correctAnswerButton.style.backgroundColor = 'none';
                    correctAnswerButton.addEventListener('click', function() {
                        handleAnswerSubmission(question, correctAnswerButton.textContent, questionDiv);
                    });
                    answersDiv.appendChild(correctAnswerButton);

                    questionDiv.appendChild(answersDiv);
                    document.getElementById('textOutput').appendChild(questionDiv);
                });
            } else {
                console.error('Unexpected API response:', data);
            }
        },
        error: function(error) {
            console.error('Error fetching questions:', error);
        }
    });
}

function handleAnswerSubmission(question, selectedAnswer, questionDiv) {
    let isCorrect = selectedAnswer === question.correctAnswer;
    let resultDiv = document.createElement('div');
    resultDiv.innerHTML = `<p>The correct answer is: ${question.correctAnswer}</p>`;
    resultDiv.innerHTML += `<p>${isCorrect ? 'Correct!' : 'Incorrect.'}</p>`;
    document.getElementById('textOutput').appendChild(resultDiv);
    document.getElementById('textOutput').removeChild(questionDiv);
}
