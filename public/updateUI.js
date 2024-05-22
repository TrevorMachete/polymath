
function getCurrentUser() {
    const user = firebase.auth().currentUser;
    if (user) {
        return user.displayName; // Returns the username of the logged in user
    } else {
        return null;
    }
}

const db = firebase.firestore();

function getPlayerDetails(username) {
    db.collection("ongoingChallenges").get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            if (doc.data().player1 === username || doc.data().player2 === username) {
                let playerOneName = doc.data().player1;
                let playerOneAvatar = doc.data().player1Avatar;
                let playerTwoName = doc.data().player2;
                let playerTwoAvatar = doc.data().player2Avatar;

                // Display the values in the specific variables
                document.getElementById('playerOneName').textContent = playerOneName;
                document.getElementById('playerOneAvatar').src = playerOneAvatar;
                document.getElementById('playerTwoName').textContent = playerTwoName;
                document.getElementById('playerTwoAvatar').src = playerTwoAvatar;
            }
        });
    }).catch((error) => {
        console.log("Error getting documents: ", error);
    });
}
