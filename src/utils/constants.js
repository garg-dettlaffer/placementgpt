// ============================================
// COLLEGES
// ============================================
export const COLLEGES = [
  'IIT Bombay', 'IIT Delhi', 'IIT Madras', 'IIT Kanpur', 'IIT Kharagpur',
  'IIT Roorkee', 'IIT Guwahati', 'IIT Hyderabad', 'IIT Indore', 'IIT Dhanbad',
  'IIT BHU', 'IIT Gandhinagar', 'IIT Jodhpur', 'IIT Patna', 'IIT Ropar',
  'BITS Pilani', 'BITS Goa', 'BITS Hyderabad',
  'NIT Trichy', 'NIT Warangal', 'NIT Karnataka', 'NIT Calicut',
  'IIIT Hyderabad', 'IIIT Bangalore', 'IIIT Delhi', 'IIIT Allahabad',
  'Delhi Technological University', 'Netaji Subhas University of Technology',
  'Jadavpur University', 'Anna University', 'VIT Vellore', 'VIT Chennai',
  'Manipal Institute of Technology', 'SRM Institute',
  'Other'
];

// ============================================
// BRANCHES
// ============================================
export const BRANCHES = [
  'Computer Science', 'Information Technology', 'Electronics & Communication',
  'Electrical Engineering', 'Mechanical Engineering', 'Civil Engineering',
  'Chemical Engineering', 'Aerospace Engineering', 'Biotechnology',
  'Data Science & AI', 'Mathematics & Computing', 'Engineering Physics',
  'Production Engineering', 'Industrial Engineering', 'Other'
];

// ============================================
// GRADUATION YEARS
// ============================================
const currentYear = new Date().getFullYear();
export const GRADUATION_YEARS = Array.from({ length: 6 }, (_, i) => currentYear + i);

// ============================================
// TOP COMPANIES
// ============================================
export const TOP_COMPANIES = [
  {
    slug: 'google',
    name: 'Google',
    avgPackage: '₹45 LPA',
    role: 'SDE-1',
    visitsCollege: true,
    status: 'HIRING',
    focusAreas: ['Trees & Graphs', 'Dynamic Programming', 'System Design'],
    logo: '/logos/google.png'
  },
  {
    slug: 'amazon',
    name: 'Amazon',
    avgPackage: '₹42 LPA',
    role: 'SDE-1',
    visitsCollege: true,
    status: 'HIRING',
    focusAreas: ['Arrays', 'Hash Maps', 'Trees', 'OOPs'],
    logo: '/logos/amazon.png'
  },
  {
    slug: 'microsoft',
    name: 'Microsoft',
    avgPackage: '₹42 LPA',
    role: 'SDE',
    visitsCollege: true,
    status: 'HIRING',
    focusAreas: ['DP', 'Graphs', 'System Design'],
    logo: '/logos/microsoft.png'
  },
  {
    slug: 'uber',
    name: 'Uber',
    avgPackage: '₹38 LPA',
    role: 'SDE-1',
    visitsCollege: false,
    status: 'HIRING',
    focusAreas: ['System Design', 'LLD', 'Scalability'],
    logo: '/logos/uber.png'
  },
  {
    slug: 'swiggy',
    name: 'Swiggy',
    avgPackage: '₹18 LPA',
    role: 'SDE-1',
    visitsCollege: true,
    status: 'HIRING',
    focusAreas: ['DSA', 'Backend Development'],
    logo: '/logos/swiggy.png'
  },
  {
    slug: 'zomato',
    name: 'Zomato',
    avgPackage: '₹28 LPA',
    role: 'Backend Engineer',
    visitsCollege: true,
    status: 'PAUSED',
    focusAreas: ['LLD', 'Caching', 'Databases'],
    logo: '/logos/zomato.png'
  },
  {
    slug: 'flipkart',
    name: 'Flipkart',
    avgPackage: '₹26 LPA',
    role: 'SDE-1',
    visitsCollege: true,
    status: 'SOON',
    focusAreas: ['E-commerce', 'Microservices'],
    logo: '/logos/flipkart.png'
  },
  {
    slug: 'adobe',
    name: 'Adobe',
    avgPackage: '₹40 LPA',
    role: 'MTS',
    visitsCollege: true,
    status: 'SOON',
    focusAreas: ['Strings & Geometry', 'Graphics'],
    logo: '/logos/adobe.png'
  },
  {
    slug: 'atlassian',
    name: 'Atlassian',
    avgPackage: '₹52 LPA',
    role: 'SDE',
    visitsCollege: false,
    status: 'HIRING',
    focusAreas: ['Distributed Systems', 'Collaboration Tools'],
    logo: '/logos/atlassian.png'
  },
  {
    slug: 'goldman-sachs',
    name: 'Goldman Sachs',
    avgPackage: '₹24 LPA',
    role: 'Analyst',
    visitsCollege: true,
    status: 'HIRING',
    focusAreas: ['Math & DP', 'Probability', 'Algorithms'],
    logo: '/logos/goldman-sachs.png'
  },
  {
    slug: 'cred',
    name: 'CRED',
    avgPackage: '₹35 LPA',
    role: 'SDE',
    visitsCollege: false,
    status: 'SOON',
    focusAreas: ['Fintech', 'Backend Systems'],
    logo: '/logos/cred.png'
  },
  {
    slug: 'tcs-digital',
    name: 'TCS Digital',
    avgPackage: '₹7.5 LPA',
    role: 'Digital Engineer',
    visitsCollege: true,
    status: 'HIRING',
    focusAreas: ['Aptitude & SQL', 'Web Development'],
    logo: '/logos/tcs.png'
  },
  // Add more as needed
];

// ============================================
// PROBLEM TOPICS
// ============================================
export const PROBLEM_TOPICS = [
  'Arrays',
  'Strings',
  'Linked List',
  'Stacks',
  'Queues',
  'Hash Map',
  'Hash Set',
  'Trees',
  'Binary Search Trees',
  'Heaps',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Backtracking',
  'Recursion',
  'Sliding Window',
  'Two Pointers',
  'Binary Search',
  'Bit Manipulation',
  'Math',
  'Sorting',
  'Divide and Conquer',
  'Trie',
  'Segment Tree',
  'Union Find'
];

// ============================================
// DIFFICULTY LEVELS
// ============================================
export const DIFFICULTY_LEVELS = ['Easy', 'Medium', 'Hard'];

// ============================================
// PROGRAMMING LANGUAGES
// ============================================
export const LANGUAGES = [
  { id: 'python', name: 'Python 3', version: '3.10', extension: 'py' },
  { id: 'java', name: 'Java', version: '17', extension: 'java' },
  { id: 'cpp', name: 'C++', version: '17', extension: 'cpp' },
  { id: 'javascript', name: 'JavaScript', version: 'ES6', extension: 'js' },
  { id: 'c', name: 'C', version: 'C17', extension: 'c' },
  { id: 'go', name: 'Go', version: '1.19', extension: 'go' },
  { id: 'rust', name: 'Rust', version: '1.65', extension: 'rs' },
];

// ============================================
// ONBOARDING STEPS
// ============================================
export const ONBOARDING_STEPS = [
  {
    step: 1,
    title: 'Welcome to PlacementGPT! 🎉',
    description: 'Let\'s set up your profile to create a personalized preparation plan.',
  },
  {
    step: 2,
    title: 'Where do you see yourself?',
    description: 'Select at least 3 companies to tailor your technical prep plan.',
  },
  {
    step: 3,
    title: 'Tell us about yourself',
    description: 'Help us understand your academic background and skills.',
  },
  {
    step: 4,
    title: 'Generating Your Roadmap',
    description: 'Our AI is creating a personalized 12-week preparation plan for you.',
  },
];

// ============================================
// INTERVIEW TYPES
// ============================================
export const INTERVIEW_TYPES = [
  { id: 'dsa', name: 'DSA Interview', icon: 'Code2' },
  { id: 'system_design', name: 'System Design', icon: 'Network' },
  { id: 'behavioral', name: 'Behavioral', icon: 'Users' },
];

// ============================================
// SUBSCRIPTION PLANS
// ============================================
export const PLANS = {
  free: {
    name: 'Free',
    price: 0,
    credits: 10,
    features: [
      '10 AI hints per month',
      'Basic problem access',
      'Limited mock interviews',
      'Community support'
    ]
  },
  pro: {
    name: 'Pro',
    price: 299,
    credits: 100,
    features: [
      '100 AI hints per month',
      'Full problem library access',
      'Unlimited mock interviews',
      'Company-specific prep plans',
      'Resume analysis',
      'Priority support',
      'Interview tips & strategies'
    ]
  }
};

// ============================================
// STATUS BADGES
// ============================================
export const STATUS_CONFIG = {
  HIRING: { color: 'green', label: 'Hiring' },
  CLOSED: { color: 'gray', label: 'Closed' },
  SOON: { color: 'orange', label: 'Soon' },
  PAUSED: { color: 'yellow', label: 'Paused' },
};

// ============================================
// SKILL CATEGORIES
// ============================================
export const SKILL_CATEGORIES = {
  'Languages': ['Python', 'Java', 'C++', 'JavaScript', 'Go', 'Rust', 'C', 'TypeScript'],
  'Web Development': ['React', 'Angular', 'Vue.js', 'Node.js', 'Express', 'Django', 'Flask', 'Spring Boot'],
  'Databases': ['MySQL', 'PostgreSQL', 'MongoDB', 'Redis', 'Cassandra', 'DynamoDB'],
  'Cloud & DevOps': ['AWS', 'Azure', 'GCP', 'Docker', 'Kubernetes', 'Jenkins', 'CI/CD'],
  'Mobile': ['React Native', 'Flutter', 'Android', 'iOS', 'Kotlin', 'Swift'],
  'Others': ['Git', 'Linux', 'System Design', 'Microservices', 'REST APIs', 'GraphQL']
};

// ============================================
// XP SYSTEM
// ============================================
export const XP_REWARDS = {
  problemSolved: {
    Easy: 10,
    Medium: 25,
    Hard: 50
  },
  dailyStreak: 5,
  mockInterview: 50,
  resumeAnalysis: 20,
  onboardingComplete: 100
};

// ============================================
// APP CONFIG
// ============================================
export const APP_CONFIG = {
  name: 'PlacementGPT',
  tagline: 'Your AI-Powered Placement Companion',
  version: '1.0.0',
  supportEmail: 'support@placementgpt.com',
  socialLinks: {
    github: 'https://github.com/placementgpt',
    twitter: 'https://twitter.com/placementgpt',
    linkedin: 'https://linkedin.com/company/placementgpt',
  }
};

export default {
  COLLEGES,
  BRANCHES,
  GRADUATION_YEARS,
  TOP_COMPANIES,
  PROBLEM_TOPICS,
  DIFFICULTY_LEVELS,
  LANGUAGES,
  ONBOARDING_STEPS,
  INTERVIEW_TYPES,
  PLANS,
  STATUS_CONFIG,
  SKILL_CATEGORIES,
  XP_REWARDS,
  APP_CONFIG
};
