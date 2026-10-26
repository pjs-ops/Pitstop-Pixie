export type ComponentCategory = 
  | 'aerodynamics' 
  | 'chassis' 
  | 'suspension' 
  | 'tires' 
  | 'powertrain';

export interface CarComponent {
  id: string;
  name: string;
  category: ComponentCategory;
  categoryLabel: string;
  meshId: string;
  explodedOffset: [number, number, number]; // [x, y, z] target offset when fully exploded
  anchorPoint: [number, number, number]; // [x, y, z] local coordinate anchor for leader line & callout
  description: string;
  primaryFunction: string;
  engineeringSignificance: string;
  performanceImplications: string;
  analogy: string;
  keyStats: { label: string; value: string }[];
  relatedComponentIds: string[];
  cameraPreset?: {
    position: [number, number, number];
    target: [number, number, number];
  };
}

export interface Driver {
  id: string;
  name: string;
  code: string;
  number: number;
  country: string;
  flag: string;
  teamId: string;
  teamName: string;
  teamColor: string;
  avatarUrl: string;
  season: string;
  biography: string;
  drivingStyle: string;
  worldChampionships: number;
  raceWins: number;
  podiums: number;
  polePositions: number;
  careerTimeline: { year: string; event: string }[];
  interestingFacts: string[];
  stats: {
    aggression: number; // 0-100
    tireManagement: number;
    wetWeather: number;
    qualifyingPace: number;
    racecraft: number;
  };
}

export interface Team {
  id: string;
  name: string;
  fullName: string;
  base: string;
  teamPrincipal: string;
  powerUnit: string;
  primaryColor: string;
  secondaryColor: string;
  firstEntry: number;
  worldChampionships: number;
  biography: string;
  drivers: string[]; // driver IDs
  keyInnovations: string[];
  liveryDescription: string;
}

export interface Hotspot {
  id: string;
  name: string;
  cornerNumber?: number;
  x: number; // percentage in SVG viewBox
  y: number;
  type: 'corner' | 'drs' | 'braking' | 'overtake';
  description: string;
  racingSignificance: string;
  gearSpeed: string;
}

export interface Circuit {
  id: string;
  name: string;
  location: string;
  country: string;
  flag: string;
  lengthKm: number;
  laps: number;
  lapRecord: { time: string; driver: string; year: string };
  corners: number;
  drsZones: number;
  svgPath: string; // SVG path data for track rendering
  svgViewBox: string;
  trackDirection: 'Clockwise' | 'Counter-Clockwise';
  hotspots: Hotspot[];
  downforceDemand: 'Very High' | 'High' | 'Medium' | 'Low';
  tireDegradation: 'Very High' | 'High' | 'Medium' | 'Low';
  overtakingDifficulty: 'Very Hard' | 'Hard' | 'Medium' | 'Easy';
  beginnerOverview: string;
  memorableMoment: string;
}

export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  estimatedMinutes: number;
  icon: string;
  category: 'basics' | 'rules' | 'strategy' | 'technical';
  overview: string;
  keyPoints: {
    title: string;
    explanation: string;
    analogy?: string;
    visualType?: 'flags' | 'tires' | 'qualifying' | 'pitstop' | 'points' | 'penalties';
  }[];
  terminology: { term: string; definition: string }[];
  knowledgeCheck: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  xpReward: number;
}

export interface QuizQuestion {
  id: string;
  type: 'component' | 'flag' | 'strategy' | 'general';
  question: string;
  subtitle?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  relatedComponentId?: string;
  imageHint?: string;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  xpRequired?: number;
  conditionDescription: string;
  category: 'engineering' | 'racing' | 'knowledge' | 'mastery';
}

export interface UserProgress {
  xp: number;
  level: 'Rookie' | 'Reserve Driver' | 'Race Winner' | 'World Champion';
  completedLessonIds: string[];
  completedQuizIds: string[];
  earnedBadgeIds: string[];
  favoriteDriverIds: string[];
  favoriteTeamIds: string[];
  streakDays: number;
  lastActiveDate: string;
  inspectedComponentIds: string[];
}
