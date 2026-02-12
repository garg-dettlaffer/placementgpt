/**
 * Fallback problem data when LeetCode API is unavailable
 * Contains 100 popular DSA problems across different difficulty levels
 */

export const FALLBACK_PROBLEMS = [
  // Easy Problems (30)
  {
    frontendQuestionId: '1',
    title: 'Two Sum',
    titleSlug: 'two-sum',
    difficulty: 'Easy',
    acRate: 49.16,
    topicTags: [{ name: 'Array' }, { name: 'Hash Table' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '9',
    title: 'Palindrome Number',
    titleSlug: 'palindrome-number',
    difficulty: 'Easy',
    acRate: 52.52,
    topicTags: [{ name: 'Math' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '13',
    title: 'Roman to Integer',
    titleSlug: 'roman-to-integer',
    difficulty: 'Easy',
    acRate: 58.84,
    topicTags: [{ name: 'Hash Table' }, { name: 'Math' }, { name: 'String' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Google' }, { name: 'Amazon' }])
  },
  {
    frontendQuestionId: '20',
    title: 'Valid Parentheses',
    titleSlug: 'valid-parentheses',
    difficulty: 'Easy',
    acRate: 40.44,
    topicTags: [{ name: 'String' }, { name: 'Stack' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '21',
    title: 'Merge Two Sorted Lists',
    titleSlug: 'merge-two-sorted-lists',
    difficulty: 'Easy',
    acRate: 61.99,
    topicTags: [{ name: 'Linked List' }, { name: 'Recursion' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }, { name: 'Apple' }])
  },
  {
    frontendQuestionId: '26',
    title: 'Remove Duplicates from Sorted Array',
    titleSlug: 'remove-duplicates-from-sorted-array',
    difficulty: 'Easy',
    acRate: 51.01,
    topicTags: [{ name: 'Array' }, { name: 'Two Pointers' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Facebook' }, { name: 'Amazon' }])
  },
  {
    frontendQuestionId: '66',
    title: 'Plus One',
    titleSlug: 'plus-one',
    difficulty: 'Easy',
    acRate: 43.27,
    topicTags: [{ name: 'Array' }, { name: 'Math' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Google' }, { name: 'Amazon' }])
  },
  {
    frontendQuestionId: '88',
    title: 'Merge Sorted Array',
    titleSlug: 'merge-sorted-array',
    difficulty: 'Easy',
    acRate: 46.45,
    topicTags: [{ name: 'Array' }, { name: 'Two Pointers' }, { name: 'Sorting' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Facebook' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '104',
    title: 'Maximum Depth of Binary Tree',
    titleSlug: 'maximum-depth-of-binary-tree',
    difficulty: 'Easy',
    acRate: 74.09,
    topicTags: [{ name: 'Tree' }, { name: 'Depth-First Search' }, { name: 'Breadth-First Search' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '121',
    title: 'Best Time to Buy and Sell Stock',
    titleSlug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    acRate: 54.29,
    topicTags: [{ name: 'Array' }, { name: 'Dynamic Programming' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '125',
    title: 'Valid Palindrome',
    titleSlug: 'valid-palindrome',
    difficulty: 'Easy',
    acRate: 44.38,
    topicTags: [{ name: 'Two Pointers' }, { name: 'String' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Facebook' }, { name: 'Amazon' }])
  },
  {
    frontendQuestionId: '136',
    title: 'Single Number',
    titleSlug: 'single-number',
    difficulty: 'Easy',
    acRate: 70.56,
    topicTags: [{ name: 'Array' }, { name: 'Bit Manipulation' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Google' }, { name: 'Amazon' }])
  },
  {
    frontendQuestionId: '141',
    title: 'Linked List Cycle',
    titleSlug: 'linked-list-cycle',
    difficulty: 'Easy',
    acRate: 47.73,
    topicTags: [{ name: 'Hash Table' }, { name: 'Linked List' }, { name: 'Two Pointers' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }, { name: 'Apple' }])
  },
  {
    frontendQuestionId: '155',
    title: 'Min Stack',
    titleSlug: 'min-stack',
    difficulty: 'Easy',  
    acRate: 52.23,
    topicTags: [{ name: 'Stack' }, { name: 'Design' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '169',
    title: 'Majority Element',
    titleSlug: 'majority-element',
    difficulty: 'Easy',
    acRate: 64.45,
    topicTags: [{ name: 'Array' }, { name: 'Hash Table' }, { name: 'Divide and Conquer' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '206',
    title: 'Reverse Linked List',
    titleSlug: 'reverse-linked-list',
    difficulty: 'Easy',
    acRate: 72.98,
    topicTags: [{ name: 'Linked List' }, { name: 'Recursion' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '217',
    title: 'Contains Duplicate',
    titleSlug: 'contains-duplicate',
    difficulty: 'Easy',
    acRate: 61.36,
    topicTags: [{ name: 'Array' }, { name: 'Hash Table' }, { name: 'Sorting' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Apple' }])
  },
  {
    frontendQuestionId: '226',
    title: 'Invert Binary Tree',
    titleSlug: 'invert-binary-tree',
    difficulty: 'Easy',
    acRate: 74.89,
    topicTags: [{ name: 'Tree' }, { name: 'Depth-First Search' }, { name: 'Breadth-First Search' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Google' }, { name: 'Amazon' }])
  },
  {
    frontendQuestionId: '234',
    title: 'Palindrome Linked List',
    titleSlug: 'palindrome-linked-list',
    difficulty: 'Easy',
    acRate: 51.71,
    topicTags: [{ name: 'Linked List' }, { name: 'Two Pointers' }, { name: 'Stack' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '242',
    title: 'Valid Anagram',
    titleSlug: 'valid-anagram',
    difficulty: 'Easy',
    acRate: 63.82,
    topicTags: [{ name: 'Hash Table' }, { name: 'String' }, { name: 'Sorting' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '283',
    title: 'Move Zeroes',
    titleSlug: 'move-zeroes',
    difficulty: 'Easy',
    acRate: 61.89,
    topicTags: [{ name: 'Array' }, { name: 'Two Pointers' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Facebook' }, { name: 'Amazon' }])
  },
  {
    frontendQuestionId: '344',
    title: 'Reverse String',
    titleSlug: 'reverse-string',
    difficulty: 'Easy',
    acRate: 76.55,
    topicTags: [{ name: 'Two Pointers' }, { name: 'String' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '387',
    title: 'First Unique Character in a String',
    titleSlug: 'first-unique-character-in-a-string',
    difficulty: 'Easy',
    acRate: 58.94,
    topicTags: [{ name: 'Hash Table' }, { name: 'String' }, { name: 'Queue' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '448',
    title: 'Find All Numbers Disappeared in an Array',
    titleSlug: 'find-all-numbers-disappeared-in-an-array',
    difficulty: 'Easy',
    acRate: 59.44,
    topicTags: [{ name: 'Array' }, { name: 'Hash Table' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Google' }, { name: 'Amazon' }])
  },
  {
    frontendQuestionId: '543',
    title: 'Diameter of Binary Tree',
    titleSlug: 'diameter-of-binary-tree',
    difficulty: 'Easy',
    acRate: 56.44,
    topicTags: [{ name: 'Tree' }, { name: 'Depth-First Search' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '704',
    title: 'Binary Search',
    titleSlug: 'binary-search',
    difficulty: 'Easy',
    acRate: 55.70,
    topicTags: [{ name: 'Array' }, { name: 'Binary Search' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '724',
    title: 'Find Pivot Index',
    titleSlug: 'find-pivot-index',
    difficulty: 'Easy',
    acRate: 54.36,
    topicTags: [{ name: 'Array' }, { name: 'Prefix Sum' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '876',
    title: 'Middle of the Linked List',
    titleSlug: 'middle-of-the-linked-list',
    difficulty: 'Easy',
    acRate: 75.83,
    topicTags: [{ name: 'Linked List' }, { name: 'Two Pointers' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '1480',
    title: 'Running Sum of 1d Array',
    titleSlug: 'running-sum-of-1d-array',
    difficulty: 'Easy',
    acRate: 88.15,
    topicTags: [{ name: 'Array' }, { name: 'Prefix Sum' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }])
  },
  {
    frontendQuestionId: '1672',
    title: 'Richest Customer Wealth',
    titleSlug: 'richest-customer-wealth',
    difficulty: 'Easy',
    acRate: 87.95,
    topicTags: [{ name: 'Array' }, { name: 'Matrix' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }])
  },

  // Medium Problems (50)
  {
    frontendQuestionId: '2',
    title: 'Add Two Numbers',
    titleSlug: 'add-two-numbers',
    difficulty: 'Medium',
    acRate: 40.79,
    topicTags: [{ name: 'Linked List' }, { name: 'Math' }, { name: 'Recursion' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '3',
    title: 'Longest Substring Without Repeating Characters',
    titleSlug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    acRate: 34.08,
    topicTags: [{ name: 'Hash Table' }, { name: 'String' }, { name: 'Sliding Window' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '5',
    title: 'Longest Palindromic Substring',
    titleSlug: 'longest-palindromic-substring',
    difficulty: 'Medium',
    acRate: 32.86,
    topicTags: [{ name: 'String' }, { name: 'Dynamic Programming' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '11',
    title: 'Container With Most Water',
    titleSlug: 'container-with-most-water',
    difficulty: 'Medium',
    acRate: 54.05,
    topicTags: [{ name: 'Array' }, { name: 'Two Pointers' }, { name: 'Greedy' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '15',
    title: '3Sum',
    titleSlug: '3sum',
    difficulty: 'Medium',
    acRate: 32.61,
    topicTags: [{ name: 'Array' }, { name: 'Two Pointers' }, { name: 'Sorting' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '19',
    title: 'Remove Nth Node From End of List',
    titleSlug: 'remove-nth-node-from-end-of-list',
    difficulty: 'Medium',
    acRate: 42.77,
    topicTags: [{ name: 'Linked List' }, { name: 'Two Pointers' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '22',
    title: 'Generate Parentheses',
    titleSlug: 'generate-parentheses',
    difficulty: 'Medium',
    acRate: 72.96,
    topicTags: [{ name: 'String' }, { name: 'Dynamic Programming' }, { name: 'Backtracking' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Google' }, { name: 'Amazon' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '33',
    title: 'Search in Rotated Sorted Array',
    titleSlug: 'search-in-rotated-sorted-array',
    difficulty: 'Medium',
    acRate: 39.20,
    topicTags: [{ name: 'Array' }, { name: 'Binary Search' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '39',
    title: 'Combination Sum',
    titleSlug: 'combination-sum',
    difficulty: 'Medium',
    acRate: 69.57,
    topicTags: [{ name: 'Array' }, { name: 'Backtracking' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '46',
    title: 'Permutations',
    titleSlug: 'permutations',
    difficulty: 'Medium',
    acRate: 75.47,
    topicTags: [{ name: 'Array' }, { name: 'Backtracking' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '48',
    title: 'Rotate Image',
    titleSlug: 'rotate-image',
    difficulty: 'Medium',
    acRate: 70.89,
    topicTags: [{ name: 'Array' }, { name: 'Math' }, { name: 'Matrix' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }, { name: 'Apple' }])
  },
  {
    frontendQuestionId: '49',
    title: 'Group Anagrams',
    titleSlug: 'group-anagrams',
    difficulty: 'Medium',
    acRate: 67.17,
    topicTags: [{ name: 'Array' }, { name: 'Hash Table' }, { name: 'String' }, { name: 'Sorting' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '53',
    title: 'Maximum Subarray',
    titleSlug: 'maximum-subarray',
    difficulty: 'Medium',
    acRate: 50.20,
    topicTags: [{ name: 'Array' }, { name: 'Divide and Conquer' }, { name: 'Dynamic Programming' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '54',
    title: 'Spiral Matrix',
    titleSlug: 'spiral-matrix',
    difficulty: 'Medium',
    acRate: 46.06,
    topicTags: [{ name: 'Array' }, { name: 'Matrix' }, { name: 'Simulation' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '55',
    title: 'Jump Game',
    titleSlug: 'jump-game',
    difficulty: 'Medium',
    acRate: 38.26,
    topicTags: [{ name: 'Array' }, { name: 'Dynamic Programming' }, { name: 'Greedy' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '56',
    title: 'Merge Intervals',
    titleSlug: 'merge-intervals',
    difficulty: 'Medium',
    acRate: 46.51,
    topicTags: [{ name: 'Array' }, { name: 'Sorting' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Facebook' }, { name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '62',
    title: 'Unique Paths',
    titleSlug: 'unique-paths',
    difficulty: 'Medium',
    acRate: 63.21,
    topicTags: [{ name: 'Math' }, { name: 'Dynamic Programming' }, { name: 'Combinatorics' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '73',
    title: 'Set Matrix Zeroes',
    titleSlug: 'set-matrix-zeroes',
    difficulty: 'Medium',
    acRate: 51.44,
    topicTags: [{ name: 'Array' }, { name: 'Hash Table' }, { name: 'Matrix' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '75',
    title: 'Sort Colors',
    titleSlug: 'sort-colors',
    difficulty: 'Medium',
    acRate: 60.12,
    topicTags: [{ name: 'Array' }, { name: 'Two Pointers' }, { name: 'Sorting' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Facebook' }, { name: 'Amazon' }])
  },
  {
    frontendQuestionId: '78',
    title: 'Subsets',
    titleSlug: 'subsets',
    difficulty: 'Medium',
    acRate: 75.56,
    topicTags: [{ name: 'Array' }, { name: 'Backtracking' }, { name: 'Bit Manipulation' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '79',
    title: 'Word Search',
    titleSlug: 'word-search',
    difficulty: 'Medium',
    acRate: 40.54,
    topicTags: [{ name: 'Array' }, { name: 'Backtracking' }, { name: 'Matrix' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '91',
    title: 'Decode Ways',
    titleSlug: 'decode-ways',
    difficulty: 'Medium',
    acRate: 32.52,
    topicTags: [{ name: 'String' }, { name: 'Dynamic Programming' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Facebook' }, { name: 'Amazon' }])
  },
  {
    frontendQuestionId: '98',
    title: 'Validate Binary Search Tree',
    titleSlug: 'validate-binary-search-tree',
    difficulty: 'Medium',
    acRate: 31.69,
    topicTags: [{ name: 'Tree' }, { name: 'Depth-First Search' }, { name: 'Binary Search Tree' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '102',
    title: 'Binary Tree Level Order Traversal',
    titleSlug: 'binary-tree-level-order-traversal',
    difficulty: 'Medium',
    acRate: 65.29,
    topicTags: [{ name: 'Tree' }, { name: 'Breadth-First Search' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Microsoft' }, { name: 'Amazon' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '105',
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    titleSlug: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    difficulty: 'Medium',
    acRate: 61.32,
    topicTags: [{ name: 'Array' }, { name: 'Hash Table' }, { name: 'Divide and Conquer' }, { name: 'Tree' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '127',
    title: 'Word Ladder',
    titleSlug: 'word-ladder',
    difficulty: 'Hard',
    acRate: 38.21,
    topicTags: [{ name: 'Hash Table' }, { name: 'String' }, { name: 'Breadth-First Search' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '128',
    title: 'Longest Consecutive Sequence',
    titleSlug: 'longest-consecutive-sequence',
    difficulty: 'Medium',
    acRate: 47.37,
    topicTags: [{ name: 'Array' }, { name: 'Hash Table' }, { name: 'Union Find' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Google' }, { name: 'Facebook' }, { name: 'Amazon' }])
  },
  {
    frontendQuestionId: '139',
    title: 'Word Break',
    titleSlug: 'word-break',
    difficulty: 'Medium',
    acRate: 45.60,
    topicTags: [{ name: 'Hash Table' }, { name: 'String' }, { name: 'Dynamic Programming' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '143',
    title: 'Reorder List',
    titleSlug: 'reorder-list',
    difficulty: 'Medium',
    acRate: 53.82,
    topicTags: [{ name: 'Linked List' }, { name: 'Two Pointers' }, { name: 'Stack' }, { name: 'Recursion' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '146',
    title: 'LRU Cache',
    titleSlug: 'lru-cache',
    difficulty: 'Medium',
    acRate: 41.88,
    topicTags: [{ name: 'Hash Table' }, { name: 'Linked List' }, { name: 'Design' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '198',
    title: 'House Robber',
    titleSlug: 'house-robber',
    difficulty: 'Medium',
    acRate: 49.78,
    topicTags: [{ name: 'Array' }, { name: 'Dynamic Programming' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '200',
    title: 'Number of Islands',
    titleSlug: 'number-of-islands',
    difficulty: 'Medium',
    acRate: 57.87,
    topicTags: [{ name: 'Array' }, { name: 'Depth-First Search' }, { name: 'Breadth-First Search' }, { name: 'Union Find' }, { name: 'Matrix' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '207',
    title: 'Course Schedule',
    titleSlug: 'course-schedule',
    difficulty: 'Medium',
    acRate: 45.48,
    topicTags: [{ name: 'Depth-First Search' }, { name: 'Breadth-First Search' }, { name: 'Graph' }, { name: 'Topological Sort' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '208',
    title: 'Implement Trie (Prefix Tree)',
    titleSlug: 'implement-trie-prefix-tree',
    difficulty: 'Medium',
    acRate: 62.76,
    topicTags: [{ name: 'Hash Table' }, { name: 'String' }, { name: 'Design' }, { name: 'Trie' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '215',
    title: 'Kth Largest Element in an Array',
    titleSlug: 'kth-largest-element-in-an-array',
    difficulty: 'Medium',
    acRate: 66.28,
    topicTags: [{ name: 'Array' }, { name: 'Divide and Conquer' }, { name: 'Sorting' }, { name: 'Heap' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Facebook' }, { name: 'Amazon' }])
  },
  {
    frontendQuestionId: '221',
    title: 'Maximal Square',
    titleSlug: 'maximal-square',
    difficulty: 'Medium',
    acRate: 44.64,
    topicTags: [{ name: 'Array' }, { name: 'Dynamic Programming' }, { name: 'Matrix' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Apple' }])
  },
  {
    frontendQuestionId: '230',
    title: 'Kth Smallest Element in a BST',
    titleSlug: 'kth-smallest-element-in-a-bst',
    difficulty: 'Medium',
    acRate: 70.78,
    topicTags: [{ name: 'Tree' }, { name: 'Depth-First Search' }, { name: 'Binary Search Tree' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '236',
    title: 'Lowest Common Ancestor of a Binary Tree',
    titleSlug: 'lowest-common-ancestor-of-a-binary-tree',
    difficulty: 'Medium',
    acRate: 59.73,
    topicTags: [{ name: 'Tree' }, { name: 'Depth-First Search' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Facebook' }, { name: 'Amazon' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '238',
    title: 'Product of Array Except Self',
    titleSlug: 'product-of-array-except-self',
    difficulty: 'Medium',
    acRate: 64.69,
    topicTags: [{ name: 'Array' }, { name: 'Prefix Sum' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '253',
    title: 'Meeting Rooms II',
    titleSlug: 'meeting-rooms-ii',
    difficulty: 'Medium',
    acRate: 49.62,
    topicTags: [{ name: 'Array' }, { name: 'Two Pointers' }, { name: 'Sorting' }, { name: 'Heap' }],
    paidOnly: true,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '279',
    title: 'Perfect Squares',
    titleSlug: 'perfect-squares',
    difficulty: 'Medium',
    acRate: 52.23,
    topicTags: [{ name: 'Math' }, { name: 'Dynamic Programming' }, { name: 'Breadth-First Search' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '287',
    title: 'Find the Duplicate Number',
    titleSlug: 'find-the-duplicate-number',
    difficulty: 'Medium',
    acRate: 59.43,
    topicTags: [{ name: 'Array' }, { name: 'Two Pointers' }, { name: 'Binary Search' }, { name: 'Bit Manipulation' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '300',
    title: 'Longest Increasing Subsequence',
    titleSlug: 'longest-increasing-subsequence',
    difficulty: 'Medium',
    acRate: 52.78,
    topicTags: [{ name: 'Array' }, { name: 'Binary Search' }, { name: 'Dynamic Programming' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '322',
    title: 'Coin Change',
    titleSlug: 'coin-change',
    difficulty: 'Medium',
    acRate: 42.43,
    topicTags: [{ name: 'Array' }, { name: 'Dynamic Programming' }, { name: 'Breadth-First Search' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '347',
    title: 'Top K Frequent Elements',
    titleSlug: 'top-k-frequent-elements',
    difficulty: 'Medium',
    acRate: 64.73,
    topicTags: [{ name: 'Array' }, { name: 'Hash Table' }, { name: 'Divide and Conquer' }, { name: 'Sorting' }, { name: 'Heap' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '416',
    title: 'Partition Equal Subset Sum',
    titleSlug: 'partition-equal-subset-sum',
    difficulty: 'Medium',
    acRate: 46.35,
    topicTags: [{ name: 'Array' }, { name: 'Dynamic Programming' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '438',
    title: 'Find All Anagrams in a String',
    titleSlug: 'find-all-anagrams-in-a-string',
    difficulty: 'Medium',
    acRate: 49.59,
    topicTags: [{ name: 'Hash Table' }, { name: 'String' }, { name: 'Sliding Window' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '494',
    title: 'Target Sum',
    titleSlug: 'target-sum',
    difficulty: 'Medium',
    acRate: 45.96,
    topicTags: [{ name: 'Array' }, { name: 'Dynamic Programming' }, { name: 'Backtracking' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Facebook' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '518',
    title: 'Coin Change II',
    titleSlug: 'coin-change-ii',
    difficulty: 'Medium',
    acRate: 62.32,
    topicTags: [{ name: 'Array' }, { name: 'Dynamic Programming' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }])
  },
  {
    frontendQuestionId: '572',
    title: 'Subtree of Another Tree',
    titleSlug: 'subtree-of-another-tree',
    difficulty: 'Easy',
    acRate: 47.02,
    topicTags: [{ name: 'Tree' }, { name: 'Depth-First Search' }, { name: 'Binary Tree' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }])
  },

  // Hard Problems (20)
  {
    frontendQuestionId: '4',
    title: 'Median of Two Sorted Arrays',
    titleSlug: 'median-of-two-sorted-arrays',
    difficulty: 'Hard',
    acRate: 37.32,
    topicTags: [{ name: 'Array' }, { name: 'Binary Search' }, { name: 'Divide and Conquer' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Google' }, { name: 'Amazon' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '23',
    title: 'Merge k Sorted Lists',
    titleSlug: 'merge-k-sorted-lists',
    difficulty: 'Hard',
    acRate: 51.46,
    topicTags: [{ name: 'Linked List' }, { name: 'Divide and Conquer' }, { name: 'Heap' }, { name: 'Merge Sort' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '32',
    title: 'Longest Valid Parentheses',
    titleSlug: 'longest-valid-parentheses',
    difficulty: 'Hard',
    acRate: 32.76,
    topicTags: [{ name: 'String' }, { name: 'Dynamic Programming' }, { name: 'Stack' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '42',
    title: 'Trapping Rain Water',
    titleSlug: 'trapping-rain-water',
    difficulty: 'Hard',
    acRate: 58.64,
    topicTags: [{ name: 'Array' }, { name: 'Two Pointers' }, { name: 'Dynamic Programming' }, { name: 'Stack' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }, { name: 'Bloomberg' }])
  },
  {
    frontendQuestionId: '51',
    title: 'N-Queens',
    titleSlug: 'n-queens',
    difficulty: 'Hard',
    acRate: 65.91,
    topicTags: [{ name: 'Array' }, { name: 'Backtracking' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '72',
    title: 'Edit Distance',
    titleSlug: 'edit-distance',
    difficulty: 'Medium',
    acRate: 53.86,
    topicTags: [{ name: 'String' }, { name: 'Dynamic Programming' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Google' }, { name: 'Amazon' }, { name: 'Microsoft' }])
  },
  {
    frontendQuestionId: '76',
    title: 'Minimum Window Substring',
    titleSlug: 'minimum-window-substring',
    difficulty: 'Hard',
    acRate: 40.61,
    topicTags: [{ name: 'Hash Table' }, { name: 'String' }, { name: 'Sliding Window' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Uber' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '84',
    title: 'Largest Rectangle in Histogram',
    titleSlug: 'largest-rectangle-in-histogram',
    difficulty: 'Hard',
    acRate: 42.58,
    topicTags: [{ name: 'Array' }, { name: 'Stack' }, { name: 'Monotonic Stack' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '85',
    title: 'Maximal Rectangle',
    titleSlug: 'maximal-rectangle',
    difficulty: 'Hard',
    acRate: 45.03,
    topicTags: [{ name: 'Array' }, { name: 'Dynamic Programming' }, { name: 'Stack' }, { name: 'Matrix' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '124',
    title: 'Binary Tree Maximum Path Sum',
    titleSlug: 'binary-tree-maximum-path-sum',
    difficulty: 'Hard',
    acRate: 39.19,
    topicTags: [{ name: 'Dynamic Programming' }, { name: 'Tree' }, { name: 'Depth-First Search' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Facebook' }, { name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '140',
    title: 'Word Break II',
    titleSlug: 'word-break-ii',
    difficulty: 'Hard',
    acRate: 46.09,
    topicTags: [{ name: 'Array' }, { name: 'Hash Table' }, { name: 'String' }, { name: 'Dynamic Programming' }, { name: 'Backtracking' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '212',
    title: 'Word Search II',
    titleSlug: 'word-search-ii',
    difficulty: 'Hard',
    acRate: 37.11,
    topicTags: [{ name: 'Array' }, { name: 'String' }, { name: 'Backtracking' }, { name: 'Trie' }, { name: 'Matrix' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }, { name: 'Airbnb' }])
  },
  {
    frontendQuestionId: '224',
    title: 'Basic Calculator',
    titleSlug: 'basic-calculator',
    difficulty: 'Hard',
    acRate: 42.54,
    topicTags: [{ name: 'Math' }, { name: 'String' }, { name: 'Stack' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '239',
    title: 'Sliding Window Maximum',
    titleSlug: 'sliding-window-maximum',
    difficulty: 'Hard',
    acRate: 45.83,
    topicTags: [{ name: 'Array' }, { name: 'Queue' }, { name: 'Sliding Window' }, { name: 'Heap' }, { name: 'Monotonic Queue' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }, { name: 'ByteDance' }])
  },
  {
    frontendQuestionId: '295',
    title: 'Find Median from Data Stream',
    titleSlug: 'find-median-from-data-stream',
    difficulty: 'Hard',
    acRate: 51.60,
    topicTags: [{ name: 'Two Pointers' }, { name: 'Design' }, { name: 'Sorting' }, { name: 'Heap' }, { name: 'Data Stream' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '297',
    title: 'Serialize and Deserialize Binary Tree',
    titleSlug: 'serialize-and-deserialize-binary-tree',
    difficulty: 'Hard',
    acRate: 56.15,
    topicTags: [{ name: 'String' }, { name: 'Tree' }, { name: 'Depth-First Search' }, { name: 'Breadth-First Search' }, { name: 'Design' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Microsoft' }, { name: 'Facebook' }])
  },
  {
    frontendQuestionId: '301',
    title: 'Remove Invalid Parentheses',
    titleSlug: 'remove-invalid-parentheses',
    difficulty: 'Hard',
    acRate: 46.64,
    topicTags: [{ name: 'String' }, { name: 'Backtracking' }, { name: 'Breadth-First Search' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Facebook' }, { name: 'Amazon' }])
  },
  {
    frontendQuestionId: '312',
    title: 'Burst Balloons',
    titleSlug: 'burst-balloons',
    difficulty: 'Hard',
    acRate: 58.70,
    topicTags: [{ name: 'Array' }, { name: 'Dynamic Programming' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }])
  },
  {
    frontendQuestionId: '329',
    title: 'Longest Increasing Path in a Matrix',
    titleSlug: 'longest-increasing-path-in-a-matrix',
    difficulty: 'Hard',
    acRate: 51.84,
    topicTags: [{ name: 'Dynamic Programming' }, { name: 'Depth-First Search' }, { name: 'Breadth-First Search' }, { name: 'Graph' }, { name: 'Topological Sort' }, { name: 'Memoization' }, { name: 'Matrix' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }, { name: 'Google' }])
  },
  {
    frontendQuestionId: '403',
    title: 'Frog Jump',
    titleSlug: 'frog-jump',
    difficulty: 'Hard',
    acRate: 45.09,
    topicTags: [{ name: 'Array' }, { name: 'Dynamic Programming' }],
    paidOnly: false,
    companyTagStats: JSON.stringify([{ name: 'Amazon' }])
  }
];
