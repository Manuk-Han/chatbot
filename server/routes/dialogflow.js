const express = require('express');
const router = express.Router();
const structjson = require('./structjson.js');

const dialogflow = require('dialogflow');
const uuid = require('uuid');

const config = require('../config/keys');

const sessionClient = new dialogflow.SessionsClient();
const sessionPath = sessionClient.sessionPath(config.googleProjectID, config.dialogFlowSessionID);

router.post('/textQuery', async (req, res) => {

    async function runSample(projectId = config.googleProjectID) {
        const sessionId = uuid.v4();

        console.log(`Session ID: ${sessionId}`);

        const request = {
            session: sessionPath,
            queryInput: {
                text: {
                    text: req.body.text,
                    languageCode: config.dialogFlowSessionLanguageCode,
                },
            },
        };

        // Send request and log result
        const responses = await sessionClient.detectIntent(request);
        console.log('Detected intent');
        const result = responses[0].queryResult;
        console.log(`  Query: ${result.queryText}`);
        console.log(`  Response: ${result.fulfillmentText}`);

        res.send(result)
    }

    runSample().catch(error => {
        console.error(error);
        res.status(500).send({ error: error.message });
    });
})



module.exports = router;
