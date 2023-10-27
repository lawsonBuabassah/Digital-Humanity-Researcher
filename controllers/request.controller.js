var bodyParser = require('body-parser');
const express = require('express');
const rateLimit = require("express-rate-limit");
const app = express();

const OpenAI = require("openai");

require('dotenv').config();
const apiKey = process.env.OPENAI_API_KEY;

const openai = new OpenAI({
    apiKey: apiKey
});

var urlencodedParser = bodyParser.urlencoded({ extended: false });
app.use(express.json());

// Limit API requests to a specific number per minute
const apiLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 5, // 5 requests per minute
    message: "Too many requests, please try again later.",
});

module.exports = function (app) {
    app.get('/', function (req, res) {
        res.render('home');
    });

    app.get('/home', function (req, res) {
        res.render('home');
    });

    // POST request to "/getRequest"
    app.post('/getRequest', apiLimiter, urlencodedParser, async function (req, res) {
        try {
            // Get the request from the user's JSON input.
            const userPrompt = req.body.userPrompt;

            const prompt = (userPrompt) => {
                return `Check if the main prompt related to digital humanities. If not, return "Sorry, the request is not related to digital humanities." If it's related, then just proceed with processing the main prompt without mentioning whether it's related or not. Main prompt: "${userPrompt}"`
            };

            const apiResponse = await openai.completions.create({
                model: 'text-davinci-003',
                max_tokens: 500,
                temperature: 0.5,
                prompt: prompt(userPrompt)
            });

            if (apiResponse.choices && apiResponse.choices.length > 0) {
                console.log(apiResponse.choices[0].text);
                myResponse = apiResponse.choices[0].text;
            } else {
                myResponse = "Sorry, the request is not related to digital humanities.";
                if (apiResponse.error && apiResponse.error.message) {
                    console.error('API error message:', apiResponse.error.message);
                } else {
                    console.error('Unknown error');
                }
            }

            // Send only the response back to the client.
            res.render('results', { response: myResponse });

        } catch (error) {
            // Handle any errors and send an error response.
            console.error('Error:', error);
            res.status(500).json({ success: false, error: error.message });
        }
    });
}
