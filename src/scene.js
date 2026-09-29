import * as THREE from 'three';

// A field of comic-style 3D shapes: toon shading (hard colour steps) plus a
// black "inked" outline made from a slightly larger back-faced copy.

const geometryFactories = [
  () => new THREE.IcosahedronGeometry(1, 0),
  () => new THREE.OctahedronGeometry(1.1, 0),
  () => new THREE.DodecahedronGeometry(1, 0),
  () => new THREE.TorusGeometry(0.8, 0.3, 12, 24),
  () => new THREE.TetrahedronGeometry(1.2, 0),
  () => new THREE.BoxGeometry(1.3, 1.3, 1.3),
  () => new THREE.ConeGeometry(0.9, 1.6, 5),
  () => new THREE.TorusKnotGeometry(0.7, 0.24, 64, 8),
];

// Small deterministic random generator so the layout is the same every load.
function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Three-step lighting ramp is what makes the toon look.
function makeRamp() {
  const data = new Uint8Array([80, 165, 255]);
  const tex = new THREE.DataTexture(data, 3, 1, THREE.RedFormat);
  tex.minFilter = THREE.NearestFilter;
  tex.magFilter = THREE.NearestFilter;
  tex.generateMipmaps = false;
  tex.needsUpdate = true;
  return tex;
}

export function initScene(canvas, { reducedMotion = false } = {}) {
  const motion = reducedMotion ? 0.15 : 1;

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 14);

  scene.add(new THREE.AmbientLight(0xffffff, 1.1));
  const sun = new THREE.DirectionalLight(0xffffff, 2.4);
  sun.position.set(4, 6, 8);
  scene.add(sun);

  const ramp = makeRamp();
  const outlineMat = new THREE.MeshBasicMaterial({ color: '#0d0821', side: THREE.BackSide });
  let palette = ['#ff3d9a', '#19e3ff', '#ffd93b', '#ffffff'];

  function makeShape(geoIndex, colorIndex) {
    const group = new THREE.Group();
    const geo = geometryFactories[geoIndex % geometryFactories.length]();
    const body = new THREE.Mesh(
      geo,
      new THREE.MeshToonMaterial({ color: palette[colorIndex % palette.length], gradientMap: ramp })
    );
    const outline = new THREE.Mesh(geo, outlineMat);
    outline.scale.setScalar(1.09);
    group.add(body, outline);
    group.userData = {
      body,
      outline,
      colorIndex,
      geoIndex,
      size: 1,
      base: new THREE.Vector3(),
      off: new THREE.Vector3(),
      spin: new THREE.Vector3(),
      phase: 0,
      boost: 0,
      pop: 0,
    };
    return group;
  }

  // --- background field ---------------------------------------
  const rand = mulberry32(1610);
  const field = [];
  for (let i = 0; i < 26; i++) {
    const s = makeShape(Math.floor(rand() * geometryFactories.length), i);
    const u = s.userData;
    u.size = 0.5 + rand() * 0.9;
    u.base.set((rand() - 0.5) * 30, (rand() - 0.5) * 18, -8 + rand() * 10);
    u.spin.set((rand() - 0.5) * 0.6, (rand() - 0.5) * 0.6, (rand() - 0.5) * 0.3);
    u.phase = rand() * Math.PI * 2;
    s.position.copy(u.base);
    s.scale.setScalar(u.size);
    scene.add(s);
    field.push(s);
  }

  // --- hero shape (big, follows the pointer, morphs on demand) -
  const hero = makeShape(0, 0);
  hero.userData.size = 2.4;
  hero.scale.setScalar(2.4);
  hero.position.set(4, 0.4, 2);
  scene.add(hero);
  let heroIndex = 0;

  const all = [hero, ...field];

  // --- pointer + scroll state ---------------------------------
  const ndc = new THREE.Vector2(0, 0);
  const raycaster = new THREE.Raycaster();
  const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const mouseWorld = new THREE.Vector3();
  let scrollTarget = 0;
  let scrollSmooth = 0;

  window.addEventListener(
    'pointermove',
    (e) => {
      ndc.x = (e.clientX / window.innerWidth) * 2 - 1;
      ndc.y = -((e.clientY / window.innerHeight) * 2 - 1);
    },
    { passive: true }
  );

  function readScroll() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    scrollTarget = max > 0 ? window.scrollY / max : 0;
  }
  window.addEventListener('scroll', readScroll, { passive: true });

  function layout() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const wide = camera.aspect > 1.1;
    const halfW = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * 12 * camera.aspect;
    hero.userData.size = wide ? 2.4 : 1.6;
    hero.position.set(wide ? halfW * 0.55 : 0, wide ? 0.4 : -3.6, 2);
    readScroll();
  }
  window.addEventListener('resize', layout);
  layout();

  // --- public API ---------------------------------------------
  function poke(shape) {
    const u = shape.userData;
    u.boost = 12;
    u.pop = 1;
    u.colorIndex += 1;
    u.body.material.color.set(palette[u.colorIndex % palette.length]);
  }

  function hit(clientX, clientY) {
    const p = new THREE.Vector2((clientX / window.innerWidth) * 2 - 1, -((clientY / window.innerHeight) * 2 - 1));
    raycaster.setFromCamera(p, camera);
    const hits = raycaster.intersectObjects(all.map((s) => s.userData.body), false);
    if (!hits.length) return false;
    poke(hits[0].object.parent);
    return true;
  }

  function setPalette(colors, ink) {
    palette = colors.filter(Boolean);
    if (ink) outlineMat.color.set(ink);
    for (const s of all) {
      const u = s.userData;
      u.body.material.color.set(palette[u.colorIndex % palette.length]);
    }
  }

  function cycleHero() {
    heroIndex = (heroIndex + 1) % geometryFactories.length;
    const u = hero.userData;
    const old = u.body.geometry;
    const geo = geometryFactories[heroIndex]();
    u.body.geometry = geo;
    u.outline.geometry = geo;
    old.dispose();
    poke(hero);
  }

  // --- render loop --------------------------------------------
  let last = performance.now();
  function frame(now) {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    const t = now / 1000;

    scrollSmooth += (scrollTarget - scrollSmooth) * 0.06;
    camera.position.set(
      Math.sin(scrollSmooth * 6) * 2.5 * motion + ndc.x * 0.6 * motion,
      2 - scrollSmooth * 4 + ndc.y * 0.4 * motion,
      14 - Math.sin(scrollSmooth * Math.PI) * 2
    );
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();

    // Where is the pointer on the z = 0 plane? Shapes nearby get pushed away.
    raycaster.setFromCamera(ndc, camera);
    raycaster.ray.intersectPlane(plane, mouseWorld);

    for (const s of field) {
      const u = s.userData;
      const dx = u.base.x - mouseWorld.x;
      const dy = u.base.y - mouseWorld.y;
      const d = Math.hypot(dx, dy) || 0.001;
      let tx = 0;
      let ty = 0;
      if (d < 4 && motion > 0.5) {
        const f = ((4 - d) / 4) * 2.4;
        tx = (dx / d) * f;
        ty = (dy / d) * f;
      }
      u.off.x += (tx - u.off.x) * 0.08;
      u.off.y += (ty - u.off.y) * 0.08;
      s.position.set(
        u.base.x + u.off.x,
        u.base.y + u.off.y + Math.sin(t * 0.8 + u.phase) * 0.3 * motion,
        u.base.z
      );
      u.boost *= 0.94;
      u.pop *= 0.9;
      s.scale.setScalar(u.size * (1 + u.pop * 0.6));
      s.rotation.x += (u.spin.x * motion + u.boost * 0.05) * dt * 3;
      s.rotation.y += (u.spin.y * motion + u.boost * 0.05) * dt * 3;
      s.rotation.z += u.spin.z * motion * dt * 3;
    }

    const hu = hero.userData;
    hu.boost *= 0.94;
    hu.pop *= 0.9;
    hero.scale.setScalar(hu.size * (1 + hu.pop * 0.35));
    hero.rotation.y = t * 0.3 * motion + ndc.x * 0.7 + hu.boost * 0.15;
    hero.rotation.x = t * 0.2 * motion - ndc.y * 0.5;

    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return { setPalette, cycleHero, hit };
}
