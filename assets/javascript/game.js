
var Player1 = "";
var Player2 = "";

// keeps track of turn to append correctly
var currentPlayer = "";


var turn = "1";

var Player1Choice = "";
var Player2Choice = "";

var chat = 0;

var chatHistory = [];
var lockInput = false;


var wins = 0;
var losses = 0;

var config = {
    apiKey: "AIzaSyDwGq9jAMnweDvjpEFxQH0CoIxbz-GubJc",
    authDomain: "rps-multiplayer-cd93e.firebaseapp.com",
    databaseURL: "https://rps-multiplayer-cd93e.firebaseio.com",
    projectId: "rps-multiplayer-cd93e",
    storageBucket: "",
    messagingSenderId: "280320616293"
  };


  firebase.initializeApp(config);


  var database = firebase.database();






// watcher for disconnects

database.ref("Players").on("child_removed" , function(snapshot){

  //

var key = snapshot.key



var disconnected = snapshot.val()

// append to chat
var newP = $("<p>")
newP.html(disconnected.name + " has disconnected.")
newP.attr("style", "color:red")
$("#chatBox").append(newP)


if(key === "1")
{
  $("#Player1Name").html("Waiting for Player 1");
  $("#Player2WinsLosses").empty();
  $("#Player1").empty();

  Player1 = "";
}
if(key === "2")
{
  $("#Player2Name").html("Waiting for Player 2");
  $("#Player2WinsLosses").empty();
  $("#Player2").empty();
  Player2 = "";
}


});





database.ref("Players/").on("child_added", function(childSnapshot) {



if(Player1 === "")
{
$("#Player1Name").text(childSnapshot.val().name);
$("#Player1WinsLosses").text("Wins: " + childSnapshot.val().wins + " Losses: " + childSnapshot.val().losses )
// $("#Player1").attr("data-state","notEmpty")
Player1 = childSnapshot.val().name


}

else {
$("#Player2Name").text(childSnapshot.val().name);
$("#Player2WinsLosses").text("Wins: " + childSnapshot.val().wins + " Losses: " + childSnapshot.val().losses )

Player2 = childSnapshot.val().name

setTurn();
}



function setTurn(){

database.ref("turn/").set({
turn:"1"
});
};

turnIndicator();


});


database.ref("Players/" + currentPlayer).on("child_changed", function(){

  // var query = database.ref("Players").orderByKey();
  // query.once("value")
  //   .then(function(snapshot) {
  //     snapshot.forEach(function(childSnapshot) {
  //
  //       var key = childSnapshot.key;
  //
  // console.log(key.wins)
  // console.log(key.losses)
  //

  // Player1WinsLosses.html("Wins: " + key.wins)

  database.ref("Players/" + currentPlayer).once("value", function(childSnapshot){

    var snap = childSnapshot.val()

    console.log(snap.name)

  });




    });
//   });
//
//
// });












// turn watcher
database.ref("turn/").on("child_changed", function(childSnapshot) {


database.ref("Players/" + turn + "/choice").once("value", function(childSnapshot)
{


if(turn ==="1")
{
  Player1Choice = childSnapshot.val()

}

if(turn==="2")
{

  Player2Choice = childSnapshot.val()

}


if(Player1Choice != "" && Player2Choice != "")

{


gameLogic();
resetRound();

}





});



function gameLogic(){

  if (Player1Choice == Player2Choice) {
    console.log("tie")
    revealWinner("No one")
  } else if (Player1Choice == "rock") {
    if (Player2Choice == "paper") {
      console.log("Player2Wins")
      updateScore("2")
      revealWinner(Player2)


    } else if (Player2Choice == "scissors") {
      console.log("Player1Wins")
      revealWinner(Player1)
      updateScore("1")


    }
  } else if (Player1Choice == "paper") {
    if (Player2Choice == "rock") {
console.log("Player1Wins")
revealWinner(Player1)
updateScore("1")


    } else if (Player2Choice == "scissors") {
console.log("Player2Wins")
revealWinner(Player2)
updateScore("2")

    }
  } else if (Player1Choice == "scissors") {
    if (Player2Choice == "rock") {
console.log("Player2Wins")
revealWinner(Player2)
updateScore("2")

    } else if (Player2Choice == "paper") {
console.log("Player1Wins")
revealWinner(Player1)
updateScore("1")

    }
  }
};



function updateScore(winner){

if(currentPlayer === winner)

{
  wins++;
  console.log("winner")
  database.ref("Players/" + currentPlayer ).child("wins").set(wins);

}

else{
  losses++;
  console.log("loser")
  database.ref("Players/"+ currentPlayer ).child("losses").set(losses);
}



  // database.ref("Players/" + "1" ).child("wins").set(wins);
  // database.ref("Players/" + "2").child("losses").set(losses);

};










function revealWinner(player){

$("#Player1").html("<h1>" + Player1Choice + "</h1>")

$("#Player2").html("<h1>" + Player2Choice + "</h1>")


$("#Winner").html(player + " Wins!!")


setTimeout(function(){

  $("#Winner").empty();
  $("#Player1").empty();
  $("#Player2").empty();

  gameOptionsDisplay1();

// clear divs and restart according to turn hint enter function


 }, 5000);

}


function resetRound(){

  // keeps track of turn to append correctly

  Player1Choice = "";
  Player2Choice = "";


};



turn = childSnapshot.val()
turnIndicator();

});




$("#submitPlayer").on("click" , function(){



if(lockInput === false)
{
  event.preventDefault();

 var newPlayer = $("#inputPlayer").val();


if(Player1 === "")
{
 database.ref("Players/" + "1").set({

   name: newPlayer,
   wins: 0,
   losses: 0,

 });

 currentPlayer = "1";


 $("#input").empty();
 $("#welcomePlayer").html("Hi " + newPlayer + "! You are player 1")

}

  else{

  database.ref("Players/" + "2").set({

    name: newPlayer,
    wins: 0,
    losses: 0,



});
currentPlayer = "2";
$("#input").empty();
$("#welcomePlayer").html("Hi " + newPlayer + "! You are player 2")

  }

};
lockInput = true;


database.ref("Players/" + currentPlayer).onDisconnect().remove();

});

$("#enterChat").on("click" , function(){


  var newChat = $("#textBox").val();

  event.preventDefault();

  $("#textBox").val("");

var chatterUser;

database.ref("Players/" + currentPlayer).once("value" , function(snapshot){

var chatShot = snapshot.val();

chatterUser = chatShot.name

});

  database.ref("chat/").child("chatHistory/" + chatterUser).set(newChat);

chat++
});





database.ref("chat/chatHistory").on("child_added", function(snapshot)

{




var newChat = $("<p>");


newChat.html(snapshot.getKey() + " says: " +  snapshot.val());

$("#chatBox").append(newChat)




});









function gameOptionsDisplay1(){
  if(currentPlayer==="1"){

  $("#Player1").empty();


var choices = ["rock","paper","scissors"]

var name = $("<p>")
var WinsLosses = $("<p>")



name.attr("id", "Player1Name")
WinsLosses.attr("id", "Player1WinsLosses")
$("#Player1").before(name)
$("#Player1").after(WinsLosses)



for (var i = 0; i < 3; i++) {
  var newChoice = $("<div>");

  newChoice.html(choices[i])
  newChoice.attr("class","choice")
  newChoice.attr("data-choice", choices[i])
  newChoice.attr("data-who","Player1")
  $("#Player1").append(newChoice)

}
}
};

function gameOptionsDisplay2(){

  if(currentPlayer==="2")
  {


  $("#Player2").empty();

var choices = ["rock","paper","scissors"]
var name = $("<p>")
var WinsLosses = $("<p>")

name.attr("id", "Player2Name")
WinsLosses.attr("id", "Player2WinsLosses")
$("#Player2").before(name)
$("#Player2").after(WinsLosses)

for (var i = 0; i < 3; i++) {
  var newChoice = $("<div>");
  newChoice.html(choices[i])
  newChoice.attr("class","choice")
  newChoice.attr("data-choice", choices[i])
  newChoice.attr("data-who","Player1")



  $("#Player2").append(newChoice)
}
}
};


function waitingStateDisp(player){

if(player === 1)

{
$("#Player1").empty()

}

if(player ===2)

{

  $("#Player2").empty()


}

}


// prints the choice after the user selects from the 3
function printChoice(player,choice)
{


if(player==="1")
{

  if(currentPlayer==="1")
  {
var newChoice = $("<h1>")
newChoice.html(choice)
$("#Player1").append(newChoice)

  }
}


if(player==="2")

{

  if(currentPlayer==="2")
  {

    var newChoice = $("<h1>")
    newChoice.html(choice)
    $("#Player2").append(newChoice)
  }


}

}






function turnIndicator(){

 var currentOpponent;


  if(currentPlayer === "1")
  {

    currentOpponent= Player2

  }
  else{
    currentOpponent= Player1

  }





  if(Player1 != "" &&  Player2 != ""){

    $("#P1").attr("class","gameDiv")
    $("#P2").attr("class","gameDiv")



if(turn === "1")
{
  $("#P1").attr("class","yourTurn")

  if(Player1Choice === "" && Player2Choice === "" )
  {
  gameOptionsDisplay1();
  }
}

if(turn === "2")
{
  $("#P2").attr("class","yourTurn")
  gameOptionsDisplay2();
}

}




if(currentPlayer === turn)
{
$("#playerStatus").html("Its Your Turn!")

}

else{

if(Player2 != "")
{


$("#playerStatus").html("Waiting for " + currentOpponent + " to choose.")


}

}

};







$(document.body).on("click",".choice", function(){
  var choice = $(this).attr("data-choice");

database.ref("Players/" + turn).child("choice").set(choice);

if(turn==="1")

{
  $("#Player1").empty();

  database.ref("turn/").set({
  turn:"2"
  });


  printChoice("1",choice)

}

else {

    $("#Player2").empty();
    database.ref("turn/").set({
    turn:"1"
    });



}

});
