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
    if (!genAI || !API_KEY) {
      throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
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
    
    if (!genAI || !API_KEY) {
      throw new Error('Gemini API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.');
    }
    
    try {
      const result = await this.chatSession.sendMessage(message);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error('Gemini API error:', error);
      if (error.message?.includes('API_KEY_INVALID')) {
        throw new Error('Invalid Gemini API key. Please check your .env file.');
      }
      throw error;
    }
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
    console.warn('Gemini model not available, using mock data');
    return getMockResumeAnalysis();
  }

  try {
    const prompt = `
You are an ATS (Applicant Tracking System) expert and resume consultant. Analyze this resume for a ${targetRole} position.

Resume content:
${resumeText}

Provide a detailed analysis with:
1. ATS Parsability Score (0-100) - How well can ATS systems read this resume?
2. Relevance Score (0-100) - How relevant is the content for ${targetRole}?
3. Brevity Score (1-10) - How concise and well-structured is it?
4. Missing critical keywords for this role
5. Specific improvement suggestions

Return ONLY valid JSON (no markdown formatting):
{
  "atsScore": 75,
  "relevanceScore": 65,
  "brevityScore": 8,
  "missingKeywords": ["Docker", "AWS", "Kubernetes"],
  "suggestions": [
    {
      "original": "Worked on backend APIs",
      "improved": "Architected scalable backend microservices handling 10K+ requests using Node.js",
      "scoreImpact": "+15 points"
    }
  ],
  "strengths": ["Clear structure", "Quantified achievements"]
}
    `.trim();

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean any markdown formatting
    let cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Try to parse JSON
    let parsedData;
    try {
      const jsonMatch = cleanText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsedData = JSON.parse(jsonMatch[0]);
        
        // Calculate overall score from component scores
        const overallScore = (
          (parsedData.atsScore || 70) * 0.4 + 
          (parsedData.relevanceScore || 60) * 0.4 + 
          (parsedData.brevityScore || 7) * 10 * 0.2
        ) / 10;
        
        parsedData.score = Math.round(overallScore * 10) / 10;
        
        return parsedData;
      }
    } catch (e) {
      console.error('Failed to parse resume analysis JSON:', e);
      console.log('Raw response:', text);
    }
    
    console.warn('Using mock resume analysis due to parsing failure');
    return getMockResumeAnalysis();
  } catch (error) {
    console.error('Gemini resume analysis error:', error);
    throw error; // Re-throw to let caller handle it
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
    score: 7.2,
    atsScore: 72,
    relevanceScore: 68,
    brevityScore: 8,
    missingKeywords: ['AWS', 'Docker', 'System Design', 'Microservices'],
    suggestions: [
      {
        original: 'Worked on backend APIs using Node.js',
        improved: 'Architected scalable backend microservices using Node.js, handling 10K+ daily requests',
        scoreImpact: '+15 points'
      },
      {
        original: 'Built web application',
        improved: 'Developed full-stack web application using React, Node.js, and MongoDB with RESTful APIs',
        scoreImpact: '+10 points'
      },
    ],
    strengths: [
      'Clear formatting and structure',
      'Good technical terminology',
      'Relevant experience listed'
    ]
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
