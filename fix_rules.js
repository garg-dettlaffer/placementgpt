import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function fixRules() {
    try {
        console.log('Authenticating as superuser...');
        // Try the new _superusers collection first
        await pb.collection('_superusers').authWithPassword('dettlaffer473@gmail.com', 'pockethostkrish@12#');
        console.log('Authenticated as superuser.');
    } catch (err) {
        console.log('Falling back to system admin auth...');
        // Fallback to legacy admin
        try {
            await pb.admins.authWithPassword('dettlaffer473@gmail.com', 'pockethostkrish@12#');
            console.log('Authenticated as system admin.');
        } catch (adminErr) {
            console.error('Failed to authenticate as admin or superuser:', adminErr.message);
            return;
        }
    }
    
    try {
        const usersCollection = await pb.collections.getOne('users');
        console.log('Users Collection ID:', usersCollection.id);
        
        console.log('Progress collection loaded. Deleting to recreate...');
        
        try {
             await pb.collections.delete('progress');
             console.log('Deleted existing progress collection.');
        } catch (delErr) {
            console.log('Progress collection did not exist or delete failed:', delErr.status);
        }
        
        // Define desired schema (PB v0.23+ flattened structure)
        const desiredSchema = [
            {
              name: 'user',
              type: 'relation',
              required: true,
              collectionId: usersCollection.id, // Flattened
              cascadeDelete: true,
              maxSelect: 1,
            },
            { name: 'solvedProblems', type: 'json' },
            { name: 'attemptedProblems', type: 'json' },
            { name: 'accuracy', type: 'number' },
            { name: 'studyTime', type: 'number' },
            { name: 'streak', type: 'number' },
            { name: 'topicStats', type: 'json' },
            { name: 'weeklyXP', type: 'number' },
            { name: 'totalXP', type: 'number' },
        ];

        console.log('Creating progress collection with correct schema (No Rules first)...');
        
        await pb.collections.create({
            name: 'progress',
            type: 'base',
            fields: desiredSchema, // CHANGED from schema to fields
            // createRule: null, // Default
        });
        
        console.log('✅ Created Progress Collection (Rules Pending).');
        
        const createdCol = await pb.collections.getOne('progress');
        console.log('CREATED COL KEYS:', Object.keys(createdCol));
        console.log('Full Object:', JSON.stringify(createdCol, null, 2));

        console.log('Updating Rules...');
         await pb.collections.update('progress', {
            createRule: '@request.auth.id != ""',
            listRule: 'user = @request.auth.id',
            viewRule: 'user = @request.auth.id',
            updateRule: 'user = @request.auth.id',
            deleteRule: 'user = @request.auth.id',
        });
        console.log('✅ Updated Rules.');



        console.log('✅ Updated Progress Collection Schema & Rules successfully.');

        
        // Also fix Mock Interviews just in case
        await pb.collections.update('mock_interviews', {
            createRule: '@request.auth.id != ""',
            listRule: 'user = @request.auth.id',
            viewRule: 'user = @request.auth.id',
            updateRule: 'user = @request.auth.id',
             deleteRule: 'user = @request.auth.id',
        });
        console.log('✅ Updated Mock Interviews Collection Rules successfully.');

             // Also fix prep_plans just in case
        await pb.collections.update('prep_plans', {
            createRule: '@request.auth.id != ""',
            listRule: 'user = @request.auth.id',
            viewRule: 'user = @request.auth.id',
            updateRule: 'user = @request.auth.id',
             deleteRule: 'user = @request.auth.id',
        });
        console.log('✅ Updated Prep Plans Collection Rules successfully.');


    } catch (err) {
        console.error('Failed to update rules:', err);
        if (err.response) {
             console.error('Response Data:', JSON.stringify(err.response, null, 2));
        }
    }
}

fixRules();
