import { Client, Databases, ID } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('698d812d003cf06e58c5')
  .setKey('standard_7a12cfa8fdc024c7a46335d6fb1f03581492fdd0b0b6eccb91700ddaf2ac871280a16fb25b22adfa60fafa2d7ba23305c2df2feb60a1d43f86130f3915a8b877523bec706daf6adb0ff353c43d05a073f76931af769220d15715d6cb49daa43364428ac308f0e3f6ed17f175227ef7c52f4cd69fa4027abc1fe66fb4f34acc68');

const databases = new Databases(client);
const DATABASE_ID = 'placementgpt';

const collections = [
  {
    id: 'progress',
    name: 'Progress',
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'solvedProblems', type: 'string', size: 5000, required: false },
      { key: 'attemptedProblems', type: 'string', size: 5000, required: false },
      { key: 'accuracy', type: 'double', required: false },
      { key: 'studyTime', type: 'integer', required: false },
      { key: 'streak', type: 'integer', required: false },
      { key: 'topicStats', type: 'string', size: 5000, required: false },
      { key: 'weeklyXP', type: 'integer', required: false },
      { key: 'totalXP', type: 'integer', required: false }
    ]
  },
  {
    id: 'problems',
    name: 'Problems',
    attributes: [
      { key: 'title', type: 'string', size: 255, required: true },
      { key: 'slug', type: 'string', size: 255, required: true },
      { key: 'difficulty', type: 'string', size: 50, required: false },
      { key: 'acceptance', type: 'double', required: false },
      { key: 'companies', type: 'string', size: 2000, required: false },
      { key: 'tags', type: 'string', size: 500, required: false },
      { key: 'description', type: 'string', size: 5000, required: false },
      { key: 'examples', type: 'string', size: 5000, required: false },
      { key: 'constraints', type: 'string', size: 2000, required: false },
      { key: 'starterCode', type: 'string', size: 5000, required: false },
      { key: 'testCases', type: 'string', size: 5000, required: false },
      { key: 'hints', type: 'string', size: 2000, required: false }
    ]
  },
  {
    id: 'companies',
    name: 'Companies',
    attributes: [
      { key: 'slug', type: 'string', size: 255, required: true },
      { key: 'name', type: 'string', size: 255, required: true },
      { key: 'avgPackage', type: 'string', size: 50, required: false },
      { key: 'role', type: 'string', size: 100, required: false },
      { key: 'status', type: 'string', size: 50, required: false },
      { key: 'focusAreas', type: 'string', size: 2000, required: false },
      { key: 'description', type: 'string', size: 2000, required: false },
      { key: 'techStack', type: 'string', size: 1000, required: false },
      { key: 'interviewProcess', type: 'string', size: 2000, required: false }
    ]
  },
  {
    id: 'mock_interviews',
    name: 'Mock Interviews',
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'sessionId', type: 'string', size: 255, required: false },
      { key: 'type', type: 'string', size: 50, required: false },
      { key: 'company', type: 'string', size: 255, required: false },
      { key: 'questions', type: 'string', size: 5000, required: false },
      { key: 'answers', type: 'string', size: 5000, required: false },
      { key: 'score', type: 'integer', required: false },
      { key: 'feedback', type: 'string', size: 5000, required: false },
      { key: 'duration', type: 'integer', required: false }
    ]
  },
  {
    id: 'prep_plans',
    name: 'Prep Plans',
    attributes: [
      { key: 'userId', type: 'string', size: 255, required: true },
      { key: 'company', type: 'string', size: 255, required: false },
      { key: 'role', type: 'string', size: 100, required: false },
      { key: 'roadmap', type: 'string', size: 10000, required: false },
      { key: 'progress', type: 'integer', required: false },
      { key: 'targetDate', type: 'string', size: 50, required: false },
      { key: 'status', type: 'string', size: 50, required: false }
    ]
  }
];

async function setup() {
  try {
    console.log('🚀 Starting Appwrite setup...\n');

    // Create database
    try {
      await databases.create(DATABASE_ID, 'PlacementGPT');
      console.log('✓ Database created: PlacementGPT');
    } catch (error) {
      if (error.code === 409) {
        console.log('⚠ Database already exists, continuing...');
      } else {
        throw error;
      }
    }

    // Create collections
    for (const col of collections) {
      try {
        await databases.createCollection(
          DATABASE_ID,
          col.id,
          col.name,
          [/* permissions */],
          false, // document security
          true // enabled
        );
        console.log(`✓ Collection created: ${col.name}`);
      } catch (error) {
        if (error.code === 409) {
          console.log(`⚠ Collection ${col.name} already exists`);
        } else {
          console.error(`✗ Error creating collection ${col.name}:`, error.message);
          continue;
        }
      }

      // Create attributes with delay (Appwrite requires time between attribute creations)
      for (const attr of col.attributes) {
        try {
          if (attr.type === 'string') {
            await databases.createStringAttribute(
              DATABASE_ID,
              col.id,
              attr.key,
              attr.size,
              attr.required
            );
          } else if (attr.type === 'integer') {
            await databases.createIntegerAttribute(
              DATABASE_ID,
              col.id,
              attr.key,
              attr.required
            );
          } else if (attr.type === 'double') {
            await databases.createFloatAttribute(
              DATABASE_ID,
              col.id,
              attr.key,
              attr.required
            );
          }
          console.log(`  ↳ Attribute created: ${attr.key}`);
          
          // Wait a bit between attribute creations
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          if (error.code === 409) {
            console.log(`  ⚠ Attribute ${attr.key} already exists`);
          } else {
            console.error(`  ✗ Error creating attribute ${attr.key}:`, error.message);
          }
        }
      }

      console.log('');
    }

    console.log('✅ Setup complete!');
    console.log('\n📝 Next steps:');
    console.log('1. Update .env with VITE_APPWRITE_PROJECT_ID');
    console.log('2. Run: npm install appwrite');
    console.log('3. Run: npm run dev');
  } catch (error) {
    console.error('❌ Setup error:', error.message);
    console.error('Full error:', error);
  }
}

setup();
