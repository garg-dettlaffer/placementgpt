import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function debugSignup() {
    const uniqueId = Math.floor(Math.random() * 10000);
    const email = `testuser${uniqueId}@example.com`;
    const password = 'Password123!';
    
    console.log(`Attempting signup with ${email}...`);

    try {
        const data = {
            email,
            password,
            passwordConfirm: password,
            name: 'Test User',
            college: 'IIT Bombay', // Must match value in COLLEGES if enum constraint exists
            branch: 'Computer Science', // Must match value in BRANCHES
            graduationYear: 2026,
            plan: 'free',
            credits: 10,
            targetCompanies: []
        };
        
        console.log('Creating user...');
        const user = await pb.collection('users').create(data);
        console.log('User created:', user.id);

        console.log('Creating progress record...');
        await pb.collection('progress').create({
            user: user.id,
            solvedProblems: [],
            attemptedProblems: [],
            accuracy: 0,
            studyTime: 0,
            streak: 0,
            topicStats: {},
            weeklyXP: 0,
            totalXP: 0
        });
        console.log('Progress record created.');
        
    } catch (err) {
        console.error('--- ERROR OCCURRED ---');
        console.error('Status:', err.status);
        console.error('Message:', err.message);
        if (err.response) {
            console.error('Response Data:', JSON.stringify(err.response, null, 2));
        } else {
            console.error('No response object found.');
        }
    }
}

debugSignup();
