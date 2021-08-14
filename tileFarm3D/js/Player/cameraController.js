import {Vector3} from "../../libs/three.module.js"


export class CameraControls {
    constructor(camera,domElement, sensitivity = 0.009, friction = 0.9, maxSpeed = 1) {

        this.keys = {
            forwards: ["KeyW","ArrowUp"],
            backwards: ["KeyS","ArrowDown"],
            up: ["Space"],
            down: ["ShiftLeft","ShiftRight"],
            left: ["KeyA","ArrowLeft"],
            right: ["KeyD","ArrowRight"],
        }
        this.state = {};
        for (var key in this.keys) {
            this.state[key] = false;
        }
        console.log(this.state)

        this.camera = camera;
        this.domElement = domElement;
        this.sensitivity = sensitivity;
        this.friction = friction;
        this.maxSpeed = 1;
		this.lat = 0;
		this.long = 0;

        this.domElement.addEventListener("mousedown", this.onMouseDown.bind(this));
        this.domElement.addEventListener("mousemove", this.onMouseMove.bind(this));
        this.domElement.addEventListener("mouseup", this.onMouseUp.bind(this));
        document.addEventListener("keydown", this.onKeyDown.bind(this));
        document.addEventListener("keyup", this.onKeyUp.bind(this));

        //Camera Velocity
        this.vx = 0; this.vy = 0; this.vz=0;

        this.mouseDown = false;
    }
    onMouseDown() {
        this.mouseDown = true;
    }
    onMouseMove(e) {
    
        //TODO- fix rotation so it rotates relative to current camera position and not
        // axises

        if (this.mouseDown === true) {
			var targetRotation = new Vector3();

            this.long += (e.movementY/Math.PI) * this.sensitivity;
            this.lat += (e.movementX/Math.PI) * this.sensitivity;
            if (this.long > Math.PI/2) {
                this.long = Math.PI/2
            } else if (this.long < -Math.PI/2) {
                this.long = -Math.PI/2;
            }
            targetRotation.setFromSphericalCoords(1,this.long,Math.PI/2 - this.lat).add(this.camera.position);
			this.camera.lookAt(targetRotation);
			this.camera.updateProjectionMatrix();
        }
    }
    onMouseUp() {
        this.mouseDown = false;
    }
    onKeyDown(e) {
        for (var dir in this.keys) {
            if (this.keys[dir].includes(e.code)) {
                this.state[dir] = true;
                return
            }
        }
    }
    onKeyUp(e) {
        for (var dir in this.keys) {
            if (this.keys[dir].includes(e.code)) {
                this.state[dir] = false;
                return
            }
        }
    }
    tick(dt) {

        //TODO- use deltaTime

        //Movement
        if (this.state.forwards && !this.state.backwards) { //Forwards/Backwards 
            this.vz -= this.sensitivity
        } else if (this.state.backwards && !this.state.forwards) {
            this.vz += this.sensitivity
        }

        if(this.state.left && !this.state.right) {
            this.vx -= this.sensitivity
        } else if (this.state.right && !this.state.left) {
            this.vx += this.sensitivity
        }
        
        if (this.state.up && !this.state.down) {
            this.vy += this.sensitivity
        } else if (this.state.down && !this.state.up) {
            this.vy -= this.sensitivity
        }

        //Speed Cap; Stop accelerating past this point
        if (this.vx > this.maxSpeed) this.vx = this.maxSpeed
        if (this.vy > this.maxSpeed) this.vy = this.maxSpeed
        if (this.vz > this.maxSpeed) this.vz = this.maxSpeed
		if (this.vx < -this.maxSpeed) this.vx = -this.maxSpeed
        if (this.vy < -this.maxSpeed) this.vy = -this.maxSpeed
        if (this.vz < -this.maxSpeed) this.vz = -this.maxSpeed

        this.camera.translateX(this.vx);
        this.camera.translateY(this.vy);
        this.camera.translateZ(this.vz);
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vz *= this.friction;
    }
}
