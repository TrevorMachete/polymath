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
    const chatContentP1 = document.getElementById('chatContentP1');
    //const chatContentP2 = document.getElementById('chatContentP2');


    // Fetch challenge messages for the current user
    db.collection('challenges').where('receiver', '==', username).onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const challengeData = doc.data();
            createMessageCard(challengeData, chatContentP1, 'challenge');
            //createMessageCard(challengeData, chatContentP2, 'challenge');
        });
    });

    // Fetch confirmation messages for the current user
    db.collection('confirmations').where('receiver', '==', username).onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const confirmationData = doc.data();
            createMessageCard(confirmationData, chatContentP1, 'confirmation');
            //createMessageCard(confirmationData, chatContentP2, 'confirmation');
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
        chatContentP1.innerHTML = '';
        //chatContentP2.innerHTML = '';
    
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
    

    acceptButton.addEventListener('click', async function() {
        // Hide the buttons and the message when the acceptButton is clicked
        denyButton.style.display = 'none';
        acceptButton.style.display = 'none';
        chatContentP1.innerHTML = '';
        //chatContentP2.innerHTML = '';
    
        // Get the current user's username
        const username = getCurrentUser();
    
        // Update the status of any challenge document where the current user's username matches the value of the receiver field
        const challengesSnapshot = await db.collection('challenges').where('receiver', '==', username).get();
        challengesSnapshot.forEach(async (doc) => {
            await db.collection('challenges').doc(doc.id).update({
                status: 'accepted'
            });
    
            // Send the notification 'Your challenge was accepted' to the Firebase confirmations collection
            db.collection('confirmations').add({
                sender: username,
                receiver: doc.data().sender,
                message: 'Your challenge was accepted'
            });
    
            // Fetch the avatars of the users
            let player1Avatar = "";
            let player2Avatar = "";
    
            const user1Snapshot = await db.collection('users').where('username', '==', username).get();
            user1Snapshot.forEach((doc) => {
                player1Avatar = doc.data().avatar;
            });
    
            const user2Snapshot = await db.collection('users').where('username', '==', doc.data().sender).get();
            user2Snapshot.forEach((doc) => {
                player2Avatar = doc.data().avatar;
            });
    
            // Create a new document in the ongoingChallenges collection
            const challengeId = username + ' vs ' + doc.data().sender;
            await db.collection('ongoingChallenges').doc(challengeId).set({
                player1: username,
                player2: doc.data().sender,
                player1Avatar: player1Avatar,
                player2Avatar: player2Avatar,
                questions: [],  // Add an empty questions array
                chats: [],  // Add an empty chats array
                currentRound: "", // Add an empty currentRound field
                playerOneScores: [],  // Add an empty scores array
                playerTwoScores: [],  // Add an empty scores array
                timestamp: firebase.firestore.FieldValue.serverTimestamp() || 'PENDING'  // Add the timestamp here
            });
    
            // After the ongoing challenge is created, update the available status of the users in the users collection to false
            const user1UpdateSnapshot = await db.collection('users').where('username', '==', username).get();
            user1UpdateSnapshot.forEach((doc) => {
                db.collection('users').doc(doc.id).update({
                    available: false
                });
            });
    
            const user2UpdateSnapshot = await db.collection('users').where('username', '==', doc.data().sender).get();
            user2UpdateSnapshot.forEach((doc) => {
                db.collection('users').doc(doc.id).update({
                    available: false
                });
    
                // Fetch the avatar and username of the sender
                const senderAvatar = doc.data().avatar;
                const senderUsername = doc.data().username;
    
                // Get the playerOneAvatar, playerOneName, playerTwoAvatar and playerTwoName elements
                const playerOneAvatar = document.getElementById('playerOneAvatar');
                const playerOneName = document.getElementById('playerOneName');
                const playerTwoAvatar = document.getElementById('playerTwoAvatar');
                const playerTwoName = document.getElementById('playerTwoName');
    
                // Set the src attribute of the playerOneAvatar and playerTwoAvatar elements to the avatars of the players
                playerOneAvatar.src = player1Avatar;
                playerTwoAvatar.src = senderAvatar;
    
                // Set the innerHTML of the playerOneName and playerTwoName elements to the usernames of the players
                playerOneName.innerHTML = username;
                playerTwoName.innerHTML = senderUsername;
            });
    
            // Clear the localStorage data related to currentRoundDisplay
            localStorage.removeItem('currentRound');
    
            // Set the currentRoundDisplay element in the UI to zero
            document.getElementById('currentRoundDisplay').innerText = 'Round 0';

        // Refresh the page
        location.reload();
        });
    });
    
    [playerOneRestartButton, playerTwoRestartButton].forEach(button => {
        button.addEventListener('click', async function() {
            // Get the current user's username
            const username = getCurrentUser();
            
    
            // Get the ongoing challenge where the current user's username matches the value of either the player1 field or the player2 field
            const challengesSnapshot = await db.collection('ongoingChallenges').where('player1', '==', username).get();
            challengesSnapshot.forEach(async (doc) => {
                // Clear all the fields and arrays in the challenge document
                await db.collection('ongoingChallenges').doc(doc.id).update({
                    player1: username,
                    player2: doc.data().player2,
                    questions: [],  // Clear the questions array
                    currentRound: "", // Clear the currentRound field
                    playerOneScores: [],  // Clear the scores array
                    playerTwoScores: [],  // Clear the scores array
                    timestamp: firebase.firestore.FieldValue.serverTimestamp() || 'PENDING'  // Update the timestamp
                });
            });
    
            const challengesSnapshot2 = await db.collection('ongoingChallenges').where('player2', '==', username).get();
            challengesSnapshot2.forEach(async (doc) => {
                // Clear all the fields and arrays in the challenge document
                await db.collection('ongoingChallenges').doc(doc.id).update({
                    player1: doc.data().player1,
                    player2: username,
                    questions: [],  // Clear the questions array
                    currentRound: "", // Clear the currentRound field
                    playerOneScores: [],  // Clear the scores array
                    playerTwoScores: [],  // Clear the scores array
                    timestamp: firebase.firestore.FieldValue.serverTimestamp() || 'PENDING'  // Update the timestamp
                });
            });
    
            // Clear the localStorage data related to currentRoundDisplay
            localStorage.removeItem('currentRound');
    
            // Set the currentRoundDisplay element in the UI to zero
            document.getElementById('currentRoundDisplay').innerText = 'Round 0';

                    // Refresh the page
        location.reload();
        });
    });
};
