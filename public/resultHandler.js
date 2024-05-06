// Initialize an empty array to store scores
let scores = [];
console.log('Initialized scores:', scores);

// Initialize currentScore to 0
let currentScore = 0;
console.log('Initialized currentScore:', currentScore);

// Initialize lastScore to 0
let lastScore = 0;
console.log('Initialized lastScore:', lastScore);

// Initialize lastRoundDisplayed to 0
let lastRoundDisplayed = 0;
console.log('Initialized lastRoundDisplayed:', lastRoundDisplayed);

// Function to clarify the last score based on the scores array
//function clarifyScore() {
  //  if (currentRound !== lastRoundDisplayed) {lastScore = scores.length > 0? scores[scores.length - 1] : 0;
    //console.log('Clarified lastScore:', lastScore);
    //return;
    //}
//}

function resetScore() {
  
    var button = document.getElementById('getQuestionsButton');
    if (button) {
      button.addEventListener('click', function() {
        
                // Reset the scores array
                scores = [];
                console.log('Reset scores:', scores);
        
                // Reset currentScore
                currentScore = 0;
                console.log('Reset currentScore:', currentScore);
        
                // Reset lastScore
                lastScore = 0;
                console.log('Reset lastScore:', lastScore);
  
      });
    } 
    
  }

// Function to display the current score for a round
function displayCurrentScore() {

    
    let currentScore = getCurrentScoreForRound();
    console.log('Current score for round:', currentScore);
    let scoreHistory = document.getElementById('scoreHistory');

    // Check if the current round is different from the last displayed round
    if (currentRound!== lastRoundDisplayed) {
        // Create a new paragraph element for the score
        let scoreParagraph = document.createElement('p');
        scoreParagraph.id = `round${currentRound}`;
        scoreParagraph.innerText = `Round ${currentRound + 0}: ${currentScore}`;
        // Append the score paragraph to the scoreHistory element
        scoreHistory.append(scoreParagraph);
        // Update the last displayed round
        lastRoundDisplayed = currentRound;
        console.log('Displayed new score for round:', currentRound + 0, currentScore);
    } else {
        // If the current round is the same as the last displayed round, update the score text
        let scoreParagraph = document.getElementById(`round${currentRound}`);
        scoreParagraph.innerText = `Round ${currentRound + 0}: ${currentScore}`;
        console.log('Updated existing score for round:', currentRound + 0, currentScore);
    }
}


// Function to handle the submission of an answer for a question
function handleAnswerSubmission(question, selectedAnswer, questionDiv) {
    let isCorrect = selectedAnswer === question.correctAnswer;
    
    let resultDiv = document.createElement('div');
    resultDiv.innerHTML = `<p>The correct answer is: ${question.correctAnswer}</p>`;
    resultDiv.innerHTML += `<p>${isCorrect? 'Correct!' : 'Incorrect.'}</p>`;
    document.getElementById('textOutput').appendChild(resultDiv);
    document.getElementById('textOutput').removeChild(questionDiv);

    // Update the score for the round based on whether the answer is correct
    updateScoreForRound(isCorrect);
    // Display the current score for the round
    displayCurrentScore();
}

// Function to get the current score for a round
function getCurrentScoreForRound() {
    return scores[currentRound] || 0;
}


// Function to update the score for a round based on whether the answer is correct
function updateScoreForRound(isCorrect) {
    if (isCorrect) {
        currentScore += 1;
    }

    // Only run clarifyScore() when the conditions in clarifyScore hold
    //if (currentRound !== lastRoundDisplayed && currentRound !== 0) {
      //  clarifyScore();
        //return;
    //}
    
    // Subtract the last score from the current score
    currentScore = currentScore - lastScore;
    console.log('Updated currentScore:', currentScore);

        // Update the score for the current round in the scores array
        scores[currentRound] = currentScore;
        console.log('Updated scores:', scores);
    

}


// Function to get the current score for a round
function getCurrentScoreForRound() {
    return scores[currentRound] || 0;
}



// Function to start a new round
function startNewRound() {
    currentRound += 1;
    console.log('Starting new round:', currentRound);
    currentScore = 0;
    // Initialize the score for the current round in the scores array
    scores[currentRound] = currentScore;
}

