const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory "database" for demo. Use Render's free PostgreSQL for real use.
let licenses = {
  'TEST-KEY-123': { hwid: null, active: true }
};

// 1. Activation Endpoint
app.post('/activate', (req, res) => {
  const { key, hwid } = req.body;
  const license = licenses[key];

  if (!license || !license.active) {
    return res.json({ success: false, message: 'Invalid or inactive license key.' });
  }
  if (license.hwid && license.hwid !== hwid) {
    return res.json({ success: false, message: 'License already activated on another machine.' });
  }

  // Lock the license to this HWID
  license.hwid = hwid;
  res.json({ success: true, message: 'Activation successful.' });
});

// 2. Validation Endpoint
app.post('/validate', (req, res) => {
  const { key, hwid } = req.body;
  const license = licenses[key];

  if (license && license.active && license.hwid === hwid) {
    res.json({ valid: true });
  } else {
    res.json({ valid: false });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`License server running on port ${PORT}`));
