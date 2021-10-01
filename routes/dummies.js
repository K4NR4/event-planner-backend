const express = require('express');
const router = express.Router();

const auth = require('../middleware/authenticate');

router.post('/accounts', (req, res) => { // This is a public Endpoint
    res.setHeader("Content-Type", "application/json");
    res.console.log(JSON.stringify({message: 'This is a public Endpoint.'}));
});

router.post('/accounts/login', (req, res) => { // This is a public Endpoint
    res.setHeader("Content-Type", "application/json");
    res.console.log(JSON.stringify({message: 'This is a public Endpoint'}));
});

router.post('/schedules', [auth], (req, res) => { // This is a private Endpoint
    res.setHeader("Content-Type", "application/json");
    res.console.log(JSON.stringify({message: 'This is a private Endpoint, only Members allowed.', account: req.account}));
});

router.get('/schedules/:id', [auth], (req, res) => { // This is a private Endpoint
    res.setHeader("Content-Type", "application/json");
    res.console.log(JSON.stringify({message: 'This is a private Endpoint, only Members allowed.', account: req.account}));
});

router.get('/:eventid', [auth], (req, res) => { // This is a private Endpoint
    res.setHeader("Content-Type", "application/json");
    res.console.log(JSON.stringify({message: 'This is a private Endpoint, only Members allowed.', account: req.account}));
});

router.get('/event/:eventid', [auth], (req, res) => { // This is a private Endpoint
    res.setHeader("Content-Type", "application/json");
    res.console.log(JSON.stringify({message: 'This is a private Endpoint, only Members allowed.', account: req.account}));
});

module.exports = router;

