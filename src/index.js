const { Client, Intents, IntentsBitField, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, VoiceConnectionStatus, getVoiceConnection, createAudioPlayer, createAudioResource, AudioPlayerStatus } = require('@discordjs/voice');
const { addSpeechEvent, SpeechEvents } = require('discord-speech-recognition');
const { TextToSpeechClient } = require('@google-cloud/text-to-speech');
const fs = require("fs");
const path = require('path');
const axios = require("axios")

require("dotenv").config()

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates] });

const api_endpoint = "http://192.168.10.124:5000"
const api_synthesize = api_endpoint + "/synthesize"
const api_voices = api_endpoint + "/voices"

if (!fs.existsSync(path.join(__dirname, "bin")))
    fs.mkdir(path.join(__dirname, "bin"), () => { });

addSpeechEvent(client, { lang: "de-DE", ignoreBots: true })

client.on("error", err => console.error(err));

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.on(SpeechEvents.speech, async (msg) => {
    if (!msg.content)
        return;

    msg.content = msg.content.trim().toLowerCase()

    console.log(`${msg.author.globalName}:`, msg.content);

    if (msg.content.toLowerCase().includes("hallo wie geht's")) {
        const conn = msg.connection;

        if (!conn) {
            console.log("invalid connection");
            return;
        }

        const request = {
            text: "Mir geht es gut. Wie geht es dir?",
            voice: "de",
        };

        let response = null;
        await axios.post(api_synthesize, request, { responseType: "arraybuffer" }).then(res => response = res.data).catch(err => console.error(err));

        if (!response || response.error) {
            console.log("There was an error generating the response.");

            if (response.error)
                console.error("Error:", response.error);

            return;
        }

        const fileName = Date.now().toString() + ".wav";
        const loc = path.join(__dirname, "bin", fileName);

        fs.writeFile(loc, Buffer.from(response), 'binary', err => err ?? console.error(err));
        console.log('Audio content written to file: ' + loc);

        const player = createAudioPlayer();

        player.on("error", err => err ?? console.error("Error while playing audio:\n", err));
        player.once(AudioPlayerStatus.Idle, () => fs.rm(loc, () => { }));

        conn.subscribe(player);

        const resource = createAudioResource(loc)
        player.play(resource);
    }
});

client.on('voiceStateUpdate', (oldState, newState) => {
    if (newState.member.id == "377862824564621312") {
        const channel = newState.channel;

        if (!channel) {
            const conn = getVoiceConnection(oldState.guild.id)

            if (conn)
                conn.destroy();

            return
        }

        const conn = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guildId,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: false
        });
    }
});

client.login(process.env.BOT_TOKEN);
