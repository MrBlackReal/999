module.exports = {
    keywords: ["hallo wie geht's", "wie geht's", "wie geht es dir"],
    execute: async (client, msg) => {
        const request = {
            text: "Mir geht es gut. Wie geht es dir?",
            voice: "de",
        };

        return request;
    }
}