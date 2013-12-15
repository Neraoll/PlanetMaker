// Main
var canvas;
var stage;
var needUpdate = false;

// Preload
var preloader;
var progressLbl;
var gameLoaded = false;

// Assets
var assets;

var animations = [];

// Colors
var bgUiColor = "#EDEDED";
var massColor = "#D8C46C";
var tempColor = "#E27493";
var aquaColor = "#4AA5D3";
var vegeColor = "#33CC8E";
var counterColor = "#588293";
var planetColor = "#EDEDED";
var atmoColor = "#EDEDED";

// Bars
var barWidth = 330;
var barHeight = 40;
var bars = [];

// Counter Bar
var counterBarWidth = 190;
var counterBarHeight = 40;
var counterCircleRadius = 10;
var counterBarValue;
var counterBar;

// Modifiers Bar
var modifiersBarWidth = 80;
var modifiersBarHeight = 262;
var modifiersMaxNumber = 5;
var modifiersBtns = [];
var modifiersBar;
var dragedModifier;

// Planet
var planetContainer;
var planetOuter;
var planetInner;
var planetInnerValue;
var planetOuterValue;

// Sound
var musicPlayer;
var music2player;

// Circles
var circleRadius = 50;
var circles = [];

// Game data
var data;
var raceData;
var planetData;
var gameData;
var planet;
var race;
var modifiers;
var score;
var scoreLbl;

// Game state
var waitingForRestart = false;

function gameInit () {
	// Get canvas
	canvas = document.getElementById("gameCanvas");

	// Create stage
	stage  = new createjs.Stage(canvas);

	// Enable mouse events
    stage.mouseEventsEnabled = true;

    // Set assets
    assets = [
            {src:"assets/fond.png", id:"bg"},
            {src:"assets/ring-bg.png", id:"ringBg"},
            {src:"assets/ring-fg.png", id:"ringFg"},
            {src:"assets/icon1.png", id:"mass"},
            {src:"assets/icon2.png", id:"aqua"},
            {src:"assets/icon3.png", id:"vege"},
            {src:"assets/icon4.png", id:"temp"},
            {src:"assets/modifier-0.png", id:"modifier0"},
            {src:"assets/modifier-1.png", id:"modifier1"},
            {src:"assets/modifier-2.png", id:"modifier2"},
            {src:"assets/modifier-3.png", id:"modifier3"},
            {src:"assets/modifier-4.png", id:"modifier4"},
            {src:"assets/modifier-5.png", id:"modifier5"},
            {src:"assets/raceTest-0.png", id:"raceTest0"},
            {src:"assets/raceTest-1.png", id:"raceTest1"},
            {src:"assets/raceTest-2.png", id:"raceTest2"},
            {src:"assets/raceTest-3.png", id:"raceTest3"},
            {src:"assets/raceTest-4.png", id:"raceTest4"},
            {src:"assets/raceTest-5.png", id:"raceTest5"},
            {src:"js/data.json", id:"data"},
            // {src:"paddle.png", id:"cpu"},
            // {src:"paddle.png", id:"player"},
            // {src:"ball.png", id:"ball"},
            // {src:"win.png", id:"win"},
            // {src:"lose.png", id:"lose"},
            // {src:"playerScore.mp3|playerScore.ogg", id:"playerScore"},
            // {src:"enemyScore.mp3|enemyScore.ogg", id:"enemyScore"},
            {src:"SD/TantumLocus_Music1.mp3|TantumLocus_Music1.ogg", id:"music1"},
            {src:"SD/TantumLocus_Music2.mp3|TantumLocus_Music2.ogg", id:"music2"},
            // {src:"wall.mp3|wall.ogg", id:"wall"}
    ];

    // Create Progress label
    progressLbl = new createjs.Text("Loading...","18px Verdana","black");
    progressLbl.lineWidth = 200;
    progressLbl.textAlign = "center";
    progressLbl.x = canvas.width / 2;
    progressLbl.y = canvas.height / 2;
    stage.addChild(progressLbl);

    preloader = new createjs.LoadQueue(false);
    preloader.installPlugin(createjs.Sound);
    preloader.addEventListener("complete", handleComplete);
    preloader.addEventListener("progress", handleProgress);
    preloader.loadManifest(assets);

    stage.update();

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", gameTick);
}

function initData () {
    data = preloader.getResult("data");
    raceData = data.race;
    planetData = data.planet;
    gameData = data.game;
    planet = gameData.planet;
    race = gameData.race;
    modifiers = gameData.modifiers;
    // console.log(gameData);
}

function lineDistance( point1, point2 )
    {
    var xs = 0;
    var ys = 0;
     
    xs = point2.x - point1.x;
    xs = xs * xs;
     
    ys = point2.y - point1.y;
    ys = ys * ys;
     
    return Math.sqrt( xs + ys );
}

function fireScore () {
    waitingForRestart = true;
    planetContainer.visible = false;

    if (!scoreLbl) {
        // Create Progress label
        scoreLbl = new createjs.Text(score + "%", "100px Verdana", "white");
        scoreLbl.textAlign = "center";
        scoreLbl.x = canvas.width / 2;
        scoreLbl.y = canvas.height / 2;
        stage.addChild(scoreLbl);
    };

    needUpdate = true;
}

function computeScore () {
    if (!score) {
        score = 0;
        for (var i = 0; i < bars.length; i++) {
            // 100 - (abs(ValeurRaceDemandée - ValeurPlanèteActuelle) * 100 / abs(ValeurDemandéeRace - ValeurPlanèteDépart))
            var barVal = bars[i][2];
            var startVal =  bars[i][3];
            var raceVal =  bars[i][4];
            score += 100 - ((Math.abs(raceVal - barVal) * 100) / (Math.abs(raceVal - startVal)));
        };
        score /= 4;
        score = Math.ceil(score);
        setTimeout(fireScore, 2000);
    };
}

function dropModifier (place, modifier) {
    if (counterBarValue >= counterBar[1]) {
        return;
    };

    var value = 0;
    var barId = "";
    if (place == planetInner) {
        // Planet
        value = modifiers[modifier.idx].value;
        barId = modifiers[modifier.idx].crust;
    } else if (place == planetOuter) {
        // Atmosphere
        value = modifiers[modifier.idx].value;
        barId = modifiers[modifier.idx].atmo;
    };

    if (barId == "mass") {
        index = 0;
    } else if (barId == "aqua") {
        index = 1;
    } else if (barId == "temp") {
        index = 2;
    } else if (barId == "vege") {
        index = 3;
    };

    setBarValue(index, bars[index][2] + value);

    // Remove one chance
    setCounterBarValue(counterBarValue + 1);

    needUpdate = true;
}

function restartGame () {
    // Mass
    setBarValue(0, planet.startValue.mass);
    
    // Aquatic
    setBarValue(1, planet.startValue.aqua);

    // Temperature
    setBarValue(2, planet.startValue.temp);

    // Vegetation
    setBarValue(3, planet.startValue.vege);

    // Add counter bar
    setCounterBarValue(0);

    scoreLbl.visible = false;
    planetContainer.visible = true;

    needUpdate = true;
}

function initUI () {
    // Add background
    var backgroundBitmap = new createjs.Bitmap(preloader.getResult("bg"));
    stage.addChild(backgroundBitmap);

    // Add planet
    addPlanet(400, 330, planetColor, atmoColor, 140, 80);

    addRace();

    // Place UI Elements

    // Mass
    var massBar = addBar(15, 15, massColor, "mass", planet.startValue.mass, 100, race.value.mass);

    // Aquatic
    var aquaBar = addBar(15, 65, aquaColor, "aqua", planet.startValue.aqua, 100, race.value.aqua);

    // Temperature
    var tempBar = addBar(405, 15, tempColor, "temp", planet.startValue.temp, 100, race.value.temp);

	// Vegetation
    var vegBar = addBar(405, 65, vegeColor, "vege", planet.startValue.vege, 100, race.value.vege);

	// Add counter bar
	addCounterBar(595, 115, counterColor, 0, 6);

    // Add modifiers bar
    addModifiersBar(705, 165, modifiersMaxNumber);

    needUpdate = true;

 //    circle.addEventListener("mousedown", handlePress);
 // function handlePress(event) {
 //     // A mouse press happened.
 //     // Listen for mouse move while the mouse is down:
 //     event.addEventListener("mousemove", handleMove);
 // }
 
 	// createjs.Touch.enable(stage);

 	var ok = false;

 	function handleClick(event) {
        console.log(event);
     	// Click Happened.
     	gameLoaded = !gameLoaded;
        // if (musicPlayer.isPlaying) {};
                // musicPlayer.stop();

    }
 	// canvas.addEventListener("click", handleClick);
    // End drag
    function handleUp (argument) {
        if (waitingForRestart) {
            waitingForRestart = false;
            restartGame();
            return;
        };
        if (dragedModifier) {
            // Detect collision
            // Fix detection (change for center pos)
            dragedModifier.sprite.x += (dragedModifier.sprite.getBounds().height / 2);
            dragedModifier.sprite.y += (dragedModifier.sprite.getBounds().height / 2);
            // Planet
            if (lineDistance(dragedModifier.sprite, planetInner) < planetInnerValue) {
                // console.log("inner");
                dropModifier(planetInner, dragedModifier);
            }
            // Atmosphere
            else if (lineDistance(dragedModifier.sprite, planetOuter) < planetOuterValue) {
                dropModifier(planetOuter, dragedModifier);
            };

            // Remove modifier
            stage.removeChild(dragedModifier.sprite);
            dragedModifier = null;

            needUpdate = true;
        };
    }
    canvas.addEventListener("mouseup", handleUp);


 	var val = 0;
    var vol = 1.0;
    var up = true;
    function handleTick() {
     //Circle will move 10 units to the right.
        //circle.x += 10;
        //Will cause the circle to wrap back
        //if (circle.x > stage.canvas.width) { circle.x = 0; }

        val = (val + 1) % 7;
        // setBarValue(0, val*10);

        
        if (vol <= -0.5) {up = false;};
        if (vol >= 1.5) {up = true;};
        if (up) {
            vol -= 0.1 % 1.0;
        } else {
            vol += 0.1 % 1.0;
        };
        // musicPlayer.setVolume(vol);
        // music2player.setVolume(1.0 - vol);
        // setPlanetInner("white", val*50);
        // barContent.scaleY = val;
        stage.update();
    }

    animations.push({handler: handleTick, count: 5});

    gameLoaded = true;
}

function addRace(){
    // Add Race
    var rand = Math.floor(Math.random()*5); 
    var raceTestBitmap = new createjs.Bitmap(preloader.getResult("raceTest"+rand));
    raceTestBitmap.x = 15;
    raceTestBitmap.y = 380;
    stage.addChild(raceTestBitmap);

    // Create Name Race label
    var rName = "";
    rand = 2 + Math.floor(Math.random()*2); 
    for(var i=0 ; i < rand ; i++){
        var rand2 = Math.floor(Math.random()*raceData.length);
        rName += raceData[rand2];
    }

    rName = rName.charAt(0).toUpperCase() + rName.slice(1);

    raceName = new createjs.Text(rName,"15px Verdana",bgUiColor);
    raceName.lineWidth = 110;
    raceName.textAlign = "center";
    raceName.x = 70;
    raceName.y = 360;
    stage.addChild(raceName);
}

function initSound () {
    musicPlayer = createjs.Sound.play("music1");
    music2player = createjs.Sound.play("music2");
    music2player.setVolume(0.0);
}

// Peload Methods
function handleProgress(event)
{
    //use event.loaded to get the percentage of the loading
	var progresPrecentage = Math.round(preloader.progress * 100);
    progressLbl.text = progresPrecentage + "%";
	stage.update();
}

function handleComplete(event) {
	//triggered when all loading is complete
	stage.removeChild(progressLbl);
	stage.update();
    initData();
	initUI();
    // initSound();
}

// Game tick
function gameTick () {
	if (gameLoaded) {
        var len = animations.length;
        var toRemove = [];
		for (var i = 0; i < len; i++) {
			animations[i].handler()
            animations[i].count--;

            if (animations[i].count <= 0) {
                toRemove.push(i);
            };
		};

        for (var i = 0; i < toRemove.length; i++) {
            animations.splice(toRemove[i],1);
        };

        if (len > 0) {
            needUpdate = true;
        };
	};


    if (needUpdate) {
        stage.update();
        needUpdate = false;
    };
}

// Bars Methods, color is a css compatible color value
function addBar (x, y, color, iconId, value, maxValue, bestValue) {
	// barBorder = new createjs.Shape();
 //    barBorder.graphics.beginStroke("black").drawRect(0, 0, barWidth, barHeight);

 //    //Set position of Shape instance.
 //    barBorder.x = x;
 //    barBorder.y = y;

 //    //Add Shape instance to stage display list.
 //    stage.addChild(barBorder);

	// Create container
 	var barContainer = new createjs.Container();
 	barContainer.x = x;
    barContainer.y = y;

    // Create Icon
    var icon = new createjs.Bitmap(preloader.getResult(iconId));

	var barX = icon.getBounds().width + 10;

	// Create bar background
    var barBackground = new createjs.Shape();
    barBackground.graphics.beginFill(bgUiColor).drawRect(0, 0, barWidth, barHeight);

    //Set position of Shape instance.
    barBackground.x = barX;
    barBackground.y = 0;

    //Add Shape instance to stage display list.
    barContainer.addChild(barBackground);

	// Create bar content
    var barContent = new createjs.Shape();
    barContent.graphics.beginFill(color).drawRect(0, 0, barWidth, barHeight);

    //Set position of Shape instance.
    barContent.x = barX;
    barContent.y = 0;

    //Add Shape instance to stage display list.
    barContainer.addChild(barContent);

    // Add best value
    var bestValueBar = new createjs.Shape();
    bestValueBar.graphics.beginFill("black").drawRect(0, 0, 3, barHeight);

    bestValueBar.x = barX + bestValue * (barWidth / maxValue);
    bestValueBar.y = 0;

    barContainer.addChild(bestValueBar);

    // Add icon at the end
    barContainer.addChild(icon);

	// Add container
    stage.addChild(barContainer);

    // Set value
    var newWidth = value * (barWidth / maxValue);
    barContent.scaleX = newWidth / barWidth;

    //Update stage will render next frame
    needUpdate = true;

    bars.push([barContainer, maxValue, value, value, bestValue]);

    return bars.length - 1;
}

function setBarValue (index, value) {
    if (value < 0) { value = 0; };
    if (value > bars[index][1]) { value = bars[index][1]; };
	var newWidth = value * (barWidth / bars[index][1]);
	bars[index][0].getChildAt(1).scaleX = newWidth / barWidth;
    bars[index][2] = value;
	// TODO animations
}

function setBarBestValue (index, value) {
	var newX = value * (barWidth / bars[index][1]);
	bars[index][0].getChildAt(2).x = bars[index][0].getChildAt(1).x + newX;

	// TODO animations
}

// Counter Bar
function addCounterBar (x, y, circleColor, value, maxValue) {
	if (counterBar) {
		return;
	};

	// Create container
 	var barContainer = new createjs.Container();
 	barContainer.x = x;
    barContainer.y = y;

	// Create bar background
    var barBackground = new createjs.Shape();
    //barBackground.graphics.beginStroke(bgUiColor).drawRect(0, 0, counterBarWidth, counterBarHeight);
    barBackground.graphics.beginFill(bgUiColor).drawRect(0, 0, counterBarWidth, counterBarHeight);

    //Add Shape instance to stage display list.
    barContainer.addChild(barBackground);

    // Add circles
    var circleLeftMargin = 20;
    var circleSpace = 10;
    var circleX = circleLeftMargin;
    for (var i = 0; i < maxValue; i++) {
    	// Create circle
    	var c = new createjs.Shape();
    	c.graphics.setStrokeStyle(4).beginStroke(circleColor).drawCircle(0, 0, counterCircleRadius);

    	c.x = circleX;
    	c.y = 20;
    	circleX += (counterCircleRadius * 2) + circleSpace;

    	if (i < value) {
    		c.graphics.beginFill(circleColor).drawCircle(0, 0, counterCircleRadius);
    	};

    	// Add to the container
    	barContainer.addChild(c);
    };

    // Add to stage
    stage.addChild(barContainer);

    counterBarValue = value;

    counterBar = [barContainer, maxValue, circleColor];
}

function setCounterBarValue (value) {
    counterBarValue = value;

	if (value != 0) { 
		value++;
	};
	var circleColor = counterBar[2];
	var circleLeftMargin = 20;
    var circleSpace = 10;
    var circleX = circleLeftMargin;
	for (var i = 1; i < counterBar[1] + 1; i++) {
    	// Create circle
    	var c = counterBar[0].getChildAt(i);
    	c.graphics.clear();

    	c.graphics.setStrokeStyle(4).beginStroke(circleColor).drawCircle(0, 0, counterCircleRadius);

    	c.x = circleX;
    	c.y = 20;
    	circleX += (counterCircleRadius * 2) + circleSpace;

    	if (i < value) {
    		c.graphics.beginFill(circleColor).drawCircle(0, 0, counterCircleRadius);
    	};
    };

    if (counterBarValue >= counterBar[1]) {
        computeScore();
    };
}

// Modifiers Bar
function addModifiersBar (x, y, modifiersNumber) {
	if (modifiersBar) {
		return;
	};

    if (modifiersNumber >= modifiers.length) {
        modifiersNumber = modifiers.length;
    };

	// Create container
 	var barContainer = new createjs.Container();
 	barContainer.x = x;
    barContainer.y = y;

	// Create bar background
    var barBackground = new createjs.Shape();
    //barBackground.graphics.beginStroke("black").drawRect(0, 0, modifiersBarWidth, modifiersBarHeight);
    barBackground.graphics.beginFill(bgUiColor).drawRect(0, 0, modifiersBarWidth, modifiersBarHeight);

    // Add Shape instance to stage display list.
    barContainer.addChild(barBackground);

    // Add to stage
    stage.addChild(barContainer);

    // Add modifiers
    var modifiersUpMargin = 20;
    var modifiersSpace = 10;
    var modifiersY = modifiersUpMargin;
    for (var i = 0; i < modifiersNumber; i++) {
       	// Create bitmap
        var modifiersBitmap = new createjs.Bitmap(preloader.getResult("modifier" + i));

    	modifiersBitmap.x = 16;
    	modifiersBitmap.y = modifiersY;
    	modifiersY += modifiersBitmap.getBounds().height + modifiersSpace;

    	// Add to the container
    	barContainer.addChild(modifiersBitmap);

        modifiersBtns.push(modifiersBitmap);

        // modifiersBitmap.addEventListener("mousemove", handleMove);
        function handleMove(evt) {
            if (!dragedModifier) {
                var modifierIdx = modifiersBtns.indexOf(evt.target);

                // Duplicate object
                dragedModifier = new createjs.Bitmap(preloader.getResult("modifier" + modifierIdx));
                dragedModifier = {sprite:dragedModifier, idx:modifierIdx};
                stage.addChild(dragedModifier.sprite);
            };

            dragedModifier.sprite.x = evt.stageX - (dragedModifier.sprite.getBounds().height / 2);
            dragedModifier.sprite.y = evt.stageY - (dragedModifier.sprite.getBounds().width / 2);

            needUpdate = true;

            // Check out the DragAndDrop example in GitHub for more
        }
        modifiersBitmap.addEventListener("pressmove", handleMove);
    };

    createjs.Touch.enable(stage);

    modifiersBar = [barContainer, modifiersNumber];
}

// Planet Methods
function addPlanet (x, y, outerColor, innerColor, outerRadius, innerRadius) {
	// Create container
 	planetContainer = new createjs.Container();
 	planetContainer.x = 0;
    planetContainer.y = 0;
    planetContainer.setBounds(0,0,stage.getBounds().width,stage.getBounds().height);

    // Add background ring
    var ringBgBitmap = new createjs.Bitmap(preloader.getResult("ringBg"));
    ringBgBitmap.x = 187;
    ringBgBitmap.y = 219;
    planetContainer.addChild(ringBgBitmap);

	// Create planet outer
	planetOuter = new createjs.Shape();
	planetOuter.graphics.beginStroke(outerColor).drawCircle(0, 0, outerRadius);
	planetOuter.graphics.beginFill(outerColor).drawCircle(0, 0, outerRadius);

	planetOuter.x = x;
	planetOuter.y = y;
    planetOuter.alpha = 0.5;

    planetOuterValue = outerRadius;

	planetContainer.addChild(planetOuter);

	// Create planet inner
	planetInner = new createjs.Shape();
	planetInner.graphics.beginStroke(innerColor).drawCircle(0, 0, innerRadius);
	planetInner.graphics.beginFill(innerColor).drawCircle(0, 0, innerRadius);

	planetInner.x = x;
	planetInner.y = y;

    planetInnerValue = innerRadius;

	planetContainer.addChild(planetInner);

    // Add foreground ring
    var ringFgBitmap = new createjs.Bitmap(preloader.getResult("ringFg"));
    ringFgBitmap.x = 188;
    ringFgBitmap.y = 221;
    planetContainer.addChild(ringFgBitmap);

    stage.addChild(planetContainer);
}

function setPlanetOuter (outerColor, outerRadius) {
	if (!planetOuter) {
		return;
	};

	planetOuter.graphics.clear();
	planetOuter.graphics.beginStroke(outerColor).drawCircle(0, 0, outerRadius);
	planetOuter.graphics.beginFill(outerColor).drawCircle(0, 0, outerRadius);
    planetOuterValue = outerRadius;
}

function setPlanetInner (innerColor, innerRadius) {
	if (!planetInner) {
		return;
	};

	planetInner.graphics.clear();
	planetInner.graphics.beginStroke(innerColor).drawCircle(0, 0, innerRadius);
	planetInner.graphics.beginFill(innerColor).drawCircle(0, 0, innerRadius);
    planetInnerValue = innerRadius;
}

// Circles Methods, color is a css compatible color value
function addCircle (x, y, color, value, maxValue) {
    var circle = new createjs.Shape();
    circle.graphics.beginFill(color).drawCircle(0, 0, circleRadius);

    //Set position of Shape instance.
    circle.x = x;
    circle.y = y;

    //Add Shape instance to stage display list.
    stage.addChild(circle);

    //Update stage will render next frame
    stage.update();

    circles.push([circle, maxValue]);

    return circles.length - 1;
}