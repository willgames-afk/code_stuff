import { CameraControls } from "./modules/cameraController.js";

THREE.Cache.enabled = false;
const DEVMODE = true;


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
console.log(camera);


const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    //Update camera settings so it knows how to render again
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
})

const sun = new THREE.DirectionalLight(0xffffff, 0.5);
const antiPitchBlack = new THREE.AmbientLight(0x333333);
scene.add(sun);
scene.add(antiPitchBlack);

const spinny = cube(0, 0, 0, 1, 0xffff00);

for (var x = -1.5; x < 1.5; x++) {
    for (var z = -1.5; z < 1.5; z++) {
        cube(x * 1.20 + 0.5, -2, z * 1.20 + 0.5, 1, 0x00ff00)
    }
}

const loader = new THREE.FontLoader();
loader.load('style/menlo.typeface.json', (font) => {
    console.log("Loaded!");
    console.log(font)
    const txgeo = new THREE.TextGeometry('Hi!', {
        font: font,
        size: 1,
        height: 1,
        curveSegments: 12,
    });
    const txmat = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const text = new THREE.Mesh(txgeo, txmat);
    //scene.add(text);

    camera.position.z = 5;

    document.getElementById("loadingmessage").remove();
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
})

function cube(x, y, z, s = 1, c = 0x00ff00) {
    const geo = new THREE.BoxGeometry(s, s, s);
    const mat = new THREE.MeshLambertMaterial({ color: c });
    const cube = new THREE.Mesh(geo, mat);
    cube.position.x = x, cube.position.y = y, cube.position.z = z;
    scene.add(cube)
    return cube;
}

function colorcubefield(x,z) {
    //Make a field of differently colored unit cubes x by z cubes long
}