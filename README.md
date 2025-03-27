# Discord Speech Bot

A Discord bot that **recognizes speech**, **responds with text-to-speech**, and **automatically joins voice channels**.

## ðŸš€ Features
âœ… Speech recognition (German: `de-DE`)
âœ… Text-to-speech responses
âœ… Command execution from voice input
âœ… Auto-join/leave for a specific user

## Installation

### Clone the Repository
```bash
git clone https://github.com/MrBlackReal/999.git
cd 999/src
```

### Install Dependencies
```bash
npm install
```

### Set Up Environment Variables
Create a `.env` file in the root directory and add:
```env
BOT_TOKEN=your_discord_bot_token
```

### Run the Bot
```bash
node index.js
```

## Usage
- The bot listens for voice commands in German (`de-DE`).
- Example command: If you say **"Hallo wie geht's"**, the bot responds via TTS.
- You can define more commands in `command/command_handler.js`.

## Dependencies
- [discord.js](https://discord.js.org/)
- [@discordjs/voice](https://www.npmjs.com/package/@discordjs/voice)
- [discord-speech-recognition](https://www.npmjs.com/package/discord-speech-recognition)
- dotenv
- fs

## License
This project is licensed under the **MIT License**.

---

**Contributions & Suggestions Welcome!**  
If you have ideas or improvements, feel free to create an issue or pull request.