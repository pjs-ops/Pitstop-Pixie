export type RadioCategory = 
  | 'team_orders' 
  | 'tire_management' 
  | 'pit_stops' 
  | 'overtaking_drs' 
  | 'safety_car_flags' 
  | 'race_strategy';

export type RadioDifficulty = 'rookie' | 'intermediate' | 'paddock_pro';

export type RadioSpeakerRole = 
  | 'race_engineer' 
  | 'driver' 
  | 'team_principal' 
  | 'race_director';

export interface RadioOption {
  id: string;
  label: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface ScenarioChoice {
  id: string;
  label: string;
  action: string;
  consequence: string;
  isOptimal: boolean;
  tacticalTradeoff: string;
}

export interface BranchingScenario {
  id: string;
  title: string;
  situation: string;
  prompt: string;
  choices: ScenarioChoice[];
}

export interface RadioMessage {
  id: string;
  phrase: string;
  speakerRole: RadioSpeakerRole;
  speakerName: string;
  driverName?: string;
  teamName: string;
  teamColor?: string;
  circuitName: string;
  lapContext: string; // e.g. "Lap 24 of 57 • Under VSC"
  category: RadioCategory;
  difficulty: RadioDifficulty;
  audioDurationSeconds?: number;
  plainTranslation: string;
  technicalExplanation: string;
  whyItMatters: string;
  engineerTip: string;
  relatedTerms: string[]; // slugs of glossary terms
  question: {
    prompt: string;
    subtext?: string;
    options: RadioOption[];
  };
  followUpScenario: BranchingScenario;
  xpReward: number;
  relatedSection?: {
    tabId: string;
    label: string;
  };
}

export interface RadioGlossaryItem {
  id: string;
  term: string;
  phoneticOrAlias?: string;
  category: RadioCategory;
  shortDefinition: string;
  beginnerAnalogy: string;
  raceSignificance: string;
  exampleRadioSnippet: string;
  relatedRadioId?: string;
  relatedTab?: string;
}

export interface UserRadioRecord {
  messageId: string;
  completed: boolean;
  firstAttemptCorrect: boolean;
  selectedOptionId: string;
  selectedScenarioChoiceId?: string;
  completedAt: string;
  bookmarked: boolean;
  attemptsCount: number;
}

export interface RadioProgressState {
  records: Record<string, UserRadioRecord>;
  guidedChallengeCompleted: boolean;
  guidedChallengeScore: number;
  bookmarkedIds: string[];
}
