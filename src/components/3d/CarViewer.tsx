import React, { Suspense, useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Html } from '@react-three/drei';
import * as THREE from 'three';
import { F1CarModel } from './F1CarModel';
import { CAR_COMPONENTS } from '../../data/carComponents';
import { CarComponent } from '../../types';
import { RotateCw, Layers, Compass } from 'lucide-react';

interface CarViewerProps {
  theme?: 'studio-ivory' | 'studio-dark';
  explodeFactor: number;
  onExplodeChange: (factor: number) => void;
  selectedComponentId: string | null;
  hoveredComponentId: string | null;
  onSelectComponent: (id: string) => void;
  onHoverComponent: (id: string | null) => void;
  cameraPreset: string;
  onCameraPresetChange: (preset: string) => void;
  autoRotate: boolean;
  onToggleAutoRotate: () => void;
}

// Smooth camera controller that lerps smoothly to target presets with aspect-ratio awareness
const CameraController: React.FC<{
  preset: string;
  selectedComponentId: string | null;
  explodeFactor: number;
  autoRotate: boolean;
  theme?: 'studio-ivory' | 'studio-dark';
}> = ({ preset, selectedComponentId, explodeFactor, autoRotate }) => {
  const { size } = useThree();
  const controlsRef = useRef<any>(null);

  // Aspect-ratio aware distance scaling to prevent horizontal clipping on narrow screens
  const aspect = size.width / (size.height || 1);
  const distScale = aspect < 0.8 ? 1.35 : aspect < 1.0 ? 1.20 : aspect < 1.25 ? 1.08 : 1.0;

  // Initial camera position & lookAt target (shifted toward the car's center of mass at [0, 0.40, 0.25])
  const targetCamPos = useRef(new THREE.Vector3(5.7 * distScale, 2.35 * distScale, 4.6 * distScale));
  const targetLookAt = useRef(new THREE.Vector3(0, 0.40, 0.25));
  const isAnimating = useRef(true);
  const isUserInteracting = useRef(false);

  useEffect(() => {
    isAnimating.current = true;
    if (selectedComponentId && explodeFactor > 0.1) {
      const comp = CAR_COMPONENTS.find((c) => c.id === selectedComponentId);
      if (comp) {
        // Center view near exploded component
        const compPos = new THREE.Vector3(
          comp.anchorPoint[0] + comp.explodedOffset[0] * explodeFactor,
          comp.anchorPoint[1] + comp.explodedOffset[1] * explodeFactor,
          comp.anchorPoint[2] + comp.explodedOffset[2] * explodeFactor
        );
        targetLookAt.current.copy(compPos);
        targetCamPos.current.set(compPos.x + 2.6, compPos.y + 1.2, compPos.z + 2.6);
        return;
      }
    }

    switch (preset) {
      case 'front':
        targetCamPos.current.set(0, 1.2 * distScale, 5.6 * distScale);
        targetLookAt.current.set(0, 0.40, 0.5);
        break;
      case 'side':
        targetCamPos.current.set(6.6 * distScale, 1.2 * distScale, 0.05);
        targetLookAt.current.set(0, 0.42, 0.05);
        break;
      case 'rear':
        targetCamPos.current.set(0, 1.4 * distScale, -5.6 * distScale);
        targetLookAt.current.set(0, 0.45, -0.6);
        break;
      case 'top':
        targetCamPos.current.set(0, 7.8 * distScale, 0.05);
        targetLookAt.current.set(0, 0, 0.05);
        break;
      case 'cockpit':
        targetCamPos.current.set(0, 1.15, 0.95);
        targetLookAt.current.set(0, 0.48, 1.8);
        break;
      case 'iso':
      default:
        // Well-proportioned three-quarter view with front wing & nose fully in frame
        targetCamPos.current.set(5.7 * distScale, 2.35 * distScale, 4.6 * distScale);
        targetLookAt.current.set(0, 0.40, 0.25);
        break;
    }
  }, [preset, selectedComponentId, explodeFactor, distScale]);

  useFrame(() => {
    if (controlsRef.current && isAnimating.current && !isUserInteracting.current) {
      controlsRef.current.object.position.lerp(targetCamPos.current, 0.08);
      controlsRef.current.target.lerp(targetLookAt.current, 0.08);
      controlsRef.current.update();

      if (
        controlsRef.current.object.position.distanceTo(targetCamPos.current) < 0.02 &&
        controlsRef.current.target.distanceTo(targetLookAt.current) < 0.02
      ) {
        controlsRef.current.object.position.copy(targetCamPos.current);
        controlsRef.current.target.copy(targetLookAt.current);
        isAnimating.current = false;
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.06}
      minDistance={1.8}
      maxDistance={12.0}
      maxPolarAngle={Math.PI / 2 - 0.03}
      autoRotate={autoRotate}
      autoRotateSpeed={1.0}
      onStart={() => {
        isUserInteracting.current = true;
        isAnimating.current = false;
      }}
      onEnd={() => {
        isUserInteracting.current = false;
      }}
    />
  );
};

// Three.js Studio Scene Background and Fog Controller
const StudioEnvironment: React.FC<{ theme?: 'studio-ivory' | 'studio-dark' }> = ({ theme = 'studio-ivory' }) => {
  const { scene } = useThree();
  const isIvory = theme === 'studio-ivory';

  useEffect(() => {
    if (isIvory) {
      // Create high-res 2D canvas texture for the 3D scene background
      const canvas = document.createElement('canvas');
      canvas.width = 1024;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Subtle vertical studio gradient: #FFFDF9 -> #F7F0E8 -> #EFE5DC
        const grad = ctx.createLinearGradient(0, 0, 0, 1024);
        grad.addColorStop(0, '#FFFDF9');
        grad.addColorStop(0.45, '#F7F0E8');
        grad.addColorStop(1, '#EFE5DC');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 1024, 1024);

        // Soft pink / blush ambient radial accent (#F3C8D8)
        const radial = ctx.createRadialGradient(512, 380, 40, 512, 380, 560);
        radial.addColorStop(0, 'rgba(243, 200, 216, 0.38)');
        radial.addColorStop(0.5, 'rgba(247, 240, 232, 0.16)');
        radial.addColorStop(1, 'rgba(239, 229, 220, 0)');
        ctx.fillStyle = radial;
        ctx.fillRect(0, 0, 1024, 1024);

        const texture = new THREE.CanvasTexture(canvas);
        texture.colorSpace = THREE.SRGBColorSpace;
        scene.background = texture;
      }
      scene.fog = new THREE.Fog('#F7F0E8', 16, 36);
    } else {
      scene.background = new THREE.Color('#100D14');
      scene.fog = new THREE.Fog('#100D14', 14, 30);
    }

    return () => {
      scene.background = null;
      scene.fog = null;
    };
  }, [isIvory, scene]);

  return null;
};

// Stable, Compact 3D Leader Line and Callout Annotation Component
const ComponentAnnotation: React.FC<{
  component: CarComponent;
  explodeFactor: number;
  theme?: 'studio-ivory' | 'studio-dark';
}> = ({ component, explodeFactor, theme = 'studio-ivory' }) => {
  const isIvory = theme === 'studio-ivory';

  // Compute true 3D position of the part anchor in world coordinates
  const anchorX = component.anchorPoint[0] + component.explodedOffset[0] * explodeFactor;
  const anchorY = component.anchorPoint[1] + component.explodedOffset[1] * explodeFactor;
  const anchorZ = component.anchorPoint[2] + component.explodedOffset[2] * explodeFactor;

  // Placement direction: if part is on left side of car (X < -0.1), place callout to left
  const isLeft = anchorX < -0.1;
  const lineEndX = isLeft ? -45 : 45;
  const lineEndY = -30;

  return (
    <group position={[anchorX, anchorY, anchorZ]}>
      {/* 3D Physical Surface Target Beacon Dot */}
      <mesh>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="#D94355" />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.028, 0.042, 24]} />
        <meshBasicMaterial
          color={isIvory ? '#D94355' : '#F3C8D8'}
          side={THREE.DoubleSide}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Compact Anchored HTML Callout - Fixed pixel size (no distanceFactor scaling) */}
      <Html
        center
        zIndexRange={[100, 0]}
        style={{ pointerEvents: 'none' }}
      >
        <div className="relative select-none pointer-events-none" style={{ width: '1px', height: '1px' }}>
          {/* SVG Leader Line connecting (0, 0) to callout badge */}
          <svg
            className="absolute top-0 left-0 overflow-visible pointer-events-none"
            style={{ width: '1px', height: '1px' }}
          >
            {/* Origin Surface Dot */}
            <circle cx="0" cy="0" r="2.2" fill="#D94355" stroke="#FFFFFF" strokeWidth="1" />

            {/* Slanted Leader Line with Elbow */}
            <polyline
              points={`0,0 ${lineEndX * 0.65},${lineEndY} ${lineEndX},${lineEndY}`}
              fill="none"
              stroke={isIvory ? '#D94355' : '#F3C8D8'}
              strokeWidth="1.25"
              strokeDasharray="3 2"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeOpacity="0.85"
            />
            <circle cx={lineEndX} cy={lineEndY} r="1.8" fill="#D94355" />
          </svg>

          {/* Compact Callout Pill */}
          <div
            className={`absolute z-30 px-2.5 py-1.5 rounded-xl shadow-xl backdrop-blur-md flex items-center space-x-2 whitespace-nowrap min-w-0 max-w-[190px] transition-all ${
              isIvory
                ? 'bg-white/95 border border-racing/70 text-plum'
                : 'bg-[#16121B]/95 border border-[#F3C8D8]/75 text-white'
            } ${isLeft ? 'right-[50px]' : 'left-[50px]'}`}
            style={{
              top: `${lineEndY}px`,
              transform: 'translateY(-50%)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-racing shrink-0 animate-pulse" />
            <div className="min-w-0 flex-1">
              <div
                className={`text-[9px] font-bold uppercase tracking-wider truncate leading-none mb-0.5 ${
                  isIvory ? 'text-racing' : 'text-blush'
                }`}
              >
                {component.categoryLabel}
              </div>
              <div
                className={`text-xs font-bold font-display truncate max-w-[145px] leading-tight ${
                  isIvory ? 'text-plum' : 'text-white'
                }`}
                title={component.name}
              >
                {component.name}
              </div>
            </div>
          </div>
        </div>
      </Html>
    </group>
  );
};

const CarLoadingState: React.FC<{ theme?: 'studio-ivory' | 'studio-dark' }> = ({ theme = 'studio-ivory' }) => {
  const isIvory = theme === 'studio-ivory';
  return (
    <Html center>
      <div
        className={`flex flex-col items-center justify-center space-y-3 p-5 rounded-2xl shadow-2xl backdrop-blur-md text-center min-w-[220px] ${
          isIvory
            ? 'bg-white/95 border border-blush text-plum'
            : 'bg-plum-dark/95 border border-racing/60 text-white'
        }`}
      >
        <div className="relative w-8 h-8">
          <div className={`absolute inset-0 rounded-full border-2 ${isIvory ? 'border-blush/40' : 'border-blush/30'}`} />
          <div className="absolute inset-0 rounded-full border-2 border-racing border-t-transparent animate-spin" />
        </div>
        <div className={`text-xs font-bold font-display ${isIvory ? 'text-plum' : 'text-white'}`}>
          Streaming 3D Telemetry...
        </div>
        <div className={`text-[10px] ${isIvory ? 'text-plum/60' : 'text-cosmic-200/70'}`}>
          Loading 112K polygon F1-style model
        </div>
      </div>
    </Html>
  );
};

export const CarViewer: React.FC<CarViewerProps> = ({
  theme = 'studio-ivory',
  explodeFactor,
  onExplodeChange,
  selectedComponentId,
  hoveredComponentId,
  onSelectComponent,
  onHoverComponent,
  cameraPreset,
  onCameraPresetChange,
  autoRotate,
  onToggleAutoRotate,
}) => {
  const isIvory = theme === 'studio-ivory';
  const selectedComponent = CAR_COMPONENTS.find((c) => c.id === selectedComponentId);

  return (
    <div
      className={`relative w-full h-[580px] lg:h-[640px] rounded-3xl overflow-hidden select-none transition-colors duration-500 ${
        isIvory
          ? 'bg-gradient-to-b from-[#FFFDF9] via-[#F7F0E8] to-[#EFE5DC] border border-blush/70 shadow-pixie'
          : 'bg-gradient-to-b from-[#1C1722] via-[#16121B] to-[#100D14] border border-plum/40 shadow-2xl'
      }`}
    >
      {/* Editorial Soft Pink Studio Ambient Glow */}
      {isIvory && (
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_50%_35%,rgba(243,200,216,0.28)_0%,rgba(247,240,232,0)_70%)]" />
      )}

      {/* 3D Canvas */}
      <Canvas
        camera={{ position: [5.7, 2.35, 4.6], fov: 36 }}
        className="cursor-grab active:cursor-grabbing"
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <StudioEnvironment theme={theme} />

        {isIvory ? (
          /* =======================================================
             Soft Warm Ivory Automotive Studio Lighting
             Tuned for high-contrast dark navy car on warm ivory floor
             ======================================================= */
          <>
            <ambientLight intensity={1.3} color="#FFF8F2" />
            {/* Front-Left Soft Key Light */}
            <directionalLight position={[-6, 7, 7]} intensity={2.6} color="#FFFFFF" castShadow />
            {/* Front-Right Soft Fill Light */}
            <directionalLight position={[7, 5, 5]} intensity={1.5} color="#FFF1E8" />
            {/* Overhead Top Diffuser */}
            <directionalLight position={[0, 9, 0]} intensity={1.1} color="#FFFDF9" />
            {/* Rear-Top Silhouette Rim Light */}
            <directionalLight position={[0, 4, -7]} intensity={1.8} color="#F3C8D8" />
            {/* Subtle Ground Floor Bounce */}
            <directionalLight position={[0, -2, 2]} intensity={0.5} color="#EFE5DC" />
          </>
        ) : (
          /* =======================================================
             Deep Plum / Dark Studio Lighting (The Garage)
             ======================================================= */
          <>
            <ambientLight intensity={1.4} />
            <directionalLight position={[6, 8, 5]} intensity={2.4} castShadow color="#FFF8F0" />
            <directionalLight position={[-6, 4, -5]} intensity={1.2} color="#DCD5F7" />
            <directionalLight position={[0, -2, 4]} intensity={0.6} color="#F3C8D8" />
            <pointLight position={[0, 3, 0]} intensity={1.6} color="#ffffff" />
            <pointLight position={[0, 0.4, 2.2]} intensity={0.8} color="#D94355" />
          </>
        )}

        <Suspense fallback={<CarLoadingState theme={theme} />}>
          <F1CarModel
            explodeFactor={explodeFactor}
            selectedComponentId={selectedComponentId}
            hoveredComponentId={hoveredComponentId}
            onSelectComponent={onSelectComponent}
            onHoverComponent={onHoverComponent}
          />

          {/* Contact Shadows on Studio Floor */}
          <ContactShadows
            position={[0, 0.01, 0]}
            opacity={isIvory ? 0.65 : 0.85}
            scale={11.0}
            blur={2.2}
            far={3.6}
            color={isIvory ? '#382D35' : '#08070A'}
          />

          {/* Stable 3D Leader Line Annotation */}
          {selectedComponent && (
            <ComponentAnnotation
              component={selectedComponent}
              explodeFactor={explodeFactor}
              theme={theme}
            />
          )}

          <CameraController
            preset={cameraPreset}
            selectedComponentId={selectedComponentId}
            explodeFactor={explodeFactor}
            autoRotate={autoRotate}
            theme={theme}
          />
        </Suspense>
      </Canvas>

      {/* Top Toolbar: Coordinated Responsive Header Bar */}
      <div className="absolute top-0 inset-x-0 z-10 p-3 sm:p-4 pointer-events-none flex flex-wrap items-center justify-between gap-2.5 max-w-full">
        {/* Top-Left: Model Identifier & License Info Badge */}
        <div
          title="F1 Hybrid Prototype • 3D Model by Qvist_Designs (CC-BY-4.0)"
          className={`pointer-events-auto backdrop-blur-md px-3 sm:px-3.5 py-1.5 rounded-xl shadow-md flex items-center space-x-2 text-xs font-medium max-w-full sm:max-w-[270px] md:max-w-[310px] min-w-0 shrink transition-all ${
            isIvory
              ? 'bg-white/92 border border-blush/70 text-plum'
              : 'bg-plum-dark/92 border border-white/10 text-cosmic-100'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="font-bold font-display truncate shrink min-w-0">F1 Hybrid Prototype</span>
          <span className={`${isIvory ? 'text-plum/30' : 'text-white/30'} shrink-0`}>•</span>
          <span
            className={`truncate text-[11px] font-semibold shrink min-w-0 ${
              isIvory ? 'text-racing' : 'text-blush'
            }`}
          >
            (CC-BY-4.0 Qvist_Designs)
          </span>
        </div>

        {/* Top-Right: Camera Presets Selector */}
        <div
          className={`pointer-events-auto flex items-center space-x-1 backdrop-blur-md p-1 sm:p-1.5 rounded-2xl shadow-md max-w-full overflow-x-auto no-scrollbar shrink-0 transition-all ${
            isIvory
              ? 'bg-white/92 border border-blush/70'
              : 'bg-plum-dark/92 border border-white/10'
          }`}
        >
          {[
            { id: 'iso', label: '3D Iso' },
            { id: 'front', label: 'Front' },
            { id: 'side', label: 'Side' },
            { id: 'top', label: 'Top' },
            { id: 'rear', label: 'Rear' },
            { id: 'cockpit', label: 'Cockpit' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onCameraPresetChange(item.id)}
              className={`px-2.5 sm:px-3 py-1 sm:py-1.5 text-[11px] sm:text-xs font-semibold rounded-xl whitespace-nowrap transition-all ${
                cameraPreset === item.id
                  ? 'bg-racing text-white shadow-sm'
                  : isIvory
                  ? 'text-plum/70 hover:text-plum hover:bg-blush-light/60'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Area: Coordinated Floating Controls & Dedicated Footer Strip */}
      <div className="absolute bottom-0 inset-x-0 z-10 p-3 sm:p-4 pointer-events-none flex flex-col items-center gap-2">
        {/* Primary Controls Panel: Orbit & Continuous Explode */}
        <div
          className={`pointer-events-auto max-w-full flex flex-wrap items-center justify-center gap-2 sm:gap-3 backdrop-blur-md px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-2xl shadow-lg transition-all ${
            isIvory
              ? 'bg-white/95 border border-blush/70 text-plum shadow-pixie'
              : 'bg-plum-dark/95 border border-white/10 text-white shadow-2xl'
          }`}
        >
          {/* Orbit Auto-Rotate Toggle */}
          <button
            onClick={onToggleAutoRotate}
            title="Toggle Auto Rotation"
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              autoRotate
                ? 'bg-blush text-plum shadow-sm'
                : isIvory
                ? 'text-plum/75 hover:bg-cosmic-100'
                : 'text-white/80 hover:bg-white/10'
            }`}
          >
            <RotateCw className={`w-3.5 h-3.5 ${autoRotate ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Orbit</span>
          </button>

          <div className={`hidden sm:block w-px h-5 ${isIvory ? 'bg-plum/15' : 'bg-white/15'}`} />

          {/* Continuous Explode Slider (0% to 100%) */}
          <div className="flex items-center space-x-2.5 sm:space-x-3">
            <div
              className={`flex items-center space-x-1.5 text-xs font-semibold ${
                isIvory ? 'text-plum' : 'text-white/90'
              }`}
            >
              <Layers className={`w-3.5 h-3.5 ${isIvory ? 'text-racing' : 'text-blush'}`} />
              <span className="whitespace-nowrap">Explode:</span>
            </div>

            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explodeFactor}
              onChange={(e) => onExplodeChange(parseFloat(e.target.value))}
              className={`w-24 sm:w-40 accent-racing h-1.5 rounded-lg cursor-pointer ${
                isIvory ? 'bg-cosmic-200' : 'bg-white/20'
              }`}
            />

            <span
              className={`text-xs font-mono font-bold w-9 text-right ${
                isIvory ? 'text-racing' : 'text-blush'
              }`}
            >
              {Math.round(explodeFactor * 100)}%
            </span>
          </div>

          <div className={`hidden sm:block w-px h-5 ${isIvory ? 'bg-plum/15' : 'bg-white/15'}`} />

          {/* Quick Explode / Reassemble Toggle */}
          <button
            onClick={() => onExplodeChange(explodeFactor > 0.05 ? 0 : 0.85)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all border ${
              isIvory
                ? 'bg-cosmic-100 hover:bg-blush-light text-plum border-blush/50'
                : 'bg-white/10 hover:bg-white/20 text-white border-white/10'
            }`}
          >
            {explodeFactor > 0.05 ? 'Reassemble Car' : 'Quick Explode'}
          </button>
        </div>

        {/* Dedicated Non-Overlapping Footer Strip: Interaction Instructions */}
        <div
          className={`pointer-events-none flex items-center justify-center space-x-2 text-[11px] sm:text-xs font-medium px-4 py-1.5 rounded-full backdrop-blur-md shadow-xs border transition-all ${
            isIvory
              ? 'bg-white/85 border-blush/60 text-plum/70 shadow-sm'
              : 'bg-plum-dark/85 border-white/10 text-white/70 shadow-md'
          }`}
        >
          <Compass className="w-3.5 h-3.5 text-racing shrink-0" />
          <span className="tracking-wide">
            Click parts to inspect <span className="text-blush-dark/60">•</span> Drag to rotate <span className="text-blush-dark/60">•</span> Scroll to zoom
          </span>
        </div>
      </div>
    </div>
  );
};
