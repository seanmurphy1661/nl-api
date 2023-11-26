require ('dotenv').config();

const express = require('express');

var fs = require('fs');
var https = require('https');
var http = require('http');

const db = require("knex")({
    client: 'pg',
    connection: {
        host: process.env.DB_HOST,
        port: process.env.DB_PORT,
        user: process.env.DB_USER,
        database: process.env.DB_DATABASE,
        password: process.env.DB_PASSWORD
    },
    pool: { min:0, max:4},
    acquireConnectionTimeout: 10000
});

const app = express();
const port = process.env.API_PORT;

if (process.env.API_HTTPS === "NO"){
    var httpServer = http.createServer(app);

    httpServer.listen(port,() => {
        console.log(`API server listening on port ${port}`);
        console.log(`HTTPS is OFF (${process.env.API_HTTPS})`);
        console.log(`Connecting to ${process.env.DB_HOST}:${process.env.DB_PORT}`);
        console.log(`Configured for ${process.env.DB_USER}@${process.env.DB_DATABASE}`)
    });
}else{
    var privateKey  = fs.readFileSync(process.env.SSL_KEY, 'utf8');
    var certificate = fs.readFileSync(process.env.SSL_CERT, 'utf8');
    var credentials = {key: privateKey, cert: certificate};
    var httpsServer = https.createServer(credentials, app);

    httpsServer.listen(port,() => {
        console.log(`API server listening on port ${port}`);
        console.log(`HTTPS is ON (${process.env.API_HTTPS})`);
        console.log(`Connecting to ${process.env.DB_HOST}:${process.env.DB_PORT}`);
        console.log(`Configured for ${process.env.DB_USER}@${process.env.DB_DATABASE}`)
    });
};

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Not Implemented');
});

app.options('/*', (req,res) =>{
    res.setHeader("Access-Control-Allow-Origin","*");
    res.setHeader("Access-Control-Request-Method","POST");
    res.setHeader("Access-Control-Allow-Headers","content-type");
    res.sendStatus(200); 
});

const preProcess = function (req,res,next) {
    if (req.body.api_key !== process.env.API_KEY){
        req.validateKey = false;
    } else {
        req.validateKey = true;
    } 
    res.setHeader("Access-Control-Allow-Origin","*");
    next()
}

app.use(preProcess);

app.post('/topnposters', async (req, res) => {
       if (req.validateKey){
        try{
            const rc_msg = await db('events').select("event_pubkey").count().groupBy("event_pubkey").orderBy("count","desc").limit(10);
            res.send(rc_msg);
        }
        catch (error){
            res.status(500);
        }
    }else{
        res.sendStatus(400);
    }
});

app.post('/eventcount', async (req, res) => {
    if (req.validateKey){
        try{
            const rc_msg = await db('events').count();
            res.send(rc_msg);
        }
        catch (error){
            res.status(500);
        }
    }else{
        res.sendStatus(400);
    } 
});

app.post('/postercount', async (req, res) => {
    if (req.validateKey){
        try{
            const rc_msg = await db('events').countDistinct("event_pubkey");
            res.send(rc_msg);
        }
        catch (error){
            res.status(500);
        }
    }else{
        res.sendStatus(400);
    }
});

app.post('/eventsbydate', async (req, res) => {
    if (req.validateKey){
        try{
            const rc_msg = await db.raw(`select date_trunc('day',"first_seen") as "rpt_date",count(*) from "events" group by date_trunc('day',"first_seen") order by "rpt_date" desc`);
            res.send(rc_msg["rows"]);
        }
        catch (error){
            res.status(500);
        }   
    }else{
        res.sendStatus(400);
    }
});

app.post('/eventsbykind', async (req, res) => {
    if (req.validateKey){
        try{
            const rc_msg = await db('events').select("event_kind").count().groupBy("event_kind").orderBy("count","desc");
            res.send(rc_msg);
        }
        catch (error){
            res.status(500);
        }   
    }else{
        res.sendStatus(400);
    }
});

app.get('/postercount', async (req, res) => {
    if (req.validateKey){
        try{
            const rc_msg = await db('events').countDistinct("event_pubkey");
            res.send(rc_msg);
        }
        catch (error){
            res.status(500);
        }
    }else{
        res.sendStatus(400);
    }
});

