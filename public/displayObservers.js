 // Reference to your Firestore database
  var db = firebase.firestore();
  
  // Reference to the 'users' collection in your database
  var usersRef = db.collection('users');
  
  // Listen for changes in the 'users' collection
  usersRef.onSnapshot(function(snapshot) {
    var observersElement = document.getElementById('observers');
    observersElement.innerHTML = ''; // Clear the observers element
    observersElement.style.display = 'flex'; // Use flexbox for horizontal alignment
    observersElement.style.overflowX = 'hidden'; // Hide the scrollbar
  
    snapshot.forEach(function(doc) {
      var user = doc.data();
  
      // Check if the user is logged in
      if(user.loggedIn === true) {
        // Create two new div elements for each user
        var userElement1 = createUserElement(user);
        var userElement2 = createUserElement(user);
  
        // Add the user elements to the observers element
        observersElement.appendChild(userElement1);
        observersElement.appendChild(userElement2);
      }
    });
  });
  
  // Function to create a user element
  function createUserElement(user) {
    var userElement = document.createElement('div');
    userElement.style.animation = 'marquee 5s linear infinite';
    userElement.style.display = 'flex'; // Use flexbox for vertical alignment
    userElement.style.alignItems = 'center'; // Vertically align items in the center
    userElement.style.padding = '0 10px'; // Add some padding between users
  
    // Add the user's avatar to the div
    var avatar = document.createElement('img');
    avatar.src = user.avatar;
    avatar.style.height = '50px'; 
    avatar.style.borderRadius = '50%'; // Adjust as needed
    userElement.appendChild(avatar);
  
    // Add a tab space
    var tabSpace = document.createTextNode('\t');
    userElement.appendChild(tabSpace);
  
    // Add the user's username to the div
    var username = document.createTextNode(user.username);
    userElement.appendChild(username);
  
    return userElement;
  }
  