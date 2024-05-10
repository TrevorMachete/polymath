document.addEventListener('DOMContentLoaded', function() {
    var db = firebase.firestore();
    var loggedInUserId;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            loggedInUserId = user.uid;
        } else {
            console.log('No user is signed in.');
        }
    });

    var selectOutput = document.getElementById('selectOutput');

    selectOutput.addEventListener('change', function() {
        var selectedUserId = selectOutput.options[selectOutput.selectedIndex].value;

        // Create a notification document in Firestore with the message and receiverId fields
        db.collection('notifications').doc(selectedUserId).set({
            message: "<div class='controlButtons'><button id='acceptButton'>Accept</button><button id='denyButton'>Deny</button></div><p>You have been challenged. Do you accept or deny the challenge?</p>",
            receiverId: selectedUserId // Add the receiverId field with the value of loggedInUserId
        })
    .then(() => {
            console.log("Notification document created with ID: ", selectedUserId);
        })
    .catch((error) => {
            console.error("Error creating notification document: ", error);
        });
    });

    // Listen for changes in the notifications collection
    db.collection('notifications').onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
            if (change.type === 'added') {
                // Get the document data
                var docData = change.doc.data();

                // Show the notification with the message
                var notification = document.getElementById('notification');
                notification.innerHTML = docData.message; // Set the HTML content of the notification
                notification.style.display = 'block';

                // Optionally, you can add event listeners to the buttons
                document.getElementById('acceptButton').addEventListener('click', function() {
                    // Handle accept action
                    console.log('Invitation accepted');
                    // You can hide the notification here if needed
                    notification.style.display = 'none';
                });

                document.getElementById('denyButton').addEventListener('click', function() {
                    // Handle deny action
                    console.log('Invitation denied');
                    // You can hide the notification here if needed
                    notification.style.display = 'none';
                });
            }
        });
    });
});

