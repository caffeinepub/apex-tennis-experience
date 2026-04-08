import { Canvas, useFrame } from "@react-three/fiber";
import { useNavigate } from "@tanstack/react-router";
import { useRef, useState } from "react";
import * as THREE from "three";

function RacketModel({
  hovered,
  accentColor,
}: { hovered: boolean; accentColor: string }) {
  const groupRef = useRef<THREE.Group>(null);
  const rotSpeed = hovered ? 0.025 : 0.008;

  useFrame(() => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += rotSpeed;
    groupRef.current.rotation.x = Math.sin(Date.now() * 0.001) * 0.1;
  });

  const neonColor = new THREE.Color(accentColor);
  const H_STRING_POSITIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const V_STRING_POSITIONS = [0, 1, 2, 3, 4, 5, 6];
  const GRIP_POSITIONS = [0, 1, 2, 3, 4, 5, 6, 7];

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0.6, 0]}>
        <torusGeometry args={[0.7, 0.06, 12, 64, Math.PI * 2]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={neonColor}
          emissiveIntensity={hovered ? 2 : 0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {H_STRING_POSITIONS.map((i) => (
        <mesh key={`h-${i}`} position={[0, 0.1 + i * 0.13, 0]}>
          <cylinderGeometry args={[0.008, 0.008, 1.2, 4]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={new THREE.Color("#ffffff")}
            emissiveIntensity={0.3}
            transparent
            opacity={0.6}
          />
        </mesh>
      ))}

      {V_STRING_POSITIONS.map((i) => (
        <mesh
          key={`v-${i}`}
          position={[-0.3 + i * 0.1, 0.6, 0]}
          rotation={[0, 0, Math.PI / 2]}
        >
          <cylinderGeometry args={[0.006, 0.006, 1.1, 4]} />
          <meshStandardMaterial
            color="#ffffff"
            emissive={new THREE.Color("#ffffff")}
            emissiveIntensity={0.3}
            transparent
            opacity={0.5}
          />
        </mesh>
      ))}

      <mesh position={[0, -0.7, 0]}>
        <cylinderGeometry args={[0.07, 0.09, 1.4, 12]} />
        <meshStandardMaterial
          color="#1a1a2e"
          emissive={neonColor}
          emissiveIntensity={hovered ? 0.5 : 0.2}
          metalness={0.6}
          roughness={0.4}
        />
      </mesh>

      {GRIP_POSITIONS.map((i) => (
        <mesh
          key={`grip-${i}`}
          position={[0, -0.4 + i * 0.1, 0]}
          rotation={[0, (i * Math.PI) / 4, 0]}
        >
          <torusGeometry args={[0.085, 0.015, 4, 16, Math.PI * 2]} />
          <meshStandardMaterial
            color={accentColor}
            emissive={neonColor}
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      <pointLight
        color={accentColor}
        intensity={hovered ? 3 : 1}
        distance={5}
      />
    </group>
  );
}

interface RacketHighlight3DProps {
  accentColor?: string;
}

export function RacketHighlight3D({
  accentColor = "#00F5FF",
}: RacketHighlight3DProps) {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();

  const handleClick = () => navigate({ to: "/rackets" });
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") navigate({ to: "/rackets" });
  };

  return (
    <div
      className="h-[400px] w-full relative cursor-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label="View racket collection"
      data-ocid="racket3d.canvas_target"
      style={{
        borderRadius: "12px",
        border: `1px solid ${hovered ? accentColor : "rgba(255,255,255,0.1)"}`,
        boxShadow: hovered
          ? `0 0 30px ${accentColor}50, 0 0 60px ${accentColor}20`
          : "0 0 20px rgba(0,0,0,0.5)",
        transition: "all 0.3s ease",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight color="#00F5FF" intensity={1} position={[5, 5, 5]} />
        <pointLight color="#9D00FF" intensity={0.5} position={[-5, -3, 3]} />
        <RacketModel hovered={hovered} accentColor={accentColor} />
      </Canvas>
      <div
        className="absolute bottom-4 left-0 right-0 text-center text-sm uppercase tracking-widest font-medium pointer-events-none"
        style={{
          color: accentColor,
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.3s",
        }}
      >
        Click to Explore →
      </div>
    </div>
  );
}

export function RacketDetail3D({
  accentColor = "#00F5FF",
}: RacketHighlight3DProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="h-[500px] w-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      data-ocid="racket3d.canvas_target"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.3} />
        <pointLight color="#00F5FF" intensity={2} position={[5, 5, 5]} />
        <pointLight color="#9D00FF" intensity={1} position={[-5, -3, 3]} />
        <pointLight color="#FF007F" intensity={0.5} position={[0, -5, 2]} />
        <RacketModel hovered={hovered} accentColor={accentColor} />
      </Canvas>
    </div>
  );
}
