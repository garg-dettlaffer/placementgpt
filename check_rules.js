import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function checkRules() {
    try {
        await pb.admins.authWithPassword('admin@placementgpt.com', 'admin123456');
        
        const progress = await pb.collections.getOne('progress');
        console.log('Progress Collection Rules:');
        console.log('listRule:', progress.listRule);
        console.log('viewRule:', progress.viewRule);
        console.log('createRule:', progress.createRule);
        console.log('updateRule:', progress.updateRule);
        console.log('deleteRule:', progress.deleteRule);

    } catch (err) {
        console.error('Error:', err);
    }
}

checkRules();
