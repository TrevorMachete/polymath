// Initialize Firestore
var db = firebase.firestore();

function toggleLoginForm() {
    var loginForm = document.getElementById('loginForm');
    var loginButton = document.getElementById('playerOneLoginLogoutButton');
    var emailField = document.getElementById('email');
    var passwordField = document.getElementById('password');

    if (firebase.auth().currentUser) {
      // If the user is logged in, log them out
      firebase.auth().signOut()
        .then(() => {
          console.log('User signed out.');
          loginButton.innerText = 'Log in | Register';
          // Hide the form when logged out
          loginForm.style.display = 'none';

          // Reset the form fields
          emailField.value = '';
          passwordField.value = '';
        })
        .catch((error) => {
          console.error('Error signing out: ', error);
        });
    } else {
      // If the user is logged out, show the login form only when the button is clicked
      loginButton.innerText = 'Log in | Register'; // Reset the button text
      loginButton.onclick = function() {
        loginForm.style.display = 'block';
      }
    }
}

function login() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;

    // Check if email and password are not empty
    if (!email || !password) {
        alert('Please fill in both email and password.');
        return;
    }

    firebase.auth().signInWithEmailAndPassword(email, password)
     .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;
        document.getElementById('playerOneLoginLogoutButton').innerText = 'Log out';
        document.getElementById('loginForm').style.display = 'none';

        // Fetch the username from Firestore and display it
        db.collection('users').doc(user.uid).get()
          .then((doc) => {
            if (doc.exists) {
              document.getElementById('playerOneName').innerText = doc.data().username;
            }
          });

        // Update online state in Firestore
        db.collection('users').doc(user.uid).set({
          online: true
        });

        // Show a confirmation alert
        alert('You are successfully logged in!');
        console.log('User logged in.');
      })
     .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === 'auth/user-not-found') {
          alert('No account found with this email. Please create an account first.');
        } else {
          alert('Error: ' + errorMessage); // Display the error message to the user
        }
      });
}

function register() {
    var email = document.getElementById('email').value;
    var password = document.getElementById('password').value;
    var username = document.getElementById('username').value;

    // Check if email, password and username are not empty
    if (!email || !password || !username) {
        alert('Please fill in all fields.');
        return;
    }

    // Check if username is made up of at least two words
    if (username.trim().split(' ').length < 2) {
        alert('Username must be made up of at least two words.');
        return;
    }

    firebase.auth().createUserWithEmailAndPassword(email, password)
     .then((userCredential) => {
        // Signed in 
        var user = userCredential.user;

        // Update the user profile with the username
        user.updateProfile({
          displayName: username
        }).then(() => {
          // Update successful
          document.getElementById('playerOneLoginLogoutButton').innerText = 'Log out';
          document.getElementById('loginForm').style.display = 'none';
          document.getElementById('playerOneName').innerText = username; // Display the username

          // Update online state in Firestore
          db.collection('users').doc(user.uid).set({
            online: true,
            username: username // Store the username in Firestore
          });

          // Show a confirmation alert
          alert('You are successfully registered and logged in!');
        }).catch((error) => {
          // An error occurred
          console.error('Error updating profile: ', error);
        });
      })
     .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        alert('Error: ' + errorMessage); // Display the error message to the user
      });
}

// Listen for auth state changes
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // User is signed in, update the UI
    document.getElementById('playerOneLoginLogoutButton').innerText = 'Log out';
    document.getElementById('loginForm').style.display = 'none';

    // Update online state in Firestore
    db.collection('users').doc(user.uid).set({
      online: true
    });
  } else {
    // User is signed out, update the UI
    document.getElementById('playerOneLoginLogoutButton').innerText = 'Log in | Register';
    document.getElementById('loginForm').style.display = 'none';

    // If a user was signed in before, update their online state in Firestore
    if (firebase.auth().currentUser) {
      db.collection('users').doc(firebase.auth().currentUser.uid).set({
        online: false
      });
    }
  }
});