import { FALLBACK_PROBLEMS } from '../data/fallbackProblems';

const LEETCODE_API = 'https://leetcode.com/graphql';

/**
 * LeetCode API Service
 * Fetches real problems from LeetCode via GraphQL
 */
export const leetcode = {
  /**
   * Fetch list of problems
   * @param {number} limit - Number of problems to fetch
   * @param {number} skip - Number of problems to skip
   * @returns {Promise<Array>} List of problems
   */
  async fetchProblems(limit = 100, skip = 0) {
    try {
      const query = `
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
          problemsetQuestionList: questionList(
            categorySlug: $categorySlug
            limit: $limit
            skip: $skip
            filters: $filters
          ) {
            total: totalNum
            questions: data {
              acRate
              difficulty
              freqBar
              frontendQuestionId: questionFrontendId
              isFavor
              paidOnly: isPaidOnly
              status
              title
              titleSlug
              topicTags {
                name
                slug
              }
              companyTagStats
            }
          }
        }
      `;
      
      const response = await fetch(LEETCODE_API, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com'
        },
        body: JSON.stringify({
          query,
          variables: { 
            categorySlug: "", 
            limit, 
            skip,
            filters: {}
          }
        })
      });
      
      if (!response.ok) {
        throw new Error(`LeetCode API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`GraphQL error: ${data.errors[0].message}`);
      }
      
      return data.data.problemsetQuestionList.questions;
    } catch (error) {
      console.error('Failed to fetch LeetCode problems:', error);
      console.log('Using fallback problem data...');
      // Return fallback data when API fails (CORS, rate limit, etc.)
      return FALLBACK_PROBLEMS.slice(skip, skip + limit);
    }
  },
  
  /**
   * Fetch detailed information about a specific problem
   * @param {string} titleSlug - Problem slug (e.g., "two-sum")
   * @returns {Promise<Object>} Problem details
   */
  async fetchProblemDetail(titleSlug) {
    try {
      const query = `
        query questionData($titleSlug: String!) {
          question(titleSlug: $titleSlug) {
            questionId
            title
            titleSlug
            content
            difficulty
            likes
            dislikes
            exampleTestcases
            topicTags {
              name
              slug
            }
            codeSnippets {
              lang
              langSlug
              code
            }
            stats
            hints
            solution {
              id
              url
            }
            companyTagStats
          }
        }
      `;
      
      const response = await fetch(LEETCODE_API, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Referer': 'https://leetcode.com'
        },
        body: JSON.stringify({
          query,
          variables: { titleSlug }
        })
      });
      
      if (!response.ok) {
        throw new Error(`LeetCode API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.errors) {
        throw new Error(`GraphQL error: ${data.errors[0].message}`);
      }
      
      return data.data.question;
    } catch (error) {
      console.error('Failed to fetch LeetCode problem detail:', error);
      throw error;
    }
  },
  
  /**
   * Transform LeetCode problem to our app format
   * @param {Object} lcProblem - LeetCode problem object
   * @returns {Object} Transformed problem
   */
  transformProblem(lcProblem) {
    return {
      id: lcProblem.frontendQuestionId,
      title: lcProblem.title,
      slug: lcProblem.titleSlug,
      difficulty: lcProblem.difficulty,
      acceptance: parseFloat(lcProblem.acRate),
      tags: lcProblem.topicTags?.map(tag => tag.name) || [],
      isPremium: lcProblem.paidOnly || false,
      status: lcProblem.status || null,
      companies: this.extractCompanies(lcProblem.companyTagStats)
    };
  },
  
  /**
   * Extract company names from companyTagStats
   * @param {string} companyTagStats - JSON string of company stats
   * @returns {Array<string>} List of company names
   */
  extractCompanies(companyTagStats) {
    try {
      if (!companyTagStats) return [];
      const stats = JSON.parse(companyTagStats);
      // Get top 3 companies that asked this question
      return stats.slice(0, 3).map(c => c.name);
    } catch {
      return [];
    }
  }
};
