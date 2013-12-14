// Main
var canvas;
var stage;
var preloader;
var gameLoaded = false;

// Assets
var assets;

var animations = [];

// Bars
var barWidth = 50;
var barHeight = 200;
var bars = [];

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

	//Create a Shape DisplayObject.
    circle = new createjs.Shape();
    circle.graphics.beginFill("red").drawCircle(0, 0, 40);

    //Set position of Shape instance.
    circle.x = circle.y = 50;

    //Add Shape instance to stage display list.
    // stage.addChild(circle);

    // barBorder = new createjs.Shape();
    // barBorder.graphics.beginStroke("black").drawRect(0, 0, 50, 200);

    // //Set position of Shape instance.
    // barBorder.x = barBorder.y = 100;

    // //Add Shape instance to stage display list.
    // stage.addChild(barBorder);

    // barContent = new createjs.Shape();
    // barContent.graphics.beginFill("red").drawRect(0, 0, 48, 198);

    // //Set position of Shape instance.
    // barContent.x = 101;
    // barContent.y = 101;

    // //Add Shape instance to stage display list.
    // stage.addChild(barContent);

    //Update stage will render next frame
    stage.update();

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

 	addBar(0, 0, "red", 0, 100, 5);

 	var val = barContent.scaleY;
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
	barBorder = new createjs.Shape();
    barBorder.graphics.beginStroke("black").drawRect(0, 0, barWidth, barHeight);

    //Set position of Shape instance.
    barBorder.x = x;
    barBorder.y = y;

    //Add Shape instance to stage display list.
    stage.addChild(barBorder);

    barContent = new createjs.Shape();
    barContent.graphics.beginFill(color).drawRect(0, 0, barWidth - 2, barHeight - 2);

    //Set position of Shape instance.
    barContent.x = x + 1;
    barContent.y = y + 1;

    //Add Shape instance to stage display list.
    stage.addChild(barContent);

    //Update stage will render next frame
    stage.update();

    bars.push([barContent, maxValue]);
}

function setBarValue (index, value) {
	var newHeight = value * (barHeight / bars[index][1]);
	bars[index][0].scaleY = newHeight / barHeight;

	// TODO animations
}