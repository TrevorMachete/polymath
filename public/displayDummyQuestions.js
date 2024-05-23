document.addEventListener('DOMContentLoaded', function() {
    
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        console.log('User is signed in:', user.uid);
        let username = user.displayName; // Assuming displayName contains the username

        // Fetch and display scores for player1
        displayDummyP1(username);

        // Fetch and display scores for player2
        displayDummyP2(username);
    } else {
        console.log('No user is signed in.');
    }
});

function displayDummyP1(username) {
    // Query for challenges where the current user is player1
    let playerOneQuery = db.collection("ongoingChallenges").where("player1", "==", username);

    playerOneQuery.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

            function displayDummyQuestions() {
                let userId = firebase.auth().currentUser.uid;  // Get the current user's ID
                let username = firebase.auth().currentUser.displayName; // Get the current user's username
        
                // Get the ongoing challenges where the current user is either player1 or player2
                let player1Query = db.collection("ongoingChallenges").where("player1", "==", username);
                let player2Query = db.collection("ongoingChallenges").where("player2", "==", username);
        
                Promise.all([player1Query.get(), player2Query.get()]).then((querySnapshots) => {
                    querySnapshots.forEach((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // Listen for real-time updates to the document
                            doc.ref.onSnapshot((docSnapshot) => {
                                let questions = docSnapshot.data().questions || [];
        
                                // Clear the chat content
                                document.getElementById('dummyTextOutput').innerHTML = '';
        
                                // Display each question
                                questions.forEach(question => {
                                    let qDiv = document.createElement('div');
                                    let ansDiv = document.createElement('div');
                                    let pansDiv = document.createElement('div');

                                    //Style the answer element
                                    ansDiv.style.color = 'green';

                                    //Style the player's answer element
                                    pansDiv.style.color = 'blue';

                                    // Style the chat message based on who sent it
                                    if (!question.served) {
                                        qDiv.style.textAlign = 'right';
                                        qDiv.style.backgroundColor = 'red';
                                        qDiv.style.borderRadius = '5px';
                                        qDiv.style.width= '98%';
                                        qDiv.style.float = 'right';
                                        qDiv.style.marginBottom = '10px';
                                        qDiv.style.marginRight = '5px';
                                        qDiv.style.color = 'white';

                                    } else {
                                        qDiv.style.textAlign = 'left';
                                        qDiv.style.backgroundColor = 'white';
                                        qDiv.style.borderRadius = '5px';
                                        qDiv.style.width= '98%';
                                        qDiv.style.float = 'left';
                                        qDiv.style.marginBottom = '10px';
                                        qDiv.style.marginLeft= '5px';
                                    }

                                    let gridContainer = document.createElement('div');
                                    gridContainer.style.display = 'grid';
                                    gridContainer.style.gridTemplateColumns = '1fr 1fr';
                                    gridContainer.style.gridTemplateRows = 'auto';
                                    gridContainer.style.borderColor = 'orange';
                                    gridContainer.style.borderStyle = 'solid';
                                    gridContainer.style.borderSize = '1%';
                                    gridContainer.style.borderRadius = '5%';
                                    gridContainer.style.marginBottom = '10px';

                                    qDiv.innerHTML = `<p style="margin-left:5px; margin-right: 5px;text-align:center;"><strong>${question.question}</strong></p>`;
                                    qDiv.style.gridColumn = '1 / span 2';  // Make qDiv span both columns

                                    ansDiv.innerHTML = `<p style="margin-left:5px; margin-right: 5px;"><u>Correct Answer:</u> <br><br><strong>${question.correctAnswer}</strong></p>`;

                                    pansDiv.innerHTML = `<p style="margin-left:5px; margin-right: 5px;"><u>Player Answer:</u><br><br><strong> ${question.userAnswer || 'Not answered'}</strong></p>`;

                                    // Append the divs to the grid container
                                    gridContainer.appendChild(qDiv);
                                    gridContainer.appendChild(ansDiv);
                                    gridContainer.appendChild(pansDiv);

                                    // Insert the new question at the beginning of the 'dummyTextOutput' element
                                    let dummyTextOutput = document.getElementById('dummyTextOutput');
                                    dummyTextOutput.insertBefore(gridContainer, dummyTextOutput.firstChild);
                                });

                            });
                        });
                    });
                });
            }
        
            // Call the displayChats function to display the chats
            displayDummyQuestions();
        });
    }).catch((error) => {
        console.error("Error retrieving dummy questions for player1: ", error);
    });
}

function displayDummyP2(username) {
    // Query for challenges where the current user is player2
    let playerTwoQuery = db.collection("ongoingChallenges").where("player2", "==", username);

    playerTwoQuery.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            
            function displayDummyQuestions() {
                let userId = firebase.auth().currentUser.uid;  // Get the current user's ID
                let username = firebase.auth().currentUser.displayName; // Get the current user's username
        
                // Get the ongoing challenges where the current user is either player1 or player2
                let player1Query = db.collection("ongoingChallenges").where("player1", "==", username);
                let player2Query = db.collection("ongoingChallenges").where("player2", "==", username);
        
                Promise.all([player1Query.get(), player2Query.get()]).then((querySnapshots) => {
                    querySnapshots.forEach((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            // Listen for real-time updates to the document
                            doc.ref.onSnapshot((docSnapshot) => {
                                let questions = docSnapshot.data().questions || [];
        
                                // Clear the chat content
                                document.getElementById('dummyTextOutput').innerHTML = '';
        
                                // Display each question
                                questions.forEach(question => {
                                    let qDiv = document.createElement('div');
                                    let ansDiv = document.createElement('div');
                                    let pansDiv = document.createElement('div');

                                    //Style the answer element
                                    ansDiv.style.color = 'green';

                                    //Style the player's answer element
                                    pansDiv.style.color = 'blue';
        
                                    // Style the chat message based on who sent it
                                    if (!question.served) {
                                        qDiv.style.textAlign = 'right';
                                        qDiv.style.backgroundColor = 'red';
                                        qDiv.style.borderRadius = '5px';
                                        qDiv.style.width= '98%';
                                        qDiv.style.float = 'right';
                                        qDiv.style.marginBottom = '10px';
                                        qDiv.style.marginRight = '5px';
                                        qDiv.style.color = 'white';
        
                                    } else {
                                        qDiv.style.textAlign = 'left';
                                        qDiv.style.backgroundColor = 'white';
                                        qDiv.style.borderRadius = '5px';
                                        qDiv.style.width= '98%';
                                        qDiv.style.float = 'left';
                                        qDiv.style.marginBottom = '10px';
                                        qDiv.style.marginLeft= '5px';
                                    }

                                    let gridContainer = document.createElement('div');
                                    gridContainer.style.display = 'grid';
                                    gridContainer.style.gridTemplateColumns = '1fr 1fr';
                                    gridContainer.style.gridTemplateRows = 'auto';
                                    gridContainer.style.borderColor = 'orange';
                                    gridContainer.style.borderStyle = 'solid';
                                    gridContainer.style.borderSize = '1%';
                                    gridContainer.style.borderRadius = '5%';
                                    gridContainer.style.marginBottom = '10px';

                                    qDiv.innerHTML = `<p style="margin-left:5px; margin-right: 5px;text-align:center;"><strong>${question.question}</strong></p>`;
                                    qDiv.style.gridColumn = '1 / span 2';  // Make qDiv span both columns

                                    ansDiv.innerHTML = `<p style="margin-left:5px; margin-right: 5px;"><u>Correct Answer:</u> <br><br><strong>${question.correctAnswer}</strong></p>`;

                                    pansDiv.innerHTML = `<p style="margin-left:5px; margin-right: 5px;"><u>Player Answer:</u><br><br><strong> ${question.userAnswer || 'Not answered'}</strong></p>`;

                                    // Append the divs to the grid container
                                    gridContainer.appendChild(qDiv);
                                    gridContainer.appendChild(ansDiv);
                                    gridContainer.appendChild(pansDiv);

                                    // Insert the new question at the beginning of the 'dummyTextOutput' element
                                    let dummyTextOutput = document.getElementById('dummyTextOutput');
                                    dummyTextOutput.insertBefore(gridContainer, dummyTextOutput.firstChild);

                                });

                            });
                        });
                    });
                });
            }
        
            // Call the displayChats function to display the chats
            displayDummyQuestions();
        });
    }).catch((error) => {
        console.error("Error retrieving dummy questions for player2: ", error);
    });
}
});
