// Initialize Firebase
var db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in, call the function to fetch messages
        fetchMessagesForCurrentUser();

        // Store auth state
        localStorage.setItem('authState', JSON.stringify(user));
    } else {
        // No user is signed in.
        console.error("No user is signed in.");

        // Clear the auth state
        localStorage.removeItem('authState');
    }
});

function getCurrentUser() {
    const user = firebase.auth().currentUser;
    if (user) {
        return user.displayName; // Returns the username of the logged in user
    } else {
        return null;
    }
}

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

        document.getElementById('timer').innerText = '00:00';
        // Get the countdown warning and timer elements
        let countdownWarning = document.getElementById('countdownWarning');
        let timer = document.getElementById('timer');
    
        let countdown = 5;
        countdownWarning.innerHTML = 'Your game begins in<br><br>';
        timer.innerText = formatTime(countdown);
    
        let countdownInterval = setInterval(function() {
            countdown--;
            if (countdown > 0) {
                timer.innerText = formatTime(countdown);
            } else {
                // Clear the countdown warning and reset the timer
                countdownWarning.innerText = '';
                timer.innerText = '00:00';
                clearInterval(countdownInterval);
                startCountdownTimer();
    
            }
        }, 1000);
    });
    
    function formatTime(seconds) {
        let minutes = Math.floor(seconds / 60);
        seconds %= 60;
        return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
    }   
    
});

function getQuestions() {
    return new Promise((resolve, reject) => {
        let userId = firebase.auth().currentUser.uid;  // Get the current user's ID
        let username = firebase.auth().currentUser.displayName; // Get the current user's username

        let params = {
            difficulty: document.getElementById('difficulty').value,
            categories: document.getElementById('categories').value,
            limit: document.getElementById('limit').value,
        };

        let queryString = Object.keys(params).map(key => key + '=' + encodeURIComponent(params[key])).join('&');

        fetch('https://the-trivia-api.com/api/questions?' + queryString)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data && Array.isArray(data)) {
                setTimeout(function() {
                    displayQuestions(data);
                }, 5000);

                // Get the ongoing challenges where the current user is either player1 or player2
                let player1Query = db.collection("ongoingChallenges").where("player1", "==", username);
                let player2Query = db.collection("ongoingChallenges").where("player2", "==", username);

                Promise.all([player1Query.get(), player2Query.get()]).then((querySnapshots) => {
                    querySnapshots.forEach((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            let questions = doc.data().questions || [];

                            data.forEach((question, index) => {
                                let questionId = `${username}-${Date.now()}-${index}`; // Generate a unique ID for each question
                                questions.push({
                                    questionId: questionId,
                                    question: question.question,
                                    correctAnswer: question.correctAnswer,
                                    userAnswer: null,  // to be updated later
                                    incorrectAnswers: question.incorrectAnswers,  // Save the answer options
                                    served: false,  // to be updated later
                                });
                            });

                            // Update the questions array in Firestore
                            doc.ref.set({
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
                    });
                });
            } else {
                console.error("Data fetched from API is undefined or not an array.");
                reject(new Error("Data fetched from API is undefined or not an array."));
            }
        });
    });
}



function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

// Function to handle answer submission
function handleAnswerSubmission(question, selectedAnswer, questionDiv) {
    let userId = firebase.auth().currentUser.uid;  // Get the current user's ID
    let username = firebase.auth().currentUser.displayName; // Get the current user's username

    // Find the ongoing challenge document(s) where the current user is either player1 or player2
    let player1Query = db.collection("ongoingChallenges").where("player1", "==", username);
    let player2Query = db.collection("ongoingChallenges").where("player2", "==", username);

    Promise.all([player1Query.get(), player2Query.get()]).then((querySnapshots) => {
        querySnapshots.forEach((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data().questions || [];
                let questionIndex = data.findIndex(q => q.questionId === question.questionId);

                if (questionIndex!== -1) {
                    // Check if the selected answer matches the correct answer
                    if (selectedAnswer === question.correctAnswer) {
                        // Determine which scores array to update based on the username match
                        let scoresToUpdate;
                        if (username === doc.data().player1) {
                            scoresToUpdate = "playerOneScores";
                        } else if (username === doc.data().player2) {
                            scoresToUpdate = "playerTwoScores";
                        }

                        // Increment the score for the current user
                        // Assuming 'scores' is an array of objects with 'userId' and 'points'
                        let currentUserScore = doc.data()[scoresToUpdate].find(score => score.userId === userId);
                        if (currentUserScore) {
                            currentUserScore.points += 1; // Add 1 point to the current user's score
                        } else {
                            // If no score entry exists for the current user, add a new one
                            doc.ref.update({
                                [scoresToUpdate]: firebase.firestore.FieldValue.arrayUnion({
                                    username: username,
                                    points: 1
                                })
                            });
                        }

                        // Optionally, log success or show a message to the user
                        console.log(`Score in ${scoresToUpdate.charAt(0).toUpperCase() + scoresToUpdate.slice(1)} incremented.`);
                    }

                    // Update the userAnswer field with the selected answer
                    data[questionIndex].userAnswer = selectedAnswer;

                    // Update the questions array in Firestore
                    doc.ref.update({
                        questions: data
                    }).then(() => {
                        console.log("User answer and score successfully updated!");
                        // Optionally, remove the questionDiv from the DOM here if needed
                    }).catch((error) => {
                        console.error("Error updating user answer and score: ", error);
                    });
                }
            });
        });
    });
}





// Function to display questions and handle answer submission
function displayQuestions() {
    let userId = firebase.auth().currentUser.uid;  // Get the current user's ID
    let username = firebase.auth().currentUser.displayName; // Get the current user's username

    // Get the ongoing challenges where the current user is either player1 or player2
    let player1Query = db.collection("ongoingChallenges").where("player1", "==", username);
    let player2Query = db.collection("ongoingChallenges").where("player2", "==", username);

    Promise.all([player1Query.get(), player2Query.get()]).then((querySnapshots) => {
        querySnapshots.forEach((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                let data = doc.data().questions || [];

                document.getElementById('textOutput').innerHTML = '';
                if (Array.isArray(data)) {
                    data.forEach((question, index) => {
                        // Only display the question if the served field is false
                        if (!question.served) {
                            let questionDiv = document.createElement('div');
                            questionDiv.innerHTML = `<p>${question.question}</p>`;

                            // Prepare all possible answers, including the correct one
                            let allPossibleAnswers = [...question.incorrectAnswers, question.correctAnswer];
                            
                            // Shuffle the array of answers
                            shuffleArray(allPossibleAnswers);

                            let answersDiv = document.createElement('div');
                            allPossibleAnswers.forEach(answer => {
                                let answerButton = document.createElement('button');
                                answerButton.textContent = answer;
                                answerButton.addEventListener('click', function() {
                                    handleAnswerSubmission(question, answerButton.textContent, questionDiv);
                                });
                                answersDiv.appendChild(answerButton);
                            });

                            questionDiv.appendChild(answersDiv);
                            document.getElementById('textOutput').appendChild(questionDiv);

                            // Update the served field to true
                            question.served = true;
                            doc.ref.update({
                                questions: data
                            });
                        }
                    });
                } else {
                    console.error('Unexpected API response:', data);
                }
            });
        });
    });
}




// Function to start the countdown timer
function startCountdownTimer() {
    let timer = document.getElementById('timer');
    let limit = parseInt(document.getElementById('limit').value);
    let countdownDuration = 5 * limit; // Default countdown duration to answer one question is 5 seconds
    timer.innerText = formatTime(countdownDuration);

    let countdownTimerInterval = setInterval(function() {
        countdownDuration--;
        if (countdownDuration > -1) {
            timer.innerText = formatTime(countdownDuration);
        } else {
            clearInterval(countdownTimerInterval);
            document.getElementById('textOutput').innerText = 'Your time has elapsed';
        }
    }, 1000);
}

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    seconds %= 60;
    return (minutes < 10 ? "0" + minutes : minutes) + ":" + (seconds < 10 ? "0" + seconds : seconds);
}

    // Retrieve auth state after page refresh
    const storedAuthState = JSON.parse(localStorage.getItem('authState'));

