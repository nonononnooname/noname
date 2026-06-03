"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

/**
 * "Anomalous matter" — a wireframe icosahedron whose surface is displaced by
 * simplex noise in the vertex shader, so it reads as matter held in constant
 * flux. A fresnel rim picks out the silhouette; a mouse-driven point light
 * sweeps the diffuse term. Brand-adapted: white mesh, brand-yellow glow, on
 * black — never the source snippet's sky-blue. Heavy (pulls in three.js), so it
 * is loaded only on the client via next/dynamic from the hero wrapper.
 */

// Subdivision of the icosahedron. The source used 64 (~320k faces) which is far
// past the point of diminishing returns; 12 morphs smoothly and stays light on
// mobile GPUs.
const DETAIL = 12;
const RADIUS = 1.2;
const MESH_COLOR = 0xffffff; // brand monochrome base
const GLOW_COLOR = 0xffd803; // brand yellow (--primary) fresnel rim

const VERTEX_SHADER = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;

  // Ashima simplex noise (snoise) — standard 3D gradient noise.
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }

  void main() {
    vNormal = normal;
    vPosition = position;
    float displacement = snoise(position * 2.0 + uTime * 0.5) * 0.18;
    vec3 displaced = position + normal * displacement;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
  }
`;

const FRAGMENT_SHADER = /* glsl */ `
  uniform vec3 uMeshColor;
  uniform vec3 uGlowColor;
  uniform vec3 uPointLight;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(uPointLight - vPosition);
    float diffuse = max(dot(normal, lightDir), 0.0);
    float fresnel = pow(1.0 - max(dot(normal, vec3(0.0, 0.0, 1.0)), 0.0), 2.0);
    vec3 color = uMeshColor * (0.35 + diffuse * 0.65) + uGlowColor * fresnel * 0.9;
    gl_FragColor = vec4(color, 1.0);
  }
`;

export function AnomalousMatterScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const geometry = new THREE.IcosahedronGeometry(RADIUS, DETAIL);
    const uniforms = {
      uTime: { value: 0 },
      uPointLight: { value: new THREE.Vector3(0, 0, 5) },
      uMeshColor: { value: new THREE.Color(MESH_COLOR) },
      uGlowColor: { value: new THREE.Color(GLOW_COLOR) },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      wireframe: true,
      transparent: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const renderFrame = (elapsedMs: number) => {
      uniforms.uTime.value = elapsedMs * 0.0003;
      mesh.rotation.y += 0.0005;
      mesh.rotation.x += 0.0002;
      renderer.render(scene, camera);
    };

    let frameId = 0;
    const loop = (elapsedMs: number) => {
      renderFrame(elapsedMs);
      frameId = requestAnimationFrame(loop);
    };

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      if (prefersReducedMotion) renderer.render(scene, camera);
    };

    // Mouse-driven light is a progressive enhancement; touch devices simply keep
    // the default light position. Disabled under reduced-motion.
    const handleMouseMove = (event: MouseEvent) => {
      // Map the cursor relative to the canvas rect (not the window) so the light
      // stays accurate even though the canvas is inset below the sticky header.
      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      const projected = new THREE.Vector3(x, y, 0.5).unproject(camera);
      const direction = projected.sub(camera.position).normalize();
      const distance = -camera.position.z / direction.z;
      uniforms.uPointLight.value.copy(
        camera.position.clone().add(direction.multiplyScalar(distance)),
      );
    };

    window.addEventListener("resize", handleResize);
    if (prefersReducedMotion) {
      renderFrame(0); // single static frame, no animation loop
    } else {
      window.addEventListener("mousemove", handleMouseMove);
      frameId = requestAnimationFrame(loop);
    }

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      // dispose() frees three.js objects but not the GPU context; forceContextLoss
      // releases it deterministically so StrictMode/navigation remounts don't
      // accumulate live WebGL contexts (browsers cap them and blank the oldest).
      renderer.forceContextLoss();
      if (renderer.domElement.parentNode === mount) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} aria-hidden className="absolute inset-0 h-full w-full" />;
}
