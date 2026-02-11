import PocketBase from 'pocketbase';

const PB_URL = import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090';

// Initialize PocketBase client
export const pb = new PocketBase(PB_URL);

// Enable auto cancellation for duplicate requests
pb.autoCancellation(false);

// ============================================
// AUTHENTICATION
// ============================================
export const auth = {
  /**
   * Sign up a new user
   */
  async signUp(email, password, name, college, branch, graduationYear) {
    try {
      // Create user
      const user = await pb.collection('users').create({
        email,
        password,
        passwordConfirm: password,
        name,
        college,
        branch,
        graduationYear,
        plan: 'free',
        credits: 10,
        targetCompanies: [],
        skills: [],
        cgpa: 0,
      });

      // Create progress record
      await pb.collection('progress').create({
        user: user.id,
        solvedProblems: [],
        attemptedProblems: [],
        accuracy: 0,
        studyTime: 0,
        streak: 0,
        topicStats: {},
        weeklyXP: 0,
        totalXP: 0,
      });

      // Auto login
      await pb.collection('users').authWithPassword(email, password);

      return { user: pb.authStore.model, error: null };
    } catch (error) {
      console.error('Sign up error:', error);
      return { user: null, error: error.message };
    }
  },

  /**
   * Sign in existing user
   */
  async signIn(email, password) {
    try {
      const authData = await pb.collection('users').authWithPassword(email, password);
      return { user: authData.record, error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { user: null, error: error.message };
    }
  },

  /**
   * Sign out current user
   */
  signOut() {
    pb.authStore.clear();
  },

  /**
   * Get current user
   */
  getCurrentUser() {
    return pb.authStore.model;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return pb.authStore.isValid;
  },

  /**
   * Refresh authentication
   */
  async refreshAuth() {
    try {
      if (pb.authStore.isValid) {
        await pb.collection('users').authRefresh();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Auth refresh error:', error);
      this.signOut();
      return false;
    }
  },

  /**
   * Update user profile
   */
  async updateProfile(userId, data) {
    try {
      const updated = await pb.collection('users').update(userId, data);
      return { user: updated, error: null };
    } catch (error) {
      console.error('Profile update error:', error);
      return { user: null, error: error.message };
    }
  },

  /**
   * Send password reset email
   */
  async requestPasswordReset(email) {
    try {
      await pb.collection('users').requestPasswordReset(email);
      return { success: true, error: null };
    } catch (error) {
      console.error('Password reset error:', error);
      return { success: false, error: error.message };
    }
  },
};

// ============================================
// DATABASE OPERATIONS
// ============================================
export const db = {
  /**
   * Get all problems with optional filters
   */
  async getProblems(filters = {}) {
    try {
      const { difficulty, company, topic, search, limit = 50, page = 1 } = filters;
      
      const filterConditions = [];
      if (difficulty) filterConditions.push(`difficulty="${difficulty}"`);
      if (company) filterConditions.push(`companies~"${company}"`);
      if (topic) filterConditions.push(`tags~"${topic}"`);
      if (search) filterConditions.push(`title~"${search}"`);
      
      const filterString = filterConditions.join(' && ');
      
      const problems = await pb.collection('problems').getList(page, limit, {
        filter: filterString || undefined,
        sort: '-created',
      });
      
      return { problems: problems.items, total: problems.totalItems, error: null };
    } catch (error) {
      console.error('Get problems error:', error);
      return { problems: [], total: 0, error: error.message };
    }
  },

  /**
   * Get single problem by slug
   */
  async getProblem(slug) {
    try {
      const problem = await pb.collection('problems').getFirstListItem(`slug="${slug}"`);
      return { problem, error: null };
    } catch (error) {
      console.error('Get problem error:', error);
      return { problem: null, error: error.message };
    }
  },

  /**
   * Get all companies
   */
  async getCompanies() {
    try {
      const companies = await pb.collection('companies').getFullList({
        sort: '-visitsCollege,name',
      });
      return { companies, error: null };
    } catch (error) {
      console.error('Get companies error:', error);
      return { companies: [], error: error.message };
    }
  },

  /**
   * Get single company by slug
   */
  async getCompany(slug) {
    try {
      const company = await pb.collection('companies').getFirstListItem(`slug="${slug}"`);
      return { company, error: null };
    } catch (error) {
      console.error('Get company error:', error);
      return { company: null, error: error.message };
    }
  },

  /**
   * Get user progress
   */
  async getProgress(userId) {
    try {
      const progress = await pb.collection('progress').getFirstListItem(`user="${userId}"`);
      return { progress, error: null };
    } catch (error) {
      console.error('Get progress error:', error);
      return { progress: null, error: error.message };
    }
  },

  /**
   * Update user progress
   */
  async updateProgress(userId, data) {
    try {
      const progress = await pb.collection('progress').getFirstListItem(`user="${userId}"`);
      const updated = await pb.collection('progress').update(progress.id, data);
      return { progress: updated, error: null };
    } catch (error) {
      console.error('Update progress error:', error);
      return { progress: null, error: error.message };
    }
  },

  /**
   * Mark problem as solved
   */
  async markProblemSolved(userId, problemId, difficulty) {
    try {
      const progressData = await this.getProgress(userId);
      if (!progressData.progress) throw new Error('Progress not found');
      
      const { solvedProblems, totalXP } = progressData.progress;
      const xpRewards = { Easy: 10, Medium: 25, Hard: 50 };
      
      if (!solvedProblems.includes(problemId)) {
        const updated = await db.updateProgress(userId, {
          solvedProblems: [...solvedProblems, problemId],
          totalXP: totalXP + xpRewards[difficulty],
        });
        return updated;
      }
      
      return progressData;
    } catch (error) {
      console.error('Mark solved error:', error);
      return { progress: null, error: error.message };
    }
  },

  /**
   * Get mock interviews for user
   */
  async getMockInterviews(userId, limit = 10) {
    try {
      const interviews = await pb.collection('mock_interviews').getList(1, limit, {
        filter: `user="${userId}"`,
        sort: '-created',
      });
      return { interviews: interviews.items, error: null };
    } catch (error) {
      console.error('Get mock interviews error:', error);
      return { interviews: [], error: error.message };
    }
  },

  /**
   * Create mock interview
   */
  async createMockInterview(userId, data) {
    try {
      const interview = await pb.collection('mock_interviews').create({
        user: userId,
        ...data,
      });
      return { interview, error: null };
    } catch (error) {
      console.error('Create mock interview error:', error);
      return { interview: null, error: error.message };
    }
  },

  /**
   * Get prep plans for user
   */
  async getPrepPlans(userId) {
    try {
      const plans = await pb.collection('prep_plans').getFullList({
        filter: `user="${userId}"`,
        sort: '-created',
      });
      return { plans, error: null };
    } catch (error) {
      console.error('Get prep plans error:', error);
      return { plans: [], error: error.message };
    }
  },

  /**
   * Create or update prep plan
   */
  async upsertPrepPlan(userId, company, roadmap) {
    try {
      // Try to find existing plan
      const existing = await pb.collection('prep_plans').getFirstListItem(
        `user="${userId}" && company="${company}"`
      ).catch(() => null);
      
      if (existing) {
        const updated = await pb.collection('prep_plans').update(existing.id, { roadmap });
        return { plan: updated, error: null };
      }
      
      const created = await pb.collection('prep_plans').create({
        user: userId,
        company,
        roadmap,
        progress: 0,
      });
      return { plan: created, error: null };
    } catch (error) {
      console.error('Upsert prep plan error:', error);
      return { plan: null, error: error.message };
    }
  },

  /**
   * Upload file (resume, avatar, etc.)
   */
  async uploadFile(collection, recordId, fieldName, file) {
    try {
      const formData = new FormData();
      formData.append(fieldName, file);
      
      const record = await pb.collection(collection).update(recordId, formData);
      return { record, error: null };
    } catch (error) {
      console.error('Upload file error:', error);
      return { record: null, error: error.message };
    }
  },

  /**
   * Get file URL
   */
  getFileUrl(record, filename) {
    return pb.files.getUrl(record, filename);
  },
};

// Subscribe to auth changes
pb.authStore.onChange((token, model) => {
  console.log('Auth state changed:', { hasToken: !!token, user: model?.email });
});

export default { pb, auth, db };
