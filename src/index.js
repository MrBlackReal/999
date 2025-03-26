const { Client, Intents, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { addSpeechEvent, SpeechEvents } = require('discord-speech-recognition');
const { textToSpeech } = require("./util")
const { findCommand } = require("./command/command_handler")
const fs = require("fs");
const path = require('path');

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

    const content = msg.content.trim().toLowerCase()

    console.log(`${msg.author.globalName}:`, msg.content);

    const command = findCommand(content)

    if (!command) {
        console.error("No command found for: " + content);
        return;        
    }

    await command.execute(msg);

    if (content.includes("hallo wie geht's")) {
        const conn = msg.connection;

        if (!conn) {
            console.log("invalid connection");
            return;
        }

        const request = {
            text: "Mir geht es gut. Wie geht es dir?",
            voice: "de",
        };

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
        });

        console.log('Audio content written to file: ' + loc);

        const player = createAudioPlayer();

        player.on("error", err => err ?? console.error("Error while playing audio:\n", err));
        player.once(AudioPlayerStatus.Idle, () => setTimeout(() => fs.rm(loc, () => { }), 2500));

        conn.subscribe(player);

        const resource = createAudioResource(loc)
        player.play(resource);
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (newState.member.id != "377862824564621312")
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
        selfDeaf: false
    });
});

client.login(process.env.BOT_TOKEN);