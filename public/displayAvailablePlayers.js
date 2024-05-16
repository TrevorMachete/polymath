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

function fetchAvailableUsers() {
    const db = firebase.firestore();
    const availablePlayersElement = document.getElementById('availablePlayers');

    db.collection('users').where('available', '==', true).get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const userData = doc.data();
            createUserCard(userData, availablePlayersElement);
        });
    }).catch((error) => {
        console.error("Error fetching documents: ", error);
    });
}

function createUserCard(userData, container) {
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = userData.avatar || 'default-avatar-url.png'; // Fallback avatar URL
    img.alt = userData.username;
    card.appendChild(img);

    const usernameText = document.createTextNode(userData.username);
    card.appendChild(usernameText);

    const button = document.createElement('button');
    button.textContent = 'Challenge';
    button.className = 'challengeButton';
    card.appendChild(button);

    // Add event listener to the button
    button.addEventListener('click', () => {
        const db = firebase.firestore();
        const sender = getCurrentUser(); // Function that returns the current user's username
        const receiver = userData.username;
        const status = 'pending';
        const message = `You have been challenged by ${sender}. Do you accept or deny?`;

        // Create a new document in the 'challenges' collection
        db.collection('challenges').add({
            sender,
            receiver,
            status,
            message
        }).then(() => {
            console.log('Challenge sent!');
        }).catch((error) => {
            console.error("Error sending challenge: ", error);
        });

        // Create a new document in the 'confirmations' collection
        const confirmationContent = "Your challengee has been notified.";
        const confirmationStatus = 'unseen'; // Set the initial status to 'unseen'

        db.collection('confirmations').add({
            receiver: sender, // The receiver of the confirmation is the sender of the challenge
            status: confirmationStatus,
            content: confirmationContent
        }).then(() => {
            console.log('Confirmation sent!');
        }).catch((error) => {
            console.error("Error sending confirmation: ", error);
        });
    });

    container.appendChild(card);
}

//Fetch ongoing challenges and display in the public challenges section
function fetchOngoingChallenges() {
    const db = firebase.firestore();
    const publicChallengesElement = document.getElementById('publicChallenges');

    db.collection('ongoingChallenges').get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const challengeData = doc.data();
            challengeData.id = doc.id; // Add the document ID to the challenge data
            createChallengeCard(challengeData, publicChallengesElement);
        });
    }).catch((error) => {
        console.error("Error fetching documents: ", error);
    });
}

function createChallengeCard(challengeData, container) {
    const card = document.createElement('div');
    card.className = 'card';

    const challengeNameText = document.createTextNode(challengeData.id); // Use the document ID as the challenge name
    card.appendChild(challengeNameText);

    container.appendChild(card);
}

document.addEventListener('DOMContentLoaded', () => {
    fetchAvailableUsers();
    fetchOngoingChallenges(); // Fetch ongoing challenges when the document is loaded
});
  