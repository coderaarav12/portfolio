"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let width = container.clientWidth || 450;
    let height = container.clientHeight || 450;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 7.2);

    // WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);

    // Multi-Angle Directional & Studio Lights for Radiant Specular Facets
    const ambientLight = new THREE.AmbientLight(0x0a192f, 2.5);
    scene.add(ambientLight);

    // Front high-power key light for glistening highlights on facets
    const keyLight = new THREE.DirectionalLight(0xffffff, 4.0);
    keyLight.position.set(3, 4, 6);
    scene.add(keyLight);

    // Cyan electric rim light
    const rimCyan = new THREE.DirectionalLight(0x00f0ff, 4.5);
    rimCyan.position.set(-6, 2, 2);
    scene.add(rimCyan);

    // Violet / Magenta accent light
    const accentViolet = new THREE.DirectionalLight(0xc084fc, 3.5);
    accentViolet.position.set(4, -4, 3);
    scene.add(accentViolet);

    // Soft point light right in the center for internal crystal luminescence
    const centerGlow = new THREE.PointLight(0x38bdf8, 25, 8);
    centerGlow.position.set(0, 0, 0);
    scene.add(centerGlow);

    // Central Master Group for coordinated rotation & floating
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    // 1. Faceted Radiant Prismatic Crystal Core
    const coreGeometry = new THREE.IcosahedronGeometry(1.6, 1);
    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0a192f,
      emissive: 0x0284c7,
      emissiveIntensity: 0.12,
      roughness: 0.14,
      metalness: 0.85,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
      flatShading: true
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    coreGroup.add(coreMesh);

    // 2. Facet Edge Highlights (Gives the crystal crisp glowing edges)
    const wireGeometry = new THREE.IcosahedronGeometry(1.604, 1);
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.22
    });
    const wireMesh = new THREE.Mesh(wireGeometry, wireMaterial);
    coreGroup.add(wireMesh);

    // 3. Inner Pulsing Core
    const innerGeometry = new THREE.OctahedronGeometry(0.85, 0);
    const innerMaterial = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x38bdf8,
      emissiveIntensity: 1.2,
      roughness: 0.1,
      metalness: 0.5
    });
    const innerMesh = new THREE.Mesh(innerGeometry, innerMaterial);
    coreGroup.add(innerMesh);

    // 4. Gyroscopic Orbital Ring 1 (Cyan Neon Ring)
    const ring1Geo = new THREE.TorusGeometry(2.35, 0.02, 16, 120);
    const ring1Mat = new THREE.MeshStandardMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 1.2,
      metalness: 0.9,
      roughness: 0.1
    });
    const ring1 = new THREE.Mesh(ring1Geo, ring1Mat);
    ring1.rotation.x = Math.PI / 3.2;
    ring1.rotation.y = Math.PI / 6;
    coreGroup.add(ring1);

    // 5. Gyroscopic Orbital Ring 2 (Electric Purple Ring)
    const ring2Geo = new THREE.TorusGeometry(2.7, 0.016, 16, 120);
    const ring2Mat = new THREE.MeshStandardMaterial({
      color: 0xd946ef,
      emissive: 0xd946ef,
      emissiveIntensity: 1.2,
      metalness: 0.9,
      roughness: 0.1
    });
    const ring2 = new THREE.Mesh(ring2Geo, ring2Mat);
    ring2.rotation.x = -Math.PI / 3.8;
    ring2.rotation.y = -Math.PI / 4.5;
    coreGroup.add(ring2);

    // 5. Orbiting Micro-Beacon Satellites
    const beaconGeo = new THREE.SphereGeometry(0.045, 16, 16);
    const beaconMat1 = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
    const beacon1 = new THREE.Mesh(beaconGeo, beaconMat1);
    coreGroup.add(beacon1);

    const beaconMat2 = new THREE.MeshBasicMaterial({ color: 0xf472b6 });
    const beacon2 = new THREE.Mesh(beaconGeo, beaconMat2);
    coreGroup.add(beacon2);

    // 6. Ambient Floating Data Points (Crisp, Subtle)
    const particleCount = 140;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePos[i] = (Math.random() - 0.5) * 12;
      particlePos[i + 1] = (Math.random() - 0.5) * 10;
      particlePos[i + 2] = (Math.random() - 0.5) * 8;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.035,
      transparent: true,
      opacity: 0.5
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Damping Interpolation
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;

    const onMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      targetX = x;
      targetY = y;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Handle Window Resize
    const onResize = () => {
      if (!container) return;
      width = container.clientWidth || 450;
      height = container.clientHeight || 450;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", onResize);

    // Animation Loop
    let animId;
    const clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse follow with spring damping
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;

      // Gentle floating levitation
      const floatY = Math.sin(elapsedTime * 1.4) * 0.12;
      coreGroup.position.y = floatY;

      // Crystal faceted core rotation
      coreMesh.rotation.x = elapsedTime * 0.22 + currentY * 0.4;
      coreMesh.rotation.y = elapsedTime * 0.32 + currentX * 0.6;

      // Inner energy core rotates opposite for mechanical depth
      innerMesh.rotation.x = -elapsedTime * 0.4;
      innerMesh.rotation.y = -elapsedTime * 0.5;

      // Gyroscopic orbital rings spin along their respective axes
      ring1.rotation.z = elapsedTime * 0.45;
      ring2.rotation.z = -elapsedTime * 0.35;

      // Orbiting satellites follow the rings
      const r1Angle = elapsedTime * 0.8;
      beacon1.position.x = Math.cos(r1Angle) * 2.35;
      beacon1.position.y = Math.sin(r1Angle) * 2.35 * Math.sin(Math.PI / 3.2);
      beacon1.position.z = Math.sin(r1Angle) * 2.35 * Math.cos(Math.PI / 3.2);

      const r2Angle = -elapsedTime * 0.65;
      beacon2.position.x = Math.cos(r2Angle) * 2.7 * Math.cos(-Math.PI / 5);
      beacon2.position.y = Math.sin(r2Angle) * 2.7;
      beacon2.position.z = Math.cos(r2Angle) * 2.7 * Math.sin(-Math.PI / 5);

      // Light response to cursor
      keyLight.position.x = 3 + currentX * 3;
      keyLight.position.y = 4 - currentY * 3;
      rimCyan.position.x = -6 + currentX * 2;
      rimCyan.position.y = 2 - currentY * 2;

      // Subtle particle field drift
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);

      coreGeometry.dispose();
      coreMaterial.dispose();
      wireGeometry.dispose();
      wireMaterial.dispose();
      innerGeometry.dispose();
      innerMaterial.dispose();
      ring1Geo.dispose();
      ring1Mat.dispose();
      ring2Geo.dispose();
      ring2Mat.dispose();
      beaconGeo.dispose();
      beaconMat1.dispose();
      beaconMat2.dispose();
      particleGeo.dispose();
      particleMat.dispose();
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
        minHeight: "440px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
    >
      {/* Soft atmospheric ambient glow behind the crystal */}
      <div
        style={{
          position: "absolute",
          width: "320px",
          height: "320px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(56, 189, 248, 0.18) 0%, rgba(168, 85, 247, 0.12) 50%, transparent 70%)",
          filter: "blur(40px)",
          pointerEvents: "none"
        }}
      />
      <div
        ref={containerRef}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "440px",
          position: "relative",
          zIndex: 2,
          cursor: "grab"
        }}
      />
    </div>
  );
}
