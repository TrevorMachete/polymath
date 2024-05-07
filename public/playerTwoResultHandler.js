// Global variable to store the ID of the user who clicked the 'getQuestionsButton'
var lastUserToClick;

// Initialize Firestore
var db = firebase.firestore();

// Initialize an empty array to store playerTwoScores
let playerTwoScores = [];
console.log('Initialized playerTwoScores:', playerTwoScores);

// Initialize currentScore to 0
let playerTwoCurrentScore = 0;
console.log('Initialized currentScore:', playerTwoCurrentScore);

// Initialize lastScore to 0
let playerTwoLastScore = 0;
console.log('Initialized lastScore:', playerTwoLastScore);

function resetPlayerTwoScore() {
    var button = document.getElementById('getQuestionsButton');
    if (button) {
      button.addEventListener('click', function() {
        // Check if the current user is User One
        if (user.uid === playerOne.uid) {
          // Reset the playerTwoScores array
          playerTwoScores = [];
          console.log('User One reset playerTwoScores:', playerTwoScores);
          
          // Reset currentScore
          playerTwoCurrentScore = 0;
          console.log('User One reset playerTwoCurrentScore:', playerTwoCurrentScore);
          
          // Reset lastScore
          playerTwoLastScore = 0;
          console.log('User One reset playerTwoLastScore:', playerTwoLastScore);

          // Store the ID of the user who clicked the button
          lastUserToClick = user.uid;
        }
      });
    } 
}

// Function to display the current score for a round
function displayPlayerTwoCurrentScore() {
    let playerTwoCurrentScore = getPlayerTwoCurrentScoreForRound();
    console.log('Current score for round:', playerTwoCurrentScore);
    let playerTwoScoreHistory = document.getElementById('playerTwoScoreHistory');

    // Check if the current round is different from the last displayed round
    if (currentRound!== lastRoundDisplayed) {
        // Create a new paragraph element for the score
        let playerTwoScoreParagraph = document.createElement('p');
        playerTwoScoreParagraph.id = `round${currentRound}`;
        playerTwoScoreParagraph.innerText = `Round ${currentRound + 0}: ${playerTwoCurrentScore}`;
        // Append the score paragraph to the playerTwoScoreHistory element
        playerTwoScoreHistory.append(playerTwoScoreParagraph);
        // Update the last displayed round
        lastRoundDisplayed = currentRound;
        console.log('Displayed new score for round:', currentRound + 0, playerTwoCurrentScore);
    } else {
        // If the current round is the same as the last displayed round, update the score text
        let playerTwoScoreParagraph = document.getElementById(`round${currentRound}`);
        playerTwoScoreParagraph.innerText = `Round ${currentRound + 0}: ${playerTwoCurrentScore}`;
        console.log('Updated existing score for round:', currentRound + 0, playerTwoCurrentScore);
    }
}

// Function to handle the submission of an answer for a question
function handleAnswerSubmission(question, selectedAnswer, questionDiv) {
    // Check if the current user is User Two and the last user to click 'getQuestionsButton' was User One
    if (user.uid === playerTwo.uid && lastUserToClick === playerOne.uid) {
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
        displayPlayerTwoCurrentScore();
    }
}

// Function to get the current score for a round
function getPlayerTwoCurrentScoreForRound() {
    return playerTwoScores[currentRound] || 0;
}

// Function to update the score for a round based on whether the answer is correct
function updateScoreForRound(isCorrect) {
    if (isCorrect) {
        playerTwoCurrentScore += 1;
    }
    
    // Subtract the last score from the current score
    playerTwoCurrentScore = playerTwoCurrentScore - playerTwoLastScore;
    console.log('Updated currentScore:', playerTwoCurrentScore);

    // Update the score for the current round in the playerTwoScores array
    playerTwoScores[currentRound] = playerTwoCurrentScore;
    console.log('Updated playerTwoScores:', playerTwoScores);
    
}

// Function to get the current score for a round
function getPlayerTwoCurrentScoreForRound() {
    return playerTwoScores[currentRound] || 0;
}

// Function to start a new round
function startNewRound() {
    currentRound += 1;
    console.log('Starting new round:', currentRound);
    playerOneCurrentScore = 0;
    // Initialize the score for the current round in the playerOneScores array
    playerOneScores[currentRound] = playerOneCurrentScore;
}
