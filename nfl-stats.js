
"use strict";

// Read the external JSON file
fetch("nfl-data.json")
    .then(function(response) {

        if (!response.ok) {
            throw new Error("Unable to load the JSON file.");
        }

        // Parse JSON into JavaScript objects
        return response.json();
    })

    .then(function(data) {

        // Display title and season from JSON
        document.getElementById("data-title").textContent =
            data.season + " " + data.title;

        const tableBody =
            document.getElementById("stats-body");

        // Loop through each player object
        data.players.forEach(function(player) {

            const row = document.createElement("tr");

            row.innerHTML =
                "<td>" + player.playerName + "</td>" +
                "<td>" + player.team + "</td>" +
                "<td>" + player.gamesPlayed + "</td>" +
                "<td>" + player.passingYards.toLocaleString() + "</td>" +
                "<td>" + player.passingTouchdowns + "</td>" +
                "<td>" + player.interceptions + "</td>";

            tableBody.appendChild(row);
        });
    })

    .catch(function(error) {

        console.error(error);

        document.getElementById("json-error").textContent =
            "The JSON data could not be loaded.";
    });
