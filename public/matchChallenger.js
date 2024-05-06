document.addEventListener('DOMContentLoaded', function() {

// Get a reference to your Firebase database and auth
var db = firebase.firestore();
var auth = firebase.auth();

// Get a reference to your button and select output area
var button = document.getElementById('playerOneChallengerMatchButton');
var selectOutput = document.getElementById('selectOutput');

// Get a reference to your avatar and name output areas
var avatarOutput = document.getElementById('playerTwoAvatar');
var nameOutput = document.getElementById('playerTwoName');

// Check if there's saved data in localStorage
if (localStorage.getItem('avatar') && localStorage.getItem('username')) {
    avatarOutput.src = localStorage.getItem('avatar');
    nameOutput.textContent = localStorage.getItem('username');
}

// Variable to hold the unsubscribe function for the document listener
var unsubscribe;

// Add an event listener to your button
button.addEventListener('click', function() {
    // Clear the select output area
    while (selectOutput.firstChild) {
        selectOutput.removeChild(selectOutput.firstChild);
    }

    // Get the currently logged in users from Firebase
    db.collection('users').where('loggedIn', '==', true)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());

            // Create a new option for each user
            var userOption = document.createElement('option');
            userOption.textContent = doc.data().username;
            userOption.value = doc.id;

            // Add the new option to the select output area
            selectOutput.appendChild(userOption);
        });

        // Make the select output area scrollable
        selectOutput.style.overflow = 'auto';

        // Show the select output area
        selectOutput.style.display = 'block';
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
});

// Add an event listener to the select output area
selectOutput.addEventListener('change', function() {
    // Get the selected user's data from Firebase
    db.collection('users').doc(this.value)
    .get()
    .then((doc) => {
        if (doc.exists) {
            // Display the selected user's avatar and username
            avatarOutput.src = doc.data().avatar;
            nameOutput.textContent = doc.data().username;

            // Save the selected user's avatar and username in localStorage
            localStorage.setItem('avatar', doc.data().avatar);
            localStorage.setItem('username', doc.data().username);

            // Set up the document listener for User Two
            if (unsubscribe) {
                // Unsubscribe from the previous document listener
                unsubscribe();
            }
            unsubscribe = db.collection('users').doc(this.value)
            .onSnapshot(function(doc) {
                if (doc.data().loggedIn == false) {
                    // User Two has logged out
                    alert("User Two has logged out");

                    // Clear the avatar and name output areas
                    avatarOutput.src = '';
                    nameOutput.textContent = '';

                    // Remove the user's avatar and username from localStorage
                    localStorage.removeItem('avatar');
                    localStorage.removeItem('username');
                }
            });
        } else {
            console.log("No such document!");
        }
    })
    .catch((error) => {
        console.log("Error getting document:", error);
    });

    // Hide the select output area
    selectOutput.style.display = 'none';
});

// Add an event listener to the document
document.addEventListener('click', function(event) {
    // Check if the click was outside the selectOutput element
    if (!selectOutput.contains(event.target)) {
        // Hide the selectOutput element
        selectOutput.style.display = 'none';
    }
});

});