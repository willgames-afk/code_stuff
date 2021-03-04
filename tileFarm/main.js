import * as Graphics from "./src/graphics.js"
import {log,optLog} from "./src/logging.js"
import * as Logic from "./src/logic.js"
log("Main is up and running!")
class Game {
	constructor() {
		this.state = new Logic.GameState(); //Create Gamestate
		this.logic = new Logic.GameLogic(this.state); //Create Game Logic
		this.display = new Graphics.Display(document.body, window.innerWidth, window.innerHeight); //Make and configure Webgl Canvas (display)
		this.renderer = new Graphics.Rendererer(this.display,this.state); //Self Explanitory
		this.timeLastRendered = 0;
	}
	mainLoop(now) {
		//Calculate Delta
		now *= 0.001 //Convert to seconds
		const deltaTime = now-this.timeLastRendered; //Get time since last render;
		this.timeLastRendered = now;

		this.logic.tick(deltaTime);
		this.renderer.render();

		//Continue Looping
		if (this.state.run) {
			requestAnimationFrame(this.mainLoop.bind(this));
		}
	}
	start() {
		requestAnimationFrame(this.mainLoop.bind(this))
	}
}

var game = new Game();
game.start();