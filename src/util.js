const axios = require("axios");

const API_ENDPOINT = "http://127.0.0.1:5000"
const API_SYNTHESIZE = API_ENDPOINT + "/synthesize"
const API_VOICES = API_ENDPOINT + "/voices"

async function textToSpeech(request) {
    const response = (await axios.post(API_SYNTHESIZE, request, { responseType: "arraybuffer" })).data;
    return response;
}

module.exports = {
    textToSpeech,
    API_ENDPOINT,
    API_SYNTHESIZE,
    API_VOICES
}