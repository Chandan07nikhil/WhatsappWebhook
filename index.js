const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const VERIFY_TOKEN = 'letsetgo'; 

// Endpoint for Facebook Webhook Verification
app.get('/api/webhook', (req, res) => {
  console.log('GET /api/webhook called');
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode && token) {
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('WEBHOOK_VERIFIED');
      res.status(200).send(challenge);
    } else {
      console.log('Verification failed');
      res.sendStatus(403);
    }
  } else {
    console.log('Missing mode or token');
    res.sendStatus(400);
  }
});

// Endpoint to handle webhook events
app.post('/api/webhook', (req, res) => {
  console.log('POST /api/webhook called');
  const body = req.body;

  if (body.object === 'page') {
    body.entry.forEach(entry => {
      const changes = entry.changes;
      changes.forEach(change => {
        if (change.field === 'leadgen') {
          const leadgen = change.value;
          console.log('Lead received:', leadgen);
          // Process the lead data
        }
      });
    });

    res.status(200).send('EVENT_RECEIVED');
  } else {
    console.log('Invalid object type');
    res.sendStatus(404);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});
