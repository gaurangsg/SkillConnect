import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroScene() {
  const hostRef = useRef(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(48, 1, 0.1, 100);
    camera.position.z = 27;
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5));
    renderer.setClearColor(0x000000, 0);
    host.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);
    let seed = 84729;
    const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    const positions = [];
    for (let i = 0; i < 72; i += 1) positions.push([(random() - 0.5) * 40, (random() - 0.5) * 23, (random() - 0.5) * 4]);

    const nodeGeometry = new THREE.BufferGeometry();
    nodeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions.flat(), 3));
    const nodes = new THREE.Points(nodeGeometry, new THREE.PointsMaterial({ color: '#b4ea87', size: 0.19, transparent: true, opacity: 0.75, sizeAttenuation: true }));
    group.add(nodes);

    const linePositions = [];
    positions.forEach((point, index) => {
      positions.slice(index + 1).forEach((next) => {
        const distance = Math.hypot(point[0] - next[0], point[1] - next[1], point[2] - next[2]);
        if (distance < 5.7 && random() > 0.56) linePositions.push(...point, ...next);
      });
    });
    const linksGeometry = new THREE.BufferGeometry();
    linksGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const links = new THREE.LineSegments(linksGeometry, new THREE.LineBasicMaterial({ color: '#8bcab0', transparent: true, opacity: 0.12 }));
    group.add(links);

    let frame = 0;
    const resize = () => {
      const { width, height } = host.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();
    const animate = () => {
      frame = requestAnimationFrame(animate);
      group.rotation.y += 0.00035;
      group.rotation.x = Math.sin(performance.now() * 0.00012) * 0.025;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      nodeGeometry.dispose();
      linksGeometry.dispose();
      nodes.material.dispose();
      links.material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={hostRef} className="hero-backdrop" aria-hidden="true" />;
}
