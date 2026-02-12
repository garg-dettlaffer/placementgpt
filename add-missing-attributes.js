import { Client, Databases } from 'node-appwrite';

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('698d812d003cf06e58c5')
  .setKey('standard_7a12cfa8fdc024c7a46335d6fb1f03581492fdd0b0b6eccb91700ddaf2ac871280a16fb25b22adfa60fafa2d7ba23305c2df2feb60a1d43f86130f3915a8b877523bec706daf6adb0ff353c43d05a073f76931af769220d15715d6cb49daa43364428ac308f0e3f6ed17f175227ef7c52f4cd69fa4027abc1fe66fb4f34acc68');

const databases = new Databases(client);
const DATABASE_ID = 'placementgpt';

const missingAttributes = [
  // Progress collection
  { collectionId: 'progress', key: 'attemptedProblems', type: 'string', size: 5000, required: false },
  { collectionId: 'progress', key: 'topicStats', type: 'string', size: 5000, required: false },
  
  // Problems collection
  { collectionId: 'problems', key: 'description', type: 'string', size: 5000, required: false },
  { collectionId: 'problems', key: 'examples', type: 'string', size: 5000, required: false },
  { collectionId: 'problems', key: 'starterCode', type: 'string', size: 5000, required: false },
  { collectionId: 'problems', key: 'testCases', type: 'string', size: 5000, required: false },
  { collectionId: 'problems', key: 'hints', type: 'string', size: 2000, required: false },
  
  // Companies collection
  { collectionId: 'companies', key: 'interviewProcess', type: 'string', size: 2000, required: false },
  
  // Mock Interviews collection
  { collectionId: 'mock_interviews', key: 'answers', type: 'string', size: 5000, required: false },
  { collectionId: 'mock_interviews', key: 'feedback', type: 'string', size: 5000, required: false }
];

async function createAttribute(collectionId, attr) {
  try {
    if (attr.type === 'string') {
      await databases.createStringAttribute(
        DATABASE_ID,
        collectionId,
        attr.key,
        attr.size,
        attr.required
      );
      console.log(`  ✓ Added ${attr.key} to ${collectionId}`);
    }
  } catch (error) {
    console.log(`  ✗ Error adding ${attr.key} to ${collectionId}: ${error.message}`);
  }
}

async function addMissingAttributes() {
  console.log('🔧 Adding missing attributes...\n');
  
  for (const attr of missingAttributes) {
    await createAttribute(attr.collectionId, attr);
    // Wait a bit between attribute creations
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('\n✅ Done adding missing attributes!');
}

addMissingAttributes();
