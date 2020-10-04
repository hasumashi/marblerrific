'use strict';
import './style.css'

// import {
// 	Engine,
// 	Scene,
// } from '@babylonjs/core';

// import { Vector2, Vector3 } from "@babylonjs/core/Maths/math";
// import { ArcRotateCamera, FreeCamera } from "@babylonjs/core/Cameras";
// import { Mesh } from "@babylonjs/core/Meshes/mesh";

// import {
// 	HemisphericLight,
// 	PointLight
// } from "@babylonjs/core/Lights";

// // Side-effects only imports allowing the standard material to be used as default.
// import "@babylonjs/core/Materials/standardMaterial";
// // Side-effects only imports allowing Mesh to create default shapes (to enhance tree shaking, the construction methods on mesh are not available if the meshbuilder has not been imported).
// import "@babylonjs/core/Meshes/Builders/sphereBuilder";
// import "@babylonjs/core/Meshes/Builders/boxBuilder";

// // import "@babylonjs/core/Physics/physicsEngineComponent"

import * as BABYLON from 'babylonjs';

import * as CANNON from "cannon";
window.CANNON = CANNON;

const TEXTURE_DIR = './assets/textures';
import MarbleTexture_Color from './assets/textures/StoneMarbleCalacatta004_COL_1K.jpg';
import MarbleTexture_Gloss from './assets/textures/StoneMarbleCalacatta004_GLOSS_1K.jpg';
import MarbleTexture_Normal from './assets/textures/StoneMarbleCalacatta004_NRM_1K.jpg';
import MarbleTexture_Reflection from './assets/textures/StoneMarbleCalacatta004_REFL_1K.jpg';

// console.log(MarbleTexture_Color, MarbleTexture_Gloss, MarbleTexture_Normal, MarbleTexture_Reflection);
// console.log(require(`./assets/textures/StoneMarbleCalacatta004_COL_1K.jpg`))
// console.log(require(`./assets/textures/StoneMarbleCalacatta004_REFL_1K.jpg`))
// console.log(require(`./assets/textures/StoneMarbleCalacatta004_GLOSS_1K.jpg`))
// console.log(require(`./assets/textures/StoneMarbleCalacatta004_NRM_1K.jpg`))


const createScene = function (canvas, engine) {
	// Create the scene space
	const scene = new BABYLON.Scene(engine);

	// Add a camera to the scene and attach it to the canvas
	const cameraRotation = Math.PI / 2;
	const camera = new BABYLON.ArcRotateCamera("Camera", cameraRotation, cameraRotation, 2, new BABYLON.Vector3(0, 5, -10), scene);
	// camera.position = new Vector3(0, 0, 0);
	camera.attachControl(canvas, true);

	// // This creates and positions a free camera (non-mesh)
	// const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

	// This targets the camera to scene origin
	camera.setTarget(BABYLON.Vector3.Zero());

	// Main light
	const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
	light.intensity = 0.8;

	// Our built-in 'sphere' shape. Params: name, subdivs, size, scene
	const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 2 }, scene);
	sphere.position.y = 2;

	// Materials
	const ballMaterial = new BABYLON.StandardMaterial("ballMaterial", scene);

	ballMaterial.diffuseTexture = new BABYLON.Texture(MarbleTexture_Color, scene);
	ballMaterial.specularTexture = new BABYLON.Texture(MarbleTexture_Reflection, scene);
	ballMaterial.bumpTexture = new BABYLON.Texture(MarbleTexture_Normal, scene);

	sphere.material = ballMaterial;

	// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
	const ground = BABYLON.Mesh.CreateGround("ground1", 16, 16, 2, scene);

	// Physics
	enablePhysics(scene);

	const friction = 1;
	sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, {
		mass: 1,
		restitution: 0.4,
		friction: friction,
	}, scene);

	ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, {
		mass: 0,
		restitution: 0.9,
		friction: friction,
	}, scene);

	sphere.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0.5, 1, 0));

	return scene;
};

const enablePhysics = function (scene) {
	const gravityVector = new BABYLON.Vector3(0, -9.81, 0);
	const physicsPlugin = new BABYLON.CannonJSPlugin();
	scene.enablePhysics(gravityVector, physicsPlugin);
}


/* Main code */
window.addEventListener('DOMContentLoaded', function () {
	const canvas = document.getElementById('renderCanvas');
	const engine = new BABYLON.Engine(canvas, true);
	const scene = createScene(canvas, engine);

	// Register a render loop to repeatedly render the scene
	engine.runRenderLoop(function () {
		scene.render();
	});

	// Watch for browser/canvas resize events
	window.addEventListener("resize", function () {
		engine.resize();
	});
});
