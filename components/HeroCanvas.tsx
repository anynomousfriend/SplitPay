'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function HeroCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    // Setting alpha to true allows background color to show through
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    // Set initial size
    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;
    renderer.setSize(width, height);
    
    // We attach the canvas to our container
    containerRef.current.appendChild(renderer.domElement);
    
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    const geometry = new THREE.IcosahedronGeometry(1, 0);
    const material = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    
    const instances = 40;
    const group = new THREE.Group();
    for(let i=0; i<instances; i++) {
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set((Math.random()-0.5)*10, (Math.random()-0.5)*10, (Math.random()-0.5)*10);
        mesh.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, 0);
        group.add(mesh);
    }
    scene.add(group);

    let animationFrameId: number;

    function animate() {
        animationFrameId = requestAnimationFrame(animate);
        group.rotation.y += 0.002;
        group.children.forEach(c => {
            c.rotation.x += 0.01;
            c.rotation.z += 0.005;
        });
        renderer.render(scene, camera);
    }
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none opacity-40"
    />
  );
}
