// Initialize Firestore
var db = firebase.firestore();

var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return false;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
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

  // Check if the button exists
  var button = document.getElementById('playerOneLoginLogoutButton');
  if (button) {
    button.addEventListener('click', function() {
      // The start method will wait until the DOM is loaded.
      ui.start('#firebaseui-auth-container', uiConfig);
    });
  } else {
    console.error('Element with ID "playerOneLoginLogoutButton" not found');
  }
});

// Define the toggleloader function
function toggleloader() {
  var loader = document.getElementById('loader');
  if (loader.style.display === 'none') {
    loader.style.display = 'block';
  } else {
    loader.style.display = 'none';
  }
}

