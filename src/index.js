const { Client, Intents, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { addSpeechEvent, SpeechEvents } = require('discord-speech-recognition');
const { textToSpeech } = require("./util")
const { getCommand } = require("./command/command_handler")
const fs = require("fs");
const path = require('path');
const userIds = String(process.env.USER_IDS).split(",")
const botName = "james"

require("dotenv").config()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });
const bin_path = path.join(__dirname, "bin");

if (!fs.existsSync(bin_path))
    fs.mkdir(bin_path, () => { });

addSpeechEvent(client, { lang: "de-DE", ignoreBots: true })

client.on("error", err => console.error(err));
client.once('ready', () => console.log(`Logged in as ${client.user.tag}!`));

client.on(SpeechEvents.speech, async (msg) => {
    if (!msg.content)
        return;

    const content = msg.content.trim().toLowerCase();

    console.log(`${msg.author.globalName}:`, content, content.includes(botName), botName);

    if (!content.includes(botName))
        return;

    let split = content.split(botName + " ")

    const command = getCommand(split[1])

    if (!command) {
        console.error("No command found for: " + content);
        return;
    }

    console.log("Running command: " + command.keywords);

    const conn = msg.connection;

    if (!conn) {
        console.log("invalid connection");
        return;
    }

    const request = await command.execute(client, msg);

    const voice_data = await textToSpeech(request)

    if (!voice_data || voice_data.error) {
        console.log("There was an error generating the response.");

        if (voice_data.error != undefined)
            console.error("Error:", voice_data.error);

        return;
    }

    const fileName = Date.now().toString() + ".wav";
    const loc = path.join(__dirname, "bin", fileName);

    fs.writeFile(loc, Buffer.from(voice_data), 'binary', err => {
        if (err)
            console.error(err);
        else
            console.log('Audio content written to file: ' + loc);
    });

    const player = createAudioPlayer();

    player.once(AudioPlayerStatus.Idle, () => setTimeout(() => fs.rm(loc, () => { }), 2500));

    conn.subscribe(player);

    const resource = createAudioResource(loc)
    player.play(resource);
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (userIds.some(v => v == newState.member.id))
        return;

    const channel = newState.channel;

    if (!channel) {
        const conn = getVoiceConnection(oldState.guild.id)

        if (conn)
            conn.destroy();

        return
    }

    joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guildId,
        adapterCreator: channel.guild.voiceAdapterCreator,
        selfDeaf: false,
        selfMute: false
    });
});

client.login(process.env.BOT_TOKEN);