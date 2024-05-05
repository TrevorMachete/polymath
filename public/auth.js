        // Initialize Firebase
        var db = firebase.firestore();

        var uiConfig = {
            callbacks: {
                signInSuccessWithAuthResult: function(authResult, redirectUrl) {
                    // User successfully signed in.
                    if (authResult.additionalUserInfo.isNewUser) {
                        // Create a "questions" collection for the new user
                        db.collection('users').doc(authResult.user.uid).collection('questions').add({
                            question: "Welcome to our app!",
                            correctAnswer: "Correct!",
                            userAnswer: "Correct!"
                        }).then(function() {
                            alert('Registration successful!');
                            document.getElementById('playerOneName').innerText = authResult.user.displayName;
                            document.getElementById('playerOneAvatar').src = authResult.user.photoURL || 'icons/avatar.jpeg';
                        }).catch(function(error) {
                            console.error('Error writing document: ', error);
                        });
                    } else {
                        // Existing user logic here
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
            document.getElementById('playerOneAvatar').src = 'icons/avatar.jpeg';
            var button = document.getElementById('playerOneLoginLogoutButton');
            if (button) {
                button.addEventListener('click', function() {
                    if (firebase.auth().currentUser) {
                        firebase.auth().signOut().then(function() {
                            button.innerText = 'Log in | Register';
                            document.getElementById('playerOneName').innerText = '';
                            document.getElementById('playerOneAvatar').src = 'icons/avatar.jpeg';
                            alert('Logout successful!');
                            console.log('User logged out');
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
 