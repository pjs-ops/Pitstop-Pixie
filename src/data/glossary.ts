export interface GlossaryTerm {
  term: string;
  category: 'aerodynamics' | 'racecraft' | 'rules' | 'strategy' | 'slang';
  simpleDefinition: string;
  deepExplanation: string;
  exampleQuote?: string;
}

export const GLOSSARY: GlossaryTerm[] = [
  {
    term: 'Apex',
    category: 'racecraft',
    simpleDefinition: 'The geometric or geometric-tactical midpoint of a corner that drivers aim for.',
    deepExplanation: 'Hitting the apex allows the car to maintain the widest possible geometric radius through the turn, carrying maximum speed and unwinding steering lock early for explosive acceleration.',
    exampleQuote: '"Miss the apex by two inches, and you lose two tenths on the entire exit straight."',
  },
  {
    term: 'Dirty Air',
    category: 'aerodynamics',
    simpleDefinition: 'Turbulent, disrupted airflow left behind a racing car.',
    deepExplanation: 'When a car follows closely behind another, the turbulent wake deprives its wings and floor of smooth laminar airflow, slashing downforce by up to 30% and causing front tires to slide and overheat.',
    exampleQuote: '"I\'m stuck in his dirty air; my front tires are burning up!"',
  },
  {
    term: 'DRS (Drag Reduction System)',
    category: 'aerodynamics',
    simpleDefinition: 'A driver-activated rear wing flap that opens up to 85mm to increase straight-line speed.',
    deepExplanation: 'Introduced in 2011 to aid overtaking. When a car is within 1.000 second of the car ahead at a detection point, the driver can open the rear flap in designated DRS zones, reducing drag and adding ~20 km/h.',
    exampleQuote: '"DRS enabled—let\'s get him down the straight!"',
  },
  {
    term: 'Porpoising',
    category: 'aerodynamics',
    simpleDefinition: 'Violent high-speed vertical bouncing caused by ground-effect aerodynamics stalling and unstalling.',
    deepExplanation: 'As downforce pulls the car closer to the ground, underfloor airflow suddenly chokes and stalls, losing downforce. The car pops up on its springs, airflow recovers, downforce returns, and the cycle repeats furiously at 300 km/h.',
    exampleQuote: '"The porpoising is brutal on the spine down the main straight."',
  },
  {
    term: 'Marbles',
    category: 'racecraft',
    simpleDefinition: 'Small chunks of molten rubber shed from tires that gather off the racing line.',
    deepExplanation: 'As tires degrade, hot rubber flakes peel off and are flung outside the clean racing groove. Driving onto marbles feels like driving on ball bearings or black ice.',
    exampleQuote: '"Stay on the clean line; offline is covered in marbles."',
  },
  {
    term: 'Box, Box!',
    category: 'slang',
    simpleDefinition: 'The universal pit wall radio command instructing the driver to pit this lap.',
    deepExplanation: 'Originates from the German word "Boxenstopp" (pit stop) and the pit "box". Saying it twice ensures radio clarity through loud engine vibrations.',
    exampleQuote: '"Box, box, box! Box for soft tires, box for soft."',
  },
  {
    term: 'Undercut',
    category: 'strategy',
    simpleDefinition: 'Pitting earlier than your rival to gain track position using fresh tire grip.',
    deepExplanation: 'Fresh rubber is up to 2 seconds a lap faster than worn rubber. By pitting first and pushing on the "out-lap", you move ahead once your rival pits on the subsequent lap.',
    exampleQuote: '"Let\'s go for the undercut; push hard on your in-lap!"',
  },
  {
    term: 'Overcut',
    category: 'strategy',
    simpleDefinition: 'Staying out on track longer while your rival pits, relying on clean air and fast pace.',
    deepExplanation: 'Most effective when fresh tires take several laps to reach operating temperature or when you have unobstructed clean air to unleash true pace.',
    exampleQuote: '"The overcut worked! We jumped both cars in the pits."',
  },
  {
    term: 'Slipstream / Tow',
    category: 'aerodynamics',
    simpleDefinition: 'Tucking in directly behind a car on a straight where low air pressure pulls you along.',
    deepExplanation: 'The leading car punches a hole in the air, creating a low-drag suction pocket. The following car experiences reduced air resistance and accelerates faster.',
    exampleQuote: '"He caught a massive slipstream down the Kemmel Straight."',
  },
];
