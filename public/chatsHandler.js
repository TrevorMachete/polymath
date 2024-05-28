document.addEventListener('DOMContentLoaded', function() {

    // Function to convert timestamp to "time ago" format
    function timeAgo(date) {
        let seconds = Math.floor((new Date() - date) / 1000);

        let interval = seconds / 31536000;
        if (interval > 1) {
            return Math.floor(interval) + " years ago";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
            return Math.floor(interval) + " months ago";
        }
        interval = seconds / 86400;
        if (interval > 1) {
            return Math.floor(interval) + " days ago";
        }
        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + " hours ago";
        }
        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + " minutes ago";
        }
        return Math.floor(seconds) + " seconds ago";
    }

// Function to send chat messages and save them in Firebase
function sendChatMessage() {
    let userId = firebase.auth().currentUser.uid;  // Get the current user's ID
    let username = firebase.auth().currentUser.displayName; // Get the current user's username
    let chatInput = document.getElementById('chatInput'); // Get the chat input element
    let message = chatInput.value; // Get the text from the chat input  
    let timestamp = Date.now();       

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
                    message: message,
                    time: timestamp,
                    status: 'unread'
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

// Attach the sendChatMessage function to the 'Enter' keydown event of the chat input
chatInput.addEventListener('keydown', function(event) {
    // Number 13 is the "Enter" key on the keyboard
    if (event.keyCode === 13) {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the sendChatMessage function
        sendChatMessage();
    }
});

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in, call the function
        displayChats();
    } else {
        // No user is signed in
        console.log("No user is signed in.");
    }
});

function displayChats() {
    let userId = firebase.auth().currentUser.uid;  // Get the current user's ID
    let username = firebase.auth().currentUser.displayName; // Get the current user's username

    // Create an audio object
    let newChatAudio = new Audio('https://firebasestorage.googleapis.com/v0/b/polymathquest00.appspot.com/o/music%2FnewChat.mp3?alt=media&token=ca5a08f8-a438-4b5b-a714-16819a572f5b');

    // Get the ongoing challenges where the current user is either player1 or player2
    let player1Query = db.collection("ongoingChallenges").where("player1", "==", username);
    let player2Query = db.collection("ongoingChallenges").where("player2", "==", username);

    Promise.all([player1Query.get(), player2Query.get()]).then((querySnapshots) => {
        querySnapshots.forEach((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                // Listen for real-time updates to the document
                doc.ref.onSnapshot((docSnapshot) => {
                    let chats = docSnapshot.data().chats || [];
                    let allChats = [...chats]; // Create a copy of the chats array

                    // Filter chats to only include those that are unread
                    let unreadChats = chats.filter(chat => chat.status === "unread");

                    // Play a sound if there are new unread messages
                    if (unreadChats.length > 0) {
                        newChatAudio.play();

                    // Change the background color of the button to green
                        let chatButtonP1 = document.getElementById('chatButtonP1');
                        chatButtonP1.style.backgroundColor = 'orange';
                        
                        // Change the background color back after 30 seconds
                        setTimeout(function() {
                        chatButtonP1.style.backgroundColor = ''; // Reset to original color
                        }, 20000); // 20 seconds
                    }

    

                    // Clear the chat content
                    document.getElementById('chatContentP1').innerHTML = '';

                    // Display each chat message
                    allChats.forEach(chat => {
                        let chatDiv = document.createElement('div');
                        let date = new Date(chat.time);
                        let timeAgoString = timeAgo(date);

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
                            chatDiv.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
                            chatDiv.style.transition = 'transform 0.5s ease-out';
                            if (unreadChats.includes(chat)) {
                                chatDiv.style.transform = 'scale(0)';
                                window.setTimeout(function() {
                                    chatDiv.style.transform = 'scale(1)';
                                }, 100); // delay for the pop-in effect
                            }

                        } else {
                            chatDiv.style.textAlign = 'left';
                            chatDiv.style.backgroundColor = 'white';
                            chatDiv.style.borderRadius = '5px';
                            chatDiv.style.width= '90%';
                            chatDiv.style.float = 'left';
                            chatDiv.style.marginBottom = '10px';
                            chatDiv.style.marginLeft= '5px';
                            chatDiv.style.boxShadow = '2px 2px 4px rgba(0, 0, 0, 0.5)';
                            chatDiv.style.transition = 'transform 0.5s ease-out';
                            if (unreadChats.includes(chat)) {
                                chatDiv.style.transform = 'scale(0)';
                                window.setTimeout(function() {
                                    chatDiv.style.transform = 'scale(1)';
                                }, 100); // delay for the pop-in effect
                            }
                        }

                        chatDiv.innerHTML = `<p style="margin-left:5px; margin-right: 5px;"><strong>${chat.username}</strong> <span id="${chat.time}" style="font-size:14px; color:darkgrey;">${timeAgoString}</span> <br>${chat.message}</p>`;
                        document.getElementById('chatContentP1').appendChild(chatDiv);

                        // Update the chat status to "read" if it's unread
                        if (chat.status === "unread") {
                            window.setTimeout(function() {
                                chat.status = "read";
                                // Update the chats in Firestore
                                doc.ref.update({
                                    chats: chats
                                });
                            }, 1000); // delay for 1 second
                        }
                    });

                    // Scroll to the bottom
                    document.getElementById('chatContentP1').scrollTop = document.getElementById('chatContentP1').scrollHeight;

                    // Update the timeAgo result every minute
                    setInterval(function() {
                        allChats.forEach(chat => {
                            let date = new Date(chat.time);
                            let timeAgoString = timeAgo(date);
                            document.getElementById(chat.time).innerText = timeAgoString;
                        });
                    }, 60000); // update the 'ago' time in chats every minute
                });
            });
        });
    });
}


    // Call the displayChats function to display the chats
    displayChats();

});
