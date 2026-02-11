import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';
const pb = new PocketBase(PB_URL);

async function loginAsAdmin(email, password) {
  try {
    await pb.admins.authWithPassword(email, password);
    return;
  } catch (error) {
    const status = error?.status || error?.response?.status;
    if (status !== 404) {
      throw error;
    }
  }

  try {
    await pb.collection('_superusers').authWithPassword(email, password);
    return;
  } catch (error) {
    const status = error?.status || error?.response?.status;
    if (status !== 404) {
      throw error;
    }
  }

  const response = await fetch(`${PB_URL}/api/superusers/auth-with-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identity: email, password }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Superuser auth failed (${response.status}): ${message}`);
  }

  const data = await response.json();
  const model = data?.record || data?.superuser || data?.admin || data?.model || null;
  pb.authStore.save(data?.token, model);
}

async function setup() {
  try {
    console.log('Logging in as admin...');
    await loginAsAdmin('dettlaffer473@gmail.com', 'pockethostkrish@12#');
    console.log('✓ Logged in successfully\n');

    console.log('Creating collections...\n');

    const existingCollections = await pb.collections.getFullList({ sort: 'name' });
    const existingByName = new Map(existingCollections.map((col) => [col.name, col]));

    const getOrCreateCollection = async (collectionData) => {
      const existing = existingByName.get(collectionData.name);
      if (existing) {
        console.log(`• ${collectionData.name} already exists (skipping)`);
        return existing;
      }
      const created = await pb.collections.create(collectionData);
      console.log(`✓ Created ${collectionData.name} collection`);
      return created;
    };

    const usersCollection = await getOrCreateCollection({
      name: 'users',
      type: 'auth',
      schema: [
        { name: 'name', type: 'text', required: true },
        { name: 'college', type: 'text', required: true },
        { name: 'branch', type: 'text', required: true },
        { name: 'graduationYear', type: 'number', required: true },
        { name: 'cgpa', type: 'number' },
        { name: 'targetCompanies', type: 'json' },
        { name: 'skills', type: 'json' },
        {
          name: 'plan',
          type: 'select',
          options: {
            maxSelect: 1,
            values: ['free', 'pro'],
          },
        },
        { name: 'credits', type: 'number' },
        {
          name: 'resumeUrl',
          type: 'file',
          options: {
            maxSelect: 1,
            maxSize: 5242880,
          },
        },
      ],
    });

    await getOrCreateCollection({
      name: 'progress',
      type: 'base',
      schema: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          options: {
            collectionId: usersCollection.id,
            cascadeDelete: true,
            maxSelect: 1,
          },
        },
        { name: 'solvedProblems', type: 'json' },
        { name: 'attemptedProblems', type: 'json' },
        { name: 'accuracy', type: 'number' },
        { name: 'studyTime', type: 'number' },
        { name: 'streak', type: 'number' },
        { name: 'topicStats', type: 'json' },
        { name: 'weeklyXP', type: 'number' },
        { name: 'totalXP', type: 'number' },
      ],
    });

    await getOrCreateCollection({
      name: 'problems',
      type: 'base',
      schema: [
        { name: 'title', type: 'text', required: true },
        { name: 'slug', type: 'text', required: true },
        {
          name: 'difficulty',
          type: 'select',
          options: {
            maxSelect: 1,
            values: ['Easy', 'Medium', 'Hard'],
          },
        },
        { name: 'acceptance', type: 'number' },
        { name: 'companies', type: 'json' },
        { name: 'tags', type: 'json' },
        { name: 'description', type: 'editor' },
        { name: 'examples', type: 'json' },
        { name: 'constraints', type: 'json' },
        { name: 'starterCode', type: 'json' },
        { name: 'testCases', type: 'json' },
        { name: 'hints', type: 'json' },
      ],
    });

    await getOrCreateCollection({
      name: 'companies',
      type: 'base',
      schema: [
        { name: 'slug', type: 'text', required: true },
        { name: 'name', type: 'text', required: true },
        {
          name: 'logo',
          type: 'file',
          options: {
            maxSelect: 1,
            maxSize: 2097152,
          },
        },
        { name: 'avgPackage', type: 'text' },
        { name: 'role', type: 'text' },
        { name: 'visitsCollege', type: 'bool' },
        {
          name: 'status',
          type: 'select',
          options: {
            maxSelect: 1,
            values: ['HIRING', 'CLOSED', 'SOON', 'PAUSED'],
          },
        },
        { name: 'focusAreas', type: 'json' },
        { name: 'commonQuestions', type: 'json' },
        { name: 'interviewRounds', type: 'json' },
      ],
    });

    await getOrCreateCollection({
      name: 'mock_interviews',
      type: 'base',
      schema: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          options: {
            collectionId: usersCollection.id,
            cascadeDelete: true,
            maxSelect: 1,
          },
        },
        { name: 'sessionId', type: 'text', required: true },
        {
          name: 'type',
          type: 'select',
          options: {
            maxSelect: 1,
            values: ['dsa', 'system_design', 'behavioral'],
          },
        },
        { name: 'company', type: 'text' },
        { name: 'questions', type: 'json' },
        { name: 'responses', type: 'json' },
        { name: 'score', type: 'number' },
        { name: 'feedback', type: 'json' },
        { name: 'duration', type: 'number' },
      ],
    });

    await getOrCreateCollection({
      name: 'prep_plans',
      type: 'base',
      schema: [
        {
          name: 'user',
          type: 'relation',
          required: true,
          options: {
            collectionId: usersCollection.id,
            cascadeDelete: true,
            maxSelect: 1,
          },
        },
        { name: 'company', type: 'text', required: true },
        { name: 'roadmap', type: 'json' },
        { name: 'progress', type: 'number' },
        { name: 'customNotes', type: 'editor' },
      ],
    });
    console.log('');

    console.log('Adding sample data...\n');

    const upsertBySlug = async (collection, slug, data) => {
      try {
        const existing = await pb.collection(collection).getFirstListItem(`slug="${slug}"`);
        await pb.collection(collection).update(existing.id, data);
        console.log(`• Updated ${collection} (${slug})`);
      } catch (error) {
        if (error?.status === 404) {
          await pb.collection(collection).create(data);
          console.log(`✓ Added ${collection} (${slug})`);
          return;
        }
        throw error;
      }
    };

    await upsertBySlug('companies', 'google', {
      slug: 'google',
      name: 'Google',
      avgPackage: '45 LPA',
      role: 'SDE-1',
      visitsCollege: true,
      status: 'HIRING',
      focusAreas: ['Trees & Graphs', 'DP', 'System Design'],
    });

    await upsertBySlug('companies', 'amazon', {
      slug: 'amazon',
      name: 'Amazon',
      avgPackage: '42 LPA',
      role: 'SDE-1',
      visitsCollege: true,
      status: 'HIRING',
      focusAreas: ['Arrays', 'Hash Maps', 'Trees'],
    });

    await upsertBySlug('companies', 'microsoft', {
      slug: 'microsoft',
      name: 'Microsoft',
      avgPackage: '40 LPA',
      role: 'SDE',
      visitsCollege: true,
      status: 'HIRING',
      focusAreas: ['DP', 'Graphs', 'System Design'],
    });
    console.log('');

    await upsertBySlug('problems', 'two-sum', {
      title: 'Two Sum',
      slug: 'two-sum',
      difficulty: 'Easy',
      acceptance: 48.5,
      companies: ['google', 'amazon'],
      tags: ['Arrays', 'Hash Map'],
      description:
        'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.',
      starterCode: {
        'Python 3':
          'class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass',
      },
      testCases: [{ input: '[2,7,11,15]\n9', output: '[0,1]' }],
    });

    await upsertBySlug('problems', 'valid-parentheses', {
      title: 'Valid Parentheses',
      slug: 'valid-parentheses',
      difficulty: 'Easy',
      acceptance: 40.2,
      companies: ['amazon', 'microsoft'],
      tags: ['Stack', 'String'],
      description:
        "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      starterCode: {
        'Python 3':
          'class Solution:\n    def isValid(self, s: str) -> bool:\n        pass',
      },
      testCases: [{ input: '()', output: 'true' }],
    });
    console.log('');

    console.log('✅ DATABASE SETUP COMPLETE!');
    console.log('Now run: npm run dev');
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

setup();
