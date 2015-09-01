# Reset reputation in your NodeBB board
**Care, this will only work if you are using MongoDB as database, if you are using Redis, I'm sorry**

### Configuration:
Set your database name, database username and database password in `reset.js`. If you are using a different IP and port, change that too.

### Reset
Just run `node reset.js`. You can run `npm install` before if you need to, but uploading the script to the `node_modules` folder of your NodeBB will just work.

### Info
This script will remove:
 - reputation counters (set to 0 for all users)
 - post vote counters
 - post votes
 - post vote dates
 - topic votes
 - reputation logs (in case you are using nodebb-plugin-reputation-rules)