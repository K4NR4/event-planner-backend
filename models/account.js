const sql = require('mssql');
const config = require('config');
const Joi = require('joi');
const bcrypt = require('bcryptjs');

const con = config.get('dbConfig_UCN');
const salt = parseInt(config.get('saltRounds'));

class Account {
    constructor(accountObj) {
        // accountObj that is used everywhere
        this.useremail = accountObj.useremail;
        this.userpassword = accountObj.userpassword;
        this.username = accountObj.username;
        // console.log(accountObj);
    }

    // static validate for (accountObj) here it checks the validity of the data being put in. such as datatypes and character limit.
    static validate(accountObj) {
        const schema = Joi.object({
            useremail: Joi.string().required().email().min(1).max(255),
            userpassword: Joi.string().min(1).max(255).required(),
            username: Joi.string().alphanum().min(1).max(50),
        });
        return schema.validate(accountObj);
    }
    // static validate for (accountResponse) (same thing here for the response.)
    static validateResponse(accountResponse) {
        const schema = Joi.object({
            userid: Joi.number().integer().required(),
            username: Joi.string().alphanum().min(1).max(50).required(),
        });

        return schema.validate(accountResponse);
    }

    static checkCredentials(accountObj) {
        // this method checks whether or not the input exists on the database.
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    // connecting to the DB
                    const pool = await sql.connect(con);
                    const result = await pool
                        .request()
                        .input(
                            'useremail',
                            sql.NVarChar(255),
                            accountObj.useremail
                        ).query(`
                            SELECT userid, username, userpassword
                            FROM users 

                            WHERE useremail = @useremail;
                        `);
                    console.log(result);

                    // these throw errors if provided credentials are incorrect, or if there are multiple results.
                    if (!result.recordset[0]) {
                        throw {
                            statusCode: 404,
                            errorMessage:
                                'User not found with provided credentials',
                        };
                    }
                    if (result.recordset.length > 1) {
                        throw {
                            statusCode: 500,
                            errorMessage:
                                'Multiple hits of unique data. Corrupt database',
                        };
                    }

                    // this is where the decryption of the password happens.
                    const bcrypt_result = await bcrypt.compare(
                        accountObj.userpassword,
                        result.recordset[0].userpassword
                    );
                    // if provided password doesn't match with the decrypted password on the DB, an error message is given.
                    if (!bcrypt_result) {
                        throw {
                            statusCode: 404,
                            errorMessage:
                                'User not found with provided credentials',
                        };
                    }

                    // if all is good we should get a positive response in the form of userid and username.
                    const accountResponse = {
                        userid: result.recordset[0].userid,
                        username: result.recordset[0].username,
                    };

                    // checking if the response format is correct
                    const { error } = Account.validateResponse(accountResponse);
                    if (error) {
                        throw {
                            statusCode: 500,
                            errorMessage:
                                'Corrupt user account information in database',
                        };
                    }
                    console.log(error);
                    resolve(accountResponse);
                } catch (error) {
                    // catching error
                    console.log(error);
                    reject(error);
                }

                sql.close(); // closing the database!
            })();
        });
    }

    // static method for readByEmail(accountObj)
    static readByEmail(accountObj) {
        // accountObj gets read and useremail is checked if already exists on the database
        return new Promise((resolve, reject) => {
            (async () => {
                try {
                    const pool = await sql.connect(con);
                    const result = await pool
                        .request()
                        .input(
                            'useremail',
                            sql.NVarChar(255),
                            accountObj.useremail
                        ).query(`
                        SELECT userid, username
                        FROM users
                        WHERE useremail = @useremail 
                    `);
                    // console.log(result);

                    // if no matching result an error is thrown
                    if (!result.recordset[0]) {
                        throw {
                            statusCode: 404,
                            errorMessage:
                                'User not found with provided credentials.',
                        };
                    }
                    // if, for some reason, multiple matches are found, this error is thrown
                    if (result.recordset.length > 1) {
                        throw {
                            statusCode: 500,
                            errorMessage:
                                'Multiple hits of unique data. Corrupt database.',
                        };
                    }

                    const accountResponse = {
                        userid: result.recordset[0].userid,
                        username: result.recordset[0].username,
                    }; // if everything is in order accountResponse is given

                    const { error } = Account.validateResponse(accountResponse);
                    if (error) {
                        throw {
                            statusCode: 500,
                            errorMessage:
                                'Corrupt user account information in database',
                        };
                    }

                    resolve(accountResponse);
                } catch (error) {
                    console.log(error);
                    reject(error);
                }

                sql.close();
            })();
        });
    }

    // method for creating a new user in the database
    create() {
        return new Promise((resolve, reject) => {
            (async () => {
                // first we check if the user already exists on the system based on the provided useremail
                try {
                    await Account.readByEmail(this);
                    reject({
                        statusCode: 409,
                        errorMessage: 'Conflict: user email is already in use',
                    });
                } catch (error) {
                    console.log(error);
                    if (!error.statusCode) {
                        reject(error);
                    }
                    if (error.statusCode != 404) {
                        reject(error);
                    }

                    try {
                        const hashedPassword = await bcrypt.hash(
                            this.userpassword,
                            salt
                        ); // initializing the bcrypt hashing.
                        const pool = await sql.connect(con); // connection to the Database.
                        const result00 = await pool
                            .request() // recording the inputs and storing them in the database.
                            .input('username', sql.NVarChar(50), this.username)
                            .input(
                                'useremail',
                                sql.NVarChar(255),
                                this.useremail
                            )
                            .input(
                                'hashedPassword',
                                sql.NVarChar(255),
                                hashedPassword
                            ) // password gets hashed right away
                            .query(`
                            INSERT INTO users([username], [useremail], [userpassword])
                            VALUES (@username, @useremail, @hashedPassword);

                            SELECT userid, username
                            FROM users
                            WHERE userid = SCOPE_IDENTITY();
                            `);

                        console.log(result00);
                        if (!result00.recordset[0]) {
                            throw {
                                statusCode: 500,
                                errorMessage:
                                    'Something went wrong, login was not created',
                            };
                        }

                        const accountResponse = {
                            // returning an accountResponse in the form of userid and username
                            userid: result00.recordset[0].userid,
                            username: result00.recordset[0].username,
                        };

                        // validating the response
                        const { error } =
                            Account.validateResponse(accountResponse);
                        console.log(error);
                        if (error) {
                            throw {
                                statusCode: 500,
                                errorMessage:
                                    'Corrupt user information in the database',
                            };
                        }

                        resolve(accountResponse);
                    } catch (error) {
                        console.log(error);
                        reject(error);
                    }
                }
                sql.close(); // closing the database
            })();
        });
    }
}
module.exports = Account;
