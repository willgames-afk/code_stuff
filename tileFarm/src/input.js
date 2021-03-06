export class InputManager {
	constructor(DOMElement,gameLogic) {
		this.DOMElement = DOMElement;
		this.gameLogic = gameLogic;
		this.initateEventListeners();
	}
	initateEventListeners() {
		this.DOMElement.addEventListener("keydown", this.onkeydown.bind(this));
		this.DOMElement.addEventListener("keyup", this.onkeyup.bind(this));
		this.DOMElement.addEventListener("mousemove", this.onmousemove.bind(this));
	}
	onkeydown(e) {
		this.gameLogic.gameState.keys[e.code] = true;
	}
	onkeyup(e) {
		this.gameLogic.gameState.keys[e.code] = false;
	}
	onmousemove(e) {
		console.log(e)
		this.gameLogic.gameState.mouse.x
	}
}