// eslint-disable-next-line no-unused-vars
const { response } = require('express');
const express = require('express');
const router = express.Router()

const auth = require('../middleware/authenticate');

const Schedule = require('../models/schedule');


router.get('/', [auth], async (req, res) => {
    //calling the Schedule class for DB access
    try {
        const schedules = await Schedule.readAll();
        return res.send(JSON.stringify(schedules))
    }catch (err){
        return res.status(500).send(JSON.stringify({message: err}))
    }
});


router.get('/:eventid', [auth], async (req, res) => {

    const { error } = Schedule.validate(req.params);

    if (error) return res.status(400).send(JSON.stringify({ errorMessage: 'Bad request: eventid has to be an integer', errorDetail: error.details[0].message }));

    try {
        const schedule = await Schedule.readById(req.params.eventid);
        return res.send(schedule);
    } catch (err) {
        return res.status(500).send(JSON.stringify({ errorMessage: err }));
    }
});


router.post('/', [auth], async (req, res) => {

    const {error} = Schedule.validate(req.body)
    
    if(error) return res.status(400).send(JSON.stringify({message: `Bad request. ${error.details[0].message}`}))

    const newSchedule = new Schedule(req.body)
    
    try{

        const scheduledFromDB = await newSchedule.create();
        return res.send(JSON.stringify(scheduledFromDB))

    }catch(err){
        return res.status(500).send(JSON.stringify({message: err}))
    }

});


router.post('/eventSchedule', [auth], async (req, res) => {

    const {error} = Schedule.validate(req.body)

    if(error) return res.status(400).send(JSON.stringify({message: `Bad request. ${error.details[0].message}`}))

    const newPersonalSchedule = new Schedule(req.body)
    // console.log(newPersonalSchedule);
    try{
        const newPersonalScheduleFromDB = await newPersonalSchedule.submitNewSchedule();
        console.log(newPersonalScheduleFromDB)
        return res.send(JSON.stringify(newPersonalScheduleFromDB))
    }
    catch(errors){
        return res.status(500).send(JSON.stringify({message: errors}))
    }
});


router.get('/dashboard/:userid', [auth], async (req,res) => {

    const { error } = Schedule.validate(req.params);

    if (error) return res.status(400).send(JSON.stringify({ errorMessage: 'Bad request: eventid has to be an integer', errorDetail: error.details[0].message }));

    try{
        const userDashboard = await Schedule.loadDashboard(req.params.userid);
        return res.send(userDashboard)
    }catch(errors){
        return res.status(500).send(JSON.stringify({ errorMessage: errors }));
    }
});

module.exports = router;