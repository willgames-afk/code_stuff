import {log, error, optLog} from "./logging.js";
export class GameState {
	constructor() {
		this.rotation = 0;
		this.run = true;
		this.player = {};
		this.player.pos = vec3.fromValues(0,0,1);
		this.player.direction = vec3.fromValues(0,0,0);
		log("Successful Game State Init!");
		optLog(this)
	}
}
export class GameLogic {
	constructor(gameState) {
		this.gameState = gameState;
	}
	tick(deltaTime) {
		this.gameState.rotation += deltaTime;
	}
}