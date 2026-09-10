import * as THREE from "../vendor/three/three.module.min.js";
import { OrbitControls } from "../vendor/three/controls/OrbitControls.js";
import { ColladaLoader } from "../vendor/three/loaders/ColladaLoader.js";
import { STORAGE_KEYS, THEMES } from "./config/constants.js";

const MODELS = Object.freeze({
  masterpiece: {
    title: "Modular FLL Robot V1 (MASTERPIECE)",
    source: "assets/projects/modular_fll_robot_v1/OMEGA_bot_2023-2024.dae",
    poster: "assets/projects/modular_fll_robot_v1/robot2.webp",
    rotation: [Math.PI / 2, 0, 0],
    yaw: Math.PI / 2
  },
  submerged: {
    title: "Modular FLL Robot V2 (SUBMERGED)",
    source: "assets/projects/modular_fll_robo_v2/bot_2024-2025.dae",
    poster: "assets/projects/modular_fll_robo_v2/robot2.webp",
    rotation: [Math.PI / 2, 0, 0]
  }
});

const elements = Object.freeze({
  viewer: document.querySelector("#viewer"),
  canvas: document.querySelector("#model-canvas"),
  poster: document.querySelector("#model-poster"),
  title: document.querySelector("#model-title"),
  reset: document.querySelector("#reset-view"),
  status: document.querySelector("#model-status"),
  progress: document.querySelector("#model-progress-bar")
});

const supportedThemes = new Set(Object.values(THEMES));
applyViewerTheme(localStorage.getItem(STORAGE_KEYS.theme));
window.addEventListener("storage", ({ key, newValue }) => {
  if (key === STORAGE_KEYS.theme) applyViewerTheme(newValue);
});

const modelKey = new URLSearchParams(location.search).get("model");
const model = MODELS[modelKey];

if (!model) {
  showError("Unknown model. Return to the portfolio and choose a valid 3D preview.");
} else {
  loadModel(model);
}

async function loadModel(config) {
  elements.title.textContent = config.title;
  elements.poster.src = config.poster;
  document.title = `${config.title} · 3D Viewer`;

  try {
    const renderer = new THREE.WebGLRenderer({ canvas: elements.canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.01, 10000);
    const controls = new OrbitControls(camera, elements.canvas);
    controls.enableDamping = true;
    controls.dampingFactor = .075;
    controls.enablePan = false;

    const resize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", resize, { passive: true });
    resize();

    scene.add(new THREE.HemisphereLight(0xffffff, 0x282828, 2.8));
    const keyLight = new THREE.DirectionalLight(0xffffff, 3.4);
    keyLight.position.set(4, 7, 6);
    scene.add(keyLight);

    const source = repairBrickLinkCollada(await fetchModelSource(config.source));
    const assetPath = new URL(".", new URL(config.source, location.href)).href;
    const result = new ColladaLoader().parse(source, assetPath);
    if (!result?.scene) throw new Error("The Collada parser returned no scene");
    const meshCount = normalizeBrickLinkMaterials(result.scene);
    if (!meshCount) throw new Error("The Collada model contains no renderable meshes");
    if (config.rotation) result.scene.rotation.set(...config.rotation);
    if (config.yaw) result.scene.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), config.yaw);
    scene.add(result.scene);
    const initialView = frameModel(result.scene, camera, controls);

    elements.reset.addEventListener("click", () => {
      camera.position.copy(initialView.position);
      controls.target.copy(initialView.target);
      controls.update();
    });
    elements.reset.hidden = false;

    renderer.setAnimationLoop(() => {
      controls.update();
      renderer.render(scene, camera);
    });

    elements.progress.style.width = "100%";
    elements.status.textContent = `Interactive model loaded · ${meshCount} rendered parts`;
    elements.viewer.classList.add("viewer--loaded");
  } catch (error) {
    console.error("Unable to load 3D model", error);
    showError(`Unable to load this Collada model: ${error.message}`);
  }
}

function normalizeBrickLinkMaterials(object) {
  let meshCount = 0;
  object.traverse((child) => {
    if (!child.isMesh) return;
    meshCount += 1;
    const materials = Array.isArray(child.material) ? child.material : [child.material];
    materials.forEach((material) => {
      if (!material) return;
      material.transparent = false;
      material.opacity = 1;
      material.alphaTest = 0;
      material.depthWrite = true;
      material.side = THREE.DoubleSide;
      material.needsUpdate = true;
    });
  });
  return meshCount;
}

function applyViewerTheme(theme) {
  document.documentElement.dataset.theme = supportedThemes.has(theme) ? theme : THEMES.light;
}

function repairBrickLinkCollada(source) {
  if (!source.includes("<COLLADA") || source.includes("xmlns:RoundingEdgeNormal=")) return source;
  return source.replace("<COLLADA ", '<COLLADA xmlns:RoundingEdgeNormal="urn:bricklink:rounding-edge-normal" xmlns:PrincipledBSDF1="urn:bricklink:principled-bsdf" ');
}

async function fetchModelSource(source) {
  const response = await fetch(source);
  if (!response.ok) throw new Error(`Model request failed with HTTP ${response.status}`);
  if (!response.body) return response.text();

  const total = Number(response.headers.get("content-length")) || 0;
  const reader = response.body.getReader();
  const chunks = [];
  let loaded = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    loaded += value.length;
    updateProgress(loaded, total);
  }

  const bytes = new Uint8Array(loaded);
  let offset = 0;
  chunks.forEach((chunk) => {
    bytes.set(chunk, offset);
    offset += chunk.length;
  });
  return new TextDecoder().decode(bytes);
}

function updateProgress(loaded, total) {
  if (!total) {
    elements.status.textContent = `Loading 3D model… ${Math.round(loaded / 1024 / 1024)} MB`;
    return;
  }
  const percentage = Math.round((loaded / total) * 100);
  elements.progress.style.width = `${percentage}%`;
  elements.status.textContent = `Loading 3D model… ${percentage}%`;
}

function frameModel(object, camera, controls) {
  const bounds = new THREE.Box3().setFromObject(object);
  const center = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3());
  const radius = Math.max(size.x, size.y, size.z) * .5;
  const mobileFit = window.matchMedia("(max-width: 620px)").matches
    ? Math.max(1.32, Math.min(1.52, .72 / camera.aspect))
    : 1;
  const distance = radius / Math.tan(THREE.MathUtils.degToRad(camera.fov * .5)) * 1.3 * mobileFit;
  const target = new THREE.Vector3();

  object.position.sub(center);
  camera.near = Math.max(distance / 1000, .01);
  camera.far = distance * 100;
  camera.position.set(distance * .85, distance * .65, distance);
  camera.updateProjectionMatrix();
  controls.target.copy(target);
  controls.minDistance = distance * .3;
  controls.maxDistance = distance * 3;
  controls.update();

  return { position: camera.position.clone(), target };
}

function showError(message) {
  elements.viewer.classList.add("viewer--error");
  elements.status.textContent = message;
  elements.progress.style.width = "100%";
}
