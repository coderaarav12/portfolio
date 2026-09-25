"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

export default function HeroScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 450;
    let height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();

    // Camera with adaptive distance for mobile viewports
    const isMobile = width < 600;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, isMobile ? -0.4 : 0, isMobile ? 10.8 : 7.8);

    // High-Performance WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3;
    container.appendChild(renderer.domElement);

    // Realistic HDR Studio Environment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    pmremGenerator.compileEquirectangularShader();
    const envTexture = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environment = envTexture;

    // Studio Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 3.8);
    keyLight.position.set(4, 5, 6);
    scene.add(keyLight);

    const rimCyan = new THREE.DirectionalLight(0x00f0ff, 4.0);
    rimCyan.position.set(-6, -2, 3);
    scene.add(rimCyan);

    const rimViolet = new THREE.DirectionalLight(0xd946ef, 3.2);
    rimViolet.position.set(3, -5, -2);
    scene.add(rimViolet);

    // Top Ceiling Anchor (Zero-Gravity Suspension Bracket)
    const anchorGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.2, 16);
    const anchorMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.9, roughness: 0.1 });
    const topAnchor = new THREE.Mesh(anchorGeo, anchorMat);
    topAnchor.position.set(0, 3.2, 0);
    scene.add(topAnchor);

    // ==================== PHYSICS BODIES (HANGING GRAVITY SYSTEM) ====================
    // Central Liquid Titanium Torus Knot
    const knotGeometry = new THREE.TorusKnotGeometry(1.25, 0.35, 200, 40, 2, 3);
    const knotMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0f172a,
      metalness: 0.95,
      roughness: 0.08,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      iridescence: 0.9,
      iridescenceIOR: 1.6,
      reflectivity: 0.95,
      envMapIntensity: 1.8
    });
    const knotMesh = new THREE.Mesh(knotGeometry, knotMaterial);
    scene.add(knotMesh);

    // Lower Hanging Pendulum Counterweight 1 (Chrome Crystal Jewel)
    const jewelGeo = new THREE.OctahedronGeometry(0.55, 0);
    const jewelMat = new THREE.MeshPhysicalMaterial({
      color: 0x1e1b4b,
      emissive: 0x4f46e5,
      emissiveIntensity: 0.4,
      metalness: 0.95,
      roughness: 0.1,
      clearcoat: 1.0,
      flatShading: true,
      envMapIntensity: 2.0
    });
    const jewelMesh = new THREE.Mesh(jewelGeo, jewelMat);
    scene.add(jewelMesh);

    // Hanging Satellite Orb 2 (Cyan Chrome Sphere)
    const orbGeo = new THREE.SphereGeometry(0.32, 32, 32);
    const orbMat = new THREE.MeshPhysicalMaterial({
      color: 0x0284c7,
      metalness: 0.95,
      roughness: 0.05,
      clearcoat: 1.0,
      envMapIntensity: 2.2
    });
    const orbMesh = new THREE.Mesh(orbGeo, orbMat);
    scene.add(orbMesh);

    // Hanging Gyroscope Orbital Ring (Magenta Neon Ring)
    const ringGeo = new THREE.TorusGeometry(1.8, 0.02, 16, 100);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xd946ef,
      emissive: 0xc026d3,
      emissiveIntensity: 0.8,
      metalness: 0.9,
      roughness: 0.1
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    scene.add(ringMesh);

    // Dynamic Tension Cables (Glow Lines connecting bodies)
    const cableMatCyan = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      linewidth: 2
    });
    const cableMatViolet = new THREE.LineBasicMaterial({
      color: 0xc084fc,
      transparent: true,
      opacity: 0.75,
      linewidth: 2
    });

    const createCable = (mat) => {
      const geo = new THREE.BufferGeometry();
      const pos = new Float32Array(6);
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      const line = new THREE.Line(geo, mat);
      scene.add(line);
      return line;
    };

    const cableAnchorToKnot = createCable(cableMatCyan);
    const cableKnotToJewel = createCable(cableMatViolet);
    const cableJewelToOrb = createCable(cableMatCyan);

    const updateCable = (line, p1, p2) => {
      const arr = line.geometry.attributes.position.array;
      arr[0] = p1.x;
      arr[1] = p1.y;
      arr[2] = p1.z;
      arr[3] = p2.x;
      arr[4] = p2.y;
      arr[5] = p2.z;
      line.geometry.attributes.position.needsUpdate = true;
    };

    // Ambient floating particles
    const particleCount = 120;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 12;
      particlePos[i + 1] = (Math.random() - 0.5) * 10;
      particlePos[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0x38bdf8,
      size: 0.03,
      transparent: true,
      opacity: 0.4
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // ==================== KINEMATICS & GRAVITY SIMULATION ====================
    // Physical state for bodies
    const bKnot = {
      pos: new THREE.Vector3(0, 0.4, 0),
      vel: new THREE.Vector3(0, 0, 0),
      restOffset: new THREE.Vector3(0, -2.6, 0),
      mass: 2.0
    };

    const bJewel = {
      pos: new THREE.Vector3(0.6, -1.8, 0),
      vel: new THREE.Vector3(0, 0, 0),
      restLength: 1.8,
      mass: 1.2
    };

    const bOrb = {
      pos: new THREE.Vector3(-0.9, -2.6, 0.3),
      vel: new THREE.Vector3(0, 0, 0),
      restLength: 1.2,
      mass: 0.8
    };

    // Pointer Interaction (Mouse & Mobile Touch)
    let isDragging = false;
    let targetX = 0;
    let targetY = 0;
    let lastPointerX = 0;
    let lastPointerY = 0;

    const setPointer = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      targetX = ((clientX - rect.left) / rect.width - 0.5) * 2;
      targetY = ((clientY - rect.top) / rect.height - 0.5) * 2;
    };

    const onPointerDown = (e) => {
      isDragging = true;
      setPointer(e.clientX, e.clientY);
      lastPointerX = targetX;
      lastPointerY = targetY;
    };

    const onPointerMove = (e) => {
      setPointer(e.clientX, e.clientY);
      if (isDragging) {
        const deltaX = targetX - lastPointerX;
        const deltaY = targetY - lastPointerY;
        bKnot.vel.x += deltaX * 12;
        bKnot.vel.y -= deltaY * 12;
        bJewel.vel.x += deltaX * 18;
        bOrb.vel.x -= deltaX * 14;
        lastPointerX = targetX;
        lastPointerY = targetY;
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onTouchStart = (e) => {
      if (e.touches.length > 0) {
        isDragging = true;
        const t = e.touches[0];
        setPointer(t.clientX, t.clientY);
        lastPointerX = targetX;
        lastPointerY = targetY;
      }
    };

    const onTouchMove = (e) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        setPointer(t.clientX, t.clientY);
        const deltaX = targetX - lastPointerX;
        const deltaY = targetY - lastPointerY;
        bKnot.vel.x += deltaX * 14;
        bJewel.vel.x += deltaX * 20;
        bOrb.vel.x -= deltaX * 16;
        lastPointerX = targetX;
        lastPointerY = targetY;
      }
    };

    container.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    container.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: true });
    window.addEventListener("touchend", onPointerUp, { passive: true });

    // Handle Window Resize
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 450;
      height = container.clientHeight || 450;
      const isMob = width < 600;
      camera.aspect = width / height;
      camera.position.set(0, isMob ? -0.4 : 0, isMob ? 10.8 : 7.8);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const elapsedTime = clock.getElapsedTime();

      // Gravity pulls knot towards rest position below topAnchor
      const anchorPos = topAnchor.position;
      const knotTarget = new THREE.Vector3(
        anchorPos.x + targetX * 1.5,
        anchorPos.y - 2.5 + Math.sin(elapsedTime * 1.2) * 0.1,
        -targetY * 1.2
      );

      // Spring force on knot
      const fKnot = knotTarget.clone().sub(bKnot.pos).multiplyScalar(18.0);
      bKnot.vel.add(fKnot.multiplyScalar(dt / bKnot.mass));
      bKnot.vel.multiplyScalar(0.92); // Damping
      bKnot.pos.add(bKnot.vel.clone().multiplyScalar(dt));

      // Pendulum 1 (Jewel) hanging from Knot
      const jewelTarget = new THREE.Vector3(
        bKnot.pos.x + Math.sin(elapsedTime * 1.6 + bKnot.pos.x) * 0.8,
        bKnot.pos.y - 1.8,
        bKnot.pos.z + Math.cos(elapsedTime * 1.4) * 0.4
      );
      const fJewel = jewelTarget.sub(bJewel.pos).multiplyScalar(22.0);
      bJewel.vel.add(fJewel.multiplyScalar(dt / bJewel.mass));
      bJewel.vel.multiplyScalar(0.91);
      bJewel.pos.add(bJewel.vel.clone().multiplyScalar(dt));

      // Pendulum 2 (Orb) hanging from Jewel
      const orbTarget = new THREE.Vector3(
        bJewel.pos.x + Math.cos(elapsedTime * 2.0) * 0.9,
        bJewel.pos.y - 1.2,
        bJewel.pos.z + Math.sin(elapsedTime * 1.8) * 0.5
      );
      const fOrb = orbTarget.sub(bOrb.pos).multiplyScalar(24.0);
      bOrb.vel.add(fOrb.multiplyScalar(dt / bOrb.mass));
      bOrb.vel.multiplyScalar(0.90);
      bOrb.pos.add(bOrb.vel.clone().multiplyScalar(dt));

      // Update Meshes
      knotMesh.position.copy(bKnot.pos);
      knotMesh.rotation.x = elapsedTime * 0.35 + bKnot.vel.y * 0.3;
      knotMesh.rotation.y = elapsedTime * 0.45 + bKnot.vel.x * 0.4;

      jewelMesh.position.copy(bJewel.pos);
      jewelMesh.rotation.x = -elapsedTime * 0.8;
      jewelMesh.rotation.y = elapsedTime * 1.0;

      orbMesh.position.copy(bOrb.pos);

      // Gyro Ring around the Knot
      ringMesh.position.copy(bKnot.pos);
      ringMesh.rotation.x = Math.PI / 3 + Math.sin(elapsedTime) * 0.3;
      ringMesh.rotation.y = elapsedTime * 0.6;

      // Update Hanging Tension Cables
      updateCable(cableAnchorToKnot, anchorPos, bKnot.pos);
      updateCable(cableKnotToJewel, bKnot.pos, bJewel.pos);
      updateCable(cableJewelToOrb, bJewel.pos, bOrb.pos);

      // Light tracking
      keyLight.position.x = 4 + targetX * 2;
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onPointerUp);
      window.removeEventListener("resize", onResize);

      knotGeometry.dispose();
      knotMaterial.dispose();
      jewelGeo.dispose();
      jewelMat.dispose();
      orbGeo.dispose();
      orbMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      cableAnchorToKnot.geometry.dispose();
      cableKnotToJewel.geometry.dispose();
      cableJewelToOrb.geometry.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      envTexture.dispose();
      pmremGenerator.dispose();
      renderer.dispose();

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        touchAction: "none"
      }}
    >
      {/* Background ambient lighting halo */}
      <div
        style={{
          position: "absolute",
          width: "360px",
          height: "360px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.16) 0%, rgba(168, 85, 247, 0.12) 50%, transparent 70%)",
          filter: "blur(50px)",
          pointerEvents: "none"
        }}
      />
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          zIndex: 2,
          cursor: "grab"
        }}
      />
    </div>
  );
}
