
"use strict";

const dealButton = document.getElementById("dealButton");
const cardHand = document.getElementById("cardHand");
const discardPile = document.getElementById("discardPile");
const gameMessage = document.getElementById("gameMessage");

const suits = ["♠", "♥", "♦", "♣"];
const ranks = [
    "A", "2", "3", "4", "5", "6", "7",
    "8", "9", "10", "J", "Q", "K"
];

let deck = [];

// Create a standard 52-card deck
function createDeck() {
    deck = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            deck.push({
                id: suit + rank,
                suit: suit,
                rank: rank
            });
        }
    }
}

// Shuffle the cards
function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));

        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Create an SVG playing card image
function createCardImage(card) {
    const color =
        card.suit === "♥" || card.suit === "♦"
            ? "#c62828"
            : "#111111";

    const svg = `
    <svg xmlns="http://www.w3.org/2000/svg"
         width="120" height="170"
         viewBox="0 0 120 170">

        <rect x="2" y="2"
              width="116" height="166"
              rx="10"
              fill="white"
              stroke="#333"
              stroke-width="3"/>

        <g fill="${color}"
           font-family="Arial, sans-serif"
           text-anchor="middle">

            <text x="22" y="30"
                  font-size="23"
                  font-weight="bold">${card.rank}</text>

            <text x="22" y="52"
                  font-size="22">${card.suit}</text>

            <text x="60" y="105"
                  font-size="62">${card.suit}</text>

        </g>
    </svg>`;

    return "data:image/svg+xml;charset=utf-8," +
        encodeURIComponent(svg);
}

// Deal five unique cards
function dealCards() {
    createDeck();
    shuffleDeck();

    cardHand.innerHTML = "";
    discardPile.textContent = "Drop Cards Here";

    for (let i = 0; i < 5; i++) {
        const card = deck.pop();

        const image = document.createElement("img");

        image.src = createCardImage(card);
        image.alt = card.rank + " of " + suitName(card.suit);
        image.className = "playing-card";
        image.id = "card-" + i;
        image.draggable = true;

        // Triggered when dragging begins
        image.addEventListener("dragstart", function(event) {
            event.dataTransfer.setData("text/plain", image.id);
            event.dataTransfer.effectAllowed = "move";
        });

        cardHand.appendChild(image);
    }

    gameMessage.textContent =
        "Five cards dealt! Drag one to the discard pile.";
}

// Convert suit symbols into readable names
function suitName(suit) {
    const names = {
        "♠": "Spades",
        "♥": "Hearts",
        "♦": "Diamonds",
        "♣": "Clubs"
    };

    return names[suit];
}

// Allow cards to be dropped
discardPile.addEventListener("dragover", function(event) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    discardPile.classList.add("drag-over");
});

// Remove highlight when dragging away
discardPile.addEventListener("dragleave", function() {
    discardPile.classList.remove("drag-over");
});

// Handle a card being dropped
discardPile.addEventListener("drop", function(event) {
    event.preventDefault();

    discardPile.classList.remove("drag-over");

    const cardId = event.dataTransfer.getData("text/plain");
    const card = document.getElementById(cardId);

    if (card && card.parentElement === cardHand) {
        const cardName = card.alt;

        // Move the card into the discard pile
        discardPile.appendChild(card);

        // Prevent discarded cards from being dragged again
        card.draggable = false;

        // Confirm that the drop event happened
        gameMessage.textContent =
            "Success! You discarded the " + cardName + ".";

        if (cardHand.children.length === 0) {
            gameMessage.textContent =
                "All five cards discarded! Click Deal Cards to play again.";
        }
    }
});

// Deal button
dealButton.addEventListener("click", dealCards);
