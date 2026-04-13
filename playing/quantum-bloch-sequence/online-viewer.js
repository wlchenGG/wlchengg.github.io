(() => {
  const statusEl = document.getElementById('status');
  const metaPanel = document.getElementById('metaPanel');
  const canvas = document.getElementById('webgl');

  function post(type, extra = {}) {
    window.parent.postMessage({ source: 'qubit-flow-online-viewer', type, ...extra }, '*');
  }

  if (!window.THREE) {
    const message = 'Three.js 未能成功加载';
    statusEl.textContent = message;
    metaPanel.textContent = '请检查网络连接，或切回离线模式。';
    post('error', { message });
    return;
  }

  const THREE = window.THREE;
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x081627, 8, 18);

  const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 100);
  const controls = { yaw: 0.94, pitch: 0.46, radius: 4.9, dragging: false, lastX: 0, lastY: 0 };
  function updateCamera() {
    const r = controls.radius;
    camera.position.set(
      Math.cos(controls.pitch) * Math.sin(controls.yaw) * r,
      Math.sin(controls.pitch) * r,
      Math.cos(controls.pitch) * Math.cos(controls.yaw) * r,
    );
    camera.lookAt(0, 0, 0);
  }

  scene.add(new THREE.AmbientLight(0xffffff, 1.25));
  const lightA = new THREE.DirectionalLight(0x92d8ff, 1.8);
  lightA.position.set(4, 6, 3);
  scene.add(lightA);
  const lightB = new THREE.DirectionalLight(0xb694ff, 1.25);
  lightB.position.set(-3, -1, -4);
  scene.add(lightB);

  const root = new THREE.Group();
  scene.add(root);

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 72, 72),
    new THREE.MeshPhysicalMaterial({
      color: 0x82a8ff,
      transparent: true,
      opacity: 0.15,
      roughness: 0.08,
      transmission: 0.08,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      side: THREE.DoubleSide,
    })
  );
  root.add(sphere);

  const wire = new THREE.LineSegments(
    new THREE.WireframeGeometry(new THREE.SphereGeometry(1.001, 22, 22)),
    new THREE.LineBasicMaterial({ color: 0x8fb2ff, transparent: true, opacity: 0.28 })
  );
  root.add(wire);

  function curveLine(points, color, opacity) {
    return new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(points),
      new THREE.LineBasicMaterial({ color, transparent: true, opacity })
    );
  }

  [-0.5, 0, 0.5].forEach((lat) => {
    const pts = [];
    const y = lat;
    const r = Math.sqrt(Math.max(0, 1 - y * y));
    for (let i = 0; i <= 120; i += 1) {
      const t = (i / 120) * Math.PI * 2;
      pts.push(new THREE.Vector3(Math.cos(t) * r, y, Math.sin(t) * r));
    }
    root.add(curveLine(pts, 0xffffff, lat === 0 ? 0.2 : 0.1));
  });

  [0, Math.PI / 2, Math.PI, Math.PI * 1.5].forEach((lon, idx) => {
    const pts = [];
    for (let i = 0; i <= 120; i += 1) {
      const t = (i / 120) * Math.PI;
      const y = Math.cos(t);
      const ring = Math.sin(t);
      pts.push(new THREE.Vector3(Math.cos(lon) * ring, y, Math.sin(lon) * ring));
    }
    root.add(curveLine(pts, 0xffffff, idx < 2 ? 0.15 : 0.08));
  });

  function makeTextSprite(text, color = '#ffffff') {
    const c = document.createElement('canvas');
    c.width = 256;
    c.height = 128;
    const ctx = c.getContext('2d');
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.font = 'bold 42px Inter, Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = color;
    ctx.fillText(text, c.width / 2, c.height / 2);
    const texture = new THREE.CanvasTexture(c);
    const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture, transparent: true }));
    sprite.scale.set(0.48, 0.24, 1);
    return sprite;
  }

  function addAxis(start, end, color, label, labelOffset) {
    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([start, end]),
      new THREE.LineBasicMaterial({ color })
    );
    root.add(line);
    const dir = end.clone().sub(start).normalize();
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.03, 0.12, 18), new THREE.MeshBasicMaterial({ color }));
    cone.position.copy(end.clone().sub(dir.clone().multiplyScalar(0.06)));
    cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
    root.add(cone);
    const sprite = makeTextSprite(label, color === 0x4ade80 ? '#4ade80' : color === 0xfb7185 ? '#fb7185' : '#9ec8ff');
    sprite.position.copy(end.clone().add(labelOffset));
    root.add(sprite);
  }

  addAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(1.35, 0, 0), 0x8ec5ff, 'X', new THREE.Vector3(0.1, 0.02, 0));
  addAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, 1.35), 0x8ec5ff, 'Y', new THREE.Vector3(0, 0.02, 0.1));
  addAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 1.25, 0), 0x4ade80, '|0⟩', new THREE.Vector3(0, 0.12, 0));
  addAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -1.25, 0), 0xfb7185, '|1⟩', new THREE.Vector3(0, -0.12, 0));

  const stateArrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), new THREE.Vector3(0, 0, 0), 1, 0x70d6ff, 0.18, 0.1);
  root.add(stateArrow);
  const tipGlow = new THREE.Mesh(new THREE.SphereGeometry(0.045, 18, 18), new THREE.MeshBasicMaterial({ color: 0x70d6ff, transparent: true, opacity: 0.95 }));
  root.add(tipGlow);
  const mixedHalo = new THREE.Mesh(new THREE.SphereGeometry(0.16, 22, 22), new THREE.MeshBasicMaterial({ color: 0x70d6ff, transparent: true, opacity: 0.16 }));
  root.add(mixedHalo);

  const trailRoot = new THREE.Group();
  root.add(trailRoot);
  let trailSignature = '';
  let displayedVector = new THREE.Vector3(0, 1, 0);
  let targetVector = new THREE.Vector3(0, 1, 0);
  let meta = { selectedQubit: 0, purity: 1, radius: 1, mixed: false, qubitCount: 1 };

  function clearTrail() {
    while (trailRoot.children.length) {
      const child = trailRoot.children[0];
      trailRoot.remove(child);
      child.geometry?.dispose?.();
      if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose?.());
      else child.material?.dispose?.();
    }
  }

  function addTube(points, radius, color, opacity) {
    if (!points || points.length < 2) return null;
    const vectors = points.map((p) => p.isVector3 ? p : new THREE.Vector3(p.x, p.y, p.z));
    const curve = new THREE.CatmullRomCurve3(vectors, false, 'catmullrom', 0.15);
    return new THREE.Mesh(
      new THREE.TubeGeometry(curve, Math.max(16, vectors.length * 16), radius, 10, false),
      new THREE.MeshStandardMaterial({ color, transparent: true, opacity, roughness: 0.36, metalness: 0.06 })
    );
  }

  function updateTrail(points, currentArc) {
    const signature = `${points.length}|${points.map((p) => `${p.x.toFixed(3)},${p.y.toFixed(3)},${p.z.toFixed(3)}`).join('|')}|${(currentArc || []).length}`;
    if (signature === trailSignature) return;
    trailSignature = signature;
    clearTrail();
    if (points.length >= 2) {
      const glow = addTube(points, 0.022, 0xd9c2ff, 0.10);
      const tube = addTube(points, 0.010, 0xa78bfa, 0.82);
      if (glow) trailRoot.add(glow);
      if (tube) trailRoot.add(tube);
      points.forEach((point, index) => {
        const p = point.isVector3 ? point : new THREE.Vector3(point.x, point.y, point.z);
        const dot = new THREE.Mesh(new THREE.SphereGeometry(index === points.length - 1 ? 0.028 : 0.018, 18, 18), new THREE.MeshBasicMaterial({ color: index === points.length - 1 ? 0x70d6ff : 0xa78bfa, transparent: true, opacity: 0.9 }));
        dot.position.copy(p);
        trailRoot.add(dot);
        if (index > 0) {
          const label = makeTextSprite(String(index), '#f3e8ff');
          label.scale.set(0.18, 0.11, 1);
          label.position.copy(p.clone().add(new THREE.Vector3(0.06, 0.06, 0.06)));
          trailRoot.add(label);
        }
      });
      for (let i = 1; i < points.length; i += 1) {
        const prev = points[i - 1].isVector3 ? points[i - 1] : new THREE.Vector3(points[i - 1].x, points[i - 1].y, points[i - 1].z);
        const curr = points[i].isVector3 ? points[i] : new THREE.Vector3(points[i].x, points[i].y, points[i].z);
        const dir = curr.clone().sub(prev).normalize();
        const mid = prev.clone().lerp(curr, 0.62);
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.02, 0.08, 18), new THREE.MeshBasicMaterial({ color: 0xcfb8ff, transparent: true, opacity: 0.9 }));
        cone.position.copy(mid);
        cone.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
        trailRoot.add(cone);
      }
    }
    if (currentArc && currentArc.length >= 2) {
      const arcGlow = addTube(currentArc, 0.026, 0xd6f7ff, 0.18);
      const arcTube = addTube(currentArc, 0.014, 0x70d6ff, 0.94);
      if (arcGlow) trailRoot.add(arcGlow);
      if (arcTube) trailRoot.add(arcTube);
    }
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function applyPayload(payload) {
    if (!payload) return;
    const dv = payload.displayVector || payload.currentVector || { x: 0, y: 1, z: 0 };
    const cv = payload.currentVector || dv;
    displayedVector.set(dv.x, dv.y, dv.z);
    targetVector.set(cv.x, cv.y, cv.z);
    meta = payload.meta || meta;
    statusEl.textContent = `显示 q${meta.selectedQubit} · ${meta.mixed ? '局部混合态' : '局部纯态'}`;
    metaPanel.innerHTML = `
      <strong>局部状态摘要</strong>
      系统：${meta.qubitCount} 比特<br />
      选中：q${meta.selectedQubit}<br />
      Purity：${Number(meta.purity || 0).toFixed(3)}<br />
      |r|：${Number(meta.radius || 0).toFixed(3)}
    `;
    updateTrail(payload.trail || [], payload.currentArc || []);
  }

  window.addEventListener('message', (event) => {
    if (!event.data || event.data.source !== 'qubit-flow-parent' || event.data.type !== 'sync') return;
    applyPayload(event.data.payload);
  });

  canvas.addEventListener('pointerdown', (event) => {
    controls.dragging = true;
    controls.lastX = event.clientX;
    controls.lastY = event.clientY;
  });
  window.addEventListener('pointermove', (event) => {
    if (!controls.dragging) return;
    const dx = event.clientX - controls.lastX;
    const dy = event.clientY - controls.lastY;
    controls.lastX = event.clientX;
    controls.lastY = event.clientY;
    controls.yaw += dx * 0.01;
    controls.pitch += dy * 0.01;
    controls.pitch = Math.max(-1.4, Math.min(1.4, controls.pitch));
  });
  window.addEventListener('pointerup', () => { controls.dragging = false; });
  canvas.addEventListener('wheel', (event) => {
    event.preventDefault();
    controls.radius *= event.deltaY < 0 ? 0.9 : 1.1;
    controls.radius = Math.max(2.6, Math.min(8.5, controls.radius));
  }, { passive: false });
  window.addEventListener('resize', resize);

  const clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    const dt = Math.min(clock.getDelta(), 0.05);
    displayedVector.lerp(targetVector, Math.min(1, dt * 8));
    const rawLen = displayedVector.length();
    const len = Math.max(0.001, rawLen);
    const dir = rawLen > 1e-6 ? displayedVector.clone().normalize() : new THREE.Vector3(0, 1, 0);
    stateArrow.setDirection(dir);
    stateArrow.setLength(len, 0.18, 0.1);
    tipGlow.position.copy(dir.clone().multiplyScalar(rawLen));
    mixedHalo.position.copy(dir.clone().multiplyScalar(rawLen));
    mixedHalo.scale.setScalar(Math.max(0.45, 1 - (meta.radius || rawLen) * 0.55));
    mixedHalo.material.opacity = meta.mixed ? 0.22 : 0.08;
    sphere.material.opacity = meta.mixed ? 0.11 : 0.15;
    wire.material.opacity = meta.mixed ? 0.22 : 0.28;
    sphere.rotation.y += 0.0008;
    wire.rotation.y -= 0.0011;
    updateCamera();
    renderer.render(scene, camera);
  }

  resize();
  post('ready');
  statusEl.textContent = 'Three.js 已就绪，等待父页面同步状态。';
  tick();
})();
