require('dotenv').config(); // simplified previously: 'const env = require('dotenv').config();'
const config = require('config');
// console.log(config);

const express = require ('express');
const cors = require('cors');
const app = express();
const accounts = require('./routes/accounts');
const dummies = require('./routes/dummies');


app.use(express.json());
app.use(cors());
app.use('/api/accounts', accounts);
const schedules = require('./routes/schedules')
const users = require('./routes/users')

app.use(express.json())
app.use('/api/schedules', schedules);
app.use('/api/users', users);
app.use('/api/dummies', dummies);

const myPort = config.get('port')
app.listen(myPort, () =>{
    console.log(`Listening on port ${myPort}`)
})

