// Declare an async function
async function updatePlayerStatus(doc) {
    // Get player1 and player2 from the document
    const player1 = doc.data().player1;
    const player2 = doc.data().player2;

    // Update the available status in the users collection for both players
    const userSnapshot = await db.collection('users').get();
    userSnapshot.forEach((doc) => {
        if (doc.data().username === player1 || doc.data().username === player2) {
            db.collection('users').doc(doc.id).update({
                available: false
            });
        }
    });
}

// Listen for changes in the ongoingChallenges collection
db.collection('ongoingChallenges').onSnapshot((snapshot) => {
    snapshot.docChanges().forEach((change) => {
        if (change.type === "added" || change.type === "modified") {
            updatePlayerStatus(change.doc);
        }
    });
});


console.log('Player status updated');