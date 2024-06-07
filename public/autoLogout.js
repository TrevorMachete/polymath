let timerId;

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    const username = user.displayName; // replace with how you store username
    const userRef = firebase.firestore().collection('users').where('username', '==', username);

    // Start a timer when the page loads
    timerId = setTimeout(() => {
      userRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({ loggedIn: false }); // Set loggedIn to false in Firestore
          firebase.auth().signOut(); // Sign out the user
        });
      });
    }, 600000); // 10 minutes in milliseconds

    // Detect when the user closes the app or browser tab
    window.addEventListener("unload", function () {
      userRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          doc.ref.update({ loggedIn: false }); // Set loggedIn to false in Firestore
          firebase.auth().signOut(); // Sign out the user
        });
      });
    });

    // Detect when the user becomes inactive
    document.onmousemove = function () {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        userRef.get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            doc.ref.update({ loggedIn: false }); // Set loggedIn to false in Firestore
            firebase.auth().signOut(); // Sign out the user
          });
        });
      }, 600000); // 10 minutes in milliseconds
    };
  } else {
    // No user is signed in.
    console.log('No user is signed in');
  }
});
