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

// Bars
var barWidth = 330;
var barHeight = 40;
var bars = [];

// Counter Bar
var counterBarWidth = 190;
var counterBarHeight = 40;
var counterCircleRadius = 10;
var counterBar;

// Modifiers Bar
var modifiersBarWidth = 80;
var modifiersBarHeight = 320;
var modifiersMaxNumber = 5;
var modifiersBar;

// Planet
var planetOuter;
var planetInner;

// Sound
var musicPlayer;
var music2player;

// Circles
var circleRadius = 50;
var circles = [];

function gameInit () {
	// Get canvas
	canvas = document.getElementById("gameCanvas");

	// Create stage
	stage  = new createjs.Stage(canvas);

	// Enable mouse events
    stage.mouseEventsEnabled = true;

    // Set assets
    assets = [
            {src:"assets/icon1.png", id:"mass"},
            {src:"assets/icon2.png", id:"aqua"},
            {src:"assets/icon3.png", id:"vege"},
            {src:"assets/icon4.png", id:"temp"},
            {src:"assets/element-10.png", id:"modifiers"},
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

    createjs.Ticker.setFPS(1);
    createjs.Ticker.addEventListener("tick", gameTick);
}

function initUI () {
	// Add planet
	addPlanet(400, 350, "blue", "white", 200, 80);

    // Place UI Elements

    // Mass
    var massBar = addBar(15, 15, "yellow", "mass", 0, 100, 5);

    // Aquatic
    var aquaBar = addBar(15, 65, "blue", "aqua", 0, 100, 5);

    // Temperature
    var tempBar = addBar(405, 15, "red", "temp", 0, 100, 5);

    // Vegetation
    var vegBar = addBar(405, 65, "green", "vege", 0, 100, 5);

    // Add counter bar
    addCounterBar(595, 115, "blue", 2, 6);

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
        if (musicPlayer.isPlaying) {};
                musicPlayer.stop();

    }
 	canvas.addEventListener("click", handleClick);

 	createjs.Sound.PL

 	var val = 0;
    var vol = 1.0;
    var up = true;
    function handleTick() {
     //Circle will move 10 units to the right.
        //circle.x += 10;
        //Will cause the circle to wrap back
        //if (circle.x > stage.canvas.width) { circle.x = 0; }

        val = (val + 1) % 7;
        setBarValue(0, val*10);
        setCounterBarValue(val);

        
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

    animations.push(handleTick)

    gameLoaded = true;
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
	initUI();
    // initSound();
}

// Game tick
function gameTick () {
	if (gameLoaded) {
        var len = animations.length;
		for (var i = 0; i < len; i++) {
			animations[i]()
		};

        needUpdate = (len > 0);
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
    barBackground.graphics.beginFill("black").drawRect(0, 0, barWidth, barHeight);

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
    bestValueBar.graphics.beginFill("black").drawRect(0, 0, 1, barHeight);

    bestValueBar.x = barX + bestValue * (barWidth / maxValue);
    bestValueBar.y = 0;

    barContainer.addChild(bestValueBar);

    // Add icon at the end
    barContainer.addChild(icon);

	// Add container
    stage.addChild(barContainer);

    //Update stage will render next frame
    stage.update();

    bars.push([barContainer, maxValue]);

    return bars.length - 1;
}

function setBarValue (index, value) {
	var newWidth = value * (barWidth / bars[index][1]);
	bars[index][0].getChildAt(1).scaleX = newWidth / barWidth;

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
    barBackground.graphics.beginStroke("black").drawRect(0, 0, counterBarWidth, counterBarHeight);
    barBackground.graphics.beginFill("black").drawRect(0, 0, counterBarWidth, counterBarHeight);

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

    counterBar = [barContainer, maxValue, circleColor];
}

function setCounterBarValue (value) {
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
}

// Modifiers Bar
function addModifiersBar (x, y, modifiersNumber) {
	if (modifiersBar) {
		return;
	};

	// Create container
 	var barContainer = new createjs.Container();
 	barContainer.x = x;
    barContainer.y = y;

	// Create bar background
    var barBackground = new createjs.Shape();
    barBackground.graphics.beginStroke("black").drawRect(0, 0, modifiersBarWidth, modifiersBarHeight);
    barBackground.graphics.beginFill("black").drawRect(0, 0, modifiersBarWidth, modifiersBarHeight);

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
        var modifiersBitmap = new createjs.Bitmap(preloader.getResult("modifiers"));

    	modifiersBitmap.x = x + 16;
    	modifiersBitmap.y = y + modifiersY;
    	modifiersY += modifiersBitmap.getBounds().height + modifiersSpace;

    	// Add to the container
    	stage.addChild(modifiersBitmap);

        // modifiersBitmap.addEventListener("mousemove", handleMove);
        modifiersBitmap.addEventListener("pressmove", handleMove);
        modifiersBitmap.identifier = i;
        function handleMove(evt) {
            evt.target.x = evt.stageX;
            evt.target.y = evt.stageY;

            needUpdate = true;
            // Check out the DragAndDrop example in GitHub for more
            // console.log(event);
        }
    };

    createjs.Touch.enable(stage);

    modifiersBar = [barContainer, modifiersNumber];
}

// Planet Methods
function addPlanet (x, y, outerColor, innerColor, outerRadius, innerRadius) {
	// // Create container
 // 	var barContainer = new createjs.Container();
 // 	barContainer.x = x;
 //    barContainer.y = y;

	// Create planet outer
	planetOuter = new createjs.Shape();
	planetOuter.graphics.beginStroke(outerColor).drawCircle(0, 0, outerRadius);
	planetOuter.graphics.beginFill(outerColor).drawCircle(0, 0, outerRadius);

	planetOuter.x = x;
	planetOuter.y = y;

	stage.addChild(planetOuter);

	// Create planet inner
	planetInner = new createjs.Shape();
	planetInner.graphics.beginStroke(innerColor).drawCircle(0, 0, innerRadius);
	planetInner.graphics.beginFill(innerColor).drawCircle(0, 0, innerRadius);

	planetInner.x = x;
	planetInner.y = y;

	stage.addChild(planetInner);
}

function setPlanetOuter (outerColor, outerRadius) {
	if (!planetOuter) {
		return;
	};

	planetOuter.graphics.clear();
	planetOuter.graphics.beginStroke(outerColor).drawCircle(0, 0, outerRadius);
	planetOuter.graphics.beginFill(outerColor).drawCircle(0, 0, outerRadius);
}

function setPlanetInner (innerColor, innerRadius) {
	if (!planetInner) {
		return;
	};

	planetInner.graphics.clear();
	planetInner.graphics.beginStroke(innerColor).drawCircle(0, 0, innerRadius);
	planetInner.graphics.beginFill(innerColor).drawCircle(0, 0, innerRadius);
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