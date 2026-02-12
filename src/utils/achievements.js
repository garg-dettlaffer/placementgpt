// Achievement definitions for PlacementGPT
export const ACHIEVEMENTS = [
  // Problem Solving Achievements
  {
    id: 'first_blood',
    name: 'First Blood',
    description: 'Solve your first problem',
    icon: '🎯',
    category: 'problems',
    rarity: 'common',
    requirement: { type: 'problems_solved', count: 1 },
    xpReward: 10
  },
  {
    id: 'getting_started',
    name: 'Getting Started',
    description: 'Solve 5 problems',
    icon: '🚀',
    category: 'problems',
    rarity: 'common',
    requirement: { type: 'problems_solved', count: 5 },
    xpReward: 25
  },
  {
    id: 'problem_solver',
    name: 'Problem Solver',
    description: 'Solve 25 problems',
    icon: '💪',
    category: 'problems',
    rarity: 'common',
    requirement: { type: 'problems_solved', count: 25 },
    xpReward: 50
  },
  {
    id: 'half_century',
    name: 'Half Century',
    description: 'Solve 50 problems',
    icon: '🏅',
    category: 'problems',
    rarity: 'rare',
    requirement: { type: 'problems_solved', count: 50 },
    xpReward: 100
  },
  {
    id: 'century',
    name: 'Century',
    description: 'Solve 100 problems',
    icon: '💯',
    category: 'problems',
    rarity: 'rare',
    requirement: { type: 'problems_solved', count: 100 },
    xpReward: 200
  },
  {
    id: 'double_century',
    name: 'Double Century',
    description: 'Solve 200 problems',
    icon: '🔥',
    category: 'problems',
    rarity: 'epic',
    requirement: { type: 'problems_solved', count: 200 },
    xpReward: 400
  },
  {
    id: 'triple_century',
    name: 'Triple Century',
    description: 'Solve 300 problems',
    icon: '⚡',
    category: 'problems',
    rarity: 'epic',
    requirement: { type: 'problems_solved', count: 300 },
    xpReward: 600
  },
  {
    id: 'legend',
    name: 'Legend',
    description: 'Solve 500 problems',
    icon: '👑',
    category: 'problems',
    rarity: 'legendary',
    requirement: { type: 'problems_solved', count: 500 },
    xpReward: 1000
  },

  // Difficulty Mastery
  {
    id: 'easy_master',
    name: 'Easy Master',
    description: 'Solve 50 Easy problems',
    icon: '🟢',
    category: 'difficulty',
    rarity: 'common',
    requirement: { type: 'difficulty', difficulty: 'Easy', count: 50 },
    xpReward: 75
  },
  {
    id: 'medium_master',
    name: 'Medium Master',
    description: 'Solve 50 Medium problems',
    icon: '🟡',
    category: 'difficulty',
    rarity: 'rare',
    requirement: { type: 'difficulty', difficulty: 'Medium', count: 50 },
    xpReward: 150
  },
  {
    id: 'hard_master',
    name: 'Hard Master',
    description: 'Solve 25 Hard problems',
    icon: '🔴',
    category: 'difficulty',
    rarity: 'epic',
    requirement: { type: 'difficulty', difficulty: 'Hard', count: 25 },
    xpReward: 250
  },

  // Streak Achievements
  {
    id:'week_streak',
    name: '7-Day Fire',
    description: 'Maintain a 7-day coding streak',
    icon: '🔥',
    category: 'streaks',
    rarity: 'common',
    requirement: { type: 'streak', count: 7 },
    xpReward: 50
  },
  {
    id: 'fortnight_streak',
    name: 'Fortnight Fury',
    description: 'Maintain a 14-day coding streak',
    icon: '🌟',
    category: 'streaks',
    rarity: 'rare',
    requirement: { type: 'streak', count: 14 },
    xpReward: 100
  },
  {
    id: 'month_streak',
    name: 'Month Master',
    description: 'Maintain a 30-day coding streak',
    icon: '💎',
    category: 'streaks',
    rarity: 'epic',
    requirement: { type: 'streak', count: 30 },
    xpReward: 250
  },
  {
    id: 'quarter_streak',
    name: 'Consistency King',
    description: 'Maintain a 90-day coding streak',
    icon: '👽',
    category: 'streaks',
    rarity: 'legendary',
    requirement: { type: 'streak', count: 90 },
    xpReward: 500
  },

  // Interview Achievements
  {
    id: 'first_interview',
    name: 'Interview Ready',
    description: 'Complete your first mock interview',
    icon: '🎤',
    category: 'interviews',
    rarity: 'common',
    requirement: { type: 'interviews_completed', count: 1 },
    xpReward: 30
  },
  {
    id: 'interview_veteran',
    name: 'Interview Veteran',
    description: 'Complete 10 mock interviews',
    icon: '🎭',
    category: 'interviews',
    rarity: 'rare',
    requirement: { type: 'interviews_completed', count: 10 },
    xpReward: 150
  },
  {
    id: 'perfectionist',
    name: 'Perfectionist',
    description: 'Score 90%+ in a mock interview',
    icon: '✨',
    category: 'interviews',
    rarity: 'epic',
    requirement: { type: 'interview_score', score: 90 },
    xpReward: 200
  },

  // Topic Mastery
  {
    id: 'array_expert',
    name: 'Array Expert',
    description: 'Solve 20 Array problems',
    icon: '📊',
    category: 'topics',
    rarity: 'common',
    requirement: { type: 'topic', topic: 'Arrays', count: 20 },
    xpReward: 50
  },
  {
    id: 'dp_master',
    name: 'DP Master',
    description: 'Solve 15 Dynamic Programming problems',
    icon: '🧠',
    category: 'topics',
    rarity: 'epic',
    requirement: { type: 'topic', topic: 'Dynamic Programming', count: 15 },
    xpReward: 200
  },
  {
    id: 'graph_guru',
    name: 'Graph Guru',
    description: 'Solve 15 Graph problems',
    icon: '🕸️',
    category: 'topics',
    rarity: 'rare',
    requirement: { type: 'topic', topic: 'Graph', count: 15 },
    xpReward: 150
  },
  {
    id: 'tree_master',
    name: 'Tree Master',
    description: 'Solve 20 Tree problems',
    icon: '🌳',
    category: 'topics',
    rarity: 'rare',
    requirement: { type: 'topic', topic: 'Tree', count: 20 },
    xpReward: 120
  },

  // Speed Achievements
  {
    id: 'speedster',
    name: 'Speedster',
    description: 'Solve a problem in under 5 minutes',
    icon: '⚡',
    category: 'speed',
    rarity: 'rare',
    requirement: { type: 'solve_time', seconds: 300 },
    xpReward: 100
  },
  {
    id: 'flash',
    name: 'The Flash',
    description: 'Solve a problem in under 2 minutes',
    icon: '💨',
    category: 'speed',
    rarity: 'epic',
    requirement: { type: 'solve_time', seconds: 120 },
    xpReward: 200
  },

  // Accuracy Achievements
  {
    id: 'accurate',
    name: 'Accurate Coder',
    description: 'Maintain 80% accuracy with 50+ submissions',
    icon: '🎯',
    category: 'accuracy',
    rarity: 'rare',
    requirement: { type: 'accuracy', accuracy: 80, minSubmissions: 50 },
    xpReward: 150
  },
  {
    id: 'perfectionist_accuracy',
    name: 'Near Perfect',
    description: 'Maintain 95% accuracy with 100+ submissions',
    icon: '💎',
    category: 'accuracy',
    rarity: 'legendary',
    requirement: { type: 'accuracy', accuracy: 95, minSubmissions: 100 },
    xpReward: 500
  },

  // Study Time Achievements
  {
    id: 'dedicated',
    name: 'Dedicated Learner',
    description: 'Study for 10 hours total',
    icon: '📚',
    category: 'study',
    rarity: 'common',
    requirement: { type: 'study_time', hours: 10 },
    xpReward: 30
  },
  {
    id: 'grinder',
    name: 'Grinder',
    description: 'Study for 50 hours total',
    icon: '💪',
    category: 'study',
    rarity: 'rare',
    requirement: { type: 'study_time', hours: 50 },
    xpReward: 100
  },
  {
    id: 'marathon_runner',
    name: 'Marathon Runner',
    description: 'Study for 100 hours total',
    icon: '🏃',
    category: 'study',
    rarity: 'epic',
    requirement: { type: 'study_time', hours: 100 },
    xpReward: 250
  },

  // Company Prep
  {
    id: 'faang_ready',
    name: 'FAANG Ready',
    description: 'Solve 50 problems tagged by top companies',
    icon: '🏢',
    category: 'companies',
    rarity: 'epic',
    requirement: { type: 'company_problems', count: 50 },
    xpReward: 300
  },

  // Special Achievements
  {
    id: 'early_bird',
    name: 'Early Bird',
    description: 'Solve a problem before 6 AM',
    icon: '🌅',
    category: 'special',
    rarity: 'common',
    requirement: { type: 'solve_hour', beforeHour: 6 },
    xpReward: 25
  },
  {
    id: 'night_owl',
    name: 'Night Owl',
    description: 'Solve a problem after midnight',
    icon: '🦉',
    category: 'special',
    rarity: 'common',
    requirement: { type: 'solve_hour', afterHour: 0 },
    xpReward: 25
  },
  {
    id: 'weekend_warrior',
    name: 'Weekend Warrior',
    description: 'Solve 20 problems on weekends',
    icon: '🎮',
    category: 'special',
    rarity: 'rare',
    requirement: { type: 'weekend_problems', count: 20 },
    xpReward: 80
  },
  {
    id: 'comeback_kid',
    name: 'Comeback Kid',
    description: 'Restore a broken streak of 7+ days',
    icon: '🔄',
    category: 'special',
    rarity: 'rare',
    requirement: { type: 'streak_restore', minStreak: 7 },
    xpReward: 100
  },
  {
    id: 'polyglot',
    name: 'Polyglot',
    description: 'Solve problems in 3 different languages',
    icon: '🌐',
    category: 'special',
    rarity: 'rare',
    requirement: { type: 'languages_used', count: 3 },
    xpReward: 120
  },

  // Resume Achievements
  {
    id: 'resume_optimizer',
    name: 'Resume Optimizer',
    description: 'Analyze your resume and get 8+ score',
    icon: '📄',
    category: 'resume',
    rarity: 'common',
    requirement: { type: 'resume_score', score: 8 },
    xpReward: 50
  },

  // Contest Achievements
  {
    id: 'contest_participant',
    name: 'Contest Participant',
    description: 'Participate in your first contest',
    icon: '🏆',
    category: 'contests',
    rarity: 'common',
    requirement: { type: 'contests_participated', count: 1 },
    xpReward: 50
  },
  {
    id: 'top_performer',
    name: 'Top 5% Performer',
    description: 'Finish in top 5% in a contest',
    icon: '🥇',
    category: 'contests',
    rarity: 'epic',
    requirement: { type: 'contest_rank_percentile', percentile: 5 },
    xpReward: 300
  },

  // Social Achievements
  {
    id: 'helpful',
    name: 'Helpful Community Member',
    description: 'Help 10 students with their doubts',
    icon: '🤝',
    category: 'social',
    rarity: 'rare',
    requirement: { type: 'helpful_count', count: 10 },
    xpReward: 100
  },
  {
    id: 'popular',
    name: 'Popular Profile',
    description: 'Get 50 profile views',
    icon: '👀',
    category: 'social',
    rarity: 'common',
    requirement: { type: 'profile_views', count: 50 },
    xpReward: 30
  },

  // Milestone Achievements
  {
    id: 'onboarding_complete',
    name: 'Welcome Aboard',
    description: 'Complete your profile setup',
    icon: '🎉',
    category: 'milestones',
    rarity: 'common',
    requirement: { type: 'milestone', milestone: 'onboarding' },
    xpReward: 10
  },
  {
    id: 'placement_ready',
    name: 'Placement Ready',
    description: 'Complete all preparation modules',
    icon: '🎓',
    category: 'milestones',
    rarity: 'legendary',
    requirement: { type: 'milestone', milestone: 'placement_ready' },
    xpReward: 1000
  },

  // XP Milestones
  {
    id: 'xp_1000',
    name: '1K XP',
    description: 'Earn 1,000 total XP',
    icon: '⭐',
    category: 'xp',
    rarity: 'common',
    requirement: { type: 'total_xp', xp: 1000 },
    xpReward: 50
  },
  {
    id: 'xp_5000',
    name: '5K XP',
    description: 'Earn 5,000 total XP',
    icon: '🌟',
    category: 'xp',
    rarity: 'rare',
    requirement: { type: 'total_xp', xp: 5000 },
    xpReward: 200
  },
  {
    id: 'xp_10000',
    name: '10K XP',
    description: 'Earn 10,000 total XP',
    icon: '💫',
    category: 'xp',
    rarity: 'epic',
    requirement: { type: 'total_xp', xp: 10000 },
    xpReward: 500
  }
];

// Categories with display info
export const ACHIEVEMENT_CATEGORIES = {
  problems: { name: 'Problem Solving', color: 'blue' },
  difficulty: { name: 'Difficulty Mastery', color: 'purple' },
  streaks: { name: 'Streaks & Consistency', color: 'orange' },
  interviews: { name: 'Mock Interviews', color: 'green' },
  topics: { name: 'Topic Mastery', color: 'cyan' },
  speed: { name: 'Speed Challenges', color: 'yellow' },
  accuracy: { name: 'Accuracy', color: 'red' },
  study: { name: 'Study Time', color: 'indigo' },
  companies: { name: 'Company Prep', color: 'pink' },
  special: { name: 'Special', color: 'teal' },
  resume: { name: 'Resume', color: 'lime' },
  contests: { name: 'Contests', color: 'amber' },
  social: { name: 'Social', color: 'rose' },
  milestones: { name: 'Milestones', color: 'violet' },
  xp: { name: 'XP Milestones', color: 'sky' }
};

// Rarity levels with styles
export const RARITY_STYLES = {
  common: {
    border: 'border-gray-600',
    glow: '',
    bg: 'bg-gray-800/50',
    text: 'text-gray-400'
  },
  rare: {
    border: 'border-blue-500',
    glow: 'shadow-[0_0_20px_rgba(59,130,246,0.5)]',
    bg: 'bg-blue-900/20',
    text: 'text-blue-400'
  },
  epic: {
    border: 'border-purple-500',
    glow: 'shadow-[0_0_30px_rgba(168,85,247,0.6)]',
    bg: 'bg-purple-900/20',
    text: 'text-purple-400'
  },
  legendary: {
    border: 'border-yellow-500',
    glow: 'shadow-[0_0_40px_rgba(234,179,8,0.7)] animate-pulse',
    bg: 'bg-yellow-900/20',
    text: 'text-yellow-400'
  }
};

// Check if user has unlocked an achievement
export const checkAchievement = (achievement, userProgress) => {
  const { requirement } = achievement;
  
  switch (requirement.type) {
    case 'problems_solved':
      return userProgress.solvedProblems.length >= requirement.count;
      
    case 'difficulty':
      const difficultyCount = userProgress.solvedProblems.filter(
        p => p.difficulty === requirement.difficulty
      ).length;
      return difficultyCount >= requirement.count;
      
    case 'streak':
      return userProgress.streak >= requirement.count;
      
    case 'interviews_completed':
      return (userProgress.interviewsCompleted || 0) >= requirement.count;
      
    case 'interview_score':
      return (userProgress.maxInterviewScore || 0) >= requirement.score;
      
    case 'topic':
      const topicCount = userProgress.solvedProblems.filter(
        p => p.topics && p.topics.includes(requirement.topic)
      ).length;
      return topicCount >= requirement.count;
      
    case 'solve_time':
      return userProgress.fastestSolve <= requirement.seconds;
      
    case 'accuracy':
      return userProgress.accuracy >= requirement.accuracy && 
             userProgress.attemptedProblems.length >= requirement.minSubmissions;
      
    case 'study_time':
      return (userProgress.studyTime / 60) >= requirement.hours;
      
    case 'company_problems':
      const companyCount = userProgress.solvedProblems.filter(
        p => p.companies && p.companies.length > 0
      ).length;
      return companyCount >= requirement.count;
      
    case 'total_xp':
      return userProgress.totalXP >= requirement.xp;
      
    case 'languages_used':
      const languages = new Set(userProgress.solvedProblems.map(p => p.language));
      return languages.size >= requirement.count;
      
    case 'resume_score':
      return (userProgress.resumeScore || 0) >= requirement.score;
      
    case 'contests_participated':
      return (userProgress.contestsParticipated || 0) >= requirement.count;
      
    case 'contest_rank_percentile':
      return (userProgress.bestContestPercentile || 100) <= requirement.percentile;
      
    case 'profile_views':
      return (userProgress.profileViews || 0) >= requirement.count;
      
    case 'milestone':
      return userProgress.milestones && userProgress.milestones.includes(requirement.milestone);
      
    default:
      return false;
  }
};

// Get achievement progress (0-100)
export const getAchievementProgress = (achievement, userProgress) => {
  const { requirement } = achievement;
  
  switch (requirement.type) {
    case 'problems_solved':
      return Math.min(100, (userProgress.solvedProblems.length / requirement.count) * 100);
      
    case 'difficulty':
      const difficultyCount = userProgress.solvedProblems.filter(
        p => p.difficulty === requirement.difficulty
      ).length;
      return Math.min(100, (difficultyCount / requirement.count) * 100);
      
    case 'streak':
      return Math.min(100, (userProgress.streak / requirement.count) * 100);
      
    case 'interviews_completed':
      return Math.min(100, ((userProgress.interviewsCompleted || 0) / requirement.count) * 100);
      
    case 'topic':
      const topicCount = userProgress.solvedProblems.filter(
        p => p.topics && p.topics.includes(requirement.topic)
      ).length;
      return Math.min(100, (topicCount / requirement.count) * 100);
      
    case 'study_time':
      return Math.min(100, ((userProgress.studyTime / 60) / requirement.hours) * 100);
      
    case 'total_xp':
      return Math.min(100, (userProgress.totalXP / requirement.xp) * 100);
      
    case 'languages_used':
      const languages = new Set(userProgress.solvedProblems.map(p => p.language));
      return Math.min(100, (languages.size / requirement.count) * 100);
      
    default:
      return checkAchievement(achievement, userProgress) ? 100 : 0;
  }
};
