document.addEventListener('DOMContentLoaded', function() {
    // Set up event listeners to store selections in local storage
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

    document.getElementById('getQuestionsButton').addEventListener('click', function() {
        // Display a countdown popup
        let countdownPopup = document.createElement('div');
        countdownPopup.id = 'countdownPopup';
        countdownPopup.style.position = 'fixed';
        countdownPopup.style.left = '50%';
        countdownPopup.style.top = '50%';
        countdownPopup.style.transform = 'translate(-50%, -50%)';
        countdownPopup.style.padding = '20px';
        countdownPopup.style.backgroundColor = '#fff';
        countdownPopup.style.border = '1px solid #000';
        document.body.appendChild(countdownPopup);
    
        let countdown = 5;
        countdownPopup.innerText = 'Your countdown begins in ' + countdown + ' seconds';
    
        let countdownInterval = setInterval(function() {
            countdown--;
            if (countdown > 0) {
                countdownPopup.innerText = 'Your countdown begins in ' + countdown + ' seconds';
            } else {
                // Remove the popup and start the countdown timer
                countdownPopup.parentNode.removeChild(countdownPopup);
                clearInterval(countdownInterval);
                startCountdownTimer();
    
                // Fetch the questions
                //getQuestions().then(questions => {
                 //   displayQuestions(questions); // Display the questions after they are fetched
                //}).catch(error => {
                  //  console.error("Error getting questions: ", error);
                //});
            }
        }, 1000);
    });
    
});

function getQuestions() {
    return new Promise((resolve, reject) => {
        let userId = firebase.auth().currentUser.uid;  // Get the current user's ID

        let params = {
            difficulty: document.getElementById('difficulty').value,
            categories: document.getElementById('categories').value,
            limit: document.getElementById('limit').value,
        };

        let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');

        fetch('https://the-trivia-api.com/api/questions?' + queryString)
           .then(response => response.json())
           .then(data => {
                // Check if data is not undefined before proceeding
                if (data && Array.isArray(data)) {
                    // Delay the display of questions by five seconds
                    setTimeout(function() {
                        displayQuestions(data);
                    }, 5000);

                    // Get the user's document
                    let userDoc = db.collection("users").doc(userId);

                    // Get the current questions array or create a new one if it doesn't exist
                    userDoc.get().then((doc) => {
                        let questions = doc.data()?.questions || [];

                        // Add new questions to the array
                        data.forEach((question, index) => {
                            questions.push({
                                question: question.question,
                                correctAnswer: question.correctAnswer,
                                userAnswer: null,  // to be updated later
                            });
                        });

                        // Update the questions array in Firestore
                        userDoc.set({
                            questions: questions
                        }, { merge: true })
                       .then(() => {
                            console.log("Questions successfully written!");
                            resolve(questions); // Resolve the promise with the questions
                        })
                       .catch((error) => {
                            console.error("Error writing questions: ", error);
                            reject(error); // Reject the promise with the error
                        });
                    });
                } else {
                    console.error("Data fetched from API is undefined or not an array.");
                    reject(new Error("Data fetched from API is undefined or not an array."));
                }
            });
    });
}


// Function to display questions and handle answer submission
function displayQuestions(data) {
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
}

// Function to handle answer submission
function handleAnswerSubmission(question, selectedAnswer, questionDiv) {
    let isCorrect = selectedAnswer === question.correctAnswer;
    let resultDiv = document.createElement('div');
    resultDiv.innerHTML = `<p>The correct answer is: ${question.correctAnswer}</p>`;
    resultDiv.innerHTML += `<p>${isCorrect ? 'Correct!' : 'Incorrect.'}</p>`;
    document.getElementById('textOutput').appendChild(resultDiv);
    document.getElementById('textOutput').removeChild(questionDiv);

    // Update the user's answer in Firestore
    db.collection("questions").where("question", "==", question.question)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            doc.ref.update({
                userAnswer: selectedAnswer
            });
        });
    })
    .catch((error) => {
        console.log("Error updating user's answer: ", error);
    });

    // Return the correctness of the answer
    return isCorrect;
}


// Function to start the countdown timer
function startCountdownTimer() {
    let playerTwoCountdownTimer = document.getElementById('playerTwoCountdownTimer');
    let limit = parseInt(document.getElementById('limit').value);
    let countdownDuration = 5 * limit; // Default countdown duration to answer one question is 5 seconds
    playerTwoCountdownTimer.innerText = countdownDuration;

    let countdownTimerInterval = setInterval(function() {
        countdownDuration--;
        if (countdownDuration > -1) {
            playerTwoCountdownTimer.innerText = countdownDuration;
        } else {
            clearInterval(countdownTimerInterval);
            document.getElementById('textOutput').innerText = 'Your countdown has ended';
        }
    }, 1000);
}

