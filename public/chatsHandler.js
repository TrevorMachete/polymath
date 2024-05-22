document.addEventListener('DOMContentLoaded', function() {

    // Function to send chat messages and save them in Firebase
    function sendChatMessage() {
        let userId = firebase.auth().currentUser.uid;  // Get the current user's ID
        let username = firebase.auth().currentUser.displayName; // Get the current user's username
        let chatInput = document.getElementById('chatInput'); // Get the chat input element
        let message = chatInput.value; // Get the text from the chat input

        // Get the ongoing challenges where the current user is either player1 or player2
        let player1Query = db.collection("ongoingChallenges").where("player1", "==", username);
        let player2Query = db.collection("ongoingChallenges").where("player2", "==", username);

        Promise.all([player1Query.get(), player2Query.get()]).then((querySnapshots) => {
            querySnapshots.forEach((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    let chats = doc.data().chats || [];

                    // Add the new message to the chats array
                    chats.push({
                        username: username,
                        message: message
                    });

                    // Update the chats array in Firestore
                    doc.ref.update({
                        chats: chats
                    })
                    .then(() => {
                        console.log("Chat message successfully written!");
                        chatInput.value = ''; // Clear the chat input
                    })
                    .catch((error) => {
                        console.error("Error writing chat message: ", error);
                    });
                });
            });
        });
    }

    // Attach the sendChatMessage function to the click event of the send button
    document.getElementById('sendButton').addEventListener('click', sendChatMessage);
    

    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in, call the function
            displayChats();
        } else {
            // No user is signed in
            console.log("No user is signed in.");
        }
    });
    

    // Function to retrieve and display chats
    function displayChats() {
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
                        let chats = docSnapshot.data().chats || [];

                        // Clear the chat content
                        document.getElementById('chatContentP1').innerHTML = '';

                        // Display each chat message
                        chats.forEach(chat => {
                            let chatDiv = document.createElement('div');

                            // Style the chat message based on who sent it
                            if (chat.username === username) {
                                chatDiv.style.textAlign = 'right';
                                chatDiv.style.backgroundColor = 'green';
                                chatDiv.style.borderRadius = '5px';
                                chatDiv.style.width= '90%';
                                chatDiv.style.float = 'right';
                                chatDiv.style.marginBottom = '10px';
                                chatDiv.style.marginRight = '5px';
                                chatDiv.style.color = 'white';

                            } else {
                                chatDiv.style.textAlign = 'left';
                                chatDiv.style.backgroundColor = 'white';
                                chatDiv.style.borderRadius = '5px';
                                chatDiv.style.width= '90%';
                                chatDiv.style.float = 'left';
                                chatDiv.style.marginBottom = '10px';
                                chatDiv.style.marginLeft= '5px';
                            }

                            chatDiv.innerHTML = `<p style="margin-left:5px; margin-right: 5px;"><strong>${chat.username}:</strong> ${chat.message}</p>`;
                            document.getElementById('chatContentP1').appendChild(chatDiv);
                        });


                        // Scroll to the bottom
                        document.getElementById('chatContentP1').scrollTop = document.getElementById('chatContentP1').scrollHeight;
                        
                    });
                });
            });
        });
    }

    // Call the displayChats function to display the chats
    displayChats();

});
