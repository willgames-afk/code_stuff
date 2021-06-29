import * as THREE from "https://unpkg.com/three@latest/build/three.module.js"
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

const assets = new Assets(start.bind(this));


assets.load();

function start() {
    //const db = assets.createBlock("dirt");
    //console.log(db);
    //document.body.appendChild(db.material.map.image);
    //scene.add(db);

    //console.log(assets)

    const spinny = cube(0, 0, 0, 1, 0xffff00);

    for (var x = -1.5; x < 1.5; x++) {
        for (var z = -1.5; z < 1.5; z++) {
            cube(x * 1.20 + 0.5, -2, z * 1.20 + 0.5, 1, 0x00ff00);
        }
    }

    camera.position.z = 5;

    const dirtBox = new THREE.BoxGeometry(1, 1, 1);
    console.log(assets.blockTextures.log)
    const dirtMat = new THREE.MeshLambertMaterial({  map: assets.blockTextures.log});
    const dirtBlock = new THREE.Mesh(dirtBox, dirtMat);
    scene.add(dirtBlock);

    //Remove Loading Message
    document.getElementById("loadingmessage").style.display = 'none';

    //Display Graphics
    document.body.appendChild(renderer.domElement);
    var controls = new CameraControls(camera, renderer.domElement)

    var doControls = true;
    var prevTime = 0;
    var counter = 0;
    function animate(ct) {
        requestAnimationFrame(animate); //Set up next animation frame

        var dt = ((ct - prevTime) / 16) || 1
        prevTime = ct;

        counter += dt;

        //console.log(dt)

        //Render the scene
        if (doControls) {
            try {
                controls.tick(dt);
            } catch (e) {
                console.error(e);
                doControls = false;
            }
        }
        renderer.render(scene, camera);

        //Animate the cube
        /*if (camera.position.z < 20) {
            camera.position.z += 0.1;
        }*/
        //text.position.x -= 0.06
        spinny.rotation.x += (0.01 * dt);
        spinny.rotation.y += (0.017 * dt);
        spinny.position.y = (Math.sin(counter / 50) + 1) / 2
    }
    animate();
}

function cube(x, y, z, s = 1, c = 0x00ff00) {
    console.log(assets.blockTextures.dirt)
    const geo = new THREE.BoxGeometry(s, s, s);
    const mat = new THREE.MeshLambertMaterial({map: assets.blockTextures.dirt});
    const cube = new THREE.Mesh(geo, mat);
    cube.position.x = x, cube.position.y = y, cube.position.z = z;
    scene.add(cube)
    return cube;
}

function colorcubefield(x, z) {
    //Make a field of differently colored unit cubes x by z cubes long
}