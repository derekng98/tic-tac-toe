// Global Variables
var origBoard;
const huPlayer = "X";
const aiPlayer = "O";
// array of winning combos on the board
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [6, 4, 2]
];

const cells = document.querySelectorAll(".cell");
startGame();

function startGame() {
  document.querySelector(".endgame").style.display = "none";
  origBoard = Array.from(Array(9).keys());
  for (var i = 0; i < cells.length; i++) {
    //when click replay will iterate over array above i.e. all cells and remove inner txt i.e. the xs and os and remove background color as the winning  // combo of each game will become highlighted at the end of a game
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    //add an event listener on the click event in which anytime human or ai clicks a square it will call the turnClick function. this will also occur on //clicking replay
    cells[i].addEventListener("click", turnClick, false);
  }
}

// create function which will signal new turn/action from human player. this is triggered by either AI or human move. this function turnClick will
// have the click event past in called square ie. the sqr that was clicked on.
function turnClick(square) {
  // make it so that if a spot is clicked already then disable it from being clicked again. since origBoard array gets filled by a # 0 to 9 but as a turn takes place/click happens on that square then the # gets replaced with either an x or an O. therefore if id is number it means that noone has played in that spot
  if (typeof origBoard[square.target.id] == "number") {
    // when id is clicked it calls the turn function that is huPlayer turn to pick square
    turn(square.target.id, huPlayer);
    // after huPlayer's turn is aiPlayer's turn. before ai plays, check if game is a tie ie every square is played and noone is declared winner. if game is not a tie then ai will take a turn
    if (!checkTie()) turn(bestSpot(), aiPlayer);
  }
}
function turn(squareId, player) {
  origBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  // after each turn check if game won. check win checks the board and the player that just made a turn to determine who is winner if is one
  let gameWon = checkWin(origBoard, player);
  if (gameWon) gameOver(gameWon);
}
//define checkwin function which will receive the board -note not just origboard can be passed in, newBoard can too. hence parameter is board. and second parameter is the player
function checkWin(board, player) {
  //below checks which squares in board have already been played in. reduce method will go
  // through every element in array and give one single value
  // ternary operator: if the e i.e. element equals the player will concat/add i i.e. the index  of array to the a i.e. accumulator array. if e
  // doesnt equal player than is spot not played in
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  // then check if game has been won with for loop iterating through all win combos
  // index in for loop is the square clicked on and win combo is its corresponding possible win combo. e.g. if clicked index 0 the win combo is 0,1,2
  for (let [index, win] of winCombos.entries()) {
    // check if every index in the win combo has been clicked i.e. greater than -1. recall
    // plays defined above is every square player has played and indexof refers to elements of
    // wincombo i.e. so the below if statement checks if the player played in every spot that counts as a win checks every win combo in the win combo
    // array if it matches in the plays variable
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      // if player has clicked on a winning combo then game has won. set game Won to equal index that index wincombo player won at and player to player that won
      gameWon = { index: index, player: player };
      //break from the function
      break;
    }
  }
  // if someone wins then gameWon is true and will return the gameOver function //otherwise gameWon is false and will be null
  return gameWon;
}
// gameOver function. the gameWon var is passed in as defined above index:index, player:player
function gameOver(gameWon) {
  // if gameWon then will initialize the gameover function that will highlight squares that //made win and disable board to be played on any more
  for (let index of winCombos[gameWon.index]) {
    // for the gameWon index ie the combo of winning plays player made highlight those squares if //human player made them highlight blue otherwise highlight  red
    document.getElementById(index).style.backgroundColor =
      gameWon.player == huPlayer ? "blue" : "red";
  }
  for (var i = 0; i < cells.length; i++) {
    //disable board iterate through every cell so that cannot click on cells any longer
    cells[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(gameWon.player == huPlayer ? "You win!" : "You lose.");
}

function declareWinner(who) {
  //changes endgame class display from none to who is the winner
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
  //filter every element in origBoard to see if the element typeof equals a number if it is a number will return that
  return origBoard.filter(s => typeof s == "number");
}

function bestSpot() {
  // is the spot that was determined to be best by minimax function (the spot that gives best score to ai)
  return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
  // if emptysquares equals 0 means every square is filled and noone has won that means its a tie.
  if (emptySquares().length == 0) {
    // if true will iterate through each cell turn them green and remove event listener so that board is disabled
    for (var i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "green";
      cells[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

// minimax function  uses recursion, it checks all avail spots then evaluates each one by making seperate function calls within the function itself, each function call checks each avail move to see that if the ai would make that move in that spot i.e. the ai player played in that spot what would be the set of next possible moves that could follow. It checks each scenerio and keeps tab of score -10 or +10 that would result from each possible move the ai can make. wants best score as ai i.e. scenerio with +10. the function goes through each scenerio finds the best one and plays that move. thus making the ai undefeatble because on each play it evaluates all possible next moves from that initial move until it reaches a terminal state and will always choose the move that leads to a terminal state in its favor by making moves that create highest score for itself and lowest for the human player
function minimax(newBoard, player) {
  var availSpots = emptySquares(newBoard);
  if (checkWin(newBoard, huPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, huPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

//start game
/*
$(document).ready(function() { 
  $("#x").add("#o").on("click", function() {
    $("#iconSelect").hide(1000);
});
});

  $("#start").on("click", function() {
    $("#myModal").show(1000);
  });
});

  $("#1player").add("#2player").on("click", function() {
    $("#startPrompt").hide(1000);
    $("#iconSelect").show();
  });
});



   $("#x").on("click", function() {
     const huPlayer = "X";
     const aiPlayer = "O";
     $("#2playermode").hide(1000);
   });
   
   
    $("#o").on("click", function() {
     const huPlayer = "O";
     const aiPlayer = "X";
     $("#2playermode").hide(1000);
   });
             
*/