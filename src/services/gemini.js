import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI;
let model;

// Initialize Gemini
if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-pro' });
} else {
  console.warn('Gemini API key not found. AI features will be disabled.');
}

// ============================================
// STATEFUL CHAT SESSION
// ============================================

export const gemini = {
  chatSession: null,
  
  async startChat(systemPrompt) {
    if (!genAI) {
      throw new Error('Gemini API not initialized');
    }
    
    const chatModel = genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: {
        temperature: 0.7,
        topP: 1,
        topK: 40,
        maxOutputTokens: 2048,
      }
    });
    
    this.chatSession = chatModel.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: systemPrompt }]
        },
        {
          role: "model",
          parts: [{ text: "Understood. I'm ready to help with placement preparation interviews. I'll provide thoughtful questions and constructive feedback." }]
        }
      ]
    });
    
    return this.chatSession;
  },
  
  async sendMessage(message) {
    if (!this.chatSession) {
      throw new Error('Chat session not started. Call startChat() first.');
    }
    
    const result = await this.chatSession.sendMessage(message);
    const response = await result.response;
    return response.text();
  },
  
  clearChat() {
    this.chatSession = null;
  }
};

// ============================================
// CORE AI FUNCTIONS
// ============================================

/**
 * Generate personalized placement roadmap
 */
export async function generateRoadmap(college, branch, targetCompanies, cgpa, skills = []) {
  if (!model) {
    return getMockRoadmap();
  }

  try {
    const prompt = `
You are an expert placement preparation coach. Create a detailed 12-week preparation roadmap for a student with the following profile:

- College: ${college}
- Branch: ${branch}
- Target Companies: ${targetCompanies.join(', ')}
- CGPA: ${cgpa}
- Current Skills: ${skills.join(', ') || 'None specified'}

Return a JSON object with this structure:
{
  "weeks": [
    {
      "week": 1,
      "title": "Week title",
      "focus": ["Focus area 1", "Focus area 2"],
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "problems": ["Problem type 1", "Problem type 2"],
      "goals": "Weekly goal description"
    }
  ],
  "tips": ["Tip 1", "Tip 2", "Tip 3"],
  "resources": ["Resource 1", "Resource 2"]
}

Make it specific to the target companies' interview patterns. Focus on DSA, System Design, and behavioral preparation.
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Try to parse JSON from response
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse roadmap JSON:', e);
    }
    
    return getMockRoadmap();
  } catch (error) {
    console.error('Gemini roadmap error:', error);
    return getMockRoadmap();
  }
}

/**
 * Generate AI hint for a problem
 */
export async function generateHint(problemTitle, problemDescription, userCode = '', attemptNumber = 1) {
  if (!model) {
    return getMockHint(attemptNumber);
  }

  try {
    const prompt = `
You are a coding mentor helping a student solve: "${problemTitle}"

Problem: ${problemDescription}

${userCode ? `Student's current code:\n\`\`\`\n${userCode}\n\`\`\`` : 'Student hasn\'t started coding yet.'}

This is hint request #${attemptNumber}. Provide a ${attemptNumber === 1 ? 'gentle nudge' : attemptNumber === 2 ? 'more specific hint' : 'clearer hint'} that helps them think through the solution without giving away the complete answer.

Keep the hint to 2-3 sentences maximum.
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini hint error:', error);
    return getMockHint(attemptNumber);
  }
}

/**
 * Analyze resume and provide ATS optimization suggestions
 */
export async function analyzeResume(resumeText, targetRole = 'Software Developer') {
  if (!model) {
    return getMockResumeAnalysis();
  }

  try {
    const prompt = `
You are an ATS (Applicant Tracking System) expert and resume consultant. Analyze this resume for a ${targetRole} position.

Resume content:
${resumeText}

Provide a detailed analysis with:
1. ATS Parsability Score (0-100)
2. Relevance Score (0-100) 
3. Missing critical keywords for this role
4. Formatting issues
5. 3-5 specific improvement suggestions
6. Rewritten bullet points that are ATS-friendly

Return as JSON:
{
  "atsScore": 75,
  "relevanceScore": 65,
  "missingKeywords": ["keyword1", "keyword2"],
  "formattingIssues": ["issue1", "issue2"],
  "suggestions": [
    {
      "category": "Impact",
      "original": "Worked on backend APIs",
      "improved": "Architected scalable backend microservices handling 10K+ requests",
      "impact": "+15 score"
    }
  ],
  "overallFeedback": "Brief summary"
}
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    try {
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (e) {
      console.error('Failed to parse resume analysis JSON:', e);
    }
    
    return getMockResumeAnalysis();
  } catch (error) {
    console.error('Gemini resume analysis error:', error);
    return getMockResumeAnalysis();
  }
}

/**
 * Conduct mock interview
 */
export async function conductMockInterview(type, company, conversationHistory = []) {
  if (!model) {
    return getMockInterviewResponse(type);
  }

  try {
    const systemPrompt = `
You are conducting a ${type} interview for ${company}. 
${type === 'dsa' ? 'Ask coding questions and evaluate solutions.' : ''}
${type === 'system_design' ? 'Ask system design questions and guide through architecture.' : ''}
${type === 'behavioral' ? 'Ask behavioral questions using STAR method.' : ''}

Keep responses concise and professional. Provide constructive feedback.
    `.trim();

    const messages = [
      systemPrompt,
      ...conversationHistory.map(msg => `${msg.role}: ${msg.content}`),
    ].join('\n\n');

    const result = await model.generateContent(messages);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini interview error:', error);
    return getMockInterviewResponse(type);
  }
}

/**
 * Generate problem editorial/solution explanation
 */
export async function generateEditorial(problemTitle, problemDescription, solution) {
  if (!model) {
    return 'Editorial generation requires Gemini API key. Please add your key to .env file.';
  }

  try {
    const prompt = `
Explain the solution to this coding problem in a clear, educational way:

Problem: ${problemTitle}
Description: ${problemDescription}

Solution approach:
${solution}

Provide:
1. Intuition (why this approach works)
2. Step-by-step algorithm
3. Time and space complexity analysis
4. Key insights and patterns

Keep it concise but thorough.
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini editorial error:', error);
    return 'Failed to generate editorial. Please try again.';
  }
}

// ============================================
// MOCK RESPONSES (Fallback when API unavailable)
// ============================================

function getMockRoadmap() {
  return {
    weeks: [
      {
        week: 1,
        title: 'Arrays & Strings Fundamentals',
        focus: ['Two Pointers', 'Sliding Window'],
        topics: ['Array manipulation', 'String operations', 'Hash Maps'],
        problems: ['Two Sum', 'Longest Substring', 'Container With Most Water'],
        goals: 'Master basic array and string manipulations. Solve 10 easy problems.'
      },
      {
        week: 2,
        title: 'Linked Lists & Stacks',
        focus: ['Linked List Operations', 'Stack Applications'],
        topics: ['Fast & Slow pointers', 'Reverse operations', 'Stack-based problems'],
        problems: ['Reverse Linked List', 'Detect Cycle', 'Valid Parentheses'],
        goals: 'Understand pointer manipulation. Solve 8 medium problems.'
      },
      // ... more weeks
    ],
    tips: [
      'Consistency is key - practice daily',
      'Focus on understanding, not memorizing',
      'Review solved problems weekly',
    ],
    resources: [
      'Leetcode company tags',
      'System Design Primer',
      'Cracking the Coding Interview',
    ]
  };
}

function getMockHint(attemptNumber) {
  const hints = [
    'Think about using a hash map to store values you\'ve seen.',
    'Consider the time complexity - can you optimize using extra space?',
    'Try using two pointers or a sliding window approach.',
  ];
  return hints[Math.min(attemptNumber - 1, hints.length - 1)];
}

function getMockResumeAnalysis() {
  return {
    atsScore: 72,
    relevanceScore: 68,
    missingKeywords: ['AWS', 'Docker', 'System Design', 'Microservices'],
    formattingIssues: [
      'Date formats are inconsistent. Use MMM YYYY consistently.',
      'Avoid tables and complex formatting that confuses ATS.'
    ],
    suggestions: [
      {
        category: 'Impact Missing',
        original: 'Worked on backend APIs using Node.js',
        improved: 'Architected scalable backend microservices using Node.js, handling 10K+ daily requests',
        impact: '+15 Score'
      },
      {
        category: 'Missing Keywords',
        original: 'Built web application',
        improved: 'Developed full-stack web application using React, Node.js, and MongoDB with RESTful APIs',
        impact: '+10 Score'
      },
    ],
    overallFeedback: 'Your resume has good content but needs ATS optimization. Add more technical keywords and quantify your achievements with metrics.'
  };
}

function getMockInterviewResponse(type) {
  const responses = {
    dsa: "Let's start with a classic array problem. Can you solve the Two Sum problem? Given an array of integers and a target sum, return indices of two numbers that add up to the target.",
    system_design: "Let's design a URL shortener like bit.ly. Start by telling me: What are the key requirements and constraints you'd consider?",
    behavioral: "Tell me about a time when you had to work with a difficult team member. How did you handle it?"
  };
  return responses[type] || responses.dsa;
}

export default {
  generateRoadmap,
  generateHint,
  analyzeResume,
  conductMockInterview,
  generateEditorial,
};
