export interface Golfer {
  name: string;
  worldRanking: string;
  odds: string;
}

export interface Tier {
  tier: number;
  label: string;
  pick: number;
  golfers: Golfer[];
}

export const tiers: Tier[] = [
  {
    tier: 1,
    label: "Tier 1",
    pick: 1,
    golfers: [
      { name: "Scottie Scheffler", worldRanking: "1", odds: "4/1" },
      { name: "Jon Rahm", worldRanking: "30", odds: "9/1" },
      { name: "Rory McIlroy", worldRanking: "2", odds: "10/1" },
      { name: "Bryson DeChambeau", worldRanking: "24", odds: "11/1" },
      { name: "Ludvig Aberg", worldRanking: "17", odds: "18/1" },
      { name: "Xander Schauffele", worldRanking: "10", odds: "19/1" },
      { name: "Cameron Young", worldRanking: "3", odds: "24/1" },
      { name: "Tommy Fleetwood", worldRanking: "4", odds: "25/1" },
      { name: "Matt Fitzpatrick", worldRanking: "6", odds: "26/1" },
      { name: "Collin Morikawa", worldRanking: "7", odds: "31/1" },
    ],
  },
  {
    tier: 2,
    label: "Tier 2",
    pick: 1,
    golfers: [
      { name: "Justin Rose", worldRanking: "9", odds: "36/1" },
      { name: "Jordan Spieth", worldRanking: "61", odds: "38/1" },
      { name: "Brooks Koepka", worldRanking: "169", odds: "38/1" },
      { name: "Hideki Matsuyama", worldRanking: "14", odds: "39/1" },
      { name: "Robert MacIntyre", worldRanking: "8", odds: "40/1" },
      { name: "Russell Henley", worldRanking: "12", odds: "42/1" },
      { name: "Chris Gotterup", worldRanking: "11", odds: "43/1" },
      { name: "Patrick Reed", worldRanking: "23", odds: "45/1" },
      { name: "Viktor Hovland", worldRanking: "22", odds: "46/1" },
      { name: "Si Woo Kim", worldRanking: "28", odds: "47/1" },
    ],
  },
  {
    tier: 3,
    label: "Tier 3",
    pick: 1,
    golfers: [
      { name: "Min Woo Lee", worldRanking: "25", odds: "54/1" },
      { name: "Justin Thomas", worldRanking: "15", odds: "55/1" },
      { name: "Patrick Cantlay", worldRanking: "35", odds: "57/1" },
      { name: "Adam Scott", worldRanking: "53", odds: "62/1" },
      { name: "Akshay Bhatia", worldRanking: "21", odds: "66/1" },
      { name: "Sepp Straka", worldRanking: "13", odds: "67/1" },
      { name: "Tyrrell Hatton", worldRanking: "31", odds: "69/1" },
      { name: "Jason Day", worldRanking: "41", odds: "69/1" },
      { name: "Jake Knapp", worldRanking: "42", odds: "69/1" },
      { name: "Shane Lowry", worldRanking: "32", odds: "70/1" },
    ],
  },
  {
    tier: 4,
    label: "Tier 4",
    pick: 1,
    golfers: [
      { name: "Sam Burns", worldRanking: "33", odds: "72/1" },
      { name: "Corey Conners", worldRanking: "44", odds: "82/1" },
      { name: "Nicolai Hojgaard", worldRanking: "36", odds: "84/1" },
      { name: "J.J. Spaun", worldRanking: "5", odds: "88/1" },
      { name: "Kurt Kitayama", worldRanking: "34", odds: "88/1" },
      { name: "Jacob Bridgeman", worldRanking: "18", odds: "94/1" },
      { name: "Maverick McNealy", worldRanking: "27", odds: "98/1" },
      { name: "Matthew McCarty", worldRanking: "49", odds: "100/1" },
      { name: "Cameron Smith", worldRanking: ">200", odds: "100/1" },
      { name: "Harris English", worldRanking: "20", odds: "105/1" },
    ],
  },
  {
    tier: 5,
    label: "Tier 5",
    pick: 1,
    golfers: [
      { name: "Ben Griffin", worldRanking: "16", odds: "110/1" },
      { name: "Daniel Berger", worldRanking: "38", odds: "110/1" },
      { name: "Gary Woodland", worldRanking: "52", odds: "110/1" },
      { name: "Max Homa", worldRanking: "163", odds: "115/1" },
      { name: "Sungjae Im", worldRanking: "71", odds: "120/1" },
      { name: "Rasmus Hojgaard", worldRanking: "57", odds: "130/1" },
      { name: "Keegan Bradley", worldRanking: "26", odds: "140/1" },
      { name: "Marco Penge", worldRanking: "37", odds: "160/1" },
      { name: "Harry Hall", worldRanking: "62", odds: "160/1" },
      { name: "Alexander Noren", worldRanking: "19", odds: "165/1" },
    ],
  },
  {
    tier: 6,
    label: "Tier 6",
    pick: 1,
    golfers: [
      { name: "Ryan Gerard", worldRanking: "29", odds: "170/1" },
      { name: "Aaron Rai", worldRanking: "39", odds: "195/1" },
      { name: "Nick Taylor", worldRanking: "67", odds: "195/1" },
      { name: "Brian Harman", worldRanking: "50", odds: "200/1" },
      { name: "Sam Stevens", worldRanking: "45", odds: "210/1" },
      { name: "Ryan Fox", worldRanking: "51", odds: "225/1" },
      { name: "Wyndham Clark", worldRanking: "78", odds: "225/1" },
      { name: "Sergio Garcia", worldRanking: ">200", odds: "225/1" },
      { name: "Max Greyserman", worldRanking: "59", odds: "230/1" },
      { name: "Dustin Johnson", worldRanking: ">200", odds: "240/1" },
      { name: "Casey Jarvis", worldRanking: "70", odds: "250/1" },
      { name: "Carlos Ortiz", worldRanking: "161", odds: "260/1" },
      { name: "Hao-Tong Li", worldRanking: "84", odds: "280/1" },
      { name: "Tom McKibbin", worldRanking: "105", odds: "280/1" },
      { name: "Nicolas Echavarria", worldRanking: "40", odds: "310/1" },
      { name: "Kristoffer Reitan", worldRanking: "46", odds: "310/1" },
      { name: "Rasmus Neergaard-Petersen", worldRanking: "69", odds: "325/1" },
      { name: "John Keefer", worldRanking: "64", odds: "340/1" },
      { name: "Michael Kim", worldRanking: "43", odds: "350/1" },
      { name: "Andrew Novak", worldRanking: "48", odds: "400/1" },
      { name: "Aldrich Potgieter", worldRanking: "77", odds: "410/1" },
      { name: "Michael Brennan", worldRanking: "47", odds: "430/1" },
      { name: "Sami Valimaki", worldRanking: "56", odds: "525/1" },
      { name: "Davis Riley", worldRanking: "120", odds: "600/1" },
      { name: "Bubba Watson", worldRanking: ">200", odds: "600/1" },
      { name: "Charl Schwartzel", worldRanking: ">200", odds: "600/1" },
      { name: "Zach Johnson", worldRanking: ">200", odds: "600/1" },
      { name: "Brian Campbell", worldRanking: "112", odds: "2500/1" },
      { name: "Danny Willett", worldRanking: ">200", odds: "2500/1" },
      { name: "Ethan Fang", worldRanking: ">200", odds: "2500/1" },
      { name: "Fifa Laopakdee", worldRanking: ">200", odds: "4000/1" },
      { name: "Angel Cabrera", worldRanking: ">200", odds: "4500/1" },
      { name: "Naoyuki Kataoka", worldRanking: ">200", odds: "4500/1" },
      { name: "Vijay Singh", worldRanking: ">200", odds: "4500/1" },
      { name: "Jackson Herrington", worldRanking: ">200", odds: "4500/1" },
      { name: "Mason Howell", worldRanking: ">200", odds: "4500/1" },
      { name: "Mateo Pulcini", worldRanking: ">200", odds: "4500/1" },
      { name: "Fred Couples", worldRanking: ">200", odds: "5000/1" },
      { name: "Jose Maria Olazabal", worldRanking: ">200", odds: "5000/1" },
      { name: "Mike Weir", worldRanking: ">200", odds: "5000/1" },
      { name: "Brandon Holtz", worldRanking: ">200", odds: "5000/1" },
    ],
  },
];

export const tiebreakerScores = Array.from({ length: 61 }, (_, i) => i - 30).map(
  (score) => {
    if (score === 0) return "E";
    if (score > 0) return `+${score}`;
    return `${score}`;
  }
);
