
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
(function (firebase) {
  'use strict';

  function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

  var firebase__default = /*#__PURE__*/_interopDefaultLegacy(firebase);

  // Import Firebase modules using CommonJS syntax

  // Your Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCeqP_q6yA6SyjSpr4xU_AV_an87-5-09I",
    authDomain: "polymath-c90aa.firebaseapp.com",
    projectId: "polymath-c90aa",
    storageBucket: "polymath-c90aa.appspot.com",
    messagingSenderId: "216032188010",
    appId: "1:216032188010:web:ee66a2622a98d505715c13",
    measurementId: "G-8LRCS1H8K3"
  };

  // Initialize Firebase
  firebase__default["default"].initializeApp(firebaseConfig);

  // Get a reference to the Firebase auth service
  var auth = firebase__default["default"].auth();

  // Sign Up Users
  function signUp(email, password) {
    auth.createUserWithEmailAndPassword(email, password).then(function (userCredential) {
      // User signed up successfully
      var user = userCredential.user;
      console.log('User signed up:', user);

      // Redirect to index.html
      window.location.href = "/index.html";
    })["catch"](function (error) {
      // Error occurred during sign up
      console.error('Sign up error:', error);
    });
  }

  // Sign In Users
  function signIn(email, password) {
    auth.signInWithEmailAndPassword(email, password).then(function (userCredential) {
      // User signed in successfully
      var user = userCredential.user;
      console.log('User signed in:', user);

      // Redirect to index.html
      window.location.href = "/index.html";
    })["catch"](function (error) {
      // Error occurred during sign in
      console.error('Sign in error:', error);
    });
  }

  // Handle Authentication State
  auth.onAuthStateChanged(function (user) {
    if (user) {
      // User is signed in
      console.log('User is signed in:', user);
    } else {
      // User is signed out
      console.log('User is signed out');
    }
  });

  // Usage
  signUp('test@example.com', 'password123');
  signIn('test@example.com', 'password123');

})(firebase);
