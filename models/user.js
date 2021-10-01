const config = require('config');

const sql = require('mssql');
const con = config.get('dbConfig_UCN');

const Joi = require('joi');

// eslint-disable-next-line no-unused-vars
const _ = require('lodash');
// eslint-disable-next-line no-unused-vars
const { result } = require('lodash');


class User {
    constructor(userObj){
        this.userid = userObj.userid;
        this.username = userObj.username;
        this.useremail = userObj.useremail;
        this.eventid = userObj.eventid;
        this.eventname = userObj.eventname;
        this.eventweek = userObj.eventweek;
        this.eventdescription = userObj.eventdescription;
        this.schedules = userObj.schedules;
        this.schedulearray = userObj.schedulearray;
    }

    static validate(userValidatior){
        const schema = Joi.object({
            userid: Joi.number(),
            username: Joi.string(),
            useremail: Joi.string(),
            eventid: Joi.number(),
            eventname: Joi.string(),
            eventweek: Joi.number(),
            eventdescription: Joi.string(),
            schedulearray: Joi.string()
        })
        return schema.validate(userValidatior)
    }


    static readUserEventsById(userid){
        return new Promise((resolve, reject) =>{
            (async ()=>{
                try{
                    const pool = await sql.connect(con)
                    const result = await pool.request()
                    .input('userid', sql.Int(), userid)
                    .query(`
                    SELECT username, eventname, eventid, eventdescription, eventweek, schedulearray
                    FROM users u
                    JOIN eventSchedules es ON u.userid = es.FK_userid
                    JOIN event e ON es.FK_eventid = e.eventid
                    WHERE u.userid = @userid
                    `)

                    const events = [];
                    result.recordset.forEach(record=>{
                        const newEvent = {
                            username: record.username,
                            eventid: record.eventid,
                            eventname: record.eventname,
                            eventdescription: record.eventdescription,
                            eventweek: record.eventweek,
                            schedulearray: record.schedulearray
                        }
                        events.push(newEvent)
                    })

                    const validEvents = [];
                    events.forEach(event =>{
                        const {error} = User.validate(event)
                        if(error) throw {errorMessage: `User.validate failed`}

                        validEvents.push(new User(event))
                    })
                    resolve(validEvents)
                }

                catch(error){
                    reject(error)

                }
                sql.close()
            })()
        })
    }
}

module.exports = User;