import { log, error, optLog } from "./logging.js";
export class GameState {
	constructor() {
		this.rotation = 0;
		this.run = true;
		this.player = {
			speed: 2.5,
			friction: 0.9,
			mouseSensitivity: 0.005, //Scale down a lot, angles are in radians.
			yaw: -(Math.PI / 2), //90 Degrees (2 PI rads = 360 degs; div by 4 to get pi/2 rads = 90degs)
			pitch: 0,
		};
		this.player.pos = vec3.fromValues(0, 0, 1);
		this.player.direction = vec3.fromValues(
			Math.cos(this.player.yaw) * Math.cos(this.player.pitch),
			Math.sin(this.player.pitch),
			Math.sin(this.player.yaw) * Math.cos(this.player.pitch)
		)
		this.player.vel = vec3.fromValues(0, 0, 0)
		this.keys = [];
		this.mouse = {
			xChange: 0,
			yChange: 0
		}
		log("Successful Game State Init!");
		optLog(this)
	}
}
export class GameLogic {
	constructor(gameState) {
		this.gameState = gameState;
		log("GameLogic Init!")
	}
	tick(deltaTime) {
		//Animate Cube
		this.gameState.rotation += deltaTime;

		//Convineince Vars
		var player = this.gameState.player
		var k = this.gameState.keys
		var m = this.gameState.mouse

		//Player Speed Multiplier with DeltaTime
		var speed = player.speed * deltaTime;

		//Position calculation
		if (k.KeyW || k.ArrowUp) {
			vec3.add(
				this.gameState.player.vel,
				this.gameState.player.vel,
				vec3.scale(vec3.create(), this.gameState.player.direction, speed)
			)
		} else if (k.KeyS || k.ArrowDown) {
			vec3.subtract(
				this.gameState.player.vel,
				this.gameState.player.vel,
				vec3.scale(vec3.create(), this.gameState.player.direction, speed)
			)
		}

		/*
		if (k.KeyA || k.ArrowRight) {
			vec3.add(
				this.gameState.player.vel,
				this.gameState.player.vel,
				vec3.scale(vec3.create(), vec3.fromValues(1, 0, 0), speed)
			)
		} else if (k.KeyD || k.ArrowLeft) {
			vec3.add(
				this.gameState.player.vel,
				this.gameState.player.vel,
				vec3.scale(vec3.create(), vec3.fromValues(-1, 0, 0), speed)
			)
		}
		*/

		//Decrease velocity by friction
		vec3.scale(
			player.vel,
			player.vel,
			player.friction//vec3.scale(vec3.create(), player.friction, speed)
		)
		//Apply velocities to position
		vec3.add(
			player.pos,
			player.pos,
			player.vel//vec3.scale(vec3.create(), player.vel, deltaTime)
		)

	}
	updateDirection(mcX, mcY) {
		const sensitivity = this.gameState.player.mouseSensitivity;
		this.gameState.player.yaw += (mcX * sensitivity);
		this.gameState.player.pitch += (mcY * -sensitivity);

		var pitch = this.gameState.player.pitch;
		if (pitch >= Math.PI/2) { //90 Degrees in Radians
			pitch = Math.PI/2 - 0.001;
		} else if (pitch <= -Math.PI/2) {
			pitch = -Math.PI/2 + 0.001;
		}
		this.gameState.player.pitch = pitch

		var yaw = this.gameState.player.yaw;
		var dir = vec3.fromValues(
			Math.cos(yaw) * Math.cos(pitch),
			Math.sin(pitch),
			Math.sin(yaw) * Math.cos(pitch)
		)
		vec3.normalize(dir,dir);
		//console.log(dir)
		this.gameState.player.direction = dir;
	}
}