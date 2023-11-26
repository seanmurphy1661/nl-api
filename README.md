# nl-api
----
```
nl-api: an api to get realtime statistics on content and use for a nostream nostr relay. 

this is a proof of concept for getting realtime information from a nostream nostr database.

any product owners out there? 
as a nostream operator, i want to see content and use statistics for my relay so that i can deliver better relay services. 

this is meant to be an interim step for relays just starting up.  while a full ELK (or similar tech) stack is the end of the rainbow, this api is bridging the gap for me. 
```
---
```
functions:
eventcount - returns the total number of rows in events table
postercount - return the total number of unique event_pubkeys
topnposters - returns a list of top 10 posters by number of events. 
eventsbydate - returns the number of events summarized by date
eventsbykind - returns the number of events summarized by kind

```
---

```
set up

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
SSL_KEY = (path to ssl private key)
SSL_CERT = (path to ssl certificate)
```
```
about the project

nl-api is a side project i created to provide usage statistics at the content level. 

```
