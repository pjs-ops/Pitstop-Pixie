export interface Rivalry {
  id: string;
  title: string;
  era: string;
  drivers: [string, string]; // names
  headline: string;
  story: string;
  keyClash: string;
  outcome: string;
}

export const RIVALRIES: Rivalry[] = [
  {
    id: 'senna_prost',
    title: 'Ayrton Senna vs Alain Prost',
    era: '1988 – 1993',
    drivers: ['Ayrton Senna', 'Alain Prost'],
    headline: 'The Mystic vs The Professor',
    story: 'Perhaps the fiercest, most psychologically charged rivalry in sports history. Teammates at McLaren who divided the team, the FIA, and the global fanbase into polarized camps of pure raw devotion versus calculated political intellect.',
    keyClash: 'Suzuka 1989 and 1990: In 1989, Prost turned into Senna at the Casio chicane to clinch the title. One year later in 1990 at the exact same track, Senna speared into Prost at 260 km/h into Turn 1 at the start to claim revenge and the championship.',
    outcome: 'They reconciled after Prost retired in 1993, with Prost serving as a pallbearer at Senna\'s funeral in 1994 and declaring that a part of him died that day too.',
  },
  {
    id: 'hamilton_verstappen',
    title: 'Lewis Hamilton vs Max Verstappen',
    era: '2021',
    drivers: ['Lewis Hamilton', 'Max Verstappen'],
    headline: 'The King vs The Usurper',
    story: 'A season for the ages that shook the world. 22 races of relentless, wheel-banging combat between the 7-time World Champion seeking his record 8th title and the young, ferocious challenger refusing to back down an inch.',
    keyClash: 'Silverstone 51G collision at Copse, Monza car-on-head crash on the kerbs, and the infamous final-lap safety car restart at Abu Dhabi.',
    outcome: 'Verstappen took his maiden title on the final lap of 2021, launching a new era of Red Bull dominance, while Hamilton demonstrated unforgettable dignity in post-race defeat.',
  },
  {
    id: 'hunt_lauda',
    title: 'James Hunt vs Niki Lauda',
    era: '1976',
    drivers: ['James Hunt', 'Niki Lauda'],
    headline: 'The Playful Rebel vs The Relentless Precision',
    story: 'Immortalized in Hollywood\'s "Rush", this rivalry pitted the flamboyant, charismatic British party-boy James Hunt in a McLaren against the analytical, deeply disciplined Austrian Niki Lauda in a Ferrari.',
    keyClash: 'Niki Lauda suffered a horrific fire crash at the Nürburgring Nordschleife, receiving last rites in the hospital—only to return to race just 42 days later with fresh facial burns in torrential Japanese rain at Fuji Speedway.',
    outcome: 'Lauda voluntarily withdrew from the dangerous monsoon at Fuji, allowing Hunt to score 3rd place and clinch the championship by a solitary point, cementing an enduring mutual respect between two icons.',
  },
];
