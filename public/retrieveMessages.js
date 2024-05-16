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

function fetchMessagesForCurrentUser() {
    const db = firebase.firestore();
    const username = getCurrentUser();
    const chatBoxP1 = document.getElementById('chatBoxP1');
    const chatBoxP2 = document.getElementById('chatBoxP2');


    // Fetch challenge messages for the current user
    db.collection('challenges').where('receiver', '==', username).onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const challengeData = doc.data();
            createMessageCard(challengeData, chatBoxP1, 'challenge');
            createMessageCard(challengeData, chatBoxP2, 'challenge');
        });
    });

    // Fetch confirmation messages for the current user
    db.collection('confirmations').where('receiver', '==', username).onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const confirmationData = doc.data();
            createMessageCard(confirmationData, chatBoxP1, 'confirmation');
            createMessageCard(confirmationData, chatBoxP2, 'confirmation');
        });
    });
}

function createMessageCard(messageData, container, messageType) {
    const card = document.createElement('div');
    card.className = 'message-card';

    const messageText = document.createElement('p');
    messageText.textContent = messageData.message;
    card.appendChild(messageText);

    container.appendChild(card);

    // If the message is a challenge, show the challenge buttons
    if (messageType === 'challenge') {
        denyButton.style.display = 'block';
        acceptButton.style.display = 'block';
    }
}

window.onload = function() {
    // Get the denyButton and acceptButton elements
    var denyButton = document.getElementById('denyButton');
    var acceptButton = document.getElementById('acceptButton');
    denyButton.addEventListener('click', function() {
        // Hide the buttons and the message when the denyButton is clicked
        denyButton.style.display = 'none';
        acceptButton.style.display = 'none';
        chatBoxP1.innerHTML = '';
        chatBoxP2.innerHTML = '';
    
        // Get the current user's username
        const username = getCurrentUser();
    
        // Update the status of any challenge document where the current user's username matches the value of the receiver field
        db.collection('challenges').where('receiver', '==', username).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection('challenges').doc(doc.id).update({
                    status: 'denied'
                });
    
                // Send the notification 'Your challenge was denied' to the Firebase confirmations collection
                db.collection('confirmations').add({
                    sender: username,
                    receiver: doc.data().sender,
                    message: 'Your challenge was denied'
                });
            });
        });
    });
    

    acceptButton.addEventListener('click', function() {
        // Hide the buttons and the message when the acceptButton is clicked
        denyButton.style.display = 'none';
        acceptButton.style.display = 'none';
        chatBoxP1.innerHTML = '';
        chatBoxP2.innerHTML = '';
    
        // Get the current user's username
        const username = getCurrentUser();
    
        // Update the status of any challenge document where the current user's username matches the value of the receiver field
        db.collection('challenges').where('receiver', '==', username).get().then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                db.collection('challenges').doc(doc.id).update({
                    status: 'accepted'
                });
    
                // Send the notification 'Your challenge was accepted' to the Firebase confirmations collection
                db.collection('confirmations').add({
                    sender: username,
                    receiver: doc.data().sender,
                    message: 'Your challenge was accepted'
                });
    
                // Create a new document in the ongoingChallenges collection
                const challengeId = username + ' vs ' + doc.data().sender;
                db.collection('ongoingChallenges').doc(challengeId).set({
                    player1: username,
                    player2: doc.data().sender
                }).then(() => {
                    // After the ongoing challenge is created, update the available status of the users in the users collection to false
                    db.collection('users').where('username', '==', username).get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            db.collection('users').doc(doc.id).update({
                                available: false
                            });
                        });
                    });
                    db.collection('users').where('username', '==', doc.data().sender).get().then((querySnapshot) => {
                        querySnapshot.forEach((doc) => {
                            db.collection('users').doc(doc.id).update({
                                available: false
                            });
    
                            // Fetch the avatar and username of the sender
                            const senderAvatar = doc.data().avatar;
                            const senderUsername = doc.data().username;
    
                            // Get the playerTwoAvatar and playerTwoName elements
                            const playerTwoAvatar = document.getElementById('playerTwoAvatar');
                            const playerTwoName = document.getElementById('playerTwoName');
    
                            // Set the src attribute of the playerTwoAvatar element to the avatar of the sender
                            playerTwoAvatar.src = senderAvatar;
    
                            // Set the innerHTML of the playerTwoName element to the username of the sender
                            playerTwoName.innerHTML = senderUsername;
                        });
                    });
                });
            });
        });
    });
   



};


