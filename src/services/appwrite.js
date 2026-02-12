import { Client, Account, Databases, Storage, ID, Query } from 'appwrite';

const client = new Client()
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://nyc.cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);

export const DATABASE_ID = 'placementgpt';
export const COLLECTIONS = {
  PROGRESS: 'progress',
  PROBLEMS: 'problems',
  COMPANIES: 'companies',
  MOCK_INTERVIEWS: 'mock_interviews',
  PREP_PLANS: 'prep_plans'
};

// Helper to parse JSON strings safely
const parseJSON = (str) => {
  if (!str) return [];
  if (typeof str === 'object') return str;
  try {
    return JSON.parse(str);
  } catch {
    return [];
  }
};

// Helper to stringify data for storage
const stringifyData = (data) => {
  if (typeof data === 'string') return data;
  return JSON.stringify(data);
};

// Auth functions
export const auth = {
  async signUp(email, password, name, college, branch, year) {
    try {
      // Create user account
      const user = await account.create(ID.unique(), email, password, name);
      
      // Auto login after signup
      await account.createEmailPasswordSession(email, password);
      
      // Create initial progress record
      await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PROGRESS,
        ID.unique(),
        {
          userId: user.$id,
          solvedProblems: stringifyData([]),
          attemptedProblems: stringifyData([]),
          accuracy: 0,
          studyTime: 0,
          streak: 0,
          topicStats: stringifyData({}),
          weeklyXP: 0,
          totalXP: 0
        }
      );

      // Update user preferences (using account.updatePrefs)
      await account.updatePrefs({
        college,
        branch,
        graduationYear: year,
        plan: 'free',
        credits: 10,
        targetCompanies: []
      });

      return user;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error(error.message || 'Sign up failed');
    }
  },

  async signIn(email, password) {
    try {
      const session = await account.createEmailPasswordSession(email, password);
      return session;
    } catch (error) {
      console.error('Sign in error:', error);
      throw new Error(error.message || 'Login failed');
    }
  },

  async signInWithGoogle() {
    try {
      account.createOAuth2Session(
        'google',
        `${window.location.origin}/dashboard`,
        `${window.location.origin}/login`
      );
    } catch (error) {
      console.error('Google auth error:', error);
      throw error;
    }
  },

  async signOut() {
    try {
      await account.deleteSession('current');
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  async getCurrentUser() {
    try {
      return await account.get();
    } catch {
      return null;
    }
  },

  isAuthenticated() {
    return this.getCurrentUser().then(user => !!user).catch(() => false);
  },

  async updateProfile(updates) {
    try {
      // Update name if provided
      if (updates.name) {
        await account.updateName(updates.name);
      }

      // Update email if provided
      if (updates.email) {
        await account.updateEmail(updates.email, updates.password || '');
      }

      // Update preferences for other fields
      const prefs = await account.getPrefs();
      await account.updatePrefs({
        ...prefs,
        ...updates
      });

      return await account.get();
    } catch (error) {
      console.error('Update profile error:', error);
      throw error;
    }
  },

  async requestPasswordReset(email) {
    try {
      return await account.createRecovery(
        email,
        `${window.location.origin}/reset-password`
      );
    } catch (error) {
      console.error('Password reset error:', error);
      throw error;
    }
  },

  async confirmPasswordReset(userId, secret, password, passwordConfirm) {
    try {
      return await account.updateRecovery(userId, secret, password, passwordConfirm);
    } catch (error) {
      console.error('Confirm password reset error:', error);
      throw error;
    }
  }
};

// Database functions
export const db = {
  async getProblems(filters = {}) {
    try {
      const queries = [];

      if (filters.difficulty && filters.difficulty !== 'All') {
        queries.push(Query.equal('difficulty', filters.difficulty));
      }

      if (filters.company) {
        queries.push(Query.search('companies', filters.company));
      }

      if (filters.tags && filters.tags.length > 0) {
        // Search for any of the tags
        filters.tags.forEach(tag => {
          queries.push(Query.search('tags', tag));
        });
      }

      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROBLEMS,
        queries
      );

      return result.documents.map(doc => ({
        ...doc,
        companies: parseJSON(doc.companies),
        tags: parseJSON(doc.tags),
        examples: parseJSON(doc.examples),
        constraints: parseJSON(doc.constraints),
        starterCode: parseJSON(doc.starterCode),
        testCases: parseJSON(doc.testCases),
        hints: parseJSON(doc.hints)
      }));
    } catch (error) {
      console.error('Get problems error:', error);
      throw error;
    }
  },

  async getProblem(slug) {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROBLEMS,
        [Query.equal('slug', slug), Query.limit(1)]
      );

      if (result.documents.length === 0) {
        throw new Error('Problem not found');
      }

      const doc = result.documents[0];
      return {
        ...doc,
        companies: parseJSON(doc.companies),
        tags: parseJSON(doc.tags),
        examples: parseJSON(doc.examples),
        constraints: parseJSON(doc.constraints),
        starterCode: parseJSON(doc.starterCode),
        testCases: parseJSON(doc.testCases),
        hints: parseJSON(doc.hints)
      };
    } catch (error) {
      console.error('Get problem error:', error);
      throw error;
    }
  },

  async getProgress(userId) {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PROGRESS,
        [Query.equal('userId', userId), Query.limit(1)]
      );

      if (result.documents.length === 0) {
        // Create if doesn't exist
        const newProgress = await databases.createDocument(
          DATABASE_ID,
          COLLECTIONS.PROGRESS,
          ID.unique(),
          {
            userId,
            solvedProblems: stringifyData([]),
            attemptedProblems: stringifyData([]),
            accuracy: 0,
            studyTime: 0,
            streak: 0,
            topicStats: stringifyData({}),
            weeklyXP: 0,
            totalXP: 0
          }
        );
        return {
          ...newProgress,
          solvedProblems: [],
          attemptedProblems: [],
          topicStats: {}
        };
      }

      const doc = result.documents[0];
      return {
        ...doc,
        solvedProblems: parseJSON(doc.solvedProblems),
        attemptedProblems: parseJSON(doc.attemptedProblems),
        topicStats: parseJSON(doc.topicStats)
      };
    } catch (error) {
      console.error('Get progress error:', error);
      throw error;
    }
  },

  async updateProgress(userId, updates) {
    try {
      const progress = await this.getProgress(userId);
      
      const updateData = { ...updates };
      if (updates.solvedProblems) updateData.solvedProblems = stringifyData(updates.solvedProblems);
      if (updates.attemptedProblems) updateData.attemptedProblems = stringifyData(updates.attemptedProblems);
      if (updates.topicStats) updateData.topicStats = stringifyData(updates.topicStats);

      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.PROGRESS,
        progress.$id,
        updateData
      );
    } catch (error) {
      console.error('Update progress error:', error);
      throw error;
    }
  },

  async getCompanies(filters = {}) {
    try {
      const queries = [];

      if (filters.search) {
        queries.push(Query.search('name', filters.search));
      }

      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COMPANIES,
        queries
      );

      return result.documents.map(doc => ({
        ...doc,
        focusAreas: parseJSON(doc.focusAreas),
        techStack: parseJSON(doc.techStack),
        interviewProcess: parseJSON(doc.interviewProcess)
      }));
    } catch (error) {
      console.error('Get companies error:', error);
      throw error;
    }
  },

  async getCompany(slug) {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.COMPANIES,
        [Query.equal('slug', slug), Query.limit(1)]
      );

      if (result.documents.length === 0) {
        throw new Error('Company not found');
      }

      const doc = result.documents[0];
      return {
        ...doc,
        focusAreas: parseJSON(doc.focusAreas),
        techStack: parseJSON(doc.techStack),
        interviewProcess: parseJSON(doc.interviewProcess)
      };
    } catch (error) {
      console.error('Get company error:', error);
      throw error;
    }
  },

  async saveMockInterview(userId, sessionData) {
    try {
      const data = {
        userId,
        ...sessionData
      };
      
      if (sessionData.questions) data.questions = stringifyData(sessionData.questions);
      if (sessionData.answers) data.answers = stringifyData(sessionData.answers);
      if (sessionData.feedback) data.feedback = stringifyData(sessionData.feedback);

      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.MOCK_INTERVIEWS,
        ID.unique(),
        data
      );
    } catch (error) {
      console.error('Save mock interview error:', error);
      throw error;
    }
  },

  async updateMockInterview(interviewId, updates) {
    try {
      const updateData = { ...updates };
      if (updates.questions) updateData.questions = stringifyData(updates.questions);
      if (updates.answers) updateData.answers = stringifyData(updates.answers);
      if (updates.feedback) updateData.feedback = stringifyData(updates.feedback);

      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.MOCK_INTERVIEWS,
        interviewId,
        updateData
      );
    } catch (error) {
      console.error('Update mock interview error:', error);
      throw error;
    }
  },

  async getUserMockInterviews(userId) {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.MOCK_INTERVIEWS,
        [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
      );

      return result.documents.map(doc => ({
        ...doc,
        questions: parseJSON(doc.questions),
        answers: parseJSON(doc.answers),
        feedback: parseJSON(doc.feedback)
      }));
    } catch (error) {
      console.error('Get user mock interviews error:', error);
      throw error;
    }
  },

  async getUserPrepPlans(userId) {
    try {
      const result = await databases.listDocuments(
        DATABASE_ID,
        COLLECTIONS.PREP_PLANS,
        [Query.equal('userId', userId), Query.orderDesc('$createdAt')]
      );

      return result.documents.map(doc => ({
        ...doc,
        roadmap: parseJSON(doc.roadmap)
      }));
    } catch (error) {
      console.error('Get user prep plans error:', error);
      throw error;
    }
  },

  async createPrepPlan(userId, planData) {
    try {
      const data = {
        userId,
        ...planData
      };

      if (planData.roadmap) data.roadmap = stringifyData(planData.roadmap);

      return await databases.createDocument(
        DATABASE_ID,
        COLLECTIONS.PREP_PLANS,
        ID.unique(),
        data
      );
    } catch (error) {
      console.error('Create prep plan error:', error);
      throw error;
    }
  },

  async updatePrepPlan(planId, updates) {
    try {
      const updateData = { ...updates };
      if (updates.roadmap) updateData.roadmap = stringifyData(updates.roadmap);

      return await databases.updateDocument(
        DATABASE_ID,
        COLLECTIONS.PREP_PLANS,
        planId,
        updateData
      );
    } catch (error) {
      console.error('Update prep plan error:', error);
      throw error;
    }
  },

  async getPrepPlan(planId) {
    try {
      const doc = await databases.getDocument(
        DATABASE_ID,
        COLLECTIONS.PREP_PLANS,
        planId
      );

      return {
        ...doc,
        roadmap: parseJSON(doc.roadmap)
      };
    } catch (error) {
      console.error('Get prep plan error:', error);
      throw error;
    }
  }
};

// Storage functions (for future file uploads like resumes)
export const storageService = {
  async uploadFile(bucketId, file) {
    try {
      return await storage.createFile(bucketId, ID.unique(), file);
    } catch (error) {
      console.error('Upload file error:', error);
      throw error;
    }
  },

  async deleteFile(bucketId, fileId) {
    try {
      return await storage.deleteFile(bucketId, fileId);
    } catch (error) {
      console.error('Delete file error:', error);
      throw error;
    }
  },

  getFileUrl(bucketId, fileId) {
    return storage.getFileView(bucketId, fileId);
  }
};

export default client;
