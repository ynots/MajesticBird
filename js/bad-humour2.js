/*******************
 * Game Set-up Fxns
 *******************/

 // Game Item Values
    // Game Values
var towerNum = 0;
var topTowerNum = 0;
var forestNum = 0;
    // Max Game Values
var maxForestNum = 2;
var maxTowerNum = 5;
var maxTopTowerNum = 5;
var highScoreMaxNum = 5;
var gameHeight = 750;
var imageResetPoint = "1600px";
var towerMoveMin = -100;
var towerMoveMax = 100;
var leeway = 25;
var score = 0;
var flightSpeed = 10;
var fallSpeed = 0;
var gravity = 1;

// Timers
var landscapeTimer = null;
var towerTimer = null;
var topTowerTimer = null;
var glideTimer = null;
var timeoutTimer = null;
var scoreTimer = null;
var flapTimer = null;

// Game States
var gameStarted = false;
var died = false;
var summaryOn = false;
var scoreSubmitted = false;
var flapping = false;

// Clears all items and recreates
function gameReset () {
    // clears all
    clearAll();
    createField();
    for (let i = 0; i < maxForestNum; i++) {
        createForest();
        forestNum++;
    }
    if (landscapeTimer == null) {
        landscapeTimer = setInterval("moveLandscape('forest')", 10);
    }
    createBird();
    for (let i = 0; i < maxTopTowerNum; i++) {
        var randomNum = randomInt(towerMoveMin, towerMoveMax);
        createTopTower(randomNum);
        topTowerNum++;
        createTower(randomNum);
        towerNum++;
    }
    createScoreBoard();
    createScore();
}

function startGame() {
	score = 0;
    gameStarted = true;
    scoreSubmitted = false;
    enactGravity();
	moveObstacles();
	startScoreCountdown();
}

function startScoreCountdown() {
    timeoutTimer = setTimeout("startScoreTimer()", 5750);
}

function startScoreTimer() {
	addScore();
	if (scoreTimer == null) {
		scoreTimer = setInterval("addScore()", 3500);
	}
}

function addScore() {
	score++;
	document.getElementById('scoreboard').childNodes[0].nodeValue = score;
}

function endGame() {
    var lastScore = score;
    summaryOn = true;
    gameReset();
    createSummary(lastScore);
}

function moveLandscape(itemClassName) {
    var items = document.getElementsByClassName(itemClassName);
    for (let i = 0; i < items.length; i++) {
        var item = items[i];
        item.style.left = parseInt(item.style.left) - 1 + "px";
        if (parseInt(item.style.left) + 1985.06 < 10) {
            item.style.left = "1970px";
        }
    }
}

function moveTower () {
    var towers = document.getElementsByClassName('tower');
    for (let i = 0; i < towers.length; i++){
        var tower = towers[i];
        tower.style.left = parseInt(tower.style.left) - 1 + "px";
        if (parseInt(tower.style.left) + parseInt(tower.width) < 10) {
            tower.style.left = imageResetPoint;
        }
        var bird = document.getElementById('bird');
        var birdRight = parseInt(bird.style.left) + parseInt(bird.width);
        var birdBottom = parseInt(bird.style.top) + parseInt(bird.height);
        var towerTop = parseInt(tower.style.bottom) + parseInt(tower.height);
        var towerRight = parseInt(tower.style.left) + parseInt(tower.width);
        if (parseInt(tower.style.left) + leeway < birdRight
            && towerRight > parseInt(bird.style.left)
            && towerTop > gameHeight + leeway - birdBottom      // check if bird bottom corners are
																// in tower's top corners
        ) {
            die();
        }
    }
}

function moveTopTower () {
    var towers = document.getElementsByClassName('top-tower');
    for (let i = 0; i < towers.length; i++){
        var tower = towers[i];
        tower.style.left = parseInt(tower.style.left) - 1 + "px";
        if (parseInt(tower.style.left) + 150 < 10) {
            tower.style.left = imageResetPoint;
        }
        var bird = document.getElementById('bird');
        var birdRight = parseInt(bird.style.left) + parseInt(bird.width);
        var birdTop = parseInt(bird.style.top);
        var towerBottom = parseInt(tower.style.top) + parseInt(tower.height);
        var towerRight = parseInt(tower.style.left) + parseInt(tower.width);
        if (parseInt(tower.style.left) + leeway < birdRight
            && towerRight > parseInt(bird.style.left)
            && towerBottom > birdTop    // check if bird top corners are
                                        // in tower's bottom corners
        ) {
            die();
        }
    }
}

function die () {
    died = true;
    endGame();
}

function enactGravity () {
    if (glideTimer != null) {
        clearInterval(glideTimer);
        glideTimer = null;
    }
    glideTimer = setInterval("glideDown()", 10);
}

function moveObstacles () {
    if (towerTimer != null || topTowerTimer != null) {
    	clearInterval(towerTimer);
        clearInterval(topTowerTimer);
    	towerTimer = null;
        topTowerTimer = null;
    }
    towerTimer = setInterval("moveTower()", 10);
    topTowerTimer = setInterval("moveTopTower()", 10);
}

function keyHandler(e) {
    var code = null;
    if (e.event) {
        code = e.event;
    } else if (e.which) {
        code = e.which;
    }

    if (code == 32) {
        if(!summaryOn) {
			if (!gameStarted) {
				gameStarted = true;
				startGame();
			} else {
				flapUp();
			}
		} else {
            clearSummary();
            summaryOn = false;
        }
    }
}

function randomInt (min, max) {
    return (Math.floor(Math.random()*(max-min+1)) + min);
}

/*******************
 * Game Creation Fxns
 *******************/

function clearAll() {
    var field = document.getElementById('field');
    var bird = document.getElementById('bird');
    var towers = document.getElementsByClassName('tower');
    var topTowers = document.getElementsByClassName('top-tower');
    var forests = document.getElementsByClassName('forest');


    /**** Resets Variables and States ****/
    towerNum = 0;
    topTowerNum = 0;
    forestNum = 0;
    if (fallSpeed != 0) {
        fallSpeed = 0;
    }
    gameStarted = false;
    died = false;

    // var summary = document.getElementById('summary-container');
    // if(summary != undefined || summary != null) {
    //     document.getElementById('field').removeChild(summary);
    // }

    /**** Clear Timeouts ****/
    if (timeoutTimer != null) {
        // console.log('timeout cleared');
        clearTimeout(timeoutTimer);
        timeoutTimer = null;
    }
    if (scoreTimer != null) {
        // console.log('scoreTimer cleared');
        clearInterval(scoreTimer);
        scoreTimer = null;
    }
    if (towerTimer != null) {
        // console.log('towerTimer cleared');
        clearInterval(towerTimer);
        towerTimer = null;
    }
    if (topTowerTimer != null) {
        // console.log('topTowerTimer cleared');
        clearInterval(topTowerTimer);
        towerTimer = null;
    }
    if (glideTimer != null) {
        // console.log('gliderTimer cleared');
        clearInterval(glideTimer);
        glideTimer = null;
    }

    /**** Removes objects & clears field ****/
    if(bird != undefined || bird != null) {
        field.removeChild(bird);
    }
    if(towers.length > 0) {
        for (let i = 0; i < towers.length; i++) {
            field.removeChild(towers[i]);
        }
    }
    if(topTowers.length > 0) {
        for (let i = 0; i < topTowers.length; i++) {
            field.removeChild(topTowers[i]);
        }
    }
    if(forests.length > 0) {
        for (let i = 0; i < forests.length; i++) {
            field.removeChild(forests[i]);
        }
    }
    if(landscapeTimer != undefined || landscapeTimer != null) {
        clearInterval(landscapeTimer);
        landscapeTimer = null;
    }
    if(field != undefined || field != null) {
        document.getElementById('container').removeChild(field);
    }
}



function createContainer() {
    var gameContainer = document.createElement('div');
    gameContainer.id = "container";
    gameContainer.style.position = "relative";
    gameContainer.style.height = gameHeight + "px";
    gameContainer.style.width = "600px";
    gameContainer.style.margin = "0 auto";
    gameContainer.style.padding = "0";
    document.body.appendChild(gameContainer);
}

function createField() {
    var newField = document.createElement('div');
    newField.id = 'field';
    newField.style.backgroundColor = "white";
    newField.style.height = "100%";
    newField.style.border = "solid black";
    newField.style.width = "100%";
    newField.style.position = "absolute";
    newField.style.minWidth = "400px";
    newField.style.top = "0px";
    newField.style.right = "0px";
    newField.style.overflow = "hidden";
    newField.style.borderRadius = "20px";
    document.getElementById('container').appendChild(newField);
}

function createForest() {
    var newForest = document.createElement('img');
    newForest.setAttribute("src", "mountains4.jpg");
    newForest.id = 'forest' + forestNum;
    newForest.className = 'forest';
    newForest.style.height = "100%";
    newForest.style.position = "absolute";
    newForest.style.top = "0px";
    newForest.style.zIndex = "0";
    newForest.style.left = 0 + (1970 * forestNum) + "px";
    document.getElementById('field').appendChild(newForest);
}

function createBird() {
    var newBird = document.createElement('img');
    newBird.setAttribute("src", "bird.gif");
    newBird.id = 'bird';
    newBird.style.position = "absolute";
    newBird.style.padding = "0";
    newBird.style.margin = "0";
    newBird.style.top = "250px";
    newBird.style.left = "50px";
    newBird.style.zIndex = "1";
    newBird.style.border = "";
    document.getElementById('field').appendChild(newBird);
}

function createScoreBoard() {
	var newScoreBoard = document.createElement('p');
	newScoreBoard.id = "scoreboard";
	newScoreBoard.style.position = "absolute";
	newScoreBoard.style.top = "50px";
	newScoreBoard.style.left = "290px";
	newScoreBoard.style.zIndex = "2";
	newScoreBoard.style.fontSize = "48px";
	newScoreBoard.style.fontWeight = "bold";
	document.getElementById('field').appendChild(newScoreBoard);
}

function createScore() {
	var newScore = document.createTextNode(score);
	newScore.id = "score";
	document.getElementById('scoreboard').appendChild(newScore);
}

function createTower (random) {
    var tower = document.createElement('img');
    tower.setAttribute("src", "mountains1-2.png");
    tower.className = 'tower';
    tower.id = "tower" + towerNum;
    tower.style.padding = "0";
    tower.style.margin = "0";
    tower.style.position = "absolute";
    //console.log(document.getElementById('field').getBoundingClientRect().right);
    tower.style.left = 700 + (350 * towerNum) + "px";
    tower.style.height = "275px";
    tower.style.width = "150px";
    tower.style.bottom = random + "px";
    document.getElementById('field').appendChild(tower);
}

function createTopTower (random) {
    var tower = document.createElement('img');
    tower.setAttribute("src", "mountains2-3.png");
    tower.className = 'top-tower';
    tower.id = "top-tower" + topTowerNum;
    tower.style.padding = "0";
    tower.style.margin = "0";
    tower.style.position = "absolute";
    //console.log(document.getElementById('field').getBoundingClientRect().right);
    tower.style.left = 700 + (350 * topTowerNum) + "px";
    tower.style.height = "275px";
    // tower.style.width = "150px";
    tower.style.top = -(random) + "px";
    document.getElementById('field').appendChild(tower);
}
/**********************
 * Highscore & Summary
 * Score Submission
 ********************/

function clearSummary() {
    if (document.getElementById('summary-container')) {
        // console.log('delete summary');
        document.getElementById('field').removeChild(document.getElementById('summary-container'));
    }
}

function createSummary (lastScore) {
    /* Create Summary Box */
	var parentDiv = document.createElement('div');
	parentDiv.id = "summary-container";
	parentDiv.style.position = "absolute";
	parentDiv.style.width = "300px";
	parentDiv.style.height = "400px";
	parentDiv.style.top = "150px";
	parentDiv.style.left = "150px";
	parentDiv.style.zIndex = "3";
    parentDiv.style.borderRadius = "8px";
    parentDiv.style.backgroundColor = "rgba(128,0,0,0.8)";

    /* Fill Summary Box */
    var hsTitle = createHSTitle('Highscores');
    var hsList = createHSList();

    parentDiv.appendChild(hsTitle);
    parentDiv.appendChild(hsList);
    document.getElementById('field').appendChild(parentDiv);
    fillHS();
    if(!(lastScore > document.getElementById('highscore4').childNodes[0].nodeValue)) {
        var hsInstruction = createHSTitle('Try again!');
        hsInstruction.style.marginTop = "40px";
        var unhappyFace = createHSTitle('=(');
        parentDiv.appendChild(hsInstruction);
        parentDiv.appendChild(unhappyFace);
    } else {
        var hsInstruction = createHSTitle('Congrats! You have beaten a highscore!');
        hsInstruction.style.fontSize = "16px";
	hsInstruction.style.marginLeft = "50px";
        var inputBox = createScoreInput();
        var label = createLabel();
        var button = createUsernameSubmit(lastScore);

        parentDiv.appendChild(hsInstruction);
        parentDiv.appendChild(label);
        parentDiv.appendChild(inputBox);
        parentDiv.appendChild(button);
    }
}

function createHSTitle(phrase) {
    var h = document.createElement('h1');
    var hTxt = document.createTextNode(phrase);
    h.style.color = "white";
    h.style.textAlign = "center";
    h.appendChild(hTxt);
    return h;
}

function createHSList() {
    var hsList = document.createElement('ol');
    hsList.id = "hs-list";
    hsList.style.color = "white";
    hsList.style.zIndex = '5';
    for (let i = 0; i < highScoreMaxNum; i++) {
        // create li element
        var hs = document.createElement('li');
        hs.style.width = "80%";
        hs.style.textAlign = "right";
        var hsUsername = document.createElement('span');
        hsUsername.id = "username" + i;
        hsUsername.style.left = "10px";
        var usernameTxt = document.createTextNode('');

        var hsSep = document.createTextNode('\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0' +
            '-\u00A0\u00A0\u00A0\u00A0');

        var hsScore = document.createElement('span');
        hsScore.id = "highscore" + i;
        hsScore.style.width = "30%";
        var scoreTxt = document.createTextNode('');

        hsUsername.appendChild(usernameTxt);
        hsScore.appendChild(scoreTxt);
        hs.appendChild(hsUsername);
        hs.appendChild(hsSep);
        hs.appendChild(hsScore);

        hsList.appendChild(hs);
    }
    return hsList;
}
function createLabel() {
    var label = document.createElement('label');
    var labelText = document.createTextNode('Name:');
    label.style.color = "white";
    label.appendChild(labelText);
    label.style.marginLeft = "25px";
    return label;
}

function createScoreInput() {
    var inputBox = document.createElement('input');
    inputBox.type = "text";
    inputBox.id = "username";
    inputBox.width = "100px";
    inputBox.height = "50px";
    inputBox.style.marginLeft = "25px";
    return inputBox;
}

function createUsernameSubmit(score) {
    var button = document.createElement('input');
    button.id = "submit-button";
    button.type = "button";
    button.value = "submit";
    button.style.float = "right";
    button.style.margin = "10px 34px 0 0";
    button.style.width = "75px";
    button.style.height = "25px";
    button.style.backgroundColor = "white";
    button.style.color = "maroon";
    button.style.fontWeight = "bold";
    button.style.fontSize = "16px";
    button.style.border = "none";
    button.onclick = function() {
        if (!scoreSubmitted) {
            checkHighscore(document.getElementById('username').value, score);
            scoreSubmitted = true;
        }
    };
    return button;
}

function checkHighscore(username, score) {
    for (let i = 0; i < highScoreMaxNum; i ++) {
        if (score > document.getElementById('highscore' + i).childNodes[0].nodeValue) {
            inputScoreToDB(username, score, i);
            return;
        }
    }
}

function inputScoreToDB(username, number, indexNum) {
    firebase.database().ref('MajesticBirdHighScore/Tester' + indexNum).set({
        Username: username,
        Score: number
    });
}

function fillHS() {
    for(let i = 0; i < highScoreMaxNum; i++) {
        getHighScore(i);
    }
}

/*******************
* Bird Movement Fxns
*******************/
function moveUp () {
    var bird = document.getElementById('bird');
    bird.style.top = parseInt(bird.style.top) - flightSpeed + "px";
    flightSpeed -= gravity;
    if (flightSpeed <= 0) {
        clearInterval(flapTimer);
        flapping = false;
        flapTimer = null;
        enactGravity();
    }
}

function flapUp() {
    fallSpeed = 0;
    if (flapping) {
        clearInterval(flapTimer);
        flapTimer = null;
        flapping = false;
    }
    flapping=true;
    flightSpeed = 10;
    flapTimer = setInterval("moveUp()", 10);
}

function glideDown () {
    if (!died) {
        var bird = document.getElementById('bird');
        bird.style.top = parseInt(bird.style.top) + fallSpeed + "px";
        fallSpeed += (gravity/20);
        // console.log(parseInt(bird.style.top) + parseInt(bird.height))
        if (parseInt(bird.style.top) + parseInt(bird.height) > 915) {
            die();
        }
    }
}

function getHighScore(num) {
    // Get Elements
    var username = document.getElementById('username' + num);
    var highscore = document.getElementById('highscore' + num);

    var dbTester = firebase.database().ref('MajesticBirdHighScore/Tester' + num);
    dbTester.on('value', snap => username.innerText = snap.val().Username);
    dbTester.on('value', snap => highscore.innerText = snap.val().Score);
}

/**********************
 * Firebase Initialization
 *********************/
var config = {
    apiKey: "AIzaSyDWl8k6e4ziLNROmwdaO6nFciCAVE9UIIc",
    authDomain: "javascripttet.firebaseapp.com",
    databaseURL: "https://javascripttet.firebaseio.com",
    storageBucket: "javascripttet.appspot.com",
    messagingSenderId: "702407733315"
    };

// function appendFBScriptsToHead () {
//     var fbScript = createScript('https://www.gstatic.com/firebasejs/3.6.2/firebase.js');
//     document.head.appendChild(fbScript);
//     eval(fbScript);
// }
//
// function createScript(url) {
//     var script = document.createElement('script');
//     script.type = 'text/javascript';
//     script.src = url;
//     return script;
// }
//
// function createLink(rel, type, url) {
//     var link = document.createElement('link');
//     link.setAttribute('rel', rel);
//     link.setAttribute('type', type);
//     link.setAttribute('href', url);
//     return link;
// }

function initializeFB() {
    firebase.initializeApp(config);
}

function addStyle() {
    var styleE = document.createElement('style');
    styleE.type = 'text/css';
    var styleCode = `span {
    display: inline-block;
    width: 50px;}
    #highscore-title {
    text-align: center;}`;
    styleE.appendChild(document.createTextNode(styleCode));
    document.body.appendChild(styleE);
}

/************************
 *  Onload Calls
 ***********************/
onload=function() {
    // appendFBScriptsToHead();
    initializeFB();
    addStyle();
    document.body.bgColor = "black";
    createContainer();
    gameReset();
    window.onkeypress=keyHandler;
}
