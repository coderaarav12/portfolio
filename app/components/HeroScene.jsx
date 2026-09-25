"use client";

import React, { useEffect, useRef } from "react";
import * as THREE from "three";

export default function HeroScene() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    // Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x06070a, 0.04);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 14);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // 1. Central Core: Glowing Wireframe Polyhedron
    const coreGroup = new THREE.Group();
    scene.add(coreGroup);

    const innerGeo = new THREE.IcosahedronGeometry(2.2, 2);
    const innerMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
    });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    coreGroup.add(innerMesh);

    // Central luminous nucleus
    const nucleusGeo = new THREE.SphereGeometry(0.8, 24, 24);
    const nucleusMat = new THREE.MeshBasicMaterial({
      color: 0x818cf8,
      transparent: true,
      opacity: 0.7,
    });
    const nucleus = new THREE.Mesh(nucleusGeo, nucleusMat);
    coreGroup.add(nucleus);

    // Core point constellation
    const corePointsGeo = new THREE.IcosahedronGeometry(2.35, 3);
    const corePointsMat = new THREE.PointsMaterial({
      color: 0x34d399,
      size: 0.06,
      transparent: true,
      opacity: 0.8,
    });
    const corePoints = new THREE.Points(corePointsGeo, corePointsMat);
    coreGroup.add(corePoints);

    // 2. Orbital Rings & System Nodes
    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);

    const ringCount = 3;
    const ringRadii = [4.2, 5.8, 7.4];
    const ringTilts = [
      { x: 0.6, y: 0.2, z: 0.1 },
      { x: -0.4, y: 0.8, z: -0.3 },
      { x: 0.2, y: -0.5, z: 0.9 },
    ];

    const nodesData = [
      { label: "AI / ML", radius: 4.2, speed: 0.008, angle: 0, color: 0x38bdf8 },
      { label: "SYSTEMS", radius: 4.2, speed: 0.008, angle: Math.PI, color: 0x818cf8 },
      { label: "PRODUCTS", radius: 5.8, speed: -0.006, angle: 0.8, color: 0x34d399 },
      { label: "VISION", radius: 5.8, speed: -0.006, angle: 3.9, color: 0x38bdf8 },
      { label: "EXPERIMENTS", radius: 7.4, speed: 0.004, angle: 1.5, color: 0xfbbf24 },
      { label: "OPEN SOURCE", radius: 7.4, speed: 0.004, angle: 4.6, color: 0xa78bfa },
    ];

    // Create thin vector ring tracks
    ringRadii.forEach((radius, i) => {
      const ringCurve = new THREE.EllipseCurve(
        0, 0, radius, radius, 0, 2 * Math.PI, false, 0
      );
      const ringPoints = ringCurve.getPoints(120);
      const ringGeo = new THREE.BufferGeometry().setFromPoints(ringPoints);
      const ringMat = new THREE.LineBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.08,
      });
      const ringLine = new THREE.Line(ringGeo, ringMat);
      ringLine.rotation.set(ringTilts[i].x, ringTilts[i].y, ringTilts[i].z);
      ringsGroup.add(ringLine);
    });

    // Create node objects
    const nodeMeshes = nodesData.map((node) => {
      const nodeObj = new THREE.Group();

      const sphereGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const sphereMat = new THREE.MeshBasicMaterial({
        color: node.color,
      });
      const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
      nodeObj.add(sphereMesh);

      // Node subtle halo
      const haloGeo = new THREE.RingGeometry(0.24, 0.28, 24);
      const haloMat = new THREE.MeshBasicMaterial({
        color: node.color,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.4,
      });
      const haloMesh = new THREE.Mesh(haloGeo, haloMat);
      nodeObj.add(haloMesh);

      ringsGroup.add(nodeObj);
      return { ...node, obj: nodeObj };
    });

    // Connecting laser line between Core and Nodes
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.15,
    });
    const connectorGeo = new THREE.BufferGeometry();
    const connectorPositions = new Float32Array(nodesData.length * 6);
    connectorGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(connectorPositions, 3)
    );
    const connectorLines = new THREE.LineSegments(connectorGeo, lineMat);
    scene.add(connectorLines);

    // 3. Ambient Star / Data Field
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 36;
      particlePositions[i + 1] = (Math.random() - 0.5) * 28;
      particlePositions[i + 2] = (Math.random() - 0.5) * 25;
    }

    particleGeo.setAttribute(
      "position",
      new THREE.BufferAttribute(particlePositions, 3)
    );

    const particleMat = new THREE.PointsMaterial({
      color: 0x94a3b8,
      size: 0.05,
      transparent: true,
      opacity: 0.5,
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse Parallax
    let targetMouseX = 0;
    let targetMouseY = 0;
    let currentMouseX = 0;
    let currentMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Scroll Integration (Flight into the Core)
    let scrollY = 0;
    const handleScroll = () => {
      scrollY = window.scrollY;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Resize Handler
    const handleResize = () => {
      if (!container) return;
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // Visibility Observer to pause when scrolled far out of view
    let isVisible = true;
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return;

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse damping
      currentMouseX += (targetMouseX - currentMouseX) * 0.05;
      currentMouseY += (targetMouseY - currentMouseY) * 0.05;

      // Scroll depth translation: Camera zooms toward core on initial scroll
      const scrollFactor = Math.min(scrollY / 700, 1.8);
      const targetCamZ = 14 - scrollFactor * 6.5;
      camera.position.z += (targetCamZ - camera.position.z) * 0.08;

      camera.position.x = currentMouseX * 1.4;
      camera.position.y = -currentMouseY * 1.4;
      camera.lookAt(0, 0, 0);

      if (!prefersReducedMotion) {
        // Rotate Core
        coreGroup.rotation.y = elapsedTime * 0.25;
        coreGroup.rotation.x = Math.sin(elapsedTime * 0.2) * 0.15;

        // Core Breathing scale
        const pulse = 1 + Math.sin(elapsedTime * 2) * 0.04;
        innerMesh.scale.set(pulse, pulse, pulse);
        nucleus.scale.set(pulse * 1.05, pulse * 1.05, pulse * 1.05);

        // Orbit Nodes
        const positions = connectorGeo.attributes.position.array;
        nodeMeshes.forEach((node, idx) => {
          node.angle += node.speed;
          const x = Math.cos(node.angle) * node.radius;
          const y = Math.sin(node.angle) * (node.radius * 0.65);
          const z = Math.sin(node.angle * 2) * 0.8;

          node.obj.position.set(x, y, z);
          node.obj.lookAt(camera.position);

          // Update connector line coordinates
          const i6 = idx * 6;
          // Point 1: core center
          positions[i6] = 0;
          positions[i6 + 1] = 0;
          positions[i6 + 2] = 0;
          // Point 2: node position
          positions[i6 + 3] = x;
          positions[i6 + 4] = y;
          positions[i6 + 5] = z;
        });
        connectorGeo.attributes.position.needsUpdate = true;

        // Slowly drift particles
        particles.rotation.y = elapsedTime * 0.02;
        particles.rotation.x = elapsedTime * 0.01;
      }

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);

      // Clean GPU resources
      innerGeo.dispose();
      innerMat.dispose();
      nucleusGeo.dispose();
      nucleusMat.dispose();
      corePointsGeo.dispose();
      corePointsMat.dispose();
      connectorGeo.dispose();
      lineMat.dispose();
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
      ref={containerRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
}
