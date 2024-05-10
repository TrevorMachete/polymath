document.addEventListener('DOMContentLoaded', function() {

    var db = firebase.firestore();

    var user2 = 'dO1RP98lSLeIrpM13eiuFoNfBth1'

// Get the currently logged-in user's UID
var currentUser;
firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        currentUser = user.uid;
    } else {
        console.log('No user is signed in.');
    }
});

    const messagesDiv = document.getElementById('messages');
    const messageForm = document.getElementById('send-message');
    const messageText = document.getElementById('message-text');

    // Listen for form submit
    messageForm.addEventListener('submit', function(e) {
      e.preventDefault();

      // TODO: Replace with the IDs of the users involved in the chat
      const user1 = currentUser;
      const user2 = 'dO1RP98lSLeIrpM13eiuFoNfBth1';

      // Assuming the current user is user1 for demonstration
      sendMessage(user1, user2, messageText.value, user1);
      messageText.value = '';
      return false;
    });

    // Send a message
    function sendMessage(user1, user2, message, currentUser) {
      db.collection('messages').add({
        sentBy: user1,
        sentTo: user2,
        text: message,
        sentAt: firebase.firestore.FieldValue.serverTimestamp(),
        forCurrentUser: currentUser, // Add a field to indicate the message is for the current user
      });
    }

    // Retrieve messages
    db.collection('messages')
     .orderBy('sentAt')
     .onSnapshot((snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data();
            // Check if the message is intended for the current user
            if (data.sentTo === user2) {
              messagesDiv.innerHTML += `<p><strong>${data.sentBy}:</strong> ${data.text}</p>`;
            }
          }
        });
      });
});
