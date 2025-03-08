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

// Ingredient boxes
const boxGem = new THREE.BoxGeometry( 1, 1, 1 );

const crateTex = loader.load('crate.png');
crateTex.wrapS = THREE.RepeatWrapping;
crateTex.wrapT = THREE.RepeatWrapping;
crateTex.magFilter = THREE.NearestFilter;

const boxMat = new THREE.MeshStandardMaterial({
    map: crateTex,
    side: THREE.DoubleSide,
  });

const box1 = new THREE.Mesh(boxGem, boxMat);
box1.position.set(5,-4.5,-1);

const box2 = new THREE.Mesh(boxGem, boxMat);
box2.position.set(5.8,-4.5,-.25);

const box3 = new THREE.Mesh(boxGem, boxMat);
box3.position.set(5.4,-3.5,-0.5);

box1.rotation.y = 45;
box2.rotation.y = 45;
box3.rotation.y = 45;

box1.castShadow = true;
box2.castShadow = true;
box3.castShadow = true;

// Road
const roadGeometry = new THREE.PlaneGeometry( 30, 5 );
const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x333333, side: THREE.DoubleSide });
const road = new THREE.Mesh(roadGeometry, roadMaterial);
road.rotation.x = -Math.PI / 2;
road.position.z = 6;
road.position.y = -4.9

const lineGeometry = new THREE.PlaneGeometry( 5, 1 );
const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
const roadline1 = new THREE.Mesh(lineGeometry, lineMaterial);
roadline1.rotation.x = -Math.PI / 2;
roadline1.position.z = 6;
roadline1.position.y = -4.8

const roadline2 = new THREE.Mesh(lineGeometry, lineMaterial);
roadline2.rotation.x = -Math.PI / 2;
roadline2.position.x = -10;
roadline2.position.z = 6;
roadline2.position.y = -4.8

const roadline3 = new THREE.Mesh(lineGeometry, lineMaterial);
roadline3.rotation.x = -Math.PI / 2;
roadline3.position.x = 10;
roadline3.position.z = 6;
roadline3.position.y = -4.8







// Moon point light
const moonPointLight = new THREE.PointLight(0xeeeeee, 20);
moonPointLight.position.set(10, -5, -8); 
moonPointLight.castShadow = true;  // Enable shadow casting from the moonlight

function makeLabelCanvas( baseWidth, size, name ) {

    const borderSize = 2;
    const ctx = document.createElement( 'canvas' ).getContext( '2d' );
    const font = `${size}px bold sans-serif`;
    ctx.font = font;
    // measure how long the name will be
    const textWidth = ctx.measureText( name ).width;

    const doubleBorderSize = borderSize * 2;
    const width = baseWidth + doubleBorderSize;
    const height = size + doubleBorderSize;
    ctx.canvas.width = width;
    ctx.canvas.height = height;

    // need to set font again after resizing canvas
    ctx.font = font;
    ctx.textBaseline = 'middle';
    ctx.textAlign = 'center';

    ctx.fillStyle = 'dark purple';
    ctx.fillRect( 0, 0, width, height );

    // scale to fit but don't stretch
    const scaleFactor = Math.min( 1, baseWidth / textWidth );
    ctx.translate( width / 2, height / 2 );
    ctx.scale( scaleFactor, 1 );
    ctx.fillStyle = 'white';
    ctx.fillText( name, 0, 0 );

    return ctx.canvas;

}


const canvas = makeLabelCanvas( 150, 32, 'Lonely Takoyaki Shop' );
const labelTex = new THREE.CanvasTexture( canvas );
labelTex.minFilter = THREE.LinearFilter;
labelTex.wrapS = THREE.ClampToEdgeWrapping;
labelTex.wrapT = THREE.ClampToEdgeWrapping;

const labelMaterial = new THREE.SpriteMaterial( {
    map: labelTex,
    transparent: true,
} );

// Create label for billboard
const label = new THREE.Sprite( labelMaterial );
label.scale.x = 8;
label.position.z = -2;
label.position.y += 2;

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
scene.add(box1);
scene.add(box2);
scene.add(box3);
scene.add(label);
scene.add(road);
scene.add(roadline1);
scene.add(roadline2);
scene.add(roadline3);

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


  

