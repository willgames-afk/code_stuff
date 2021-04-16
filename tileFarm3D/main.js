THREE.Cache.enabled = false;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);

const geo = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geo, material);
scene.add(cube);

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
	const txmat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
	const text = new THREE.Mesh(txgeo, txmat);
	scene.add(text);

	camera.position.z = 5;

	document.getElementById("loadingmessage").remove();
	document.body.appendChild(renderer.domElement);

	function animate() {
		requestAnimationFrame(animate); //Set up next animation frame
	
		//Render the scene
		renderer.render(scene, camera);
	
		//Animate the cube
		if (camera.position.z < 20) {
			camera.position.z += 0.1;
		}
		text.position.x -= 0.06
		cube.rotation.x += 0.01;
		cube.rotation.y += 0.017;
	}
	animate();
})