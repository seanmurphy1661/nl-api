# nl-api

prerequistes: dotenv express knex node pg 

dotenv file:
API_PORT = 3000 (what port should we listen on)
API_KEY =  (this is a key that must be supplied)
API_HTTPS = NO (use https:// or http:// )
DB_HOST = 127.0.0.1 (database host ip)
DB_PORT = 5432 (database port)
DB_USER =  (user context for executing sql)
DB_DATABASE = "nostr_ts_relay" (this is the database where the relay stores events)
DB_PASSWORD = (supply the password for the user context)
SSL_KEY = (path to ssl private key)
SSL_CERT = (path to ssl certificate)
