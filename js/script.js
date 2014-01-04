// Main
var canvas;
var stage;
var needUpdate = false;
var animations = new Object();

// Preload
var preloader;
var progressLbl;
var gameLoaded = false;
var waitingForLoading = false;

// Assets
var assets;

// Colors
var bgUiColor = "#EDEDED";
var massColor = "#D8C46C";
var tempColor = "#E27493";
var aquaColor = "#4AA5D3";
var vegeColor = "#33CC8E";
var brunColor = "#E8D0AA";
var counterColor = "#588293";
var planetColor = "#EDEDED";
var atmoColor = "rgb(237, 237, 237)";
var tutorialBgColor = "rgb(32, 104, 132)";
var tutorialTextColor = "white";

// Key codes
var KEYCODE_M = 77;

// Dynamic key events
var keyEvents = [];

// Tutorial Dialog
var tutorialDialogContainer;

// Bars
var barWidth = 330;
var barHeight = 40;
var bars = [];

// Counter Bar
var counterNumber = 8;
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
var draggedModifier;

// Race
var raceContainer;
var racesNumber = 6;

// Planet
var planetContainer;
var planetOuter;
var planetInner;
var planetInnerValue;
var planetOuterValue;
var planetInnerBrun;
var planetInnerGreen;
var planetInnerBrunValue;
var planetInnerGreenValue;
var planetSelectedScale = 1.05;
var innerSelected = false;
var outerSelected = false;

// Sound
var musicPlayer;
var musicPlayerLoopInterval;
var soundPlayer;

// Circles
var circleRadius = 50;
var circles = [];

// Game data
var data;
var textData;
var raceData;
var planetData;
var gameData;
var planet;
var race;
var modifiers;
var score;
var scoreLbl;
var links;

// Game state
var waitingForRestart = false;
var waitingForTutorial = false;

function gameInit () {
	// Get canvas
	canvas = document.getElementById("gameCanvas");

	// Create stage
	stage  = new createjs.Stage(canvas);

	// Enable mouse events
    stage.mouseEventsEnabled = true;

    // Enable mouse move event outside of the stage
    stage.mouseMoveOutside = true;

    // Set assets
    createjs.Sound.alternateExtensions = ["mp3"];
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
            {src:"assets/sound-on.png", id:"soundBtnOn"},
            {src:"assets/sound-off.png", id:"soundBtnOff"},
            {src:"js/data.json", id:"data"},
            {src:"SD/TantumLocus_Music_Menu.ogg", id:"musicMenu"},
            {src:"SD/TantumLocus_Music1.ogg", id:"music1"},
            {src:"SD/TantumLocus_Music2.ogg", id:"music2"},
            {src:"SD/TantumLocus_Music3.ogg", id:"music3"},
            {src:"SD/Tic1.ogg", id:"tic1"},
            {src:"SD/Tic2.ogg", id:"tic2"},
            {src:"SD/Score_Neg.ogg", id:"scoreNeg"},
            {src:"SD/Score_Pos.ogg", id:"scorePos"},
    ];

    for(var i=1 ; i <= 4 ; i++)
    {
        for(var j=1 ; j <= 6 ; j++)
        {
            assets.push({src:"assets/races/race"+i+"_0"+j+".png", id:"race"+i+"_0"+j}); 
        }
    }

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
    textData = data.texts;
    raceData = data.race;
    planetData = data.planet;
    gameData = data.game;
    planet = gameData.planet;
    race = gameData.race;
    modifiers = gameData.modifiers;
    links = data.links;
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
    // planetContainer.visible = false;
    // planetContainer.alpha = 1.0;

    if (!scoreLbl) {
        // Create Progress label
        scoreLbl = new createjs.Text(score + "%", "100px Verdana", "white");
        scoreLbl.textAlign = "center";
        scoreLbl.x = canvas.width / 2;
        scoreLbl.y = canvas.height / 2;
        stage.addChild(scoreLbl);
        scoreLbl.alpha = 0.0;
    } else {
        scoreLbl.visible = true;
        scoreLbl.alpha = 0.0;
        scoreLbl.text = score + "%";
    };

    addAnimation("EndGameTransition", animationWith(function alpha () {
            planetContainer.alpha -= 0.06;
            scoreLbl.alpha += 0.06;
        }, 1.0 / 0.06));

    needUpdate = true;
}

function computeScore () {
        waitingForRestart = true;

        score = 0;
        for (var i = 0; i < bars.length; i++) {
            // 100 - (abs(ValeurRaceDemandée - ValeurPlanèteActuelle) * 100 / abs(ValeurDemandéeRace - ValeurPlanèteDépart))
            var barVal = bars[i][2];
            var startVal =  bars[i][3];
            var raceVal =  bars[i][4];
            score += 100 - ((Math.abs(raceVal - barVal) * 100) / (Math.abs(raceVal - startVal) + 1));
        };
        score /= 4;
        score = Math.ceil(score);

    // Play music
    if (score > 0) {
        playMusic("scorePos", false, 0.8, false);
        musicPlayer.setVolume(1.0);
    } else {
        playMusic("scoreNeg", false, 0.8, false);
        musicPlayer.setVolume(1.0);
    };
    setTimeout(fireScore, 1000);
}

function barIndexForId (barId) {
    var index = 0;
    if (barId == "mass") {
        index = 0;
    } else if (barId == "aqua") {
        index = 1;
    } else if (barId == "temp") {
        index = 2;
    } else if (barId == "vege") {
        index = 3;
    };
    return index;
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

    // Change base bar
    var index = barIndexForId(barId);
    setBarValue(index, bars[index][2] + value);
    setPlanetState();

    // Change links bar
    var valueMultiplier = modifiers[modifier.idx].link;
    var linkdata = links[barId];
    if (value > 0) {
        for (var key in linkdata.up) {
            var newVal = linkdata.up[key] * valueMultiplier;
            // console.log(barId + " " + valueMultiplier + " up " + key);
            var barIdx = barIndexForId(key);

            setBarValue(barIdx, bars[barIdx][2] + newVal);
        };
    } else {
        for (var key in linkdata.down) {
            var newVal = linkdata.down[key] * valueMultiplier;
            // console.log(barId + " " + newVal + " down " + key);
            var barIdx = barIndexForId(key);

            setBarValue(barIdx, bars[barIdx][2] + newVal);
        };
    };

    // Remove one chance
    setCounterBarValue(counterBarValue + 1);

    // Plays sound
    playSound("tic2");

    // Deselect

    needUpdate = true;
}

function startGame () {
    waitingForLoading = true;

    if (gameLoaded) {
        playGameMusic();
    };
}

function restartGame () {
    //Nouvelle race
    raceContainer.removeAllChildren();
    addRace();

    //Nouvelle planète
    newPlanet();

    // Update UI
    setPlanetState();

    // Mass
    setBarValue(0, planet.startValue.mass);
    setBarBestValue(0, race.value.mass);
    
    // Aquatic
    setBarValue(1, planet.startValue.aqua);
    setBarBestValue(1, race.value.aqua);

    // Temperature
    setBarValue(2, planet.startValue.temp);
    setBarBestValue(2, race.value.temp);

    // Vegetation
    setBarValue(3, planet.startValue.vege);
    setBarBestValue(3, race.value.vege);

    // Reset counter bar value
    setCounterBarValue(0);

    scoreLbl.visible = false;
    scoreLbl.alpha = 1.0;
    planetContainer.visible = true;
    planetContainer.alpha = 1.0;

    score = null;

    playGameMusic();
    needUpdate = true;
}

function handleKeyUp (e) {
    //cross browser issues exist
    if(!e){ var e = window.event; }

    // Dynamic events
    if (keyEvents[e.keyCode]) {
        keyEvents[e.keyCode].handler();
    };

    // Constant event
    switch(e.keyCode) {
    }
}

function initUI () {
    // Add background
    var backgroundBitmap = new createjs.Bitmap(preloader.getResult("bg"));
    stage.addChild(backgroundBitmap);

    newPlanet();

    // Add planet
    addPlanet(400, 330, planetColor, atmoColor, 150, 80);

    // Create container
    raceContainer = new createjs.Container();
    raceContainer.x = 0;
    raceContainer.y = 0;
    raceContainer.setBounds(0,0,stage.getBounds().width,stage.getBounds().height);
    stage.addChild(raceContainer);
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
    counterBarWidth = counterNumber * 30 + 10;
	addCounterBar(800 - (counterBarWidth + 15), 115, counterColor, 0, counterNumber);

    // Add modifiers bar
    addModifiersBar(705, 165, modifiersMaxNumber);

    // Add Sound Button
    addSoundButton(755, 505);
    
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

        if (waitingForTutorial && waitingForLoading) {
            hideTutorial();
            return;
        };

        if (draggedModifier) {
            // Detect collision
            // Fix detection (change for center pos)
            draggedModifier.sprite.x += (draggedModifier.sprite.getBounds().height / 2);
            draggedModifier.sprite.y += (draggedModifier.sprite.getBounds().height / 2);
            // Planet
            if (lineDistance(draggedModifier.sprite, planetInner) < planetInnerValue) {
                // console.log("inner");
                dropModifier(planetInner, draggedModifier);
            }
            // Atmosphere
            else if (lineDistance(draggedModifier.sprite, planetOuter) < planetOuterValue) {
                dropModifier(planetOuter, draggedModifier);
            };

            // Remove modifier
            stage.removeChild(draggedModifier.sprite);
            draggedModifier = null;

            // Deselect planet
            setPlanetInnerSelected(false);
            setPlanetOuterSelected(false);

            needUpdate = true;
        };
    }
    // We Don't do it on the canvas because the mouse can go outside of it
    window.addEventListener("mouseup", handleUp);

    // Add keyboard handling
    window.onkeyup = handleKeyUp;

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

    // animations.push({handler: handleTick, count: 5});

    setPlanetState();

    if (waitingForLoading) {
        playGameMusic();
    };

    // Show tutorial
    showTutorial();

    gameLoaded = true;
}

function addRace () {
    var rand = Math.ceil(Math.random()*racesNumber); 
    var raceTestBitmap = new createjs.Bitmap(preloader.getResult("race3_0"+rand));
    raceTestBitmap.x = 15;
    raceTestBitmap.y = 400;
    raceContainer.addChild(raceTestBitmap);

    var rand = Math.ceil(Math.random()*racesNumber); 
    var raceTestBitmap = new createjs.Bitmap(preloader.getResult("race4_0"+rand));
    raceTestBitmap.x = 30;
    raceTestBitmap.y = 415;
    raceContainer.addChild(raceTestBitmap);

    var rand = Math.ceil(Math.random()*racesNumber); 
    var raceTestBitmap = new createjs.Bitmap(preloader.getResult("race2_0"+rand));
    raceTestBitmap.x = 30;
    raceTestBitmap.y = 345;
    raceContainer.addChild(raceTestBitmap);

    var rand = Math.ceil(Math.random()*racesNumber); 
    var raceTestBitmap = new createjs.Bitmap(preloader.getResult("race1_0"+rand));
    raceTestBitmap.x = 75;
    raceTestBitmap.y = 385;
    raceContainer.addChild(raceTestBitmap);


    rName = generateName(raceData, 2);

    raceName = new createjs.Text(rName,"15px Verdana",bgUiColor);
    raceName.lineWidth = 110;
    raceName.textAlign = "center";
    raceName.x = 85;
    raceName.y = 340;
    raceContainer.addChild(raceName);

    //New value
    gameData.race.value.mass = 10 + Math.floor(Math.random()*80);
    gameData.race.value.temp = 10 + Math.floor(Math.random()*80);
    gameData.race.value.vege = 10 + Math.floor(Math.random()*80);
    gameData.race.value.aqua = 10 + Math.floor(Math.random()*80);
}

function generateName(tData, minChar){
    // Create Name Race label
    var rName = "";
    rand = minChar + Math.floor(Math.random()*2); 
    for(var i=0 ; i < rand ; i++){
        var rand2 = Math.floor(Math.random()*tData.length);
        rName += tData[rand2];
    }

    return rName.charAt(0).toUpperCase() + rName.slice(1);
}

function initSound () {
    if (!musicPlayer) {
        playMusic("musicMenu", true, 0.2, true);
    };

    // musicPlayer = createjs.Sound.play("music1");
    // music2player = createjs.Sound.play("music2");
    // music2player.setVolume(0.0);
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
    initSound();
}

// Game tick
function gameTick () {
	if (gameLoaded) {
        var animationsCount = 0;

		for (var key in animations) {
            animationsCount++;

			animations[key].handler()
            animations[key].count--;

            if (animations[key].count <= 0) {
                if (animations[key].endHandler) {
                    animations[key].endHandler();
                }
                removeAnimation(key);
            };
		};

        if (animationsCount > 0) {
            needUpdate = true;
        };
	};

    // Check for visual feed back every 10 ticks
    if (createjs.Ticker.getTicks(false) % 10 == 0) {
        // Check for dragged modifier feedback
        if (draggedModifier) {
            checkForModifierMovement();
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
    if (!value) { value = 0};
    if (value < 0) { value = 0; };
    if (value > bars[index][1]) { value = bars[index][1]; };
    
	var newWidth = value * (barWidth / bars[index][1]);
    bars[index][2] = value;
	
    // Animation
    var barShape = bars[index][0].getChildAt(1);
    var delta = (newWidth / barWidth) - barShape.scaleX;
    function animation () {
        barShape.scaleX += delta / 30;
    }
    addAnimation("BarValue" + index, animationWith(animation, 30)); // with 30fps the animation time is 1 sec
}

function setBarBestValue (index, value) {
    if (!value) { value = 0};
    if (value < 0) { value = 0; };
    if (value > bars[index][1]) { value = bars[index][1]; };

	var newX = bars[index][0].getChildAt(1).x + (value * (barWidth / bars[index][1]));
    bars[index][4] = value;

    // Animation
	var barShape = bars[index][0].getChildAt(2);
    var delta =  newX - barShape.x;
    function animation () {
        barShape.x += delta / 30;
    }
    addAnimation("BarBestValue" + index, animationWith(animation, 30));
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

        function handleMove(evt) {
            if (waitingForRestart || waitingForTutorial) {return;};

            if (!draggedModifier) {
                var modifierIdx = modifiersBtns.indexOf(evt.target);

                // Duplicate object
                draggedModifier = new createjs.Bitmap(preloader.getResult("modifier" + modifierIdx));
                draggedModifier = {sprite:draggedModifier, idx:modifierIdx};
                stage.addChild(draggedModifier.sprite);

                // Play sound
                playSound("tic1");
            };

            draggedModifier.sprite.x = evt.stageX - (draggedModifier.sprite.getBounds().height / 2);
            draggedModifier.sprite.y = evt.stageY - (draggedModifier.sprite.getBounds().width / 2);

            needUpdate = true;
        }
        modifiersBitmap.addEventListener("pressmove", handleMove);
    };

    createjs.Touch.enable(stage);

    modifiersBar = [barContainer, modifiersNumber];
}

// Handle feedback when modifiers move
function checkForModifierMovement () {
    if (!draggedModifier) {
        return;
    };

    // Check for planet feedbacks
    // Get center pos
    var centerPos = {x:draggedModifier.sprite.x + (draggedModifier.sprite.getBounds().width / 2), y:draggedModifier.sprite.y + (draggedModifier.sprite.getBounds().height / 2)}

    // Planet
    if (lineDistance(centerPos, planetInner) < planetInnerValue) {
        setPlanetInnerSelected(true);
        setPlanetOuterSelected(false);
        needUpdate = true;
    }
    // Atmosphere
    else if (lineDistance(centerPos, planetOuter) < planetOuterValue) {
        setPlanetInnerSelected(false);
        setPlanetOuterSelected(true);
        needUpdate = true;
    } else if (innerSelected || outerSelected) {
        setPlanetInnerSelected(false);
        setPlanetOuterSelected(false);
        needUpdate = true;
    };
}

// Sound Button
function addSoundButton (x, y) {
    // Create container
    var btnContainer = new createjs.Container();
    btnContainer.x = x;
    btnContainer.y = y;

    // Create sound button
    var soundBtnContainer = new createjs.Container();
    
    // Get bitmaps
    var soundBtnOnBitmap = new createjs.Bitmap(preloader.getResult("soundBtnOn"));
    var soundBtnOffBitmap = new createjs.Bitmap(preloader.getResult("soundBtnOff"));
    
    // Add to the container
    soundBtnContainer.addChild(soundBtnOffBitmap);
    soundBtnContainer.addChild(soundBtnOnBitmap);

    // Init visibility
    soundBtnOnBitmap.visible = true;
    soundBtnOffBitmap.visible = false;

    // Handle click
    function handleClick (event) {
        if (createjs.Sound.getMute()) {
            // Change visibility
            soundBtnOnBitmap.visible = true;
            soundBtnOffBitmap.visible = false;

            // Un-mute all sound
            createjs.Sound.setMute(false);
        } else {
            // Change visibility
            soundBtnOnBitmap.visible = false;
            soundBtnOffBitmap.visible = true;

            // Mute all sound
            createjs.Sound.setMute(true);
        };

        needUpdate = true;
    }
    soundBtnContainer.addEventListener("click", handleClick);

    // Add key events
    keyEvents[KEYCODE_M] = {handler: handleClick};

    // Add to the container
    btnContainer.addChild(soundBtnContainer);

    // Add to stage
    stage.addChild(btnContainer);
}

function newPlanet()
{
    //Nouvelle planête
    gameData.planet.startValue.mass = 10 + Math.floor(Math.random()*80);
    gameData.planet.startValue.temp = 10 + Math.floor(Math.random()*80);
    gameData.planet.startValue.vege = 10 + Math.floor(Math.random()*80);
    gameData.planet.startValue.aqua = 10 + Math.floor(Math.random()*80);

    gameData.planet.currentValue.mass = gameData.planet.startValue.mass;
    gameData.planet.currentValue.temp = gameData.planet.startValue.temp;
    gameData.planet.currentValue.vege = gameData.planet.startValue.vege;
    gameData.planet.currentValue.aqua = gameData.planet.startValue.aqua;
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

    // Create planet innerBrun
    planetInnerBrun = new createjs.Shape();
    planetInnerBrun.graphics.beginStroke(innerColor).drawCircle(0, 0, innerRadius);
    planetInnerBrun.graphics.beginFill(innerColor).drawCircle(0, 0, innerRadius);

    planetInnerBrun.x = x;
    planetInnerBrun.y = y;

    planetInnerBrunValue = innerRadius;

    planetContainer.addChild(planetInnerBrun);

    // Create planet innerGreen
    planetInnerGreen = new createjs.Shape();
    planetInnerGreen.graphics.beginStroke(innerColor).drawCircle(0, 0, innerRadius);
    planetInnerGreen.graphics.beginFill(innerColor).drawCircle(0, 0, innerRadius);

    planetInnerGreen.x = x;
    planetInnerGreen.y = y;

    planetInnerGreenValue = innerRadius;

    planetContainer.addChild(planetInnerGreen);

    // Add foreground ring
    var ringFgBitmap = new createjs.Bitmap(preloader.getResult("ringFg"));
    ringFgBitmap.x = 188;
    ringFgBitmap.y = 221;
    planetContainer.addChild(ringFgBitmap);

    pName = generateName(planetData, 2);

    planetName = new createjs.Text(pName,"15px Verdana",bgUiColor);
    planetName.lineWidth = 110;
    planetName.textAlign = "center";
    planetName.x = 400;
    planetName.y = 500;
    planetContainer.addChild(planetName);

    stage.addChild(planetContainer);
}

function setPlanetState () {

    var blueRadius = 50 + (75 * bars[0][2] / 100);
    setPlanetInner(aquaColor, blueRadius);

    var brunRadius = blueRadius * (100 - bars[1][2]) / 100;
    // Ensure that the inner border is always visible
    brunRadius--;
    setPlanetInnerBrun(brunColor, brunRadius);

    var greenRadius = brunRadius * bars[3][2] / 100;
    // Ensure that the inner border is always visible
    greenRadius--;
    setPlanetInnerGreen(vegeColor, greenRadius);

    var atmoTemp = Math.round(120 + (117 * (100 - bars[2][2]) / 100));
    setPlanetOuter("rgb(237, "+atmoTemp+", "+atmoTemp+")", planetOuterValue);
}

function setPlanetOuter (outerColor, outerRadius) {
	if (!planetOuter) {
		return;
	};

    if (outerRadius < 0) {
        outerRadius = 0;
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

    if (innerRadius < 0) {
        innerRadius = 0;
    };

	planetInner.graphics.clear();
	planetInner.graphics.beginStroke(bgUiColor).drawCircle(0, 0, innerRadius);
	planetInner.graphics.beginFill(innerColor).drawCircle(0, 0, innerRadius);
    planetInnerValue = innerRadius;
}

function setPlanetInnerBrun (innerColor, innerRadius) {
    if (!planetInnerBrun) {
        return;
    };

    if (innerRadius < 0) {
        innerRadius = 0;
    };

    planetInnerBrun.graphics.clear();
    planetInnerBrun.graphics.beginStroke(innerColor).drawCircle(0, 0, innerRadius);
    planetInnerBrun.graphics.beginFill(innerColor).drawCircle(0, 0, innerRadius);
    planetInnerBrunValue = innerRadius;
}

function setPlanetInnerGreen (innerColor, innerRadius) {
    if (!planetInnerGreen) {
        return;
    };

    if (innerRadius < 0) {
        innerRadius = 0;
    };

    planetInnerGreen.graphics.clear();
    planetInnerGreen.graphics.beginStroke(innerColor).drawCircle(0, 0, innerRadius);
    planetInnerGreen.graphics.beginFill(innerColor).drawCircle(0, 0, innerRadius);
    planetInnerGreenValue = innerRadius;
}

function setPlanetInnerSelected (selected) {
    var newScale = selected ? planetSelectedScale : 1.0;

    planetInner.scaleX = newScale;
    planetInner.scaleY = newScale;
    planetInnerBrun.scaleX = newScale;
    planetInnerBrun.scaleY = newScale;
    planetInnerGreen.scaleX = newScale;
    planetInnerGreen.scaleY = newScale;

    innerSelected = selected;
}

function setPlanetOuterSelected (selected) {
    var newScale = selected ? planetSelectedScale : 1.0;

    planetOuter.scaleX = newScale;
    planetOuter.scaleY = newScale;

    outerSelected = selected;
}

function showTutorial (argument) {
    waitingForTutorial = true;

    // Create dialog container
    tutorialDialogContainer = new createjs.Container();
    tutorialDialogContainer.x = 250;
    tutorialDialogContainer.y = 125;
    tutorialDialogContainer.alpha = 0.0;

    // Create dialog shape
    var dialogBackground = new createjs.Shape();
    dialogBackground.graphics.beginStroke(bgUiColor).drawRect(0, 0, 300, 300);
    dialogBackground.graphics.beginFill(tutorialBgColor).drawRect(0, 0, 300, 300);

    dialogBackground.alpha = 0.9;

    // Add shape
    tutorialDialogContainer.addChild(dialogBackground);

    // Create labels
    var tutorialLbl = new createjs.Text(textData.tutorial, "18px Verdana", tutorialTextColor);
    tutorialLbl.lineWidth = 300;
    tutorialLbl.textAlign = "center";
    tutorialLbl.x = 150;
    tutorialLbl.y = 10;

    var tutorialCloseLbl = new createjs.Text(textData.tutorialClose, "18px Verdana", tutorialTextColor);
    tutorialCloseLbl.lineWidth = 300;
    tutorialCloseLbl.textAlign = "center";
    tutorialCloseLbl.x = 150;
    tutorialCloseLbl.y = 270;

    // Add labels
    tutorialDialogContainer.addChild(tutorialLbl);
    tutorialDialogContainer.addChild(tutorialCloseLbl);

    // Add container to stage
    stage.addChild(tutorialDialogContainer)

    // Animate showing
    var delta = 1.0 / 14;
    function animation () {
        tutorialDialogContainer.alpha += delta;
    }
    addAnimation("TutorialShowing", animationWith(animation, 14));
}

function hideTutorial (argument) {
    // Animate hiding
    var delta = 1.0 / 14;
    function animation () {
        tutorialDialogContainer.alpha -= delta;
    }
    function animationEnd () {
        waitingForTutorial = false;
        stage.removeChild(tutorialDialogContainer);
    }
    addAnimation("TutorialHiding", animationWith(animation, 14, animationEnd));
}

// Animations
function animationWith (handler, count, endHandler) {
    return {handler: handler, count: count ? count : 1, endHandler: endHandler};
}

// Add/Repalce animation in the dictionary. Each animation use a key to avoid conflict, and to be able to remove it easly.
function addAnimation (key, animation) {
    if (!key) {
        return;
    };

    animations[key] = animation;
}

function removeAnimation (key) {
    if (!key) {
        return;
    };

    animations[key] = null;
    delete animations[key];
}

// Musics/Sound
function playMusic (name, loop, volume, fadeIn) {
    if (musicPlayer) {
        fadeMusicINOUT(name, volume);
        // musicPlayer.stop();
    } else {
        musicPlayer = createjs.Sound.play(name);
        if (fadeIn) {
            musicPlayer.setVolume(0);
            addAnimation("MusicFadeIn", animationWith(function handle () {
                musicPlayer.setVolume(musicPlayer.getVolume() + 0.01);
            }, volume / 0.01))
        } else {
            musicPlayer.setVolume(volume);
        };
    }
    
    if (loop) {
        if (musicPlayerLoopInterval) {
            clearInterval(musicPlayerLoopInterval);
        };

        function playAgain(event) {
            console.log("loop");
            fadeMusicINOUT(musicPlayer.src, musicPlayer.getVolume());
        }
        musicPlayerLoopInterval = setInterval(playAgain, musicPlayer.getDuration() - 500)
    };
}

function playSound (name) {
    if (soundPlayer) {
        soundPlayer.stop();
    };

    soundPlayer = createjs.Sound.play(name);
    soundPlayer.setVolume(1.0);
}

function fadeMusicINOUT (newMusic, volume) {
    var delta = volume / 12;

    var oldPlayer = musicPlayer;

    musicPlayer = createjs.Sound.play(newMusic);
    musicPlayer.setVolume(0);

    addAnimation("OldMusicFadeOut", animationWith(function handle () {
        oldPlayer.setVolume(oldPlayer.getVolume() - delta);
    }, 12));

    addAnimation("NewMusicFadeIn", animationWith(function handle () {
        musicPlayer.setVolume(musicPlayer.getVolume() + delta);
    }, 12));
}

function playGameMusic () {
    var rand = Math.floor(Math.random()*3) + 1;
    playMusic("music" + rand, true, 0.2, true);
}