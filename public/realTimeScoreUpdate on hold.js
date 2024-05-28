function displayPlayerOneScores(username) {
    // Query for challenges where the current user is player1
    let playerOneQuery = db.collection("ongoingChallenges").where("player1", "==", username);

    playerOneQuery.onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const playerOneUsername = data.player1;
            const playerTwoUsername = data.player2;
            const playerOneAvatar = data.player1Avatar;
            const playerTwoAvatar = data.player2Avatar;
            const playerOneScores = data.playerOneScores || [];
            const playerTwoScores = data.playerTwoScores || [];

            // Iterate over the scores for player1 and player2
            playerOneScores.forEach((score, index) => {
                if (score.username === username) {
                    // Create a new div for each score
                    let div = document.createElement("div");
                    div.textContent = "Round " + (index + 1) + ": " + score.points;

                    div.style.border = "1px solid white";
                    div.style.marginBottom= "5px";
                    div.style.backgroundColor = "white";
                    div.style.padding = "5px 5px 5px 5px";

                    document.getElementById("playerOneScore").appendChild(div);
                }
            });

            playerTwoScores.forEach((score, index) => {
                if (score.username === playerTwoUsername) {
                    // Create a new div for each score
                    let div = document.createElement("div");
                    div.textContent = "Round " + (index + 1) + ": " + score.points;

                    div.style.border = "1px solid white";
                    div.style.marginBottom= "5px";
                    div.style.backgroundColor = "white";
                    div.style.padding = "5px 5px 5px 5px";

                    document.getElementById("playerTwoScore").appendChild(div);
                }
            });

            // Display the avatars and names for player1 and player2
            document.getElementById("playerOneAvatar").src = playerOneAvatar;
            document.getElementById("playerTwoAvatar").src = playerTwoAvatar;
            document.getElementById("playerOneName").textContent = playerOneUsername;
            document.getElementById("playerTwoName").textContent = playerTwoUsername;
            document.getElementById("playerOneLabel").textContent = playerOneUsername;
            document.getElementById("playerTwoLabel").textContent = playerTwoUsername;
            
        });
    }, (error) => {
        console.error("Error retrieving scores for player1: ", error);
    });
}

function displayPlayerTwoScores(username) {
    // Query for challenges where the current user is player2
    let playerTwoQuery = db.collection("ongoingChallenges").where("player2", "==", username);

    playerTwoQuery.onSnapshot((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const playerOneUsername = data.player1;
            const playerTwoUsername = data.player2;
            const playerOneAvatar = data.player1Avatar;
            const playerTwoAvatar = data.player2Avatar;
            const playerOneScores = data.playerOneScores || [];
            const playerTwoScores = data.playerTwoScores || [];

            // Iterate over the scores for player1 and player2
            playerOneScores.forEach((score, index) => {
                if (score.username === playerOneUsername) {
                    // Create a new div for each score
                    let div = document.createElement("div");
                    div.textContent = "Round " + (index + 1) + ": " + score.points;

                    div.style.border = "1px solid white";
                    div.style.marginBottom= "5px";
                    div.style.backgroundColor = "white";
                    div.style.padding = "5px 5px 5px 5px";

                    document.getElementById("playerOneScore").appendChild(div);
                }
            });

            playerTwoScores.forEach((score, index) => {
                if (score.username === username) {
                    // Create a new div for each score
                    let div = document.createElement("div");
                    div.textContent = "Round " + (index + 1) + ": " + score.points;

                    div.style.border = "1px solid white";
                    div.style.marginBottom= "5px";
                    div.style.backgroundColor = "white";
                    div.style.padding = "5px 5px 5px 5px";

                    document.getElementById("playerTwoScore").appendChild(div);
                }
            });

            // Display the avatars and names for player1 and player2
            document.getElementById("playerOneAvatar").src = playerOneAvatar;
            document.getElementById("playerTwoAvatar").src = playerTwoAvatar;
            document.getElementById("playerOneName").textContent = playerOneUsername;
            document.getElementById("playerTwoName").textContent = playerTwoUsername;
            document.getElementById("playerOneLabel").textContent = playerOneUsername;
            document.getElementById("playerTwoLabel").textContent = playerTwoUsername;
            document.getElementById("currentRoundDisplay").textContent = Round;

        });
    }, (error) => {
        console.error("Error retrieving scores for player2: ", error);
    });
}
