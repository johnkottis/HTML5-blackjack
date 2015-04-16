/* AUthor: John Kottis
*/

var BlackJack = ( function( window, undefined ) {
  'use strict';
  // this object is used to store private variables and methods across multiple instantiations
  var privates = {
    deck: [],
    points: {
      user: 0,
      dealer: 0
    },
    cards : {
      user:[],
      dealer:[]
    },
    deckOriginal : [
      "1-of-clubs","2-of-clubs","3-of-clubs","4-of-clubs","5-of-clubs",
      "6-of-clubs","7-of-clubs","8-of-clubs","9-of-clubs","ten-of-clubs",
      "jack-of-clubs","queen-of-clubs","king-of-clubs",
      "1-of-spades","2-of-spades","3-of-spades","4-of-spades","5-of-spades",
      "6-of-spades","7-of-spades","8-of-spades","9-of-spades","ten-of-spades",
      "jack-of-spades","queen-of-spades","king-of-spades",
      "1-of-hearts","2-of-hearts","3-of-hearts","4-of-hearts","5-of-hearts",
      "6-of-hearts","7-of-hearts","8-of-hearts","9-of-hearts","ten-of-hearts",
      "jack-of-hearts","queen-of-hearts","king-of-hearts",
      "1-of-diamonds","2-of-diamonds","3-of-diamonds","4-of-diamonds","5-of-diamonds",
      "6-of-diamonds","7-of-diamonds","8-of-diamonds","9-of-diamonds","ten-of-diamonds",
      "jack-of-diamonds","queen-of-diamonds","king-of-diamonds"
      ],
      activePlayer : ["user", "dealer"],
      activeGame : true,
      winner: null,
      selectedCard: null
  };

   function BlackJack() {

    this.currentlyPlaying = true;

    // SHUFFLE DECK
    this.shuffleDeck = function shuffleDeck(currentDeck) {
      for (var j, x, i = currentDeck.length; i; j = Math.floor(Math.random() * i), 
        x = currentDeck[--i], 
        currentDeck[i] = currentDeck[j], 
        currentDeck[j] = x);
      return currentDeck;
    };

    // DEFINE WINNER
    this.defineWinner = function defineWinner() {
      if (privates.points.user === 21) {
        privates.winner = true;
        this.notifyWinner();
      }
      else if (privates.points.user > 21) {
        privates.winner = false;
        this.notifyWinner();
      }
      else if ((privates.points.user < privates.points.dealer) && (privates.points.dealer < 22) ) {
        privates.winner = false;
      }
      else if (privates.points.dealer > 22) {
        privates.winner = true;
      }
      else if (privates.points.user == privates.points.dealer) {
        privates.winner = null;
      }
      privates.activeGame = false;
      this.currentlyPlaying = false;
      return privates.activeGame;
    };
    
    // PICK A CARD & ADD IT TO THE USER'S SET OF CARDS
    this.hitCard = function hitCard(userType) {
      if (privates.points[userType] < 21) {
        privates.deck.pop();
        privates.selectedCard = privates.deck[privates.deck.length - 1];
        privates.cards[userType].unshift(privates.selectedCard);
        this.countPoints("user");
        this.countPoints("dealer");
        this.defineWinner();
      }
    };

    // DROP HTML CARD
    this.dropCard = function dropCard(userType) {
      var tableSide = 'side-' + userType;
      var tableSideNode = document.getElementById(tableSide);
      var newCard = document.createElement("li");
      var cardClass = 'class' + privates.selectedCard;
      newCard.className = cardClass;
      tableSideNode.appendChild(newCard);
    };

    // NOTIFY WINNER
    this.notifyWinner = function notifyWinner() {
      var notificationArea = document.getElementById('side-winner');
      var newStatus = document.createElement("span");
      if (privates.winner === true) {
        var nodeStatus = document.createTextNode("User Won! Points: " + privates.points.user + ' VS ' + privates.points.dealer);
      }
      else {
        var nodeStatus = document.createTextNode("Dealer Won! Points: " + privates.points.user + ' VS ' + privates.points.dealer);
      }
      newStatus.appendChild(nodeStatus);
      notificationArea.appendChild(newStatus);
      document.getElementById('js-hit').style.display = "none";
      document.getElementById('js-stick').style.display = "none";
    };

    // CLEAR DOM
    this.clearDom = function clearDom() {
      // CLEAR HTML FROM PREVIOUS GAME RESULTS
      var resultsCards = document.getElementById("side-user");
      while (resultsCards.firstChild) {
          resultsCards.removeChild(resultsCards.firstChild);
      }
      var resultsCards = document.getElementById("side-dealer");
      while (resultsCards.firstChild) {
          resultsCards.removeChild(resultsCards.firstChild);
      }
      var resultsWinner = document.getElementById("side-winner");
      while (resultsCards.firstChild) {
          resultsCards.removeChild(resultsCards.firstChild);
      }
      document.getElementById('js-hit').style.display = "block";
      document.getElementById('js-stick').style.display = "block";
    };

    // COUNT POINTS
    this.countPoints = function countPoints(userType) {
      privates.points[userType] = 0;
      for (var i = 0; i < privates.cards[userType].length; i++) {
        (privates.cards[userType][i].charAt(1) == "-") ?
            ((privates.cards[userType][i].charAt(0) == "1") ? 
                  ((privates.points[userType] < 11) ? privates.points[userType] += 11 : privates.points[userType] += 1) :
            privates.points[userType] +=  parseInt(privates.cards[userType][i].charAt(0))) : 
        privates.points[userType] += 10;
      }

      return privates.points[userType];
    };

    // INITIALIZE TABLE's VARIABLES & CLEAR HTML RESULTS
    this.initializeTable = function initializeTable() {
      this.clearDom();
      privates.activeGame = true;
      privates.winner = null;
      privates.deck = this.shuffleDeck(privates.deckOriginal);
      privates.points = {
        user: 0,
        dealer: 0
      };
      privates.cards = {
        user:[],
        dealer:[]
      };
      this.hitCard("user");
      this.dropCard("user");
      this.hitCard("user");
      this.dropCard("user");
      this.hitCard("dealer");
      this.dropCard("dealer");
    };

    // USER STICKS AND WAITS FOR DEALER'S ACTIONS
    this.stickAction = function stickAction() {
      while (privates.points.user > privates.points.dealer) {
        this.hitCard("dealer");
        this.dropCard("dealer");
        this.countPoints("dealer");
      }
      this.defineWinner();
      this.notifyWinner();
      privates.activeGame = false;
      return privates.activeGame;
    };

  }

  return BlackJack;
  
} )( window );


// INITIALIZE GAME & BIND EVENTS
var BlackJackGame = new BlackJack();

document.getElementById("js-restart").addEventListener("click", function(event){
    BlackJackGame.initializeTable();
    BlackJackGame.countPoints("user");
});

document.getElementById("js-hit").addEventListener("click", function(event){
      BlackJackGame.hitCard("user");
      BlackJackGame.dropCard("user");      
    });

document.getElementById("js-stick").addEventListener("click", function(event){
    BlackJackGame.stickAction();
});
