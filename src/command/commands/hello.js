module.exports = {
    keywords: ["hallo wie geht's", "wie geht's", "wie geht es dir"],
    execute: async (client, msg) => {
        try {
            // Get user's name or nickname if available
            const userName = msg.author.username || "Benutzer";
            
            // Dynamic response based on a simple condition
            const responses = [
                `Mir geht es gut, ${userName}. Wie geht es dir?`,
                `Alles bestens, ${userName}! Und dir?`,
                `Ich kann nicht klagen, ${userName}. Wie steht es bei dir?`
            ];

            // Pick a random response
            const responseText = responses[Math.floor(Math.random() * responses.length)];

            // Return response
            const request = {
                text: responseText,
                voice: "de",
            };

            return request;
        } catch (err) {
            console.error("Error executing command:", err);
            return {
                text: "Entschuldigung, ich hatte ein Problem bei der Antwort.",
                voice: "de",
            };
        }
    }
};