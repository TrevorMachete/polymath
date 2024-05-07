document.addEventListener('DOMContentLoaded', function() {

    // Get a reference to your Firebase database
    var db = firebase.firestore();

    // Get a reference to your button and select output area
    var button = document.getElementById('playerOneChallengerMatchButton');
    var selectOutput = document.getElementById('selectOutput');
    var playerTwoName = document.getElementById('playerTwoName');
    var playerTwoAvatar = document.getElementById('playerTwoAvatar');

    // Load the saved user from localStorage
    var savedUser = JSON.parse(localStorage.getItem('selectedUser'));
    if (savedUser) {
        playerTwoName.textContent = savedUser.username;
        playerTwoAvatar.src = savedUser.avatar;

        // Listen for changes in the Firestore document of the saved user
        db.collection('users').doc(savedUser.id).onSnapshot((doc) => {
            if (doc.exists && doc.data().loggedIn === false) {
                alert(savedUser.username + ' has logged out.');
            }
        });
    }

    // Add an event listener to your button
    button.addEventListener('click', function() {
        // Clear the select output area
        selectOutput.innerHTML = '';

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

            // Show the select output area
            selectOutput.classList.add('visible');
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
    });

    // Add an event listener to the select output area
    selectOutput.addEventListener('change', function() {
        // Get the selected user's id
        var selectedUserId = selectOutput.options[selectOutput.selectedIndex].value;

        // Get the selected user's data from Firebase
        db.collection('users').doc(selectedUserId)
        .get()
        .then((doc) => {
            if (doc.exists) {
                // Update playerTwoName and playerTwoAvatar
                playerTwoName.textContent = doc.data().username;
                playerTwoAvatar.src = doc.data().avatar; // Assuming 'avatar' holds the URL of the user's avatar

                // Save the selected user to localStorage
                localStorage.setItem('selectedUser', JSON.stringify({
                    id: selectedUserId,
                    username: doc.data().username,
                    avatar: doc.data().avatar
                }));

                // Listen for changes in the Firestore document of the selected user
                db.collection('users').doc(selectedUserId).onSnapshot((doc) => {
                    if (doc.exists && doc.data().loggedIn === false) {
                        alert(doc.data().username + ' has logged out.');
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
        selectOutput.classList.remove('visible');
    });

    // Add an event listener to the document body
    document.body.addEventListener('click', function(event) {
        // If the click was not within the select output area, hide it
        if (event.target.id !== 'selectOutput') {
            selectOutput.classList.remove('visible');
        }
    });
});
