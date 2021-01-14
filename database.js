var sqlite3 = require('sqlite3').verbose()
var md5 = require('md5')

const DBSOURCE = "taskRecords.db"

let db = new sqlite3.Database(DBSOURCE, (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message)
      throw err
    }else{
        console.log('Connected to the SQLite database.')
        db.run(`CREATE TABLE IF NOT EXISTS TaskList (
            oid INTEGER PRIMARY KEY,
            rowNum TEXT NOT NULL,
            dateCreated TEXT NOT NULL,
            dueDate TEXT NOT NULL,
            title TEXT NOT NULL,
            comments TEXT NOT NULL,
            priority TEXT NOT NULL,
            completion TEXT NOT NULL,
            status TEXT NOT NULL
            )`,
        (err) => {
            if (err) {
                console.log('Table not created')
                // Table already created
            }else{
                console.log('Table created.')
                // Table just created, creating some rows
                //var insert = 'INSERT INTO TaskList(rowNum, dateCreated, dueDate, title, comments, priority, completion, status) VALUES(?,?,?,?,?,?,?,?)'
                //db.run(insert, ["admin","admin@example.com",md5("admin123456")])
                //db.run(insert, ["user","user@example.com",md5("user123456")])
                //db.run(insert, [1,12120,1292020,'2 Create Input File','Create a record of system file for to-do list application.',10,'T','Started'])
            }
        });  
    }
});


module.exports = db