# nl-api
nl-api is an ExpressJS api that uses knex to access the nostr relay database.




---
### Routes
```
post to all routes with the following payload 
{
    api_key: <api-key>,
    limit: <nlimit>
}

api_key: this is the shared key stored in API_KEY
limit: uses limit() to restrict the number of rows returned 


/eventcount - returns the total number of rows in events table
/postercount - return the total number of unique event_pubkeys
/topnposters - returns a list of top <limit> posters by number of events
/eventsbydate - returns the number of events summarized by date
/eventsbykind - returns a list of <limit> kinds with the corresponding number of events

```
---
### Set up

```

prerequistes: dotenv express knex node pg 

dotenv file:
API_PORT = 3000 (what port should we listen on)
API_KEY =  (this is a key that must be supplied)
API_HTTPS = NO (use https:// or http:// )
DB_HOST = 127.0.0.1 (database host ip)
DB_PORT = 5432 (database port)
DB_USER =  (user context for executing sql)
DB_DATABASE = "nostr_ts_relay" (this is the default database where the relay stores events)
DB_PASSWORD = (supply the password for the user context)
DEFAULT_LIMIT = 10
SSL_KEY = (path to ssl private key)
SSL_CERT = (path to ssl certificate)
```

---

about the project

This is a side project that came out of the nostr.1661.io project. I figured that begining relay operators don't really have the time to set up full analytical stack. I know I didn't. 

I got tired of logging into the database to get the stats. Plus, I could not see them on my phone. Yes, a bit obsessed...

You are likely to see lots of borrowed code - this is my initial deliverable using this particular mix of tech. 

Thanks for checking out the project.
-Sean

