// Sample data to populate your Appwrite database
// You can use this in Appwrite Console or via the REST API

export const SAMPLE_PROBLEMS = [
  {
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    acceptance: 48.5,
    companies: JSON.stringify(["Google", "Amazon", "Microsoft", "Facebook"]),
    tags: JSON.stringify(["Array", "Hash Map"]),
    description: "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.",
    examples: JSON.stringify([
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      }
    ]),
    constraints: JSON.stringify([
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9"
    ]),
    starterCode: JSON.stringify({
      python: "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        ",
      javascript: "function twoSum(nums, target) {\n    \n}",
      java: "class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        \n    }\n}"
    }),
    testCases: JSON.stringify([
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
      { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, expected: [0, 1] }
    ]),
    hints: JSON.stringify([
      "Try using a Hash Map to store complement values",
      "For each number, check if target - number exists in the map"
    ])
  },
  {
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    acceptance: 62.1,
    companies: JSON.stringify(["Google", "Amazon", "Microsoft"]),
    tags: JSON.stringify(["Stack", "String"]),
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid. An input string is valid if: Open brackets must be closed by the same type of brackets. Open brackets must be closed in the correct order.",
    examples: JSON.stringify([
      { input: 's = "()"', output: "true" },
      { input: 's = "()[]{}"', output: "true" },
      { input: 's = "(]"', output: "false" }
    ]),
    constraints: JSON.stringify(["1 <= s.length <= 10^4"]),
    starterCode: JSON.stringify({
      python: "class Solution:\n    def isValid(self, s: str) -> bool:\n        ",
      javascript: "function isValid(s) {\n    \n}",
      java: "class Solution {\n    public boolean isValid(String s) {\n        \n    }\n}"
    }),
    testCases: JSON.stringify([
      { input: { s: "()" }, expected: true },
      { input: { s: "()[]{}" }, expected: true },
      { input: { s: "(]" }, expected: false }
    ]),
    hints: JSON.stringify(["Use a stack data structure", "Push opening brackets, pop when closing brackets match"])
  },
  {
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    difficulty: "Easy",
    acceptance: 54.3,
    companies: JSON.stringify(["Amazon", "Microsoft", "Adobe"]),
    tags: JSON.stringify(["Linked List", "Recursion"]),
    description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.",
    examples: JSON.stringify([
      { input: "list1 = [1,2,4], list2 = [1,3,4]", output: "[1,1,2,3,4,4]" }
    ]),
    constraints: JSON.stringify(["The number of nodes in both lists is in the range [0, 50]"]),
    starterCode: JSON.stringify({
      python: "class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        ",
      javascript: "function mergeTwoLists(list1, list2) {\n    \n}"
    }),
    testCases: JSON.stringify([]),
    hints: JSON.stringify(["Use a dummy node", "Compare values from both lists"])
  }
];

export const SAMPLE_COMPANIES = [
  {
    slug: "google",
    name: "Google",
    avgPackage: "₹42 LPA",
    role: "SDE-1",
    status: "Hiring",
    focusAreas: JSON.stringify(["DSA", "System Design", "Behavioral"]),
    description: "World's top tech company focused on search, cloud, and AI innovation. Known for excellent work culture and challenging technical interviews.",
    techStack: JSON.stringify(["Python", "Java", "C++", "Go", "TypeScript"]),
    interviewProcess: JSON.stringify([
      "Online Assessment (2 coding problems)",
      "Phone Screen (1 hour coding)",
      "Onsite Rounds (4-5 rounds)",
      "System Design",
      "Behavioral"
    ])
  },
  {
    slug: "amazon",
    name: "Amazon",
    avgPackage: "₹28 LPA",
    role: "SDE-1",
    status: "Hiring",
    focusAreas: JSON.stringify(["DSA", "Leadership Principles", "OOP Design"]),
    description: "E-commerce and cloud computing giant. Focuses heavily on leadership principles and coding fundamentals.",
    techStack: JSON.stringify(["Java", "Python", "C++", "Ruby"]),
    interviewProcess: JSON.stringify([
      "Online Assessment",
      "Technical Phone Screen",
      "Virtual Onsite (4 rounds)",
      "Bar Raiser Round"
    ])
  },
  {
    slug: "microsoft",
    name: "Microsoft",
    avgPackage: "₹40 LPA",
    role: "SDE",
    status: "Hiring",
    focusAreas: JSON.stringify(["DSA", "System Design", "Product Thinking"]),
    description: "Leading software company known for Windows, Azure, Office. Excellent benefits and work-life balance.",
    techStack: JSON.stringify(["C#", "TypeScript", "Python", "C++"]),
    interviewProcess: JSON.stringify([
      "Online Assessment",
      "Phone Screen",
      "Final Loop (4-5 rounds)",
      "As Appropriate (AA) Round"
    ])
  },
  {
    slug: "swiggy",
    name: "Swiggy",
    avgPackage: "₹23 LPA",
    role: "SDE-1",
    status: "Soon",
    focusAreas: JSON.stringify(["DSA", "LLD", "Product Development"]),
    description: "India's leading food delivery platform. Fast-paced startup environment with rapid growth.",
    techStack: JSON.stringify(["Python", "Go", "JavaScript", "React"]),
    interviewProcess: JSON.stringify([
      "Coding Round",
      "Technical Interview 1",
      "Technical Interview 2",
      "Hiring Manager Round"
    ])
  },
  {
    slug: "flipkart",
    name: "Flipkart",
    avgPackage: "₹22 LPA",
    role: "SDE-1",
    status: "Hiring",
    focusAreas: JSON.stringify(["DSA", "System Design", "E-commerce Domain"]),
    description: "India's largest e-commerce marketplace. Part of Walmart, excellent learning opportunities.",
    techStack: JSON.stringify(["Java", "Python", "React", "Node.js"]),
    interviewProcess: JSON.stringify([
      "Online Test",
      "Technical Round 1",
      "Technical Round 2",
      "Hiring Manager"
    ])
  }
];

// To use this data:
// 1. Go to Appwrite Console → Databases → placementgpt
// 2. Click on a collection (e.g., "problems")
// 3. Click "Add Document"
// 4. Copy-paste the JSON from SAMPLE_PROBLEMS or SAMPLE_COMPANIES
// 5. Appwrite will auto-generate Document ID

console.log('Sample Problems:', SAMPLE_PROBLEMS.length);
console.log('Sample Companies:', SAMPLE_COMPANIES.length);
