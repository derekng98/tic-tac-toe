let move ="X";



function nextMove(box) {

	if (move == "X" && box.innerHTML ==''){
		box.innerHTML = '<img src="X.png"/>'
	}
	else if (box.innerHTML ==''){
		box.innerHTML = '<img src="O.png"/>'
	}
	switchMove()
	
}

function switchMove() {

	if(checkForWinner(move)){
		alert( move + ' won!')
	}
	else if (checkTie()){
		alert("It's a tie!")
	}
	else if(move == "X") {
		move = "O";
	}
	else {
		move = "X";
	}
}

function checkForWinner(act) {
	
	let result = false;
	if(	checkRow(1, 2, 3) ||
		checkRow(4, 5, 6) ||
		checkRow(7, 8, 9) ||
		checkRow(1, 5, 9) ||
		checkRow(3, 5, 7) ||
		checkRow(1, 4, 7) ||
		checkRow(2, 5, 8) ||
		checkRow(3, 6, 9)) {
			result = true;
	}
	return result;
}

function checkRow(a, b, c) {
	// debugger;
	let allowedX = '<img src="X.png">'
	let allowedO = '<img src="O.png">'
	let result = false;
	if ((getBox(a) == allowedX || getBox(a) == allowedO) && 
		(getBox(b) == allowedX || getBox(b) == allowedO) && 
		(getBox(c) == allowedX || getBox(c) == allowedO) &&
		(getBox(a) == getBox(b) && getBox(a) == getBox(c))){
		result = true;
	}
	return result;
}

function getBox(number){
	return document.getElementById(number).innerHTML;
}

function clearBoard(){
	const box = document.getElementsByClassName('box');

	for (let i = 0; i < box.length; i++){
		box[i].innerHTML = '';
	}
}

function checkTie(){
	let tie;
	for (let i = 1; i<=9; i++){
		if (getBox(i)==""){
			tie = false;
			return tie;
		}
	}
	tie = true;
	return tie;
}	

