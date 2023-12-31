require ('dotenv').config();

const express = require('express');

var fs = require('fs');
var https = require('https');
var http = require('http');
const { group } = require('console');


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

    httpServer.listen(port,'0.0.0.0',() => {
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

    httpsServer.listen(port,'0.0.0.0',() => {
        console.log(`API server listening on port ${port}`);
        console.log(`HTTPS is ON (${process.env.API_HTTPS})`);
        console.log(`Connecting to ${process.env.DB_HOST}:${process.env.DB_PORT}`);
        console.log(`Configured for ${process.env.DB_USER}@${process.env.DB_DATABASE}`)
    });
};

app.use(express.json());

app.get('/*', (req, res) => {
    res.send('not implemented');
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

app.post('/*', async (req,res) =>{

    console.log(req.url,"req.body:",req.body);

    if (! req.validateKey) {
        res.sendStatus(400);
        return;
    }

    // defaults
    nlimit = (req.body.limit) ? Number(req.body.limit) : process.env.DEFAULT_LIMIT;
    dateRange = (req.body.dateRange) ? req.body.dateRange : ['2020-01-01','2119-12-31'];
    kindFocus = (req.body.kindFocus) ? req.body.kindFocus : "all";

    try{
        switch (req.url) {
            case '/eventcount':
                res.send(await db('events').count().whereBetween("first_seen",dateRange));
                break;
            case '/eventsbykind' :
                res.send(await db('events').select("event_kind").count().groupBy("event_kind").orderBy("count","desc").whereBetween("first_seen",dateRange).limit(nlimit));
                break;
            case '/postercount' :
                res.send(await db('events').countDistinct("event_pubkey").whereBetween("first_seen",dateRange));
                break;
            case '/topnposters' :
                res.send(await db('events').select("event_pubkey").count().whereBetween("first_seen",dateRange).groupBy("event_pubkey").orderBy("count","desc").limit(nlimit) );
                break;
            case '/eventsbydate' : 
                rc_msg = await db.raw(`select date_trunc('day',"first_seen") as "rpt_date",count(*) from "events" group by date_trunc('day',"first_seen") order by "rpt_date" desc`);
                res.send(rc_msg["rows"]);
                break;
            case '/eventsbyso' : 
                select_clause = `select date_trunc('day',"first_seen") as "rpt_date",count(*) from "events" `;
                if (kindFocus !== 'all') 
                    where_clause = `where event_kind = ` + Number(kindFocus ) + ` ` ;
                else
                    where_clause = ' ';
                group_by_clause = `group by date_trunc('day',"first_seen") `;
                order_by_clause = `order by "rpt_date" desc`;
                sql_command = select_clause + where_clause+ group_by_clause + order_by_clause; 

                rc_msg = await db.raw(sql_command);
                res.send(rc_msg["rows"]);
                break;
            default:
                res.sendStatus(400);                
        }
    }
    catch (error){
        res.status(500);
    }
});