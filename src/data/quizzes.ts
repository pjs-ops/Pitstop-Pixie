import { QuizQuestion } from '../types';

export const COMPONENT_QUIZZES: QuizQuestion[] = [
  {
    id: 'q_comp_1',
    type: 'component',
    question: 'Which component is responsible for generating up to 60% of an F1 car\'s downforce using ground effect suction?',
    subtitle: 'Inspect the underside of the car in the 3D Garage',
    options: ['Rear Wing DRS Flap', 'Venturi Floor Tunnels', 'Front Wing Endplates', 'Halo Safety Ring'],
    correctIndex: 1,
    explanation: 'The sculptured carbon-fiber floor with Venturi tunnels squeezes airflow underneath the car, creating a powerful low-pressure ground effect vacuum that accounts for over 50-60% of total grip.',
    relatedComponentId: 'floor',
  },
  {
    id: 'q_comp_2',
    type: 'component',
    question: 'How much static weight can the Grade 5 titanium Halo safety ring support above the cockpit?',
    subtitle: 'Safety engineering',
    options: ['1,000 kg (1 car)', '12,000 kg (equivalent to 2 African elephants)', '500 kg', '3,000 kg'],
    correctIndex: 1,
    explanation: 'Weighing only 7 kg itself, the Grade 5 titanium Halo structure can withstand a crushing load of 125 kN (~12 tonnes or 12,000 kg), shielding the driver from massive impacts.',
    relatedComponentId: 'halo',
  },
  {
    id: 'q_comp_3',
    type: 'component',
    question: 'What is the role of the MGU-K (Kinetic Motor Generator Unit) in the hybrid power unit?',
    subtitle: 'Hybrid Powertrain',
    options: [
      'Pumps coolant into the sidepod radiators',
      'Harvests kinetic energy under braking and deploys 160 hp electric boost to the crankshaft',
      'Rotates the steering wheel automatically during safety car periods',
      'Pressurizes the fuel tank at 500 bar'
    ],
    correctIndex: 1,
    explanation: 'The MGU-K acts as a generator under braking (recovering up to 2 MJ/lap into the battery) and as an electric motor deploying 120 kW (160 horsepower) under acceleration.',
    relatedComponentId: 'energy_mgu_k',
  },
  {
    id: 'q_comp_4',
    type: 'component',
    question: 'Why do carbon-ceramic F1 brakes need to reach temperatures above 400°C to work effectively?',
    subtitle: 'Braking dynamics',
    options: [
      'Because cold carbon-carbon composite material provides very little friction coefficient',
      'To heat up the fuel lines',
      'To melt rubber marbles stuck to the rim',
      'To prevent the hydraulic fluid from freezing'
    ],
    correctIndex: 0,
    explanation: 'Carbon-carbon composite discs provide minimal braking friction when cold. Their peak operating window is 400°C to 1,000°C (glowing cherry red), which is why drivers weave to keep heat in the discs.',
    relatedComponentId: 'brakes',
  },
  {
    id: 'q_comp_5',
    type: 'component',
    question: 'When the DRS (Drag Reduction System) flap opens on the rear wing, what is the maximum allowed opening gap?',
    subtitle: 'Aerodynamic rules',
    options: ['85 millimeters', '150 millimeters', '30 millimeters', '200 millimeters'],
    correctIndex: 0,
    explanation: 'FIA technical regulations strictly cap the DRS flap opening slot at 85 mm. This sheds drag and provides a ~15-25 km/h top-speed gain on straightaways.',
    relatedComponentId: 'rear_wing',
  },
];

export const FLAG_QUIZZES: QuizQuestion[] = [
  {
    id: 'q_flag_1',
    type: 'flag',
    question: 'What must a driver do when seeing a DOUBLE waved yellow flag?',
    subtitle: 'Marshaling signals',
    options: [
      'Maintain racing speed and be cautious',
      'Reduce speed significantly, abandon lap/overtaking, and prepare to change direction or stop',
      'Accelerate out of danger zone',
      'Enter the pits immediately'
    ],
    correctIndex: 1,
    explanation: 'A double waved yellow flag indicates the track is wholly or partially blocked or marshals are on circuit. Drivers must drastically reduce speed, may not overtake, and must be prepared to stop.',
  },
  {
    id: 'q_flag_2',
    type: 'flag',
    question: 'What does a diagonally split Black and White flag shown with a driver\'s number mean?',
    subtitle: 'Sporting conduct',
    options: [
      'Race has ended',
      'The car has a mechanical failure and must retire',
      'Official warning for unsportsmanlike conduct or repeated track limit violations',
      'Fastest lap has been achieved'
    ],
    correctIndex: 2,
    explanation: 'The black and white diagonal flag is motorsport\'s yellow card. It serves as a stern final warning for aggressive driving or track limit infractions before a time penalty is assessed.',
  },
  {
    id: 'q_flag_3',
    type: 'flag',
    question: 'During a Virtual Safety Car (VSC), how do drivers know what speed to maintain?',
    subtitle: 'Digital safety control',
    options: [
      'They must follow a physical medical car',
      'They must stay positive relative to a designated minimum delta lap time on their dashboard',
      'They are speed capped strictly at 50 km/h everywhere',
      'They must brake every 5 seconds'
    ],
    correctIndex: 1,
    explanation: 'Under VSC, the steering wheel display shows a target delta time. Drivers must keep their delta positive (slower than the reference safety pace) in every micro-sector of the circuit.',
  },
];

export const STRATEGY_QUIZZES: QuizQuestion[] = [
  {
    id: 'q_strat_1',
    type: 'strategy',
    question: 'What is an "Undercut" in Formula 1 race strategy?',
    subtitle: 'Pit wall tactics',
    options: [
      'Passing a car on the grass at turn 1',
      'Pitting 1 or 2 laps earlier than your rival to exploit fresh tire grip on your out-lap and jump them',
      'Running lighter aerodynamic downforce to pass on straights',
      'Lowering the front wing angle during a pit stop'
    ],
    correctIndex: 1,
    explanation: 'An undercut means pitting before the car ahead. Your new tires offer 1.5 to 2.5 seconds per lap more grip than their worn tires, so when they pit a lap later, you fly past them as they exit the pit lane.',
  },
  {
    id: 'q_strat_2',
    type: 'strategy',
    question: 'Under which conditions is an "Overcut" usually more effective than an undercut?',
    subtitle: 'Track temperature & tire warmup',
    options: [
      'When new tires are very cold and take multiple laps to warm up (or the leader has clean air to push)',
      'When it is completely dry with high degradation',
      'Whenever DRS is disabled',
      'At high altitude circuits only'
    ],
    correctIndex: 0,
    explanation: 'An overcut works when new tires suffer from slow warmup (out-lap warmup struggle) or high graining, allowing the car that stays out on warm rubber in clean air to build a decisive gap.',
  },
  {
    id: 'q_strat_3',
    type: 'strategy',
    question: 'Why do teams often make a "free pit stop" when a Safety Car is deployed?',
    subtitle: 'Pit loss time arithmetic',
    options: [
      'Tires are free of charge from Pirelli during safety cars',
      'Because cars on track drive ~40% slower, reducing relative pit loss time from ~22s down to ~12s',
      'The pit lane speed limit is raised to 150 km/h',
      'Mechanics work twice as fast'
    ],
    correctIndex: 1,
    explanation: 'At normal racing speed, pitting costs ~20-25 seconds of track distance. Under the Safety Car, cars on track circulate ~40% slower, cutting the net time loss to ~10-12 seconds—meaning you lose far fewer track positions.',
  },
];

export const DAILY_CHALLENGES: QuizQuestion[] = [
  {
    id: 'daily_today',
    type: 'general',
    question: 'Why do F1 cars produce dramatic showers of bright orange sparks along high-speed straights?',
    subtitle: 'Today\'s Daily Rookie Challenge',
    options: [
      'Electrical short circuits in the battery',
      'Titanium skid blocks embedded in the wooden underfloor plank rubbing the asphalt at 300 km/h under aerodynamic downforce load',
      'Burning magnesium from the wheels',
      'Exhaust afterburners igniting unburned fuel'
    ],
    correctIndex: 1,
    explanation: 'At high speeds, aerodynamic downforce presses the car down by thousands of kilograms. Four titanium skid blocks embedded in the underfloor plank contact the tarmac, shaving off harmless, glorious titanium sparks!',
  },
];
