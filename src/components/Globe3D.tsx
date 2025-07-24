"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere, Html, Line } from "@react-three/drei";
import * as THREE from "three";
import { MarkerProps, ConnectionLineProps, Globe3DProps } from "@/types";
import { getLatencyColor } from "@/lib/utils";

function Marker({ position, color, size, onClick, children }: MarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.5;
      meshRef.current.scale.setScalar(hovered ? size * 1.2 : size);
    }
  });

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshBasicMaterial color={color} />
      </mesh>
      {hovered && (
        <Html distanceFactor={10}>
          <div className="bg-gray-900/90 text-white p-2 rounded-lg text-xs whitespace-nowrap pointer-events-none">
            {children}
          </div>
        </Html>
      )}
    </group>
  );
}

function ConnectionLine({ start, end, color, animated = false }: ConnectionLineProps) {
  const materialRef = useRef<THREE.LineBasicMaterial>(null);

  useFrame((state) => {
    if (animated && materialRef.current) {
      const opacity = 0.3 + 0.3 * Math.sin(state.clock.elapsedTime * 2);
      materialRef.current.opacity = opacity;
    }
  });

  const points = useMemo(() => {
    const startVec = new THREE.Vector3(...start);
    const endVec = new THREE.Vector3(...end);
    const distance = startVec.distanceTo(endVec);

    // Calculate the midpoint between start and end
    const midpoint = new THREE.Vector3(
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2,
      (start[2] + end[2]) / 2
    );

    // Calculate a much higher control point to ensure the entire curve stays above globe
    // Use a more aggressive height calculation
    const baseHeight = 2.25; // Well above globe radius of 2
    const distanceMultiplier = Math.max(0.3, distance * 0.25); // Minimum multiplier ensures height for short distances
    const controlHeight = baseHeight + distanceMultiplier;

    // Normalize the midpoint and scale it to the calculated height
    const controlPoint = midpoint.normalize().multiplyScalar(controlHeight);

    const curve = new THREE.QuadraticBezierCurve3(
      startVec,
      controlPoint,
      endVec
    );

    // Generate initial curve points
    const curvePoints = curve.getPoints(50);

    // Ensure every point along the curve is above the globe surface
    const safePoints = curvePoints.map((point) => {
      const distanceFromCenter = point.length();
      const minDistance = 2.05; // Slightly above globe surface

      if (distanceFromCenter < minDistance) {
        // If point is too close to center, push it outward
        return point.normalize().multiplyScalar(minDistance);
      }
      return point;
    });

    return safePoints;
  }, [start, end]);

  return (
    <Line
      points={points}
      color={color}
      transparent
      opacity={animated ? 0.6 : 0.3}
      lineWidth={1}
    />
  );
}

function Stars() {
  const starsRef = useRef<THREE.Points>(null);

  const starPositions = useMemo(() => {
    const positions = new Float32Array(2000 * 3); // 2000 stars, 3 coordinates each

    for (let i = 0; i < 2000; i++) {
      // Generate random positions in a sphere around the globe
      const radius = 15 + Math.random() * 35; // Stars between radius 15 and 50
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }

    return positions;
  }, []);

  useFrame((state) => {
    if (starsRef.current) {
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      starsRef.current.rotation.x = state.clock.elapsedTime * 0.02;
    }
  });

  return (
    <points ref={starsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={2000}
          array={starPositions}
          itemSize={3}
          args={[starPositions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.1}
        color="#ffffff"
        transparent
        opacity={0.8}
        sizeAttenuation={true}
      />
    </points>
  );
}

function Globe() {
  const globeRef = useRef<THREE.Mesh>(null);
  const texture = useMemo(() => {
    const loader = new THREE.TextureLoader();
    return loader.load("/earth.png");
  }, []);
  return (
    <Sphere ref={globeRef} args={[2, 64, 64]}>
      <meshPhongMaterial map={texture} />
    </Sphere>
  );
}

// Convert lat/lng to 3D sphere coordinates
function latLngToVector3(lat: number, lng: number, radius: number = 2): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

function Scene({ exchanges, cloudRegions, connections, onMarkerClick, showRegions }: Globe3DProps) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 0, 5);
  }, [camera]);

  const getProviderColor = (provider: string) => {
    switch (provider) {
      case "AWS": return "#FF9900";
      case "GCP": return "#4285F4";
      case "Azure": return "#0078D4";
      default: return "#ffffff";
    }
  };

  // Only show connections if we have both realtime enabled and connections
  const visibleConnections = connections.filter((connection) => connection.animated || !connection.animated);

  return (
    <>
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars />
      <Globe />

      {/* Exchange markers */}
      {exchanges.map((exchange) => {
        const position = latLngToVector3(
          exchange.location.lat,
          exchange.location.lng,
          2.05
        );
        return (
          <Marker
            key={exchange.id}
            position={position}
            color={getProviderColor(exchange.cloudProvider)}
            size={1.5}
            onClick={() => onMarkerClick(exchange.id, "exchange")}
          >
            <div>
              <div className="font-semibold">{exchange.name}</div>
              <div className="text-xs text-gray-300">
                {exchange.location.city}, {exchange.location.country}
              </div>
              <div className="text-xs text-blue-400">
                {exchange.cloudProvider} - {exchange.region}
              </div>
              <div className="text-xs text-green-400">
                {exchange.serverCount} servers
              </div>
            </div>
          </Marker>
        );
      })}

      {/* Cloud region markers */}
      {showRegions &&
        cloudRegions.map((region) => {
          const position = latLngToVector3(
            region.location.lat,
            region.location.lng,
            2.08
          );
          return (
            <Marker
              key={region.id}
              position={position}
              color={getProviderColor(region.provider)}
              size={1.8}
              onClick={() => onMarkerClick(region.id, "region")}
            >
              <div>
                <div className="font-semibold">{region.name}</div>
                <div className="text-xs text-gray-300">
                  {region.location.city}, {region.location.country}
                </div>
                <div className="text-xs text-blue-400">
                  {region.provider} - {region.code}
                </div>
                <div className="text-xs text-green-400">
                  {region.serverCount} servers
                </div>
              </div>
            </Marker>
          );
        })}

      {/* Connection lines */}
      {visibleConnections.map((connection) => {
        const startPos = latLngToVector3(
          connection.from.lat,
          connection.from.lng,
          2.05
        );
        const endPos = latLngToVector3(
          connection.to.lat,
          connection.to.lng,
          2.05
        );
        return (
          <ConnectionLine
            key={connection.id}
            start={startPos}
            end={endPos}
            color={getLatencyColor(connection.latency)}
            animated={connection.animated}
          />
        );
      })}

      <OrbitControls
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={3}
        maxDistance={10}
        autoRotate={false}
        autoRotateSpeed={0.5}
      />
    </>
  );
}

export default function Globe3D(props: Globe3DProps) {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
        <Scene {...props} />
      </Canvas>
    </div>
  );
}
