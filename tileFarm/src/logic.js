import {log, error, optLog} from "./logging.js";
export class GameState {
	constructor() {
		this.rotation = 0;
		this.run = true;
		this.player = {
			speed: 2.5,
			friction: 0.9
		};
		this.player.pos = vec3.fromValues(0,0,1);
		this.player.direction = vec3.fromValues(0,0,0);
		this.player.vel = vec3.fromValues(0,0,0)
		this.keys = [];
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

		var player = this.gameState.player
		var speed = player.speed * deltaTime;

		var k = this.gameState.keys
		if (k.KeyW || k.ArrowUp) {
			vec3.add(
				this.gameState.player.vel,
				this.gameState.player.vel,
				vec3.scale(vec3.create(), vec3.fromValues(0,0,1), speed)
			)
		} else if (k.KeyS || k.ArrowDown) {
			vec3.add(
				this.gameState.player.vel,
				this.gameState.player.vel,
				vec3.scale(vec3.create(), vec3.fromValues(0,0,-1), speed)
			)
		}
		if (k.KeyA || k.ArrowRight) {
			vec3.add(
				this.gameState.player.vel,
				this.gameState.player.vel,
				vec3.scale(vec3.create(), vec3.fromValues(1,0,0), speed)
			)
		} else if (k.KeyD || k.ArrowLeft) {
			vec3.add(
				this.gameState.player.vel,
				this.gameState.player.vel,
				vec3.scale(vec3.create(), vec3.fromValues(-1,0,0), speed)
			)
		}
		vec3.scale(
			player.vel,
			player.vel,
			player.friction//vec3.scale(vec3.create(), player.friction, speed)
		)

		vec3.add(
			player.pos, 
			player.pos,
			player.vel//vec3.scale(vec3.create(), player.vel, deltaTime)
		)
	}
	onkeydown(e) {
		console.log(this)
		switch (e.code) {
			case "KeyW":
			case "ArrowUp":
				vec3.add(
					this.gameState.player.pos,
					this.gameState.player.pos,
					vec3.scale(vec3.create(), vec3.fromValues(0,0,-1), this.gameState.player.speed)
				)
				break;
			
		}
	}
	onkeyup(e) {

	}
	updatePosition() {
		vec3.add(
			this.gameState.player.pos,
			this.gameState.player.pos,
			vec3.fromValues(0,0,-1)
		)
	}
}