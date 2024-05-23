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

    document.getElementById('getQuestionsButtonP1').addEventListener('click', function() {

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
    
    document.getElementById('getQuestionsButtonP2').addEventListener('click', function() {

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
                }, 0);

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

                                //Style the answers element
                                answerButton.style.backgroundColor = 'blue';
                                answerButton.style.color = 'white';
                                answerButton.style.fontSize = '14px';
                                answerButton.style.padding = '5px';
                                answerButton.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
                            });

                            questionDiv.appendChild(answersDiv);
                            document.getElementById('textOutput').appendChild(questionDiv);

                            //Style the questions element
                            questionDiv.style.backgroundColor = 'orange';
                            questionDiv.style.paddingTop = '5px';
                            questionDiv.style.paddingBottom = '5px';
                            questionDiv.style.marginBottom = '10px';
                            questionDiv.style.borderRadius = '10px';
                            questionDiv.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
                            questionDiv.style.textShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';




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
    
                if (questionIndex !== -1) {
                    // Determine which scores array to update based on the username match
                    let scoresToUpdate;
                    if (username === doc.data().player1) {
                        scoresToUpdate = "playerOneScores";
                    } else if (username === doc.data().player2) {
                        scoresToUpdate = "playerTwoScores";
                    }
    
                // Get the scores array
                let scoresArray = doc.data()[scoresToUpdate];
                // Find the score objects for the current user
                let currentUserScores = scoresArray.filter(score => score.username === username);

                if (currentUserScores.length > 0) {
                    // Get the most recent score entry for the current user
                    let mostRecentScore = currentUserScores[currentUserScores.length - 1];

                    // Check if the selected answer matches the correct answer
                    if (selectedAnswer === question.correctAnswer) {
                        if (gameRound.getCurrentRound() === mostRecentScore.Round) {
                            // If the current round is equal to the last round, increment the points
                            mostRecentScore.points += 1;
                        } else if (gameRound.getCurrentRound() > mostRecentScore.Round) {
                            // If the current round is greater than the last round added to the scoresArray
                            // Add a new entry with the current round and 1 point
                            scoresArray.push({
                                username: username,
                                points: 1,
                                Round: gameRound.getCurrentRound()
                            });
                        }
                    } else { // The answer is incorrect
                        if (gameRound.getCurrentRound() > mostRecentScore.Round) {
                            // If the current round is greater than the last round
                            // Add a new entry with the current round and 0 points
                            scoresArray.push({
                                username: username,
                                points: 0,
                                Round: gameRound.getCurrentRound()
                            });
                        }
                        // If the current round is equal to the last round, do nothing (points remain the same)
                    }
                } else {
                    // If no score entry exists for the current user, add a new one
                    scoresArray.push({
                        username: username,
                        points: selectedAnswer === question.correctAnswer ? 1 : 0,
                        Round: gameRound.getCurrentRound()
                    });
                }

                // Update the scores array in Firestore
                doc.ref.update({
                    [scoresToUpdate]: scoresArray
                }).then(() => {
                    console.log(`Score in ${scoresToUpdate.charAt(0).toUpperCase() + scoresToUpdate.slice(1)} incremented.`);
                }).catch((error) => {
                    console.error("Error updating score: ", error);
                });


/** 
// Initialize an empty object to store the scores for each player
let playerScores = {};

// Iterate over the scores array
scoresArray.forEach(score => {
    // If an entry for the current player does not exist in playerScores, create one
    if (!playerScores[score.username]) {
        playerScores[score.username] = {};
    }

    // If an entry for the current round does not exist for the current player in playerScores, create one with a value of 0
    if (!playerScores[score.username][score.Round]) {
        playerScores[score.username][score.Round] = 0;
    }

    // Add the points of the current score to the corresponding round for the current player in playerScores
    playerScores[score.username][score.Round] += score.points;
});

// Now let's display the scores on the screen

let scoresDiv = document.getElementById('scores');

// Clear the scores div
scoresDiv.innerHTML = '';

// Iterate over playerScores and create HTML for each player's scores
for (let username in playerScores) {
    let playerDiv = document.createElement('div');
    playerDiv.innerHTML = `<h2>${username}'s Scores:</h2>`;
    for (let round in playerScores[username]) {
        playerDiv.innerHTML += `<p>Round ${round}: ${playerScores[username][round]} points</p>`;
    }
    scoresDiv.appendChild(playerDiv);
}*/

    
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
