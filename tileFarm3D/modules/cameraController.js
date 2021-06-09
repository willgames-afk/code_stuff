export class CameraControls {
    constructor(camera,domElement, sensitivity = 0.05, friction = 0.9, maxSpeed = 1) {

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
            this.camera.rotation.x += (e.movementY/Math.PI) * this.sensitivity;
            this.camera.rotation.y += (e.movementX/Math.PI) * this.sensitivity;
            if (this.camera.rotation.x > Math.PI/2) {
                this.camera.rotation.x = Math.PI/2
            } else if (this.camera.rotation.x < -Math.PI/2) {
                this.camera.rotation.x = -Math.PI/2;
            }
            this.camera.rotation.z=0;
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

        const p = this.camera.rotation.y;
        const directionVector = { //Camera Angle
            z: this.sensitivity * Math.cos(p),
            x: this.sensitivity * Math.sin(p)
        }
        const leftVec = { //90 degree offest; for strafing
            z: this.sensitivity * Math.cos(p - Math.PI/2),
            x: this.sensitivity * Math.sin(p - Math.PI/2),
        }

        //Movement
        if (this.state.forwards && !this.state.backwards) { //Forwards/Backwards 
            this.vx -= directionVector.x;
            this.vz -= directionVector.z;
        } else if (this.state.backwards && !this.state.forwards) {
            this.vx += directionVector.x;
            this.vz += directionVector.z;
        }

        if(this.state.left && !this.state.right) {
            this.vx += leftVec.x;
            this.vz += leftVec.z;
        } else if (this.state.right && !this.state.left) {
            this.vx -= leftVec.x;
            this.vz -= leftVec.z
        }
        
        if (this.state.up && !this.state.down) {
            this.vy += this.sensitivity
        } else if (this.state.down && !this.state.up) {
            this.vy -= this.sensitivity
        }

        //Speed Cap; Stop accelerating past this point
        if (this.vx > this.maxSpeed) {this.vx = this.maxSpeed}
        if (this.vy > this.maxSpeed) {this.vy = this.maxSpeed}
        if (this.vz > this.maxSpeed) {this.vz = this.maxSpeed}

        this.camera.position.x += this.vx;
        this.camera.position.y += this.vy;
        this.camera.position.z += this.vz;
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vz *= this.friction;
    }
}
