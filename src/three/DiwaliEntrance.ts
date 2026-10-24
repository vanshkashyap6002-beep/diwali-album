import * as THREE from "three";
import { rangoliMarkup } from "../components/FestiveArt";
export interface EntranceController {
  enter(): void;
  dispose(): void;
}
export function createEntrance(host: HTMLElement, onFailure?: () => void): EntranceController {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.setClearColor(0x17233b, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.3;
  host.appendChild(renderer.domElement);
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x17233b, 16, 35);
  const camera = new THREE.PerspectiveCamera(37, 1, 0.1, 60);
  camera.position.set(0, 5.8, 14.5);
  camera.lookAt(0, 2.1, 0);
  const materials: THREE.Material[] = [];
  const textures: THREE.Texture[] = [];
  const mat = (color: number, roughness = 0.9) => {
    const m = new THREE.MeshStandardMaterial({ color, roughness });
    materials.push(m);
    return m;
  };
  const plaster = mat(0xc99d79),
    wood = mat(0x47291e),
    gold = mat(0xb98c46, 0.45),
    clay = mat(0xad6144),
    stone = mat(0x9e8871),
    red = mat(0x883d31);
  const mesh = (
    geometry: THREE.BufferGeometry,
    material: THREE.Material,
    x: number,
    y: number,
    z: number,
  ) => {
    const o = new THREE.Mesh(geometry, material);
    o.position.set(x, y, z);
    scene.add(o);
    return o;
  };
  const box = (
    w: number,
    h: number,
    d: number,
    m: THREE.Material,
    x: number,
    y: number,
    z: number,
  ) => mesh(new THREE.BoxGeometry(w, h, d), m, x, y, z);
  scene.add(new THREE.HemisphereLight(0x8d9cbc, 0x5b3820, 2));
  const warm = new THREE.PointLight(0xffba64, 26, 10, 2);
  warm.position.set(0, 3, 1);
  scene.add(warm);
  const side = new THREE.DirectionalLight(0xe8d8c1, 2);
  side.position.set(-5, 8, 5);
  scene.add(side);
  box(16, 0.15, 16, stone, 0, -0.15, 0);
  for (let x = -7; x <= 7; x++)
    for (let z = -4; z <= 7; z++) {
      box(0.018, 0.008, 0.98, wood, x, 0.002, z);
      box(0.98, 0.008, 0.012, wood, x, 0.003, z + 0.5);
    }
  // The open doorway is real geometry; its recess and altar occupy different depths.
  box(3.1, 5.7, 0.55, plaster, -3.15, 2.8, -1);
  box(3.1, 5.7, 0.55, plaster, 3.15, 2.8, -1);
  box(3.2, 1.2, 0.55, plaster, 0, 5.05, -1);
  box(9.7, 0.17, 0.9, gold, 0, 5.75, -0.8);
  box(9.4, 0.15, 0.75, wood, 0, 5.57, -0.8);
  box(3.8, 0.2, 2.2, stone, 0, 0.1, -0.5);
  box(4.2, 0.16, 1.2, stone, 0, 0.02, 0.5);
  box(3.1, 4.5, 0.12, red, 0, 2.2, -3.1);
  box(3.1, 0.12, 3, red, 0, 0.1, -2.1);
  for (const s of [-1, 1]) {
    box(0.22, 4.6, 0.65, wood, s * 1.62, 2.4, -0.65);
    box(0.07, 4.6, 0.08, gold, s * 1.48, 2.4, -0.28);
    const door = new THREE.Group();
    scene.add(door);
    door.position.set(s * 1.65, 0.2, -0.6);
    door.rotation.y = s * -0.48;
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.78, 4.2, 0.17), wood);
    panel.position.set(s * 0.4, 2.1, 0);
    door.add(panel);
    for (let y = 0.5; y < 4; y += 0.9) {
      const trim = new THREE.Mesh(
        new THREE.BoxGeometry(0.58, 0.64, 0.05),
        gold,
      );
      trim.position.set(s * 0.4, y, 0.11);
      door.add(trim);
      const inner = new THREE.Mesh(
        new THREE.BoxGeometry(0.5, 0.56, 0.06),
        wood,
      );
      inner.position.set(s * 0.4, y, 0.15);
      door.add(inner);
    }
    box(1.18, 1.75, 0.2, wood, s * 3.3, 2.8, -0.6);
    box(0.95, 1.5, 0.21, mat(0xdda75d), s * 3.3, 2.8, -0.48);
    for (let i = -2; i <= 2; i++)
      box(0.045, 1.52, 0.1, wood, s * 3.3 + i * 0.17, 2.8, -0.32);
    box(1.2, 0.08, 0.3, gold, s * 3.3, 1.9, -0.3);
  }
  box(3.35, 0.2, 0.5, wood, 0, 4.6, -0.5);
  const flowerGeo = new THREE.IcosahedronGeometry(0.075, 1),
    flowerMat = mat(0xe7a029);
  for (let i = 0; i < 49; i++) {
    const x = -1.65 + (i * 3.3) / 48,
      y = 4.57 - 0.28 * Math.sin((i / 48) * Math.PI);
    mesh(flowerGeo, flowerMat, x, y, -0.1);
    if (i % 3 === 0) {
      const leaf = mesh(
        new THREE.SphereGeometry(0.07, 5, 4),
        mat(0x60724a),
        x,
        y - 0.18,
        -0.1,
      );
      leaf.scale.set(0.6, 2.2, 0.5);
    }
  }
  for (const x of [-1.8, 1.8])
    for (let i = 0; i < 25; i++)
      mesh(flowerGeo, flowerMat, x, 4.5 - i * 0.14, -0.22);
  box(2.15, 0.45, 1.1, red, 0, 0.5, -2.15);
  box(2.25, 0.08, 1.15, gold, 0, 0.76, -2.15);
  box(2.25, 1.64, 0.16, gold, 0, 1.85, -2.7);
  const loader = new THREE.TextureLoader();
  let disposed = false;
  loader.load("/art/lakshmi-ganesh.webp", (texture) => {
    if (disposed) {
      texture.dispose();
      return;
    }
    texture.colorSpace = THREE.SRGBColorSpace;
    textures.push(texture);
    const m = new THREE.MeshBasicMaterial({ map: texture });
    materials.push(m);
    mesh(new THREE.PlaneGeometry(2.08, 1.39), m, 0, 1.85, -2.6);
  });
  const rangoliTexture = loader.load(
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(rangoliMarkup),
  );
  textures.push(rangoliTexture);
  rangoliTexture.colorSpace = THREE.SRGBColorSpace;
  const rm = new THREE.MeshBasicMaterial({
    map: rangoliTexture,
    transparent: true,
    depthWrite: false,
  });
  materials.push(rm);
  const rangoli = mesh(new THREE.PlaneGeometry(4.7, 4.7), rm, 0, 0.018, 3);
  rangoli.rotation.x = -Math.PI / 2;
  const flameMaterial = new THREE.MeshBasicMaterial({ color: 0xffd580 });
  materials.push(flameMaterial);
  const flames: THREE.Mesh[] = [];
  const lampLights: THREE.PointLight[] = [];
  const lamp = (x: number, z: number, scale = 1) => {
    const bowl = mesh(
      new THREE.SphereGeometry(0.24, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2),
      clay,
      x,
      0.13 * scale,
      z,
    );
    bowl.rotation.x = Math.PI;
    bowl.scale.set(scale, 0.6 * scale, 0.8 * scale);
    const lip = mesh(
      new THREE.TorusGeometry(0.2, 0.025, 6, 20),
      gold,
      x,
      0.14 * scale,
      z,
    );
    lip.rotation.x = Math.PI / 2;
    lip.scale.setScalar(scale);
    const flame = mesh(
      new THREE.SphereGeometry(0.055, 8, 8),
      flameMaterial,
      x,
      0.32 * scale,
      z,
    );
    flame.scale.set(scale, 2.6 * scale, scale);
    flames.push(flame);
    const light = new THREE.PointLight(0xffae4e, 1.4, 1.7);
    lampLights.push(light);
    light.position.set(x, 0.4 * scale, z);
    scene.add(light);
  };
  [
    [-2.7, 1],
    [2.7, 1],
    [-2.5, 3.1],
    [2.5, 3.1],
    [-1.4, 5.1],
    [1.4, 5.1],
    [-1.1, -0.5],
    [1.1, -0.5],
  ].forEach(([x, z]) => lamp(x, z));
  const thali = mesh(
    new THREE.CylinderGeometry(0.28, 0.25, 0.04, 24),
    gold,
    -0.7,
    0.83,
    -1.9,
  );
  thali.rotation.z = 0.02;
  // Petals scattered sparingly around the rangoli, not a particle simulation.
  for (let i = 0; i < 55; i++) {
    const a = i * 2.399,
      r = 2.1 + (i % 7) * 0.13;
    const p = mesh(
      new THREE.SphereGeometry(0.03, 5, 3),
      flowerMat,
      Math.cos(a) * r,
      0.025,
      3 + Math.sin(a) * r,
    );
    p.scale.set(1.6, 0.25, 1);
  }
  let frame = 0,
    start = 0,
    enterAt: number | null = null;
  const resize = () => {
    const w = host.clientWidth,
      h = host.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / Math.max(1, h);
    camera.fov = w / h < 0.8 ? 48 : 37;
    camera.updateProjectionMatrix();
  };
  resize();
  const ro = new ResizeObserver(resize);
  ro.observe(host);
  const draw = (t: number) => {
    if (disposed || document.hidden) return;
    frame = requestAnimationFrame(draw);
    if (t - start < 33) return;
    start = t;
    const p = enterAt === null ? 0 : Math.min(1, (t - enterAt) / 1700);
    const ease = p * p * (3 - 2 * p);
    camera.position.set(
      0.15 * Math.sin(t * 0.00015) * (1 - ease),
      5.8 - ease * 2.7,
      14.5 - ease * 8,
    );
    camera.lookAt(0, 2.1 - ease * 0.1, -ease);
    warm.intensity = 26 + ease * 14;
    flames.forEach((f, i) => {
      const ignition = i < 2 || i > 5 ? 1 : enterAt === null ? 0 : Math.max(0, Math.min(1, (p - (i - 2) * 0.12) * 5));
      f.visible = ignition > 0;
      f.scale.y = (2.6 + Math.sin(t * 0.004 + i) * 0.17) * ignition;
      lampLights[i].intensity = 1.4 * ignition;
    });
    renderer.render(scene, camera);
  };
  frame = requestAnimationFrame(draw);
  const visibility = () => { cancelAnimationFrame(frame); if (!document.hidden && !disposed) frame = requestAnimationFrame(draw); };
  const contextLost = () => { cancelAnimationFrame(frame); onFailure?.(); };
  document.addEventListener('visibilitychange', visibility);
  renderer.domElement.addEventListener('webglcontextlost', contextLost);
  return {
    enter() {
      enterAt = performance.now();
    },
    dispose() {
      disposed = true;
      document.removeEventListener('visibilitychange', visibility);
      renderer.domElement.removeEventListener('webglcontextlost', contextLost);
      cancelAnimationFrame(frame);
      ro.disconnect();
      scene.traverse((o) => {
        if (o instanceof THREE.Mesh) o.geometry.dispose();
      });
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
