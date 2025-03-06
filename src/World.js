import * as THREE from "three";
import {OBJLoader} from 'three/addons/loaders/OBJLoader.js';
import {MTLLoader} from 'three/addons/loaders/MTLLoader.js';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

//Stuff for requirements
//Point light with lanterns
//Hemisphere light
//Already have directional light
//
//Extras
//Shadows
//Fog if turned to night
//Billboards

const w = window.innerWidth;
const h = window.innerHeight;


//Renderer
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const fov = 90;
const aspect = w/h;
const near = 0.1;
const far = 50;
const color = 0xFFFFFF;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
const controls = new OrbitControls( camera, renderer.domElement );
const scene = new THREE.Scene();
const loader = new THREE.TextureLoader();
const cubeLoader = new THREE.CubeTextureLoader();
const objLoader = new OBJLoader();
const mtlLoader = new MTLLoader();
const warmLight = 0xfff2cc;

//Directional light (requirement)
const moonLight = new THREE.AmbientLight(0xaaaaaa, 0.2);  // Soft light, lower intensity
moonLight.castShadow = true; 

//Spot Light (requirement)
const spotLight1 = new THREE.SpotLight(warmLight, 5);
spotLight1.position.set(0.5,-2.5,-0.25);
spotLight1.angle = Math.PI / 6; // Control spread
spotLight1.castShadow = true;
spotLight1.target.position.set(0.5, -6, -0.25); // Directly below the light
scene.add(spotLight1.target);

const spotLight2 = new THREE.SpotLight(warmLight, 5);
spotLight2.position.set(-1.25,-2.5,-0.25);
spotLight2.angle = Math.PI / 6;
spotLight2.castShadow = true;
spotLight2.target.position.set(-1.25, -6, -0.25); // Directly below the light
scene.add(spotLight2.target);

const spotLight3 = new THREE.SpotLight(warmLight, 5);
spotLight3.position.set(-3,-2.5,-1);
spotLight3.angle = Math.PI / 6;
spotLight3.castShadow = true;
spotLight3.target.position.set(-3, -6, -1); // Directly below the light
scene.add(spotLight3.target);

const spotLight4 = new THREE.SpotLight(warmLight, 5);
spotLight4.position.set(-3,-2.5,-2.5);
spotLight4.angle = Math.PI / 6;
spotLight4.castShadow = true;
spotLight4.target.position.set(-3, -6, -2.5); // Directly below the light
scene.add(spotLight4.target);

// Point light
const shopLight = new THREE.PointLight(warmLight, 10); // Warm light, intensity 1, range 10
shopLight.position.set(0, -3, -2); // Place it inside the shop
shopLight.castShadow = true; // Enable shadows
shopLight.decay = 1.5;

// Moon
const moonGeometry = new THREE.SphereGeometry(1, 32, 32); // Radius 1, with 32 segments
const moonMaterial = new THREE.MeshStandardMaterial({
    color: 0xaaaaaa,
    emissive: 0xeeeeee, 
    emissiveIntensity: 0.1,
});
const moon = new THREE.Mesh(moonGeometry, moonMaterial);

moon.position.set(10, -5, -8); 

const glowGeometry = new THREE.SphereGeometry(1.5, 32, 32);
const glowMaterial = new THREE.MeshStandardMaterial({
    color: 0xeeeeee,
    opacity: 0.3,
    transparent: true,
});
const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
glowSphere.position.set(10, -5, -8);


// Moon point light
const moonPointLight = new THREE.PointLight(0xeeeeee, 20);
moonPointLight.position.set(10, -5, -8); 
moonPointLight.castShadow = true;  // Enable shadow casting from the moonlight

const dayTex = cubeLoader.load([
    "sky1.png",
    "sky1.png",
    "sky1.png",
    "sky1.png",
    "sky1.png",
    "sky1.png",
]);

const nightTex = cubeLoader.load([
    "night.png",
    "night.png",
    "night.png",
    "night.png",
    "night.png",
    "night.png",
]);

renderer.setSize(w,h);
document.body.appendChild(renderer.domElement);

//render plane
const planeSize = 30;
 
const texture = loader.load('grassSquare.png');
texture.wrapS = THREE.RepeatWrapping;
texture.wrapT = THREE.RepeatWrapping;
texture.magFilter = THREE.NearestFilter;
 
const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
const planeMat = new THREE.MeshStandardMaterial({
    map: texture,
    side: THREE.DoubleSide,
  });
planeMat.color.setRGB(1.5, 1.5, 1.5);
const mesh = new THREE.Mesh(planeGeo, planeMat);
mesh.rotation.x = Math.PI * -.5;
mesh.receiveShadow = true;
mesh.castShadow = false;
mesh.position.y = -5
scene.add(mesh);

camera.position.z = 8;
camera.position.y = -2;

//Load shop
mtlLoader.load('takoyakishop.mtl', (mtl) => {
    mtl.preload();
    objLoader.setMaterials(mtl);
    objLoader.load('takoyakishop.obj', (shop) => {
        shop.position.y = -5;
        shop.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true; // Enable shadows for all meshes
            }
        });
        scene.add(shop);
    });
});


scene.add(moonLight);
scene.add(spotLight1);
scene.add(spotLight2);
scene.add(spotLight3);
scene.add(spotLight4);
scene.add(shopLight);
scene.add(moon);
scene.add(moonPointLight);
scene.add(glowSphere);

const moonOrbitGroup = new THREE.Group();
scene.add(moonOrbitGroup);
moonOrbitGroup.add(moon);
moonOrbitGroup.add(glowSphere);
moonOrbitGroup.add(moonPointLight);

scene.background = nightTex;
scene.fog = new THREE.FogExp2(0xcccccc, 0.05); // Color and density


let worldPosition = new THREE.Vector3();

function animate(){
    requestAnimationFrame(animate);

    moonOrbitGroup.rotation.z += 0.01;

    moon.getWorldPosition(worldPosition)
    if (worldPosition.x < 0 && (worldPosition.y < -5 && worldPosition.y > -6)){
        scene.background = dayTex;
        scene.fog = null;
        spotLight1.intensity = 0;
        spotLight2.intensity = 0;
        spotLight3.intensity = 0;
        spotLight4.intensity = 0;
        moonLight.intensity = 1;

    }
    if (worldPosition.x > 0 && (worldPosition.y < -5 && worldPosition.y > -6)){
        scene.background = nightTex
        scene.fog = new THREE.FogExp2(0xcccccc, 0.05); // Color and density
        spotLight1.intensity = 5;
        spotLight2.intensity = 5;
        spotLight3.intensity = 5;
        spotLight4.intensity = 5;
        moonLight.intensity = 0.2;
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();


  

