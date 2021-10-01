const config = require('config');
const sql = require('mssql');
const con = config.get('dbConfig_UCN');
const Joi = require('joi');

// eslint-disable-next-line no-unused-vars
const _ = require('lodash');

class Schedule {
    constructor (scheduleObj){
        this.userid = scheduleObj.userid
        this.username = scheduleObj.username;
        this.useremail = scheduleObj.useremail;
        this.eventid = scheduleObj.eventid;
        this.eventname = scheduleObj.eventname;
        this.eventweek = scheduleObj.eventweek;
        this.eventdescription = scheduleObj.eventdescription;
        this.schedules = scheduleObj.schedules;
        this.schedulearray = scheduleObj.schedulearray;
    }

    static validate(scheduleWannabee){
        const schema = Joi.object({
            userid: Joi.number(),
            username: Joi.string(),
            useremail: Joi.string(),
            eventid: Joi.number(),
            eventname: Joi.string(),
            eventweek: Joi.number(),
            eventdescription: Joi.string(),
            schedulearray: Joi.string(),
            schedules: Joi.array()
                .items(
                    Joi.object({
                        userid: Joi.number(),
                        schedulearray: Joi.string()
                    })
                )
        });
        return schema.validate(scheduleWannabee);
    }

    // the static function for getting all schedules/events
    static readAll(){
        return new Promise((resolve,reject) =>{
            (async () =>{
                // 1. connect to the DB
                // query to DB
                // verify format
                // if all is good then resolve
                // if not good reject iwth error
                // close db
                
                try{
                    const pool = await sql.connect(con);
                    const result = await pool.request().query(`
                    SELECT u.userid, u.username, u.useremail, e.eventid, e.eventname, e.eventweek, e.eventdescription, es.schedulearray
                    FROM users u
                    JOIN eventSchedules es ON es.FK_userid = u.userid
                    JOIN event e ON es.FK_eventid = e.eventid
                    `)

                    const schedules = [];

                    result.recordset.forEach(record =>{
                        const newSchedule = {
                            userid: record.userid,
                            username: record.username,
                            useremail: record.useremail,
                            eventid: record.eventid,
                            eventname: record.eventname,
                            eventweek: record.eventweek,
                            eventdescription: record.eventdescription,
                            schedulearray: record.schedulearray
                        }

                        schedules.push(newSchedule);
                    })

                    const validSchedules = [];
                    schedules.forEach(schedule =>{
                        const {error} = Schedule.validate(schedule);

                        if(error) throw {errorMessage: 'Schedule.validate failed'}

                        validSchedules.push(new Schedule(schedule))
                    })

                    resolve(validSchedules)
                }catch (error){
                    reject(error);
                }
                sql.close();
            })();
        })
    }

    static readById(eventid){
        return new Promise((resolve,reject)=>{
            (async ()=>{
                try{
                    // 'pooling' - a technic to optimize the opening and closing the connection to the DB
                    const pool = await sql.connect(con)
                    const resultWithIds = await pool.request()
                    .input('eventid', sql.Int(), eventid)       
                    .query(`
                    SELECT e.eventid, e.eventname, e.eventweek, e.eventdescription, es.schedulearray, es.FK_userid
                    FROM event e
                    JOIN eventSchedules es ON e.eventid = es.FK_eventid
                    WHERE e.eventid = @eventid
                    `)
                    
                    const event = {};
                    resultWithIds.recordset.forEach((record, index) =>{
                        if (index == 0) {
                            event.eventid = record.eventid,
                            event.eventname =  record.eventname,
                            event.eventdescription = record.eventdescription,
                            event.eventweek = record.eventweek,
                            event.schedules = [
                                {
                                    userid: record.FK_userid,
                                    schedulearray: record.schedulearray
                                }
                            ]
                        } else {
                            event.schedules.push(
                                {
                                    userid: record.FK_userid,
                                    schedulearray: record.schedulearray
                                }
                            )
                        }
                        
                    })
                    
    
                    if (event.length == 0) throw { statusCode: 404, errorMessage: `Event not found with provided eventid: ${eventid}` }

                    const { error } = Schedule.validate(event);
                    if (error) throw { statusCode: 500, errorMessage: `Corrupt Event informaion in database, eventid: ${eventid}`}
                    resolve(new Schedule(event));

                }
                catch(error){
                    reject(error);
                }
                sql.close();
            })();
        })
            
    }

    create() {
        return new Promise((resolve, reject)=>{
            (async ()=>{
                try{
                    
                    // connect to the DB
                    const pool = await sql.connect(con);
                    // query the DB
                    const result00 = await pool.request()
                    .input('eventname', sql.NVarChar(50), this.eventname)
                    .input('eventdescription', sql.NVarChar(255), this.eventdescription)
                    .input('eventweek', sql.Int(), this.eventweek)
                    .input('userid', sql.Int(), this.userid)
                    .query(`
                    INSERT INTO event (eventname, eventdescription, eventweek, FK_userid)
                    VALUES (@eventname, @eventdescription, @eventweek, @userid)

                    SELECT * FROM event
                    WHERE eventid = SCOPE_IDENTITY();
                    `)
                    if (!result00.recordset[0]) throw { dberror: 'Something went wrong with the INSERT to the EVENT!' }
                      
                    const schedules = []

                    // create the object of the event for each instance that is passed 
                    result00.recordset.forEach(record =>{
                        const newSchedule = {
                            eventname: record.eventname,
                            eventdescription: record.eventdescription,
                            eventweek: record.eventweek,
                            userid: record.userid 
                        }
                        schedules.push(newSchedule)

                    })

                    const validSchedules = []
                    schedules.forEach(schedule =>{
                        const {error} = Schedule.validate(schedule)
                        if(error) throw {errorMessage: `Schedule.validate failed`}

                        validSchedules.push(new Schedule(schedule))

                    });

                    resolve(validSchedules);

                }
                catch(error){
                    reject(error);
                }

                sql.close();
            })();
        });
    }


    submitNewSchedule(){
        return new Promise((resolve, reject) => {
            (async () => {
                try{
                    const pool = await sql.connect(con) // connecting to the DB
                    
                    let result2;
                    const exists = await pool.request()
                        .input('eventid', sql.Int(), this.eventid)
                        .input('userid', sql.Int(), this.userid)
                        .input('schedulearray', sql.NVarChar(), this.schedulearray)
                        .query(`
                            SELECT * 
                            FROM eventSchedules
                            WHERE FK_userid = @userid AND FK_eventid = @eventid;
                        `);
                    if (exists.recordset.length > 0) {
                        result2 = await pool.request()
                        .input('eventid', sql.Int(), this.eventid)
                        .input('userid', sql.Int(), this.userid)
                        .input('schedulearray', sql.NVarChar(), this.schedulearray)
                        .query(`
                            UPDATE eventSchedules 
                            SET schedulearray = @schedulearray
                            WHERE FK_eventid = @eventid AND FK_userid = @userid
                            
                            SELECT * 
                            FROM eventSchedules
                            WHERE FK_userid = @userid AND FK_eventid = @eventid;
                        `); console.log(result2);
                    } else {
                        result2 = await pool.request()
                        .input('eventid', sql.Int(), this.eventid)
                        .input('userid', sql.Int(), this.userid)
                        .input('schedulearray', sql.NVarChar(), this.schedulearray)
                        .query(`
                            INSERT INTO eventSchedules (FK_eventid, FK_userid, schedulearray)
                            VALUES (@eventid, @userid, @schedulearray)
        
                            SELECT * 
                            FROM eventSchedules
                            WHERE FK_userid = @userid AND FK_eventid = @eventid;
                        `); console.log(result2);
                    }
                    
                    if(!result2.recordset[0]) throw {dberror: 'Something went wrong with the DB'}

                    const personalSchedule = []

                    result2.recordset.forEach(record =>{
                        const newPersonalSchedule = {
                            eventid: record.eventid,
                            userid: record.userid,
                            schedulearray: record.schedulearray
                        }
                        personalSchedule.push(newPersonalSchedule)
                    })

                    const validatedPersonalSchedules = [];
                    personalSchedule.forEach(el =>{
                        const {error} = Schedule.validate(el)
                        if(error) throw {errorMessage: `Schedule.validate on new personal schedule failed`}

                        validatedPersonalSchedules.push(new Schedule(el))
                    })
                    resolve(validatedPersonalSchedules)
                }
                catch(errors){
                    reject(errors)
                }
                sql.close();
            })();
        });
    }

    static loadDashboard(userid){
        return new Promise((resolve, reject)=>{
            (async ()=>{
                try{
                    const pool = await sql.connect(con)
                    const resultsOfTheUser = await pool.request()
                    .input('userid', sql.Int(), userid)
                    .query(`
                    SELECT u.userid, u.username, e.eventid, e.eventname, e.eventweek, e.eventdescription
                    FROM users u
                    JOIN event e ON u.userid = e.FK_userid
                    WHERE u.userid = @userid
                    `)

                    const userSchedules = [];
                    resultsOfTheUser.recordset.forEach(record=>{
                        const newUserSchedules = {
                            userid: record.userid,
                            username: record.username,
                            eventid: record.eventid,
                            eventname: record.eventname,
                            eventweek: record.eventweek,
                            eventdescription: record.eventdescription
                        }
                        userSchedules.push(newUserSchedules)
                    })

                    const validUserSchedules = []
                    userSchedules.forEach(userSchdules=>{
                        const {error} = Schedule.validate(userSchdules);

                        if(error) throw {errorMessage: 'Schedule.validate failed'}

                        validUserSchedules.push(new Schedule(userSchdules))
                    })
                    resolve(validUserSchedules)
                }catch(error){
                    reject(error)
                }
                sql.close()
            })();
        })
    }
}

module.exports = Schedule;