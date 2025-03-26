const path = require("path");
const fs = require("fs");

const commands = [];
const commandFiles = fs.readdirSync(path.join(__dirname, "commands")).filter(name => name.endsWith(".js"));

for (const file of commandFiles) {
    const command = require("./commands/" + file)
    commands.push(command);
}

function getCommand(content) {
    content = content.trim().toLowerCase();
    return commands.find(cmd => cmd.keywords.some(key => content.includes(key)));
}

module.exports = {
    getCommand
}