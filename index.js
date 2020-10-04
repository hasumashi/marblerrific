'use strict';
import './style.css'

import {
	Engine,
	Scene,
} from '@babylonjs/core';

import { Vector2, Vector3 } from "@babylonjs/core/Maths/math";
import { ArcRotateCamera, FreeCamera } from "@babylonjs/core/Cameras";
import { Mesh } from "@babylonjs/core/Meshes/mesh";

import {
	HemisphericLight,
	PointLight
} from "@babylonjs/core/Lights";

// Side-effects only imports allowing the standard material to be used as default.
import "@babylonjs/core/Materials/standardMaterial";
// Side-effects only imports allowing Mesh to create default shapes (to enhance tree shaking, the construction methods on mesh are not available if the meshbuilder has not been imported).
import "@babylonjs/core/Meshes/Builders/sphereBuilder";
import "@babylonjs/core/Meshes/Builders/boxBuilder";


const canvas = document.getElementById('renderCanvas');
const engine = new Engine(canvas, true);

const createScene = function () {
	// Create the scene space
	const scene = new Scene(engine);

	// Add a camera to the scene and attach it to the canvas
	const cameraRotation = Math.PI / 2;
	const camera = new ArcRotateCamera("Camera", cameraRotation, cameraRotation, 2, new Vector3(0, 5, -10), scene);
	// camera.position = new Vector3(0, 0, 0);
	camera.attachControl(canvas, true);

	// // This creates and positions a free camera (non-mesh)
	// const camera = new FreeCamera("camera1", new Vector3(0, 5, -10), scene);

	// This targets the camera to scene origin
	camera.setTarget(Vector3.Zero());

	// Main light
	const light = new HemisphericLight("light1", new Vector3(0, 1, 0), scene);
	light.intensity = 0.7;

	// Our built-in 'sphere' shape. Params: name, subdivs, size, scene
	const sphere = Mesh.CreateSphere("sphere1", 16, 2, scene);

	// Move the sphere upward 1/2 its height
	sphere.position.y = 2;

	// Our built-in 'ground' shape. Params: name, width, depth, subdivs, scene
	Mesh.CreateGround("ground1", 16, 16, 2, scene);

	return scene;
};

const scene = createScene();

// Register a render loop to repeatedly render the scene
engine.runRenderLoop(function () {
	scene.render();
});

// Watch for browser/canvas resize events
window.addEventListener("resize", function () {
	engine.resize();
});
