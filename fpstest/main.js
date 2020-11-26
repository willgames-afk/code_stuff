var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshPhongMaterial({ 
    color: 0x00ff00,});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const light = new THREE.PointLight(0xff0000, 1, 100)
light.position.set(0, 10, 0).normalize();
scene.add(light)

camera.position.z = 5;

function render() {
    requestAnimationFrame(render);
    cube.rotation.x += 0.01
    cube.rotation.y += 0.01
    renderer.render(scene, camera);
}
render();