// eslint-disable-next-line no-unused-vars
const { response } = require('express');
const express = require('express');
const router = express.Router();

const auth = require('../middleware/authenticate');

const User = require('../models/user');

router.get('/:userid', [auth], async (req, res) => {
    res.setHeader('Content-Type', 'application/json')
    const {error} = User.validate(req.params)

    if(error) return res.status(400).send(JSON.stringify({errorMessage: `Bad request userid has to be an integer`, eventDetails:error.details[0].message }))

    try{
        const listOfUserEvents = await User.readUserEventsById(req.params.userid)
        return res.send(JSON.stringify(listOfUserEvents))
    }catch(error){
        return res.status(500).send(JSON.stringify({errorMessage: error}))
    }
});

module.exports = router