const axios = require('axios');
const fs = require('fs');
require('dotenv').config();

const token = process.env.DISCORD_TOKEN;

async function registerCommands() {
    try {
        const { data: user } = await axios.get('https://discord.com/api/v10/users/@me', {
            headers: { Authorization: `Bot ${token}` }
        });
        const appId = user.id;

        const files = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));
        let commands = [];
        for(const file of files) {
            const content = fs.readFileSync('./commands/' + file, 'utf8');
            const nameMatch = content.match(/name:\s*['"](.*?)['"]/);
            const descMatch = content.match(/description:\s*['"](.*?)['"]/);
            if(nameMatch && nameMatch[1]) {
                const name = nameMatch[1].toLowerCase().replace(/[^a-z0-9_-]/g, '').substring(0, 32);
                const desc = descMatch && descMatch[1] ? descMatch[1].substring(0, 100) : 'No description provided';
                
                commands.push({
                    name: name,
                    description: desc,
                    options: [{
                        name: 'args',
                        description: 'Arguments for the command',
                        type: 3, // STRING
                        required: false
                    }]
                });
            }
        }

        console.log(`Registering ${commands.length} slash commands...`);
        const res = await axios.put(`https://discord.com/api/v10/applications/${appId}/commands`, commands, {
            headers: { Authorization: `Bot ${token}` }
        });
        console.log('Successfully registered commands!');
    } catch (e) {
        console.error('Error registering commands:', e.response ? e.response.data : e.message);
    }
}

registerCommands();
