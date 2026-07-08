import { useRef, useEffect } from "react";
import * as THREE from "three";

const PARTICLE_COUNT = 3000;

export default function OrbitParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 100;

    // Particle geometry
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const colors = new Float32Array(PARTICLE_COUNT * 3);
    const sizes = new Float32Array(PARTICLE_COUNT);
    const velocities: THREE.Vector3[] = [];
    const originalPositions: THREE.Vector3[] = [];

    const color1 = new THREE.Color("#2DD4BF");
    const color2 = new THREE.Color("#D4AF37");
    const color3 = new THREE.Color("#F4F4F5");

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const i3 = i * 3;
      const radius = 20 + Math.random() * 80;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);

      positions[i3] = x;
      positions[i3 + 1] = y;
      positions[i3 + 2] = z;

      originalPositions.push(new THREE.Vector3(x, y, z));
      velocities.push(
        new THREE.Vector3(
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02,
          (Math.random() - 0.5) * 0.02
        )
      );

      const mixRatio = Math.random();
      let c: THREE.Color;
      if (mixRatio < 0.33) {
        c = color1.clone().lerp(color2, Math.random());
      } else if (mixRatio < 0.66) {
        c = color2.clone().lerp(color3, Math.random());
      } else {
        c = color3.clone().lerp(color1, Math.random());
      }
      colors[i3] = c.r;
      colors[i3 + 1] = c.g;
      colors[i3 + 2] = c.b;

      sizes[i] = 0.5 + Math.random() * 2;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

    // Create circular point texture
    const spriteCanvas = document.createElement("canvas");
    spriteCanvas.width = 32;
    spriteCanvas.height = 32;
    const ctx = spriteCanvas.getContext("2d")!;
    const grad = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(0.3, "rgba(255,255,255,0.8)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 32, 32);
    const spriteTexture = new THREE.CanvasTexture(spriteCanvas);

    const material = new THREE.PointsMaterial({
      size: 1.5,
      map: spriteTexture,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const interactionPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mouseWorldPos = new THREE.Vector3();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);

    // Animation
    const clock = new THREE.Clock();

    const animate = () => {
      rafRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      const posArray = geometry.attributes.position.array as Float32Array;

      // Update mouse world position
      mouse.set(mouseRef.current.x, mouseRef.current.y);
      raycaster.setFromCamera(mouse, camera);
      const intersectPoint = raycaster.ray.intersectPlane(interactionPlane, new THREE.Vector3());
      if (intersectPoint) mouseWorldPos.copy(intersectPoint);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const i3 = i * 3;
        const orig = originalPositions[i];
        const vel = velocities[i];

        // Undulating motion
        const waveX = Math.sin(elapsed * 0.3 + orig.y * 0.02) * 0.5;
        const waveY = Math.cos(elapsed * 0.2 + orig.x * 0.02) * 0.5;
        const waveZ = Math.sin(elapsed * 0.4 + orig.z * 0.02) * 0.3;

        posArray[i3] = orig.x + vel.x * elapsed * 10 + waveX;
        posArray[i3 + 1] = orig.y + vel.y * elapsed * 10 + waveY;
        posArray[i3 + 2] = orig.z + vel.z * elapsed * 10 + waveZ;

        // Mouse repulsion
        const dx = posArray[i3] - mouseWorldPos.x * 30;
        const dy = posArray[i3 + 1] - mouseWorldPos.y * 30;
        const dz = posArray[i3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < 25 && dist > 0.1) {
          const force = (1 - dist / 25) * 2;
          posArray[i3] += (dx / dist) * force;
          posArray[i3 + 1] += (dy / dist) * force;
        }
      }

      geometry.attributes.position.needsUpdate = true;
      points.rotation.y = elapsed * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      geometry.dispose();
      material.dispose();
      spriteTexture.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
