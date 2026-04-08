import { Canvas, useFrame } from "@react-three/fiber";
import { useCallback, useState } from "react";
import * as THREE from "three";

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 300;

  const positions = useRef(
    new Float32Array(
      Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 20),
    ),
  );

  const velocities = useRef(
    Array.from({ length: count }, () => ({
      vx: (Math.random() - 0.5) * 0.01,
      vy: (Math.random() - 0.5) * 0.01,
      vz: (Math.random() - 0.5) * 0.005,
    })),
  );

  useFrame(() => {
    if (!pointsRef.current) return;
    const pos = positions.current;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += velocities.current[i].vx;
      pos[i * 3 + 1] += velocities.current[i].vy;
      pos[i * 3 + 2] += velocities.current[i].vz;
      if (Math.abs(pos[i * 3]) > 10) velocities.current[i].vx *= -1;
      if (Math.abs(pos[i * 3 + 1]) > 10) velocities.current[i].vy *= -1;
      if (Math.abs(pos[i * 3 + 2]) > 5) velocities.current[i].vz *= -1;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions.current, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        color="#00F5FF"
        transparent
        opacity={0.7}
        sizeAttenuation
      />
    </points>
  );
}

function TennisBall({ phase }: { phase: number }) {
  const ballRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!ballRef.current || phase < 2) return;
    const t = clock.getElapsedTime();
    if (phase === 2) {
      ballRef.current.position.z = -5 + t * 3;
      ballRef.current.rotation.x += 0.1;
      ballRef.current.rotation.y += 0.08;
    }
  });

  if (phase < 2) return null;

  return (
    <mesh ref={ballRef} position={[0, 0, -5]}>
      <sphereGeometry args={[0.15, 16, 16]} />
      <meshStandardMaterial
        color="#c8ff00"
        emissive="#7fff00"
        emissiveIntensity={2}
        roughness={0.3}
      />
    </mesh>
  );
}

function ShockwaveRing({ visible }: { visible: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(0.1);

  useFrame(() => {
    if (!ringRef.current || !visible) return;
    scaleRef.current = Math.min(scaleRef.current + 0.06, 5);
    ringRef.current.scale.setScalar(scaleRef.current);
    const mat = ringRef.current.material as THREE.MeshBasicMaterial;
    mat.opacity = Math.max(0, 1 - scaleRef.current / 5);
  });

  if (!visible) return null;

  return (
    <mesh ref={ringRef} position={[0, 0, 2]} rotation={[0, 0, 0]}>
      <torusGeometry args={[1, 0.03, 8, 64]} />
      <meshBasicMaterial color="#00F5FF" transparent opacity={1} />
    </mesh>
  );
}

function PlayerSilhouette({ opacity }: { opacity: number }) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.1;
  });

  const lineColor = new THREE.Color("#00F5FF");

  const createLine = (points: [number, number, number][]) => {
    const geometry = new THREE.BufferGeometry().setFromPoints(
      points.map(([x, y, z]) => new THREE.Vector3(x, y, z)),
    );
    return geometry;
  };

  const bodyLines: [number, number, number][][] = [
    [
      [-0.2, 0, 0],
      [0.2, 0, 0],
      [0.3, -0.8, 0],
      [-0.3, -0.8, 0],
      [-0.2, 0, 0],
    ],
    [
      [0, 0.6, 0],
      [0.2, 0.3, 0],
      [0.1, 0, 0],
      [-0.1, 0, 0],
      [-0.2, 0.3, 0],
      [0, 0.6, 0],
    ],
    [
      [-0.2, 0, 0],
      [-0.6, 0.4, 0],
      [-0.9, 0.8, 0],
    ],
    [
      [0.2, 0, 0],
      [0.5, -0.2, 0],
      [0.7, -0.5, 0],
    ],
    [
      [-0.1, -0.8, 0],
      [-0.25, -1.4, 0],
      [-0.2, -2.0, 0],
    ],
    [
      [0.1, -0.8, 0],
      [0.3, -1.3, 0],
      [0.1, -2.0, 0],
    ],
  ];

  const lineIds = [
    "torso",
    "head",
    "left-arm",
    "right-arm",
    "left-leg",
    "right-leg",
  ];

  return (
    <group ref={groupRef} position={[0, 0.5, -2]}>
      {bodyLines.map((pts, i) => (
        <line key={lineIds[i]}>
          <primitive object={createLine(pts)} attach="geometry" />
          <lineBasicMaterial
            color={lineColor}
            transparent
            opacity={opacity}
            linewidth={2}
          />
        </line>
      ))}
      <pointLight color="#00F5FF" intensity={opacity * 3} distance={5} />
    </group>
  );
}

function IntroScene({
  phase,
  onPhaseChange,
}: { phase: number; onPhaseChange: (p: number) => void }) {
  const phaseRef = useRef(phase);
  phaseRef.current = phase;

  useFrame(({ clock, camera }) => {
    const t = clock.getElapsedTime();

    if (phaseRef.current === 0 && t > 0.5) onPhaseChange(1);
    else if (phaseRef.current === 1 && t > 2) onPhaseChange(2);
    else if (phaseRef.current === 2 && t > 3.5) onPhaseChange(3);
    else if (phaseRef.current === 3 && t > 4.5) onPhaseChange(4);

    if (phaseRef.current >= 1 && phaseRef.current < 3) {
      camera.position.z = 5 - (t - 0.5) * 0.2;
    }
    if (phaseRef.current === 3) {
      camera.position.x = Math.sin(t * 30) * 0.05;
    } else {
      camera.position.x = 0;
    }
  });

  return null;
}

import { useNavigate } from "@tanstack/react-router";
import { useRef } from "react";

export function IntroScreen() {
  const navigate = useNavigate();
  const [phase, setPhase] = useState(0);
  const [playerOpacity, setPlayerOpacity] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [exiting, setExiting] = useState(false);

  const handlePhaseChange = useCallback((p: number) => {
    setPhase(p);
    if (p === 1) {
      let op = 0;
      const interval = setInterval(() => {
        op = Math.min(op + 0.05, 1);
        setPlayerOpacity(op);
        if (op >= 1) clearInterval(interval);
      }, 50);
    }
    if (p >= 4) {
      setTimeout(() => setShowButton(true), 300);
    }
  }, []);

  const handleEnter = () => {
    setExiting(true);
    setTimeout(() => navigate({ to: "/home" }), 800);
  };

  const loadingDots = [
    { key: "dot-a", delay: "0s" },
    { key: "dot-b", delay: "0.2s" },
    { key: "dot-c", delay: "0.4s" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{
        background: "#050505",
        opacity: exiting ? 0 : 1,
        transition: "opacity 0.8s ease",
        transform: exiting ? "scale(1.05)" : "scale(1)",
      }}
    >
      <div className="absolute inset-0">
        <Canvas
          camera={{ position: [0, 0, 5], fov: 60 }}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <ambientLight intensity={0.2} />
          <pointLight color="#00F5FF" intensity={1} position={[5, 5, 5]} />
          <pointLight color="#9D00FF" intensity={0.5} position={[-5, -5, 2]} />
          <ParticleField />
          <PlayerSilhouette opacity={playerOpacity} />
          <TennisBall phase={phase} />
          <ShockwaveRing visible={phase === 3} />
          <IntroScene phase={phase} onPhaseChange={handlePhaseChange} />
        </Canvas>
      </div>

      <div className="relative z-10 text-center mb-20">
        <div
          className="text-6xl md:text-8xl font-display font-black uppercase tracking-[0.2em] mb-4"
          style={{
            color: "#00F5FF",
            textShadow: "0 0 20px #00F5FF, 0 0 40px #00F5FF, 0 0 80px #00F5FF",
            opacity: playerOpacity,
            transition: "opacity 0.5s ease",
          }}
        >
          APEX
        </div>
        <div
          className="text-2xl md:text-3xl font-body font-light tracking-[0.5em] uppercase"
          style={{
            color: "#9D00FF",
            textShadow: "0 0 10px #9D00FF",
            opacity: playerOpacity,
            transition: "opacity 0.5s ease 0.2s",
          }}
        >
          TENNIS
        </div>
      </div>

      {showButton && (
        <button
          type="button"
          onClick={handleEnter}
          data-ocid="intro.primary_button"
          className="relative z-10 group"
          style={{
            background: "rgba(0,5,15,0.8)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            border: "1px solid #00F5FF",
            borderRadius: "9999px",
            padding: "1rem 3rem",
            color: "#00F5FF",
            fontSize: "1.1rem",
            fontFamily: "inherit",
            fontWeight: 800,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            cursor: "none",
            animation: "pulse-glow 2s ease-in-out infinite",
            boxShadow:
              "0 0 20px rgba(0,245,255,0.4), 0 0 40px rgba(0,245,255,0.2)",
          }}
        >
          <span
            className="relative z-10 inline-block"
            style={{ transition: "transform 0.3s ease" }}
          >
            ENTER EXPERIENCE
          </span>
          <span
            className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{ background: "rgba(0,245,255,0.1)" }}
          />
        </button>
      )}

      {!showButton && (
        <div className="relative z-10 flex gap-2">
          {loadingDots.map(({ key, delay }) => (
            <div
              key={key}
              className="w-2 h-2 rounded-full"
              style={{
                background: "#00F5FF",
                animation: `pulse 1.2s ease-in-out ${delay} infinite`,
                boxShadow: "0 0 6px #00F5FF",
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
