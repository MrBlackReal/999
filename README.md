# 🎙️ Discord Speech Bot  

A Discord bot that **recognizes speech**, **responds with text-to-speech**, and **automatically joins voice channels**.  

## 🚀 Features  
✅ Speech recognition (German: `de-DE`)  
✅ Text-to-speech responses  
✅ Command execution from voice input  
✅ Auto-join/leave for a specific user  

## 📦 Installation  

### 1️⃣ Clone the Repository  
```bash
git clone https://github.com/MrBlackReal/999.git
cd 999```

2️⃣ Install Dependencies

npm install

3️⃣ Set Up Environment Variables

Create a .env file in the root directory and add:

BOT_TOKEN=your_discord_bot_token

4️⃣ Run the Bot

node index.js

🎛️ Usage

The bot listens for voice commands in German (de-DE).

Example command: If you say "Hallo wie geht's", the bot responds via TTS.

You can define more commands in command/command_handler.js.


🛠️ Dependencies

discord.js

@discordjs/voice

discord-speech-recognition

dotenv

fs


📜 License

This project is licensed under the MIT License.