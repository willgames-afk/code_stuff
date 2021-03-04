import { error } from "./logging.js"
export class Angle3D {
	constructor(lat, long) {
		this.lat = lat;
		this.long = long;
	}
}
export class Vector2D {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	get angle() {
		//!! USE WITH CARE; EXPENSIVE!!
		return Math.atan2(this.x, this.y);
	}
	set angle(a) {
		var r = this.magnitude; //Only calculate once;
		this.x = r * Math.cos(a);
		this.y = r * Math.sin(a);
	}
	get magnitude() {
		//!! AS CHEAP AS POSSIBLE
		return Math.hypot(this.x, this.y) || Math.sqrt(this.x * this.x + this.y * this.y);//Fallbacks
	}
	set magnitude(r) {
		var a = this.angle; //calculate once
		this.x = r * Math.cos(a);
		this.y = r * Math.sin(a);
	}
	get z() { error("Vector2D Error: Vector is 2D."); return 0; }
	set z() { error("Vector2D Error: Vector is 2D."); return false; }
	add(v) {
		if (v.x && v.y) {
			//it's a vector; add x and y components
			this.x += v.x;
			this.y += v.y;
		} else if (typeof v == "number") {
			//it's a scalar; add magnitude.
			this.magnitude += v;
		}
		return this;
	}
	subtract(v) {
		if (v.x && v.y) { //Vector
			this.x -= v.x;
			this.y -= v.y;
		} else if (typeof v == "number") { //Scalar
			this.magnitude -= v
		}
		return this;
	}
	multiply(v) {
		if (typeof v == "number") {
			this.x *= v;
			this.y *= v;
			return this;
		} // else
		error("Vector2D Error: Multiply can only multiply vectors by scalars (numbers); use Vector2D.dot or Vector2D.cross instead.");
		return false;
	}
	static dot(v1, v2) {
		return v1.x * v2.x + v1.y * v2.y;
	}
	static cross(v1, v2) {
		return new Vector3D(0, 0, v1.x * v2.y - v1.y * v2.x);
	}
}
export class Vector3D {
	constructor(x, y, z) {
		this.x = x;
		this.y = y;
		this.z = z;
	}
	get angle() {
		//!! USE WITH CARE; EXPENSIVE!!
		return new Angle3D(Math.acos(this.z / this.r), Math.acos(this.x / (Math.hypot(this.x, this.y) || Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z)) * (y < 0 ? -1 : 1)))
	}
	set angle(a) {
		var r = this.magnitude; //Only calculate once;
		this.x = r * Math.sin(a.lat) * Math.cos(a.long);
		this.y = r * Math.sin(a.lat) * Math.sin(a.long);
		this.z = r * Math.cos(a.lat);
	}
	get magnitude() {
		//!! AS CHEAP AS POSSIBLE
		return Math.hypot(this.x, this.y, this.z) || Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);//Fallbacks
	}
	set magnitude(r) {
		var a = this.angle; //calculate once
		this.x = r * Math.sin(a.lat) * Math.cos(a.long);
		this.y = r * Math.sin(a.lat) * Math.sin(a.long);
		this.z = r * Math.cos(a.lat);
	}
	add(v) {
		if (v.x && v.y) {
			//it's a vector; add x and y components
			this.x += v.x;
			this.y += v.y;
			this.z += v.z;
		} else if (typeof v == "number") {
			//it's a scalar; add magnitude.
			this.magnitude += v;
		}
	}
	subtract(v) {
		if (v.x && v.y) { //Vector
			this.x -= v.x;
			this.y -= v.y;
			this.z -= v.z;
		} else if (typeof v == "number") { //Scalar
			this.magnitude -= v;
		}
	}
	multiply(v) {
		if (typeof v == "number") {
			this.x *= v;
			this.y *= v;
			return this;
		} // else
		error("Vector3D Error: Multiply can only multiply vectors by scalars (numbers); use Vector2D.dot or Vector2D.cross instead.");
		return false;
	}
	static dot(v1, v2) {
		return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
	}
	static cross(v1, v2) {
		return new Vector3D(
			v1.y * v2.z - v1.z * v2.y,
			v1.z * v2.x - v1.x * v2.z,
			v1.x * v2.y - v1.y * v2.x
		);
	}
}
export function isPowerOf2(v) {
	return (value & (value-1)) == 0;
}