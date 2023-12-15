# nl-api
nl-api is an ExpressJS api that uses knex to access the nostr relay database.




---
### Routes
The api provides for five routes. Every post request should include the following parameters
```
{
    api_key: <api-key>,
    limit: <nlimit>,
    dateRange: [<startDate>,<endDate>]
}
```
|Parameter| Use|
|:----|:-----|
|api_key| this is the shared key stored in API_KEY|
|limit| uses limit() to restrict the number of rows returned |
|dateRange|two item array for date range|



| route|use|Limit|Date Range|Default Alignment|
|:--------------|:-----|:---------------------------:|:---------------------------:|------------------------|
| /eventcount  |get the total number of events| N | Y | N/A |
| /eventsbydate |get the number of events by day| N | N | N/A |
| /eventsbykind |get the number of events by kind| Y | Y | N/A |
| /postercount |get the total number of unique npubs| N | Y | N/A |
| /topnposters |get the number of events by npub| Y | Y | N/A |


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

