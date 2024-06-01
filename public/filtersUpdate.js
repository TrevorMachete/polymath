firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
      // User is signed in, now it's safe to access user.uid
      console.log('User is signed in:', user.uid);
      let username = user.displayName; // Assuming displayName contains the username

      // Query to find the ongoing challenge document(s) where the current user is either player1 or player2
      let player1Query = db.collection("ongoingChallenges").where("player1", "==", username);
      let player2Query = db.collection("ongoingChallenges").where("player2", "==", username);

      // Function to update the filters fields in Firestore
      function updateFiltersInFirestore(newCategoriesValue, newDifficultyValue, newLimitValue, newGameRoundsValue) {
        // Combine both queries to cover both player1 and player2 cases
        Promise.all([player1Query.get(), player2Query.get()])
          .then(snapshots => {
            snapshots.forEach(snapshot => {
              snapshot.forEach(doc => {
                // Update the filters fields for the document
                doc.ref.update({ 
                  categories: newCategoriesValue,
                  difficulty: newDifficultyValue,
                  limit: newLimitValue,
                  gameRounds: newGameRoundsValue 
                });
              });
            });
          })
          .catch(error => {
            console.error("Error updating filters in Firestore: ", error);
          });
      }

      // Event listener for changes on the gameRounds HTML element
      let categories = document.getElementById('categories');
      let difficulty = document.getElementById('difficulty'); 
      let limit = document.getElementById('limit'); 
      let gameRounds = document.getElementById('gameRounds');

      categories.addEventListener('change', (event) => {
          const selectedCategories = event.target.value;
          updateFiltersInFirestore(selectedCategories, difficulty.value, limit.value, gameRounds.value);
      });

      difficulty.addEventListener('change', (event) => {
          const selectedDifficulty = event.target.value;
          updateFiltersInFirestore(categories.value, selectedDifficulty, limit.value, gameRounds.value);
      });

      limit.addEventListener('change', (event) => {
          const selectedLimit = event.target.value;
          updateFiltersInFirestore(categories.value, difficulty.value, selectedLimit, gameRounds.value);
      });

      gameRounds.addEventListener('change', (event) => {
        const selectedGameRounds = event.target.value;
        updateFiltersInFirestore(categories.value, difficulty.value, limit.value, selectedGameRounds);
      });

      // Listen for real-time updates
      db.collection("ongoingChallenges")
        .where("player1", "==", username)
        .onSnapshot(function(snapshot) {
          snapshot.docChanges().forEach(function(change) {
            if (change.type === "modified") {
              let data = change.doc.data();
              categories.value = data.categories;
              difficulty.value = data.difficulty;
              limit.value = data.limit;
              gameRounds.value = data.gameRounds;
            }
          });
        });

      db.collection("ongoingChallenges")
        .where("player2", "==", username)
        .onSnapshot(function(snapshot) {
          snapshot.docChanges().forEach(function(change) {
            if (change.type === "modified") {
              let data = change.doc.data();
              categories.value = data.categories;
              difficulty.value = data.difficulty;
              limit.value = data.limit;
              gameRounds.value = data.gameRounds;
            }
          });
        });

  } else {
      // No user is signed in, handle accordingly
      console.log('No user is signed in.');
  }
});
