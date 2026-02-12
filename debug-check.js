import { Client, Databases } from 'node-appwrite';

console.log('Starting script...');

const client = new Client()
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')
  .setProject('698d812d003cf06e58c5')
  .setKey('standard_7a12cfa8fdc024c7a46335d6fb1f03581492fdd0b0b6eccb91700ddaf2ac871280a16fb25b22adfa60fafa2d7ba23305c2df2feb60a1d43f86130f3915a8b877523bec706daf6adb0ff353c43d05a073f76931af769220d15715d6cb49daa43364428ac308f0e3f6ed17f175227ef7c52f4cd69fa4027abc1fe66fb4f34acc68');

console.log('Client created');

const databases = new Databases(client);
const DATABASE_ID = 'placementgpt';

console.log('About to call listCollections...');

async function listCollections() {
  console.log('Inside listCollections function');
  try {
    console.log('Trying to get database...');
    const database = await databases.get(DATABASE_ID);
    console.log('✓ Database:', database.name);
    
    console.log('Trying to list collections...');
    const collections = await databases.listCollections(DATABASE_ID);
    console.log('\n📊 Collections found:', collections.collections.length);
    
    for (const collection of collections.collections) {
      console.log(`\n${collection.name} (${collection.$id}):`);
      console.log(`  Total attributes: ${collection.attributes.length}`);
      console.log(`  Attributes:`, collection.attributes.map(a => a.key).join(', '));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Full error:', error);
  }
}

console.log('Calling listCollections...');
listCollections()
  .then(() => {
    console.log('\n✅ Script completed');
  })
  .catch(err => {
    console.error('❌ Fatal error:', err);
  });
