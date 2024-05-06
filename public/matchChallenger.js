// Get a reference to your Firebase database
var db = firebase.firestore();

// Get a reference to your button and text output area
var button = document.getElementById('playerOneChallengerMatchButton');
var textOutput = document.getElementById('textOutput');

// Add an event listener to your button
button.addEventListener('click', function() {
    // Clear the text output area
    textOutput.innerHTML = '';

    // Get the currently logged in users from Firebase
    db.collection('users').where('loggedIn', '==', true)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());

            // Create a new div for each user
            var userDiv = document.createElement('div');
            userDiv.textContent = doc.data().username;

            // Add the new div to the text output area
            textOutput.appendChild(userDiv);
        });

        // Make the text output area scrollable
        textOutput.style.overflow = 'auto';
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
});
