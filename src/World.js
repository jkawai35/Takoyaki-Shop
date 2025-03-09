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

//Ambient Light (requirement)
const moonLight = new THREE.AmbientLight(0xaaaaaa, 0.2);  // Soft light, lower intensity

//Directional Light
const dirLight = new THREE.DirectionalLight(0xaaaaaa);
dirLight.position.set(0,10,10);
dirLight.castShadow = true;

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
road.receiveShadow = true;

const lineGeometry = new THREE.PlaneGeometry( 5, 1 );
const lineMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, side: THREE.DoubleSide });
const roadline1 = new THREE.Mesh(lineGeometry, lineMaterial);
roadline1.rotation.x = -Math.PI / 2;
roadline1.position.z = 6;
roadline1.position.y = -4.8
roadline1.receiveShadow = true;

const roadline2 = new THREE.Mesh(lineGeometry, lineMaterial);
roadline2.rotation.x = -Math.PI / 2;
roadline2.position.x = -10;
roadline2.position.z = 6;
roadline2.position.y = -4.8
roadline2.receiveShadow = true;

const roadline3 = new THREE.Mesh(lineGeometry, lineMaterial);
roadline3.rotation.x = -Math.PI / 2;
roadline3.position.x = 10;
roadline3.position.z = 6;
roadline3.position.y = -4.8
roadline3.receiveShadow = true;

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

function createCone(){
    const coneFinished = new THREE.Object3D();
    const coneGeo = new THREE.ConeGeometry( .5, 1.5, 30 );
    const coneMat = new THREE.MeshStandardMaterial({
        color: "orange",
    });
    const cone = new THREE.Mesh(coneGeo, coneMat);
    cone.castShadow = true;

    const baseGeo = new THREE.BoxGeometry(1, .25, 1);
    const baseMat = new THREE.MeshStandardMaterial({
        color: '#ff8c00',
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y -= .75;

    coneFinished.add(cone);
    coneFinished.add(base);
    return coneFinished;

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

// Creat cones
const cone1 = createCone();
cone1.position.y = -4;
cone1.position.z = 3;
cone1.position.x = -12;

const cone2 = createCone();
cone2.position.y = -4;
cone2.position.z = 3;
cone2.position.x = -9;

const cone3 = createCone();
cone3.position.y = -4;
cone3.position.z = 3;
cone3.position.x = -6;

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

// Car
function createCar() {
    const car = new THREE.Group();

    const bodyGeometry = new THREE.BoxGeometry(4, 1, 2);
    const bodyMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 }); // Red color
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.5; 
    car.add(body);

    const roofGeometry = new THREE.BoxGeometry(2.5, 0.8, 1.5);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: 0x990000 }); // Darker red
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.set(0, 1, 0);
    car.add(roof);

    const wheelGeometry = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 16);
    const wheelMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 }); // Black wheels

    function createWheel(x, z) {
        const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
        wheel.rotation.z = Math.PI / 2; 
        wheel.rotation.y = Math.PI / 2;
        wheel.position.set(x, 0.25, z);
        car.add(wheel);
    }

    const headlightMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffcc, 
        emissive: 0xffffcc, 
        emissiveIntensity: 3 
    });
    
    const headlightGeometry = new THREE.SphereGeometry(0.2, 16, 16);
    const headlight1 = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlight1.position.set(-2, 0.5, -.5);
    car.add(headlight1);
    
    const headlight2 = new THREE.Mesh(headlightGeometry, headlightMaterial);
    headlight2.position.set(-2, 0.5, .5);
    car.add(headlight2);

    const headlightLight = new THREE.SpotLight(warmLight, 2);
    headlightLight.angle = Math.PI / 6;
    headlightLight.position.set(-2, 0.5, -.5);
    headlightLight.target.position.set(-7, 0.5, -.5); 
    car.add(headlightLight);
    car.add(headlightLight.target);

    const headlightLight2 = new THREE.SpotLight(warmLight, 2);
    headlightLight2.angle = Math.PI / 6;
    headlightLight2.position.set(-2, 0.5, .5); 
    headlightLight2.target.position.set(-7, 0.5, .5); 
    car.add(headlightLight2);
    car.add(headlightLight2.target);

    createWheel(-1.5, 1); // Front left
    createWheel(1.5, 1);  // Front right
    createWheel(-1.5, -1); // Rear left
    createWheel(1.5, -1);  // Rear right

    car.userData.headLights = [headlightLight, headlightLight2];
    car.castShadow = true;
    
    return car;
}

const car = createCar();
car.position.set(10, -5, 6);

const car2 = createCar();
car2.position.set(-5, -5, 6);

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
scene.add(cone1);
scene.add(cone2);
scene.add(cone3);
scene.add(dirLight);
scene.add(car);
scene.add(car2);

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
        car.userData.headLights.forEach(light => {
            light.intensity = 0;
        });
        car2.userData.headLights.forEach(light => {
            light.intensity = 0;
        });

    }
    if (worldPosition.x > 0 && (worldPosition.y < -5 && worldPosition.y > -6)){
        scene.background = nightTex
        scene.fog = new THREE.FogExp2(0xcccccc, 0.05); // Color and density
        spotLight1.intensity = 5;
        spotLight2.intensity = 5;
        spotLight3.intensity = 5;
        spotLight4.intensity = 5;
        moonLight.intensity = 0.2;
        car.userData.headLights.forEach(light => {
            light.intensity = 5;
        });
        car2.userData.headLights.forEach(light => {
            light.intensity = 5;
        });
    }

    controls.update();
    renderer.render(scene, camera);
}

animate();


  

