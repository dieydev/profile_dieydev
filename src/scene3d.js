import * as THREE from 'three';

export class Scene3D {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.currentTheme = 'violet';
    this.isWireframe = false;
    this.mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    this.scrollProgress = 0;
    this.targetCamera = { x: 0, y: 0, z: 9, rotX: 0, rotY: 0 };
    this.clock = new THREE.Clock();

    // Vibrant Cyber Themes
    this.themes = {
      violet: {
        primary: 0x8B5CF6,
        secondary: 0x06B6D4,
        accent: 0xEC4899,
        particle: 0xA78BFA
      },
      matrix: {
        primary: 0x10B981,
        secondary: 0x14B8A6,
        accent: 0x34D399,
        particle: 0x6EE7B7
      },
      sunset: {
        primary: 0xF43F5E,
        secondary: 0xF59E0B,
        accent: 0xFB7185,
        particle: 0xFDE047
      }
    };

    this.init();
  }

  init() {
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2(0x070913, 0.04);

    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 100);
    this.camera.position.set(0, 0, 9);

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.15;

    // Lighting
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(this.ambientLight);

    const colors = this.themes[this.currentTheme];
    this.pointLight1 = new THREE.PointLight(colors.primary, 3.2, 25);
    this.pointLight1.position.set(4, 3, 4);
    this.scene.add(this.pointLight1);

    this.pointLight2 = new THREE.PointLight(colors.secondary, 2.6, 25);
    this.pointLight2.position.set(-4, -3, 3);
    this.scene.add(this.pointLight2);

    this.pointLight3 = new THREE.PointLight(colors.accent, 1.8, 15);
    this.pointLight3.position.set(0, 5, 2);
    this.scene.add(this.pointLight3);

    // Objects
    this.createStarfield();
    this.createCentralCore();
    this.createOrbitingTechNodes();
    this.createEnergyRings();
    this.createClickShockwaves();

    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2(-999, -999);

    this.bindEvents();
    this.animate();
  }

  createCentralCore() {
    this.coreGroup = new THREE.Group();
    const colors = this.themes[this.currentTheme];

    // Inner glowing sphere
    const innerGeo = new THREE.SphereGeometry(0.85, 32, 32);
    this.innerMat = new THREE.MeshStandardMaterial({
      color: colors.primary,
      emissive: colors.primary,
      emissiveIntensity: 0.55,
      roughness: 0.2,
      metalness: 0.8,
      wireframe: this.isWireframe
    });
    this.innerMesh = new THREE.Mesh(innerGeo, this.innerMat);
    this.coreGroup.add(this.innerMesh);

    // Mid Icosahedron lattice
    const icoGeo = new THREE.IcosahedronGeometry(1.4, 1);
    this.icoMat = new THREE.MeshStandardMaterial({
      color: colors.secondary,
      emissive: colors.secondary,
      emissiveIntensity: 0.4,
      wireframe: true,
      roughness: 0.3,
      metalness: 0.9
    });
    this.icoMesh = new THREE.Mesh(icoGeo, this.icoMat);
    this.coreGroup.add(this.icoMesh);

    // Outer Octahedron
    const octaGeo = new THREE.OctahedronGeometry(1.9, 0);
    this.octaMat = new THREE.MeshStandardMaterial({
      color: colors.accent,
      emissive: colors.accent,
      emissiveIntensity: 0.3,
      wireframe: true,
      transparent: true,
      opacity: 0.65
    });
    this.octaMesh = new THREE.Mesh(octaGeo, this.octaMat);
    this.coreGroup.add(this.octaMesh);

    // Torus knot core
    const knotGeo = new THREE.TorusKnotGeometry(1.1, 0.08, 100, 16);
    this.knotMat = new THREE.MeshStandardMaterial({
      color: colors.primary,
      emissive: colors.secondary,
      emissiveIntensity: 0.4,
      metalness: 0.9,
      roughness: 0.1,
      wireframe: this.isWireframe
    });
    this.knotMesh = new THREE.Mesh(knotGeo, this.knotMat);
    this.coreGroup.add(this.knotMesh);

    this.scene.add(this.coreGroup);
  }

  createEnergyRings() {
    this.ringsGroup = new THREE.Group();
    const colors = this.themes[this.currentTheme];
    const ringRadii = [2.4, 2.9, 3.4];
    this.rings = [];

    ringRadii.forEach((radius, i) => {
      const ringGeo = new THREE.TorusGeometry(radius, 0.02, 16, 100);
      const ringMat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? colors.primary : colors.secondary,
        transparent: true,
        opacity: 0.5 - i * 0.1
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2 + (i * 0.3);
      ringMesh.rotation.y = (i * 0.4);
      this.rings.push(ringMesh);
      this.ringsGroup.add(ringMesh);
    });

    this.scene.add(this.ringsGroup);
  }

  createStarfield() {
    const particleCount = 1250;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const themeColors = this.themes[this.currentTheme];
    const color1 = new THREE.Color(themeColors.primary);
    const color2 = new THREE.Color(themeColors.secondary);
    const color3 = new THREE.Color(themeColors.accent);

    for (let i = 0; i < particleCount; i++) {
      const r = 4 + Math.random() * 26;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 35;

      positions[i * 3] = Math.cos(theta) * r;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = Math.sin(theta) * r;

      const mixedColor = i % 3 === 0 ? color1 : (i % 3 === 1 ? color2 : color3);
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.3, 'rgba(255,255,255,0.8)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);

    const texture = new THREE.CanvasTexture(canvas);

    this.starMaterial = new THREE.PointsMaterial({
      size: 0.16,
      vertexColors: true,
      map: texture,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.starfield = new THREE.Points(geometry, this.starMaterial);
    this.scene.add(this.starfield);
  }

  createOrbitingTechNodes() {
    this.nodesGroup = new THREE.Group();
    this.nodesList = [];

    const techData = [
      { name: '.NET 8', tag: 'C# Backend', color: 0x512BD4 },
      { name: 'Kafka', tag: 'Event-Driven', color: 0x231F20 },
      { name: 'Redis', tag: 'Cache & Queue', color: 0xDC382D },
      { name: 'Docker', tag: 'Containers', color: 0x2496ED },
      { name: 'FastAPI', tag: 'Python Service', color: 0x009688 },
      { name: 'YARP', tag: 'API Gateway', color: 0x6D28D9 },
      { name: 'Postgres', tag: 'Database', color: 0x336791 },
      { name: 'React', tag: 'Frontend', color: 0x61DAFB }
    ];

    const nodeCount = techData.length;
    const radius = 3.6;

    for (let i = 0; i < nodeCount; i++) {
      const data = techData[i];
      const angle = (i / nodeCount) * Math.PI * 2;
      const heightOffset = Math.sin(i * 1.5) * 0.8;

      const subGroup = new THREE.Group();
      subGroup.position.set(
        Math.cos(angle) * radius,
        heightOffset,
        Math.sin(angle) * radius
      );

      const geo = new THREE.DodecahedronGeometry(0.32, 0);
      const mat = new THREE.MeshStandardMaterial({
        color: this.themes[this.currentTheme].secondary,
        emissive: data.color,
        emissiveIntensity: 0.45,
        metalness: 0.8,
        roughness: 0.2
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.userData = {
        name: data.name,
        tag: data.tag,
        angle: angle,
        orbitRadius: radius,
        speed: 0.2 + (i % 3) * 0.05,
        verticalSpeed: 0.8 + (i % 2) * 0.4
      };

      subGroup.add(mesh);

      const nodeRingGeo = new THREE.RingGeometry(0.42, 0.45, 24);
      const nodeRingMat = new THREE.MeshBasicMaterial({
        color: this.themes[this.currentTheme].primary,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.6
      });
      const nodeRing = new THREE.Mesh(nodeRingGeo, nodeRingMat);
      subGroup.add(nodeRing);

      this.nodesList.push({ group: subGroup, mesh: mesh, ring: nodeRing });
      this.nodesGroup.add(subGroup);
    }

    this.scene.add(this.nodesGroup);
  }

  createClickShockwaves() {
    this.shockwaves = [];
    for (let i = 0; i < 4; i++) {
      const geo = new THREE.RingGeometry(0.1, 0.2, 48);
      const mat = new THREE.MeshBasicMaterial({
        color: this.themes[this.currentTheme].accent,
        transparent: true,
        opacity: 0,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.visible = false;
      this.scene.add(mesh);
      this.shockwaves.push({ mesh, active: false, scale: 0.1 });
    }
  }

  triggerShockwave(origin) {
    const wave = this.shockwaves.find(w => !w.active);
    if (wave) {
      wave.active = true;
      wave.mesh.visible = true;
      wave.mesh.position.copy(origin || this.coreGroup.position);
      wave.mesh.lookAt(this.camera.position);
      wave.scale = 0.1;
      wave.mesh.scale.set(0.1, 0.1, 0.1);
      wave.mesh.material.opacity = 0.9;
    }
  }

  setTheme(themeName) {
    if (!this.themes[themeName]) return;
    this.currentTheme = themeName;
    const colors = this.themes[themeName];

    this.pointLight1.color.setHex(colors.primary);
    this.pointLight2.color.setHex(colors.secondary);
    this.pointLight3.color.setHex(colors.accent);

    if (this.innerMat) {
      this.innerMat.color.setHex(colors.primary);
      this.innerMat.emissive.setHex(colors.primary);
    }
    if (this.icoMat) {
      this.icoMat.color.setHex(colors.secondary);
      this.icoMat.emissive.setHex(colors.secondary);
    }
    if (this.octaMat) {
      this.octaMat.color.setHex(colors.accent);
      this.octaMat.emissive.setHex(colors.accent);
    }
    if (this.knotMat) {
      this.knotMat.color.setHex(colors.primary);
      this.knotMat.emissive.setHex(colors.secondary);
    }

    if (this.rings) {
      this.rings.forEach((r, idx) => {
        r.material.color.setHex(idx % 2 === 0 ? colors.primary : colors.secondary);
      });
    }

    if (this.starfield) {
      const colorAttr = this.starfield.geometry.attributes.color;
      const count = colorAttr.count;
      const c1 = new THREE.Color(colors.primary);
      const c2 = new THREE.Color(colors.secondary);
      const c3 = new THREE.Color(colors.accent);
      for (let i = 0; i < count; i++) {
        const mc = i % 3 === 0 ? c1 : (i % 3 === 1 ? c2 : c3);
        colorAttr.setXYZ(i, mc.r, mc.g, mc.b);
      }
      colorAttr.needsUpdate = true;
    }

    if (this.nodesList) {
      this.nodesList.forEach(item => {
        item.mesh.material.color.setHex(colors.secondary);
        item.ring.material.color.setHex(colors.primary);
      });
    }
  }

  toggleWireframe() {
    this.isWireframe = !this.isWireframe;
    if (this.innerMat) this.innerMat.wireframe = this.isWireframe;
    if (this.knotMat) this.knotMat.wireframe = this.isWireframe;
    return this.isWireframe;
  }

  onPointerMove(e) {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = -(e.clientY / window.innerHeight) * 2 + 1;
    this.mouse.targetX = x;
    this.mouse.targetY = y;
    this.pointer.x = x;
    this.pointer.y = y;
  }

  onPointerClick(e) {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const meshes = this.nodesList.map(n => n.mesh);
    const intersects = this.raycaster.intersectObjects([...meshes, this.innerMesh, this.icoMesh]);

    if (intersects.length > 0) {
      const hit = intersects[0];
      this.triggerShockwave(hit.point);
      return hit.object.userData;
    } else {
      this.triggerShockwave();
      return null;
    }
  }

  onScroll(scrollProgress, currentSection) {
    this.scrollProgress = scrollProgress;

    switch (currentSection) {
      case 'hero':
        this.targetCamera = { x: 0, y: 0, z: 9, rotX: 0, rotY: 0 };
        break;
      case 'about':
        this.targetCamera = { x: -2.8, y: -0.5, z: 7.2, rotX: 0.05, rotY: 0.28 };
        break;
      case 'education':
        this.targetCamera = { x: 2.2, y: -0.2, z: 7.6, rotX: -0.06, rotY: -0.22 };
        break;
      case 'skills':
        this.targetCamera = { x: -2.5, y: 0.4, z: 7.5, rotX: 0.05, rotY: 0.26 };
        break;
      case 'projects':
        this.targetCamera = { x: 0, y: -1.6, z: 8.8, rotX: 0.18, rotY: 0.0 };
        break;
      case 'stats':
        this.targetCamera = { x: 2.4, y: 0.2, z: 7.6, rotX: -0.08, rotY: -0.24 };
        break;
      case 'contact':
        this.targetCamera = { x: -1.8, y: -0.2, z: 7.4, rotX: 0.08, rotY: 0.2 };
        break;
      default:
        this.targetCamera = { x: 0, y: 0, z: 9, rotX: 0, rotY: 0 };
    }
  }

  onResize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize());
    window.addEventListener('pointermove', (e) => this.onPointerMove(e));
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const delta = this.clock.getDelta();
    const elapsedTime = this.clock.getElapsedTime();

    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.05;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.05;

    this.camera.position.x += (this.targetCamera.x + this.mouse.x * 0.6 - this.camera.position.x) * 0.05;
    this.camera.position.y += (this.targetCamera.y + this.mouse.y * 0.4 - this.camera.position.y) * 0.05;
    this.camera.position.z += (this.targetCamera.z - this.camera.position.z) * 0.05;

    this.camera.rotation.x += (this.targetCamera.rotX - this.mouse.y * 0.06 - this.camera.rotation.x) * 0.05;
    this.camera.rotation.y += (this.targetCamera.rotY + this.mouse.x * 0.08 - this.camera.rotation.y) * 0.05;

    if (this.coreGroup) {
      this.coreGroup.rotation.y = elapsedTime * 0.25;
      this.coreGroup.rotation.x = Math.sin(elapsedTime * 0.3) * 0.15;
      this.coreGroup.position.y = Math.sin(elapsedTime * 1.2) * 0.15;

      this.innerMesh.rotation.y = -elapsedTime * 0.5;
      this.icoMesh.rotation.y = elapsedTime * 0.4;
      this.icoMesh.rotation.z = Math.sin(elapsedTime * 0.5) * 0.2;
      this.octaMesh.rotation.x = elapsedTime * 0.3;
      this.octaMesh.rotation.y = -elapsedTime * 0.2;
      this.knotMesh.rotation.x = elapsedTime * 0.45;
      this.knotMesh.rotation.y = elapsedTime * 0.35;
    }

    if (this.ringsGroup) {
      this.rings.forEach((ring, idx) => {
        const dir = idx % 2 === 0 ? 1 : -1;
        ring.rotation.z += delta * (0.3 + idx * 0.15) * dir;
        ring.rotation.x += delta * 0.1 * dir;
      });
    }

    if (this.starfield) {
      this.starfield.rotation.y = elapsedTime * 0.02;
      this.starfield.rotation.x = this.mouse.y * 0.05;
    }

    this.raycaster.setFromCamera(this.pointer, this.camera);
    const meshes = this.nodesList.map(n => n.mesh);
    const intersects = this.raycaster.intersectObjects(meshes);

    const hoveredMesh = intersects.length > 0 ? intersects[0].object : null;

    this.nodesList.forEach(item => {
      const data = item.mesh.userData;
      data.angle += delta * data.speed;
      const x = Math.cos(data.angle) * data.orbitRadius;
      const z = Math.sin(data.angle) * data.orbitRadius;
      const y = Math.sin(elapsedTime * data.verticalSpeed + data.angle) * 0.6;

      item.group.position.set(x, y, z);
      item.mesh.rotation.y += delta * 1.5;
      item.mesh.rotation.x += delta * 0.8;
      item.ring.lookAt(this.camera.position);

      const isHovered = (hoveredMesh === item.mesh);
      const targetScale = isHovered ? 1.6 : 1.0;
      item.mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);

      const targetEmissive = isHovered ? 1.2 : 0.45;
      item.mesh.material.emissiveIntensity += (targetEmissive - item.mesh.material.emissiveIntensity) * 0.1;
    });

    this.pointLight1.position.x = Math.sin(elapsedTime * 0.8) * 5;
    this.pointLight1.position.y = Math.cos(elapsedTime * 0.6) * 4;
    this.pointLight2.position.x = -Math.cos(elapsedTime * 0.7) * 5;
    this.pointLight2.position.z = Math.sin(elapsedTime * 0.9) * 4;

    this.shockwaves.forEach(w => {
      if (w.active) {
        w.scale += delta * 4;
        w.mesh.scale.set(w.scale, w.scale, w.scale);
        w.mesh.material.opacity -= delta * 1.2;
        if (w.mesh.material.opacity <= 0) {
          w.active = false;
          w.mesh.visible = false;
        }
      }
    });

    this.renderer.render(this.scene, this.camera);
  }
}
