import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

function Background3D({ theme = 'dark' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Scene, Camera, Renderer Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 30;

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 2. Theme Colors
    const isDark = theme === 'dark';
    scene.fog = new THREE.FogExp2(isDark ? 0x05010a : 0xf0f4ff, 0.015);

    const primaryColor = isDark ? 0x00eaff : 0x2563eb;
    const secondaryColor = isDark ? 0xb400ff : 0x7c3aed;
    const accentColor = isDark ? 0xff007f : 0x06b6d4;

    // 3. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, isDark ? 0.6 : 0.9);
    scene.add(ambientLight);

    const light1 = new THREE.PointLight(primaryColor, isDark ? 3 : 2, 80);
    light1.position.set(20, 20, 20);
    scene.add(light1);

    const light2 = new THREE.PointLight(secondaryColor, isDark ? 3 : 2, 80);
    light2.position.set(-20, -20, 15);
    scene.add(light2);

    const light3 = new THREE.PointLight(accentColor, isDark ? 2.5 : 1.5, 60);
    light3.position.set(0, 15, -10);
    scene.add(light3);

    // 4. Floating 3D Geometric Objects (Representing items floating in 3D campus space)
    const objectsGroup = new THREE.Group();
    scene.add(objectsGroup);

    const geometries = [
      new THREE.IcosahedronGeometry(2.2, 0),
      new THREE.TorusGeometry(2, 0.6, 16, 100),
      new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16),
      new THREE.OctahedronGeometry(2.2, 0),
      new THREE.DodecahedronGeometry(2, 0),
      new THREE.BoxGeometry(2.5, 2.5, 2.5),
    ];

    const shapes = [];
    const shapeCount = 14;

    for (let i = 0; i < shapeCount; i++) {
      const geom = geometries[i % geometries.length];
      const isWire = i % 2 === 0;

      const mat = new THREE.MeshStandardMaterial({
        color: i % 3 === 0 ? primaryColor : i % 3 === 1 ? secondaryColor : accentColor,
        wireframe: isWire,
        transparent: true,
        opacity: isDark ? (isWire ? 0.45 : 0.25) : (isWire ? 0.35 : 0.15),
        roughness: 0.2,
        metalness: 0.8,
        emissive: i % 3 === 0 ? primaryColor : secondaryColor,
        emissiveIntensity: isDark ? 0.2 : 0.1,
      });

      const mesh = new THREE.Mesh(geom, mat);

      // Random 3D Position spread
      mesh.position.set(
        (Math.random() - 0.5) * 55,
        (Math.random() - 0.5) * 40,
        (Math.random() - 0.5) * 30 - 5
      );

      // Random Rotations & Speeds
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

      const speed = {
        rx: (Math.random() - 0.5) * 0.012,
        ry: (Math.random() - 0.5) * 0.012,
        rz: (Math.random() - 0.5) * 0.008,
        floatSpeed: 0.001 + Math.random() * 0.002,
        floatOffset: Math.random() * Math.PI * 2,
        initialY: mesh.position.y,
      };

      shapes.push({ mesh, speed });
      objectsGroup.add(mesh);
    }

    // 5. Interactive Particle Constellation Grid
    const particleCount = 600;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    for (let i = 0; i < particleCount; i++) {
      const x = (Math.random() - 0.5) * 70;
      const y = (Math.random() - 0.5) * 50;
      const z = (Math.random() - 0.5) * 40;

      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;

      particleVelocities.push({
        x: (Math.random() - 0.5) * 0.02,
        y: (Math.random() - 0.5) * 0.02,
        z: (Math.random() - 0.5) * 0.02,
      });
    }

    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );

    // Circle texture for smooth particles
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(8, 8, 8, 0, Math.PI * 2);
    ctx.fill();

    const pTexture = new THREE.CanvasTexture(canvas);

    const particleMaterial = new THREE.PointsMaterial({
      color: primaryColor,
      size: isDark ? 0.6 : 0.45,
      map: pTexture,
      transparent: true,
      opacity: isDark ? 0.75 : 0.5,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });

    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 6. Dynamic Connecting Constellation Lines
    const maxConnections = 120;
    const linePositions = new Float32Array(maxConnections * 6);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(linePositions, 3)
    );

    const lineMaterial = new THREE.LineBasicMaterial({
      color: secondaryColor,
      transparent: true,
      opacity: isDark ? 0.18 : 0.1,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
    });

    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    // 7. Mouse Parallax Tracking
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 8. Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 9. Animation Loop
    let animationFrameId;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse interpolation
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Parallax Camera Tilt
      camera.position.x = mouseX * 3;
      camera.position.y = -mouseY * 3;
      camera.lookAt(scene.position);

      // Rotate light sources
      light1.position.x = Math.sin(elapsedTime * 0.5) * 25;
      light1.position.y = Math.cos(elapsedTime * 0.3) * 20;

      light2.position.x = Math.cos(elapsedTime * 0.4) * -25;
      light2.position.y = Math.sin(elapsedTime * 0.6) * -20;

      // Animate 3D Shapes
      shapes.forEach(({ mesh, speed }) => {
        mesh.rotation.x += speed.rx;
        mesh.rotation.y += speed.ry;
        mesh.rotation.z += speed.rz;
        mesh.position.y = speed.initialY + Math.sin(elapsedTime * 2 + speed.floatOffset) * 1.5;
      });

      // Animate Particles & Update Lines
      const positions = particleGeometry.attributes.position.array;
      let vertexIdx = 0;
      let connectionCount = 0;

      for (let i = 0; i < particleCount; i++) {
        // Move particle
        positions[i * 3] += particleVelocities[i].x;
        positions[i * 3 + 1] += particleVelocities[i].y;
        positions[i * 3 + 2] += particleVelocities[i].z;

        // Bounce boundaries
        if (Math.abs(positions[i * 3]) > 35) particleVelocities[i].x *= -1;
        if (Math.abs(positions[i * 3 + 1]) > 25) particleVelocities[i].y *= -1;
        if (Math.abs(positions[i * 3 + 2]) > 20) particleVelocities[i].z *= -1;

        // Check distance for lines
        for (let j = i + 1; j < particleCount; j++) {
          if (connectionCount >= maxConnections) break;

          const dx = positions[i * 3] - positions[j * 3];
          const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
          const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

          if (dist < 6.5) {
            linePositions[vertexIdx++] = positions[i * 3];
            linePositions[vertexIdx++] = positions[i * 3 + 1];
            linePositions[vertexIdx++] = positions[i * 3 + 2];

            linePositions[vertexIdx++] = positions[j * 3];
            linePositions[vertexIdx++] = positions[j * 3 + 1];
            linePositions[vertexIdx++] = positions[j * 3 + 2];

            connectionCount++;
          }
        }
      }

      particleGeometry.attributes.position.needsUpdate = true;
      lineGeometry.attributes.position.needsUpdate = true;
      lineGeometry.setDrawRange(0, connectionCount * 2);

      // Group rotation
      objectsGroup.rotation.y = elapsedTime * 0.03;

      renderer.render(scene, camera);
    };

    animate();

    // 10. Clean Up on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);

      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }

      geometries.forEach((g) => g.dispose());
      shapes.forEach(({ mesh }) => {
        if (mesh.material) mesh.material.dispose();
      });

      particleGeometry.dispose();
      particleMaterial.dispose();
      lineGeometry.dispose();
      lineMaterial.dispose();
      pTexture.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    />
  );
}

export default React.memo(Background3D);
