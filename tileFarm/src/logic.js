import {log, error, optLog} from "./logging.js";
export class GameState {
	constructor() {
		this.rotation = 0;
		this.run = true;
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