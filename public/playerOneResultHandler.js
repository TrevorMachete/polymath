// Initialize Firestore
var db = firebase.firestore();

// Initialize an empty array to store playerOneScores
let playerOneScores = [];
console.log('Initialized playerOneScores:', playerOneScores);

// Initialize currentScore to 0
let playerOneCurrentScore = 0;
console.log('Initialized currentScore:', playerOneCurrentScore);

// Initialize lastScore to 0
let playerOneLastScore = 0;
console.log('Initialized lastScore:', playerOneLastScore);

function resetPlayerOneScore() {
  
    var button = document.getElementById('getQuestionsButton');
    if (button) {
      button.addEventListener('click', function() {
        
        // Reset the playerOneScores array
        playerOneScores = [];
        console.log('Reset playerOneScores:', playerOneScores);
        
        // Reset currentScore
        playerOneCurrentScore = 0;
        console.log('Reset playerOneCurrentScore:', playerOneCurrentScore);
        
        // Reset lastScore
        playerOneLastScore = 0;
        console.log('Reset playerOneLastScore:', playerOneLastScore);
  
      });
    } 
    
  }

// Function to display the current score for a round
function displayPlayerOneCurrentScore() {
    
    let playerOneCurrentScore = getPlayerOneCurrentScoreForRound();
    console.log('Current score for round:', playerOneCurrentScore);
    let playerOneScoreHistory = document.getElementById('playerOneScoreHistory');

    // Check if the current round is different from the last displayed round
    if (currentRound!== lastRoundDisplayed) {
        // Create a new paragraph element for the score
        let playerOneScoreParagraph = document.createElement('p');
        playerOneScoreParagraph.id = `round${currentRound}`;
        playerOneScoreParagraph.innerText = `Round ${currentRound + 0}: ${playerOneCurrentScore}`;
        // Append the score paragraph to the playerOneScoreHistory element
        playerOneScoreHistory.append(playerOneScoreParagraph);
        // Update the last displayed round
        lastRoundDisplayed = currentRound;
        console.log('Displayed new score for round:', currentRound + 0, playerOneCurrentScore);
    } else {
        // If the current round is the same as the last displayed round, update the score text
        let playerOneScoreParagraph = document.getElementById(`round${currentRound}`);
        playerOneScoreParagraph.innerText = `Round ${currentRound + 0}: ${playerOneCurrentScore}`;
        console.log('Updated existing score for round:', currentRound + 0, playerOneCurrentScore);
    }
}

// Function to handle the submission of an answer for a question
function handleAnswerSubmission(question, selectedAnswer, questionDiv) {
    let isCorrect = selectedAnswer === question.correctAnswer;
    document.getElementById('textOutput').removeChild(questionDiv);

    // Get the value of limit from the HTML options element
let limit = document.getElementById('limit').value;

// Calculate the delay of result display in milliseconds
let delay = (5 * limit + 1) * 1000;
    
    setTimeout(function() {
        let resultDiv = document.createElement('div');
        resultDiv.innerHTML = `<p>The correct answer is: ${question.correctAnswer}</p>`;
        resultDiv.innerHTML += `<p>${isCorrect ? 'You\'re correct!' : 'You\'re incorrect.'}</p>`;
        document.getElementById('textOutput').appendChild(resultDiv);
        
    }, delay);

    // Update the score for the round based on whether the answer is correct
    updateScoreForRound(isCorrect);
    // Display the current score for the round
    displayPlayerOneCurrentScore();
}

// Function to get the current score for a round
function getPlayerOneCurrentScoreForRound() {
    return playerOneScores[currentRound] || 0;
}

// Function to update the score for a round based on whether the answer is correct
function updateScoreForRound(isCorrect) {
    if (isCorrect) {
        playerOneCurrentScore += 1;
    }
    
    // Subtract the last score from the current score
    playerOneCurrentScore = playerOneCurrentScore - playerOneLastScore;
    console.log('Updated currentScore:', playerOneCurrentScore);

        // Update the score for the current round in the playerOneScores array
        playerOneScores[currentRound] = playerOneCurrentScore;
        console.log('Updated playerOneScores:', playerOneScores);
    
}

// Function to get the current score for a round
function getPlayerOneCurrentScoreForRound() {
    return playerOneScores[currentRound] || 0;
}

// Function to start a new round
function startNewRound() {
    currentRound += 1;
    console.log('Starting new round:', currentRound);
    playerOneCurrentScore = 0;
    // Initialize the score for the current round in the playerOneScores array
    playerOneScores[currentRound] = playerOneCurrentScore;
}