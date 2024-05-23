// Initialize Firebase
var db = firebase.firestore();

firebase.auth().onAuthStateChanged(function(user) {
    if (user) {
        // User is signed in.
        var avatar = user.photoURL || '../icons/avatar.jpeg';
        var username = user.displayName;

        document.getElementById('playerOneName').innerText = username;
        document.getElementById('playerOneAvatar').src = avatar;
        document.getElementById('playerOneLoginLogoutButton').innerText = 'Log Out';
        document.getElementById('playerTwoLoginLogoutButton').innerText = 'Log Out';

        // Set 'loggedIn' and 'available' fields to true in Firestore
        db.collection('users').doc(user.uid).update({
            loggedIn: true,
            available: true
        });
    } else {
        // User is signed out.
        document.getElementById('playerOneName').innerText = 'Not Logged In';
        document.getElementById('playerOneAvatar').src = '../icons/avatar.jpeg';
        document.getElementById('playerOneLoginLogoutButton').innerText = 'Log in | Register';
        document.getElementById('playerTwoLoginLogoutButton').innerText = 'Log in | Register';

    }
});

var uiConfig = {
    callbacks: {
        signInSuccessWithAuthResult: function(authResult, redirectUrl) {
            // User successfully signed in.
            if (authResult.additionalUserInfo.isNewUser) {
                // Check if displayName exists
                var username = authResult.user.displayName;
                if (!username) {
                    // Prompt the user to enter a username if displayName does not exist
                    username = prompt("Please enter a username:");
                }
                // Create a document for the new user
                db.collection('users').doc(authResult.user.uid).set({
                    username: username,
                    loggedIn: true,
                    available: true,
                    avatar: authResult.user.photoURL || '../icons/avatar.jpeg'
                }).then(function() {
                    alert('Registration successful!');
                    document.getElementById('playerOneName').innerText = username;
                    document.getElementById('playerOneAvatar').src = authResult.user.photoURL || '../icons/avatar.jpeg';
                }).catch(function(error) {
                    console.error('Error writing document: ', error);
                });
            } else {
                // Existing user logic here
                db.collection('users').doc(authResult.user.uid).update({
                    loggedIn: true,
                    available: true
                });
            }
            // Change the button text to 'Log Out'
            document.getElementById('playerOneLoginLogoutButton').innerText = 'Log Out';
            document.getElementById('playerTwoLoginLogoutButton').innerText = 'Log Out';
            alert('Login successful!');
            console.log('User logged in');
            return false;
            
        },
        uiShown: function() {
            // The widget is rendered.
            // Hide the loader.
            toggleLoader();
        }
    },
    signInFlow: 'popup',
    signInOptions: [
        firebase.auth.EmailAuthProvider.PROVIDER_ID,
        firebase.auth.GoogleAuthProvider.PROVIDER_ID,
        firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        firebase.auth.TwitterAuthProvider.PROVIDER_ID,
        firebase.auth.GithubAuthProvider.PROVIDER_ID
    ],
    tosUrl: '<YOUR_TOS_URL>',
    privacyPolicyUrl: function() {
        window.location.assign('<YOUR_PRIVACY_POLICY_URL>');
    }
};

var ui = new firebaseui.auth.AuthUI(firebase.auth());

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('playerOneAvatar').src = '../icons/avatar.jpeg';
    var button = document.getElementById('playerOneLoginLogoutButton');
    if (button) {
        button.addEventListener('click', function() {
            if (firebase.auth().currentUser) {
                var currentUserUid = firebase.auth().currentUser.uid; // Store uid before signing out
                firebase.auth().signOut().then(function() {
                    // Set 'loggedIn' and 'available' fields to false in Firestore
                    db.collection('users').doc(currentUserUid).update({
                        loggedIn: false,
                        available: false
                    }).then(function() {
                        button.innerText = 'Log in | Register';
                        document.getElementById('playerOneName').innerText = '';
                        document.getElementById('playerOneAvatar').src = '../icons/avatar.jpeg';
                        alert('Logout successful!');
                        console.log('User logged out');
                    }).catch(function(error) {
                        console.error('Error updating document: ', error);
                    });
                }).catch(function(error) {
                    console.error('Error signing out: ', error);
                });
            } else {
                ui.start('#firebaseui-auth-container', uiConfig);
            }
        });
    } else {
        console.error('Element with ID "playerOneLoginLogoutButton" not found');
    }
});

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('playerTwoAvatar').src = '../icons/avatar.jpeg';
    var button = document.getElementById('playerTwoLoginLogoutButton');
    if (button) {
        button.addEventListener('click', function() {
            if (firebase.auth().currentUser) {
                var currentUserUid = firebase.auth().currentUser.uid; // Store uid before signing out
                firebase.auth().signOut().then(function() {
                    // Set 'loggedIn' and 'available' fields to false in Firestore
                    db.collection('users').doc(currentUserUid).update({
                        loggedIn: false,
                        available: false
                    }).then(function() {
                        button.innerText = 'Log in | Register';
                        document.getElementById('playerTwoName').innerText = '';
                        document.getElementById('playerTwoAvatar').src = '../icons/avatar.jpeg';
                        alert('Logout successful!');
                        console.log('User logged out');
                    }).catch(function(error) {
                        console.error('Error updating document: ', error);
                    });
                }).catch(function(error) {
                    console.error('Error signing out: ', error);
                });
            } else {
                ui.start('#firebaseui-auth-container', uiConfig);
            }
        });
    } else {
        console.error('Element with ID "playerTwoLoginLogoutButton" not found');
    }
});

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
