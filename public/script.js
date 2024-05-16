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


function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}



// Function to display questions and handle answer submission
function displayQuestions(data) {
    document.getElementById('textOutput').innerHTML = '';
    if (Array.isArray(data)) {
        data.forEach(question => {
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
        });
    } else {
        console.error('Unexpected API response:', data);
    }
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

    // If there is a stored auth state, set the auth state
    if (storedAuthState) {
        firebase.auth().signInWithCredential(firebase.auth.AuthCredential.fromJSON(storedAuthState));
    }