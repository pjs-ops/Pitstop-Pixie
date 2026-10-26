# PITSTOP PIXIE 🏎️✨
> **“A little magic, a lot of motorsport.”**

The complete, frontend-first Formula 1 learning platform engineered for motorsport newcomers. Built with React, TypeScript, Three.js, React Three Fiber, Drei, Tailwind CSS, Recharts, and Framer Motion.

---

## 🌟 Visual Identity & Design Tokens

- **Cosmic Latte**: `#F7F0E8` (warm cream background)
- **Blush Pink**: `#F3C8D8`
- **Lavender**: `#DCD5F7`
- **Racing Red**: `#D94355`
- **Plum Ink**: `#332C39`
- **Sage**: `#D5E5D5`
- **Studio Graphite**: `#18131E` (deep plum inside 3D viewer)

---

## 🏎️ Core Feature Universe

### 1. Rookie HQ (Homepage)
- Hero section with interactive 3D F1 car, orbit controls, and camera presets
- Concept of the Day spotlight
- Continue-Learning quick-jump card
- Curated 6-portal discovery matrix
- Trophy & badge showcase

### 2. The Garage (Signature 3D Engineering Experience)
- Real-time 3D Formula 1 hybrid car with 16 individually separable components:
  1. Front Wing & Flap Cascades
  2. Rear Wing & DRS Actuator
  3. Ground Effect Venturi Floor Tunnels
  4. Rear Diffuser & Strakes
  5. Carbon Monocoque & Survival Cell
  6. Titanium Halo Safety Ring
  7. Front Wishbone & Pushrod Suspension
  8. Custom F1 Digital Steering Wheel
  9. Front 18-Inch Pirelli Wheels & Slick Tires
  10. Rear 18-Inch Wide Wheels & Slick Tires
  11. Carbon-Ceramic Brakes & 1000-Hole Discs
  12. 1.6L V6 Turbocharged Combustion Engine (ICE)
  13. Turbocharger & Wastegate Turbine
  14. MGU-K (Kinetic Motor Generator Unit)
  15. Energy Store (Lithium-Ion Battery Pack)
  16. 8-Speed Seamless Carbon Gearbox
- **Modes**: Explore Freely, Guided Car Tour, Exploded View, Reassembly Sequence, Component Quiz
- **Explosion Interaction**: Continuous 0–100% slider animating major components outward along physical vectors
- **Camera Presets**: Isometric, Front, Side, Rear, Top, and Cockpit
- **Rookie Analogies**: Beginner-friendly explanations for every complex mechanical concept

### 3. The Paddock (Driver & Team Discovery)
- Official 2024 / 2025 driver profiles with driving styles, career timelines, and stat radars
- Constructor profiles with liveries, engine specs, and historic innovations
- **Driver Duel**: Interactive side-by-side comparator between any 2 drivers
- **Epic Rivalries**: Senna vs Prost, Hamilton vs Verstappen, Hunt vs Lauda
- **Rookie Glossary**: Radio chatter, aerodynamics jargon, and race terminology

### 4. Circuit Safari (Interactive Track Visualizer)
- Monaco, Silverstone, Monza, Spa-Francorchamps, Suzuka, and COTA
- Real-time animated miniature car traversing track splines
- Numbered corner markers, DRS zones, and heavy braking hotspots
- Hotspot tactical breakdowns with gear and cornering speed
- **Track Comparator**: Compare downforce demand, lap lengths, and overtaking difficulty

### 5. Race Day 101 (Visual Beginner Curriculum)
- 6 comprehensive interactive visual lessons:
  1. The Weekend Format & Qualifying Shootout
  2. The Secret Code of Flags & Safety Cars
  3. The Art of Tire Compounds & Strategy
  4. The 2.0-Second Pit Stop Anatomy
  5. Penalties, Stewarding & Track Limits
  6. Points, Podiums & World Championships
- Interactive simulators: Flag simulator, tire compound inspector, pit stop breakdown
- Mini knowledge checks rewarding XP upon completion

### 6. Pit School (Gamification & Progress)
- Multi-category quizzes: Car Parts, Flag Master, Strategy Scenarios, Daily Challenge
- Rank ladder: **Rookie → Reserve Driver → Race Winner → World Champion**
- Daily streak tracking
- Trophy cabinet of persistent badges
- Reset progress option with confirmation

### 7. Strategy Room (Telemetry & Race Simulations)
- **Tire Degradation Simulator**: Soft vs Medium vs Hard lap delta over 35 laps with track temp and abrasion controls
- **Undercut Calculator**: Input gap to leader and out-lap push delta to predict pit stop overtakes
- **1-Stop vs 2-Stop Calculator**: Compare race times with adjustable pit loss time
- **Weather Crossover**: Rainfall intensity slider to predict when slicks become unviable

### 8. Global Search & Shell
- Press `/` or `Ctrl+K` to search across all components, circuits, drivers, teams, and terms
- Responsive navigation with live XP and level pill
- LocalStorage persistence with duplicate award prevention

---

## 🛠️ Installation & Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build

# Preview production build
npm run preview
```

---

## 📐 Asset Licensing & 3D Model Architecture

- All 3D components in `src/components/3d/F1CarModel.tsx` are procedurally generated using clean Three.js geometries and mathematically proportioned dimensions.
- The component registry in `src/data/carComponents.ts` maps directly to mesh group IDs, enabling seamless replacement with external GLB/GLTF assets in the future.
- All SVG track layouts are mathematically plotted and normalized to `600x450` coordinate space.
"# Pitstop-Pixie" 
"# Pitstop-Pixie" 
