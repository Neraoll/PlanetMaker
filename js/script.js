// Main
var canvas;
var stage;

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
            {src:"assets/icon3.png", id:"veg"},
            {src:"assets/icon4.png", id:"temp"},
            // {src:"credits.png", id:"credits"},
            // {src:"paddle.png", id:"cpu"},
            // {src:"paddle.png", id:"player"},
            // {src:"ball.png", id:"ball"},
            // {src:"win.png", id:"win"},
            // {src:"lose.png", id:"lose"},
            // {src:"playerScore.mp3|playerScore.ogg", id:"playerScore"},
            // {src:"enemyScore.mp3|enemyScore.ogg", id:"enemyScore"},
            // {src:"hit.mp3|hit.ogg", id:"hit"},
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

    createjs.Ticker.setFPS(10);
    createjs.Ticker.addEventListener("tick", gameTick);
}

function initUI () {
    // Place UI Elements

    // Mass
    var massBar = addBar(15, 15, "yellow", "mass", 0, 100, 5);

    // Aquatic
    var aquaBar = addBar(15, 65, "blue", "aqua", 0, 100, 5);

    // Temperature
    var tempBar = addBar(405, 15, "red", "temp", 0, 100, 5);

	// Vegetation
    var vegBar = addBar(405, 65, "green", "veg", 0, 100, 5);

	// Add counter bar
	addCounterBar(595, 115, "blue", 2, 6);

 //    circle.addEventListener("mousedown", handlePress);
 // function handlePress(event) {
 //     // A mouse press happened.
 //     // Listen for mouse move while the mouse is down:
 //     event.addEventListener("mousemove", handleMove);
 // }
 // function handleMove(event) {
 //     // Check out the DragAndDrop example in GitHub for more
 // }
 	// createjs.Touch.enable(stage);

 	var ok = false;

 	function handleClick(event) {
     	// Click Happened.
     	gameLoaded = !gameLoaded;
     }
 	canvas.addEventListener("click", handleClick);

 	

 	var val = 0;
    function handleTick() {
     //Circle will move 10 units to the right.
        //circle.x += 10;
        //Will cause the circle to wrap back
        //if (circle.x > stage.canvas.width) { circle.x = 0; }

        val = (val + 1) % 7;
        setBarValue(0, val*10);
        setCounterBarValue(val);
        // barContent.scaleY = val;
        stage.update();
    }

    animations.push(handleTick)

    gameLoaded = true;
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
	progressLbl.visible = false;
	stage.update();
	initUI();
}

// Game tick
function gameTick () {
	if (gameLoaded) {
		for (var i = animations.length - 1; i >= 0; i--) {
			animations[i]()
		};
	};

	stage.update();
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
function addModifiersBar (x, y) {
	if (modifiersBar) {
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

    modifiersBar = barContainer;
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