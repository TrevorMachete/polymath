document.addEventListener('DOMContentLoaded', function() {

// Get the refreshButton element
const refreshButton = document.getElementById('refreshButton');

// Add an event listener to the refreshButton
refreshButton.addEventListener('click', function() {
    // Refresh the page
    location.reload();
    });
});
