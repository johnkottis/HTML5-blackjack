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