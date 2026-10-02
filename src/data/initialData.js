export const CATEGORIES = {
  physical: {
    id: 'physical',
    label: 'Physical / Gym',
    color: '#00f0ff',
    bg: 'rgba(0, 240, 255, 0.1)',
    border: 'rgba(0, 240, 255, 0.3)',
    icon: 'Dumbbell'
  },
  mind: {
    id: 'mind',
    label: 'Mind & Focus',
    color: '#3b82f6',
    bg: 'rgba(59, 130, 246, 0.1)',
    border: 'rgba(59, 130, 246, 0.3)',
    icon: 'Brain'
  },
  sleep: {
    id: 'sleep',
    label: 'Sleep & Recovery',
    color: '#a855f7',
    bg: 'rgba(168, 85, 247, 0.1)',
    border: 'rgba(168, 85, 247, 0.3)',
    icon: 'Moon'
  },
  discipline: {
    id: 'discipline',
    label: 'Discipline / Ghost',
    color: '#ef4444',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.3)',
    icon: 'ShieldAlert'
  },
  nutrition: {
    id: 'nutrition',
    label: 'Fuel & Nutrition',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.1)',
    border: 'rgba(16, 185, 129, 0.3)',
    icon: 'Flame'
  }
};

export const DEFAULT_HABITS = [
  {
    id: 'habit-1',
    name: 'Push Up',
    description: 'minimum 3 sets ',
    category: 'physical',
    isNonNegotiable: true,
    targetValue: 3,
    unit: 'sets'
  },
  {
    id: 'habit-2',
    name: 'Squat',
    description: 'minimum 3 sets of 20 free squat',
    category: 'physical',
    isNonNegotiable: true,
    targetValue: 3,
    unit: 'sets'
  },
  {
    id: 'habit-3',
    name: '1 Gallon (3.8L) Water Intake',
    description: 'Optimal hydration for mental acuity and muscle recovery',
    category: 'nutrition',
    isNonNegotiable: false,
    targetValue: 3.8,
    unit: 'L'
  },
  {
    id: 'habit-4',
    name: 'Read 10+ Pages (High Value)',
    description: 'Books on strategy, philosophy, psychology, or technical mastery',
    category: 'mind',
    isNonNegotiable: true,
    targetValue: 10,
    unit: 'pages'
  },
  {
    id: 'habit-5',
    name: 'Daily Bible Reading',
    description: 'Bible chapters according to the church schedule',
    category: 'mind',
    isNonNegotiable: true,
    targetValue: 3,
    unit: 'chapters'
  },
  {
    id: 'habit-6',
    name: '7.5+ Hours Quality Sleep',
    description: 'Lights out by 12:00 AM, no screens 15 min before bed',
    category: 'sleep',
    isNonNegotiable: true,
    targetValue: 7.5,
    unit: 'hrs'
  },
  {
    id: 'habit-7',
    name: 'Guitar Practice',
    description: '20 minutes of practice at least',
    category: 'discipline',
    isNonNegotiable: true
  },
  {
    id: 'habit-8',
    name: 'Piano Practice',
    description: '20 minutes of practice at least',
    category: 'discipline',
    isNonNegotiable: true
  },
  {
    id: 'habit-9',
    name: 'Chess',
    description: '1 game minimum at least',
    category: 'mind',
    isNonNegotiable: true
  },
  {
    id: 'habit-10',
    name: 'Jump Rope',
    description: '2 minutes 3 sets',
    category: 'physical',
    isNonNegotiable: false
  },
  {
    id: 'habit-11',
    name: 'Running',
    description: '3km of running at least',
    category: 'physical',
    isNonNegotiable: false
  }
];

export const WINTER_ARC_QUOTES = [
  { quote: "Discipline is choosing between what you want now and what you want most.", author: "Abraham Lincoln" },
  { quote: "In the depths of winter, I finally learned that within me there lay an invincible summer.", author: "Albert Camus" },
  { quote: "Ghost mode isn't about hiding from the world. It's about locking in until your results shake the room.", author: "Winter Arc Protocol" },
  { quote: "The cold doesn't care about your excuses. Neither does your future self.", author: "Marcus Aurelius" },
  { quote: "90 days of relentless, silent obsession will change the trajectory of the next 10 years.", author: "David Goggins" },
  { quote: "You do not rise to the level of your goals. You fall to the level of your systems.", author: "James Clear" },
  { quote: "Suffering is the sole origin of consciousness. Embrace the frost.", author: "Fyodor Dostoevsky" },
  { quote: "He who has a why to live can bear almost any how.", author: "Friedrich Nietzsche" }
];

export const BADGES = [
  {
    id: 'first_step',
    name: 'Initiate',
    description: 'Completed your first 100% daily non-negotiable checklist',
    icon: 'Footprints',
    condition: (stats) => stats.flawlessDays >= 1
  },
  {
    id: 'frost_walker',
    name: 'Frost Walker',
    description: 'Achieve a 7-day unbroken Winter Arc streak',
    icon: 'Flame',
    condition: (stats) => stats.currentStreak >= 7 || stats.longestStreak >= 7
  },
  {
    id: 'ice_forged',
    name: 'Ice Forged',
    description: 'Reach a 21-day discipline streak — new identity established',
    icon: 'Shield',
    condition: (stats) => stats.longestStreak >= 21
  },
  {
    id: 'halfway_peak',
    name: 'Halfway Peak',
    description: 'Crushed 45 days into the 90-day Winter Arc',
    icon: 'Mountain',
    condition: (stats) => stats.daysTracked >= 45
  },
  {
    id: 'monk_titan',
    name: 'Monk Titan',
    description: 'Logged 30 flawless 100% execution days',
    icon: 'Zap',
    condition: (stats) => stats.flawlessDays >= 30
  },
  {
    id: 'ascension',
    name: 'Ascension: Jan 1st',
    description: 'Conquer the full 90-Day Winter Arc with >80% completion',
    icon: 'Trophy',
    condition: (stats) => stats.daysTracked >= 90 && stats.overallCompletionRate >= 80
  }
];
