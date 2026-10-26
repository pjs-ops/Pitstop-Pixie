import React, { useRef, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

interface F1CarModelProps {
  explodeFactor: number; // 0.0 (assembled) to 1.0 (fully exploded)
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  onSelectComponent: (id: string) => void;
  onHoverComponent: (id: string | null) => void;
}

// Map GLB node names to PITSTOP PIXIE component IDs
const NODE_TO_COMPONENT_MAP: Record<string, string> = {
  'front-wing': 'front_wing',
  'rear-wing': 'rear_wing',
  'floor': 'floor',
  'chassis': 'monocoque',
  'halo': 'halo',
  'front-suspension': 'suspension_front',
  'rear-suspension': 'suspension_front',
  'front-left-wheel': 'tires_front',
  'front-right-wheel': 'tires_front',
  'rear-left-wheel': 'tires_rear',
  'rear-right-wheel': 'tires_rear',
  'left-sidepod': 'monocoque',
  'right-sidepod': 'monocoque',
  'engine-cover': 'engine_ice',
  'mirrors': 'monocoque',
  'exhaust': 'gearbox',
};

// Explode offsets in the model's native local space (length = X, height = Y, width = Z)
const PART_EXPLODE_VECTORS: Record<string, [number, number, number]> = {
  'front-wing': [-1.4, 0, 0],
  'rear-wing': [1.5, 0.45, 0],
  'floor': [0, -0.9, 0],
  'chassis': [0, 0.2, 0],
  'halo': [0, 1.4, 0],
  'engine-cover': [0.35, 1.25, 0],
  'left-sidepod': [0, 0.25, 0.95],
  'right-sidepod': [0, 0.25, -0.95],
  'front-suspension': [-0.5, 0.2, 0],
  'rear-suspension': [0.5, 0.2, 0],
  'front-left-wheel': [0, 0, 1.15],
  'front-right-wheel': [0, 0, -1.15],
  'rear-left-wheel': [0, 0, 1.15],
  'rear-right-wheel': [0, 0, -1.15],
  'mirrors': [0, 1.5, 0],
  'exhaust': [0.65, -0.2, 0],
};

export const F1CarModel: React.FC<F1CarModelProps> = ({
  explodeFactor,
  selectedComponentId,
  hoveredComponentId,
  onSelectComponent,
  onHoverComponent,
}) => {
  const carGroupRef = useRef<THREE.Group>(null);
  const gltf = useGLTF('/models/f1-2026.glb') as any;

  // Clone scene and create dedicated material instances per mesh to isolate state
  const { clonedMeshes, baseTransforms } = useMemo(() => {
    const meshes: THREE.Mesh[] = [];
    const baseMap = new Map<string, THREE.Vector3>();

    if (gltf && gltf.scene) {
      gltf.scene.children.forEach((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = (child as THREE.Mesh).clone(true);
          mesh.castShadow = true;
          mesh.receiveShadow = true;

          // Store resting base position
          baseMap.set(mesh.name, mesh.position.clone());

          // Build realistic PBR materials inspired by modern Red Bull-style racing aesthetics
          // Palette: Matte midnight carbon navy, raw satin carbon, titanium, dark forged alloy, racing red
          let matColor = '#0d1527'; // Matte midnight navy for bodywork
          let roughness = 0.32;
          let metalness = 0.22;

          if (mesh.name === 'front-wing' || mesh.name === 'rear-wing' || mesh.name === 'floor') {
            // Raw carbon fiber weave for aero surfaces
            matColor = '#161a1f';
            roughness = 0.38;
            metalness = 0.16;
          } else if (mesh.name === 'halo') {
            // Satin titanium charcoal sheen
            matColor = '#2b313b';
            roughness = 0.24;
            metalness = 0.85;
          } else if (mesh.name.includes('suspension')) {
            // Aerodynamic carbon-titanium wishbones
            matColor = '#20242a';
            roughness = 0.28;
            metalness = 0.72;
          } else if (mesh.name.includes('wheel')) {
            // 18-inch Pirelli slick rubber & forged alloy rim
            matColor = '#18191c';
            roughness = 0.82;
            metalness = 0.1;
          } else if (mesh.name === 'exhaust') {
            // Inconel titanium heat-treated tailpipe
            matColor = '#8b939c';
            roughness = 0.22;
            metalness = 0.92;
          }

          mesh.material = new THREE.MeshStandardMaterial({
            color: new THREE.Color(matColor),
            roughness,
            metalness,
            emissive: new THREE.Color('#000000'),
            emissiveIntensity: 0,
          });

          meshes.push(mesh);
        }
      });
    }

    return { clonedMeshes: meshes, baseTransforms: baseMap };
  }, [gltf]);

  // Update exploded positions and material highlights reversibly without drift
  useEffect(() => {
    clonedMeshes.forEach((mesh) => {
      const basePos = baseTransforms.get(mesh.name);
      if (basePos) {
        const offset = PART_EXPLODE_VECTORS[mesh.name] || [0, 0, 0];
        mesh.position.set(
          basePos.x + offset[0] * explodeFactor,
          basePos.y + offset[1] * explodeFactor,
          basePos.z + offset[2] * explodeFactor
        );
      }

      // Check selection and hover state for this mesh
      const compId = NODE_TO_COMPONENT_MAP[mesh.name];
      const isSelected = compId === selectedComponentId;
      const isHovered = compId === hoveredComponentId;

      const mat = mesh.material as THREE.MeshStandardMaterial;
      if (mat) {
        if (isSelected) {
          mat.emissive.set('#d94355');
          mat.emissiveIntensity = 0.65;
        } else if (isHovered) {
          mat.emissive.set('#e11d48');
          mat.emissiveIntensity = 0.35;
        } else {
          mat.emissive.set('#000000');
          mat.emissiveIntensity = 0;
        }
      }
    });
  }, [clonedMeshes, baseTransforms, explodeFactor, selectedComponentId, hoveredComponentId]);

  // Subtle breathing animation when stationary and fully assembled
  useFrame((state) => {
    if (carGroupRef.current && explodeFactor === 0) {
      carGroupRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.6) * 0.006;
    }
  });

  return (
    // Rotate 90 deg around Y so length aligns with Z (Front at +Z, Rear at -Z) and center at [0, 0, -0.25]
    <group
      ref={carGroupRef}
      rotation={[0, Math.PI / 2, 0]}
      position={[0, 0, -0.25]}
    >
      {/* 1. Photorealistic GLB Meshes */}
      {clonedMeshes.map((mesh) => {
        const compId = NODE_TO_COMPONENT_MAP[mesh.name] || 'monocoque';
        return (
          <primitive
            key={mesh.name}
            object={mesh}
            onClick={(e: any) => {
              e.stopPropagation();
              onSelectComponent(compId);
            }}
            onPointerOver={(e: any) => {
              e.stopPropagation();
              onHoverComponent(compId);
            }}
            onPointerOut={(e: any) => {
              e.stopPropagation();
              onHoverComponent(null);
            }}
          />
        );
      })}

      {/* 2. Internal Powertrain - Revealed during exploded view */}
      <group
        position={[
          0.65,
          0.42 + explodeFactor * 0.5,
          0
        ]}
      >
        {/* 1.6L V6 Engine Block */}
        <mesh
          position={[0, 0, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectComponent('engine_ice');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHoverComponent('engine_ice');
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onHoverComponent(null);
          }}
        >
          <boxGeometry args={[0.55, 0.32, 0.42]} />
          <meshStandardMaterial
            color="#2d3238"
            metalness={0.88}
            roughness={0.25}
            emissive={
              selectedComponentId === 'engine_ice'
                ? '#d94355'
                : hoveredComponentId === 'engine_ice'
                ? '#e11d48'
                : '#000000'
            }
            emissiveIntensity={selectedComponentId === 'engine_ice' ? 0.65 : hoveredComponentId === 'engine_ice' ? 0.35 : 0}
          />
        </mesh>

        {/* Turbocharger with Snail Housing */}
        <mesh
          position={[0.38, 0.15, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectComponent('turbocharger');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHoverComponent('turbocharger');
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onHoverComponent(null);
          }}
        >
          <torusGeometry args={[0.11, 0.045, 16, 24]} />
          <meshStandardMaterial
            color="#a8b0b8"
            metalness={0.92}
            roughness={0.2}
            emissive={
              selectedComponentId === 'turbocharger'
                ? '#d94355'
                : hoveredComponentId === 'turbocharger'
                ? '#e11d48'
                : '#000000'
            }
            emissiveIntensity={selectedComponentId === 'turbocharger' ? 0.65 : hoveredComponentId === 'turbocharger' ? 0.35 : 0}
          />
        </mesh>

        {/* MGU-K Electric Motor with Orange High-Voltage Conduits */}
        <mesh
          position={[-0.22, -0.08, 0.18]}
          rotation={[0, 0, Math.PI / 2]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectComponent('energy_mgu_k');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHoverComponent('energy_mgu_k');
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onHoverComponent(null);
          }}
        >
          <cylinderGeometry args={[0.07, 0.07, 0.28, 16]} />
          <meshStandardMaterial
            color="#ea580c"
            metalness={0.6}
            roughness={0.35}
            emissive={
              selectedComponentId === 'energy_mgu_k'
                ? '#d94355'
                : hoveredComponentId === 'energy_mgu_k'
                ? '#e11d48'
                : '#ea580c'
            }
            emissiveIntensity={selectedComponentId === 'energy_mgu_k' ? 0.65 : hoveredComponentId === 'energy_mgu_k' ? 0.35 : 0.15}
          />
        </mesh>

        {/* Energy Store (Lithium-Ion Battery) */}
        <mesh
          position={[-0.65, -0.16, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectComponent('energy_store');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHoverComponent('energy_store');
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onHoverComponent(null);
          }}
        >
          <boxGeometry args={[0.35, 0.12, 0.38]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.5}
            roughness={0.4}
            emissive={
              selectedComponentId === 'energy_store'
                ? '#d94355'
                : hoveredComponentId === 'energy_store'
                ? '#e11d48'
                : '#000000'
            }
            emissiveIntensity={selectedComponentId === 'energy_store' ? 0.65 : hoveredComponentId === 'energy_store' ? 0.35 : 0}
          />
        </mesh>

        {/* 8-Speed Seamless Carbon Gearbox */}
        <mesh
          position={[0.72, -0.04, 0]}
          onClick={(e) => {
            e.stopPropagation();
            onSelectComponent('gearbox');
          }}
          onPointerOver={(e) => {
            e.stopPropagation();
            onHoverComponent('gearbox');
          }}
          onPointerOut={(e) => {
            e.stopPropagation();
            onHoverComponent(null);
          }}
        >
          <boxGeometry args={[0.38, 0.25, 0.28]} />
          <meshStandardMaterial
            color="#1e242b"
            metalness={0.7}
            roughness={0.3}
            emissive={
              selectedComponentId === 'gearbox'
                ? '#d94355'
                : hoveredComponentId === 'gearbox'
                ? '#e11d48'
                : '#000000'
            }
            emissiveIntensity={selectedComponentId === 'gearbox' ? 0.65 : hoveredComponentId === 'gearbox' ? 0.35 : 0}
          />
        </mesh>
      </group>
    </group>
  );
};

// Preload the GLB model for instantaneous rendering
useGLTF.preload('/models/f1-2026.glb');
