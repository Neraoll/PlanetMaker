// Main
var canvas;
var stage;
var preloader;
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
var counterCircleRadius = 20;
var counterBar;

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
            // {src:"bg.png", id:"bg"},
            // {src:"main.png", id:"main"},
            // {src:"startB.png", id:"startB"},
            // {src:"creditsB.png", id:"creditsB"},
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

    createjs.Ticker.setFPS(30);
    createjs.Ticker.addEventListener("tick", gameTick);

    preloader = new createjs.LoadQueue();
    preloader.installPlugin(createjs.Sound);
    // preloader.onProgress = handleProgress;
    // preloader.onComplete = handleComplete;
    // preloader.onFileLoad = handleFileLoad;
    preloader.loadManifest(assets);


    // Place UI Elements

    // Mass
    var massBar = addBar(65, 15, "yellow", 0, 100, 5);

    // Aquatic
    var aquaBar = addBar(65, 65, "blue", 0, 100, 5);

    // Temperature
    var tempBar = addBar(455, 15, "red", 0, 100, 5);

	// Vegetation
    var vegBar = addBar(455, 65, "green", 0, 100, 5);


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

        val = (val + 1) % 100;
        setBarValue(0, val);
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
}
 
function handleComplete(event) {
         //triggered when all loading is complete
}
 
function handleFileLoad(event) {
         //triggered when an individual file completes loading
             
         switch(event.type)
         {
            case PreloadJS.IMAGE:
            //image loaded
            var img = new Image();
            img.src = event.src;
            img.onload = handleLoadComplete;
            window[event.id] = new Bitmap(img);
            break;
 
            case PreloadJS.SOUND:
            //sound loaded
            handleLoadComplete();
            break;
         }
}

// Game tick
function gameTick () {
	if (gameLoaded) {
		for (var i = animations.length - 1; i >= 0; i--) {
			animations[i]()
		};
	};
}

// Bars Methods, color is a css compatible color value
function addBar (x, y, color, value, maxValue, bestValue) {
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

	// Create bar background
    var barBackground = new createjs.Shape();
    barBackground.graphics.beginFill("black").drawRect(0, 0, barWidth, barHeight);

    //Set position of Shape instance.
    barBackground.x = 0;
    barBackground.y = 0;

    //Add Shape instance to stage display list.
    barContainer.addChild(barBackground);

	// Create bar content
    var barContent = new createjs.Shape();
    barContent.graphics.beginFill(color).drawRect(0, 0, barWidth, barHeight);

    //Set position of Shape instance.
    barContent.x = 0;
    barContent.y = 0;

    //Add Shape instance to stage display list.
    barContainer.addChild(barContent);

    // Add best value
    var bestValueBar = new createjs.Shape();
    bestValueBar.graphics.beginFill("black").drawRect(0, 0, 1, barHeight);

    bestValueBar.x = bestValue * (barWidth / maxValue);
    bestValueBar.y = 0;

    barContainer.addChild(bestValueBar);

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
    barBackground.graphics.beginFill("black").drawRect(0, 0, counterBarWidth, counterBarHeight);

    // Add circles
    for (var i = 0; i < maxValue; i++) {
    	// Create circle
    	var c = createjs.Shape();
    	c.graphics.beginFill(circleColor).drawCircle(0, 0, counterCircleRadius);

    	// Add to the container

    };

    //Add Shape instance to stage display list.
    barContainer.addChild(barBackground);

    // Add to stage
    stage.addChild(barContainer);
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