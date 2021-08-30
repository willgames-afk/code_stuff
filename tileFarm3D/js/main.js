import * as THREE from "../libs/three.module.js"
import { CameraControls } from "./Player/cameraController.js";
import { Assets } from "./Loader.js";
import * as Config from "./config.js"

THREE.Cache.enabled = Config.cacheEnabled;

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//console.log(camera);


const renderer = new THREE.WebGLRenderer();//{ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {
	renderer.setSize(window.innerWidth, window.innerHeight);
	//Update camera settings so it knows how to render again
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
})

const sun = new THREE.DirectionalLight("#ffffff", 0.5);
scene.add(sun);

const antiPitchBlack = new THREE.AmbientLight("#333333");
scene.add(antiPitchBlack);


	//Remove Loading Message
document.getElementById("loadingmessage").style.display = 'none';