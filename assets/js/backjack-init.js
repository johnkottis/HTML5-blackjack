document.getElementById("js-restart").addEventListener("click", function(event){
    BlackJackGame.Core.initializeTable();
    BlackJackGame.Core.countPoints("user");
});

document.getElementById("js-hit").addEventListener("click", function(event){
      BlackJackGame.Core.hitCard("user");
      BlackJackGame.Core.dropCard("user");      
    });

document.getElementById("js-stick").addEventListener("click", function(event){
    BlackJackGame.Core.stickAction();
});