// Initialize Firestore
var db = firebase.firestore();

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // If it's a new user, store the username and photo URL in Firestore
      if (authResult.additionalUserInfo.isNewUser) {
        db.collection('users').doc(authResult.user.uid).set({
          username: authResult.user.displayName,
          avatar: authResult.user.photoURL // Store the avatar URL
        }).then(function() {
          alert('Registration successful!');
          // Display the username
          document.getElementById('playerOneName').innerText = authResult.user.displayName;
          // Display the avatar
          document.getElementById('playerOneAvatar').src = authResult.user.photoURL || 'icons/avatar.jpeg';
        }).catch(function(error) {
          console.error('Error writing document: ', error);
        });
      } else {
        // If it's an existing user, retrieve the username and avatar from Firestore
        db.collection('users').doc(authResult.user.uid).get().then(function(doc) {
          if (doc.exists) {
            // Display the username
            document.getElementById('playerOneName').innerText = doc.data().username;
            // Display the avatar
            document.getElementById('playerOneAvatar').src = doc.data().avatar || 'icons/avatar.jpeg';
          } else {
            console.log('No such document!');
          }
        }).catch(function(error) {
          console.log('Error getting document:', error);
        });
      }
      // Change the button text to 'Log Out'
      document.getElementById('playerOneLoginLogoutButton').innerText = 'Log Out';
      alert('Login successful!');
      console.log('User logged in');
      return false;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      toggleLoader(); // Call the toggleLoader function here
    }
  },
  signInFlow: 'popup',
  signInOptions: [
    // List the providers you want to offer your users.
    firebase.auth.EmailAuthProvider.PROVIDER_ID,
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID
  ],
  // Terms of service url/callback.
  tosUrl: '<YOUR_TOS_URL>',
  // Privacy policy url/callback.
  privacyPolicyUrl: function() {
    window.location.assign('<YOUR_PRIVACY_POLICY_URL>');
  }
};

// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());

// Add an event listener to the DOMContentLoaded event
document.addEventListener('DOMContentLoaded', (event) => {
  // This block of code will be executed after the DOM is fully loaded

  // Set the avatar to the default avatar
  document.getElementById('playerOneAvatar').src = 'icons/avatar.jpeg';

  // Check if the button exists
  var button = document.getElementById('playerOneLoginLogoutButton');
  if (button) {
    button.addEventListener('click', function() {
      if (firebase.auth().currentUser) {
        // If a user is currently logged in, log them out
        firebase.auth().signOut().then(function() {
          // Change the button text back to 'Log in | Register'
          button.innerText = 'Log in | Register';
          // Clear the playerOneName element
          document.getElementById('playerOneName').innerText = '';
          // Set the avatar to the default avatar
          document.getElementById('playerOneAvatar').src = 'icons/avatar.jpeg';
          alert('Logout successful!');
          console.log('User logged out');
        }).catch(function(error) {
          console.error('Error signing out: ', error);
        });
      } else {
        // If no user is currently logged in, show the login interface
        ui.start('#firebaseui-auth-container', uiConfig);
      }
    });
  } else {
    console.error('Element with ID "playerOneLoginLogoutButton" not found');
  }
});

// Define the toggleLoader function
function toggleLoader() {
  var loader = document.getElementById('loader');
  if (loader) {
    if (loader.style.display === 'none') {
      loader.style.display = 'block';
    } else {
      loader.style.display = 'none';
    }
  } else {
    console.error('Element with ID "loader" not found');
  }
}