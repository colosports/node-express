// Create express app
var express = require("express")
var app = express()
var db = require("./database.js")
var md5 = require("md5")
const helmet = require('helmet'); 
app.use(helmet()); 

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
const methodOverride = require('method-override');
app.use(methodOverride('_method'));

const column1 = 'rowNum';
const column2 = 'dateCreated';
const column3 = 'dueDate';
const column4 = 'title';
const column5 = 'comments';
const column6 = 'priority';
const column7 = 'completion'; 
const column8 = 'status'; 

// Server port
var HTTP_PORT = 8000 
// Start server
app.listen(HTTP_PORT, () => {
    console.log("Server running on port %PORT%".replace("%PORT%",HTTP_PORT))
});
// Root endpoint
app.get("/", (req, res, next) => {
    //res.json({"message":"Ok"})
  
    res.send('<html>\n<head><title>Todo List - Home Page</title></head>\n\n<body>' 
    + '\n<div><a href="/">Home</a></div>' 
    + '\n<div><a href="/api/tasks">View Tasks</a></div>'
    + '\n<div><a href="/add">Create a New Task</a></div>'
    + '\n<div><a href="/view">Edit a Task</a></div>'
    //+ '\n<div><a href="/delete"><img src="./images/icon_delete.png" />Delete a Task</a></div>'
    // + '\n<div><a href="/tasks?term=hello%20world">Test</a></div>' 
    + '\n</body>\n</html>');

});


// Insert here other API endpoints

//Get a List of all users
app.get("/api/tasks", (req, res, next) => {
    var sql = "select * from TaskList"
    sort = req.query.sort;
    order = req.query.order;

    // Sort
    switch (sort) {
        case "column1":
        if (order == "desc")
            sql = "SELECT * FROM TaskList ORDER BY " + column1 + " DESC";
        else
            sql = "SELECT * FROM TaskList ORDER BY " + column1 + " ASC"; 
        break;
        case "column2":
        if (order == "desc")
            sql = "SELECT * FROM TaskList ORDER BY " + column2 + " DESC";
        else 
            sql = "SELECT * FROM TaskList ORDER BY " + column2 + " ASC"; 
        break;
        case "column3":
        if (order == "desc")
            sql = "SELECT * FROM TaskList ORDER BY " + column3 + " DESC";
        else 
            sql = "SELECT * FROM TaskList ORDER BY " + column3 + " ASC"; 
        break;    
        case "column4":
        if (order == "desc")
            sql = "SELECT * FROM TaskList ORDER BY " + column4 + " DESC";
        else 
            sql = "SELECT * FROM TaskList ORDER BY " + column4 + " ASC"; 
        break;    
        case "column5":
        if (order == "desc")
            sql = "SELECT * FROM TaskList ORDER BY " + column5 + " DESC";
        else 
            sql = "SELECT * FROM TaskList ORDER BY " + column5 + " ASC"; 
        break;    
        case "column6":
        if (order == "desc")
            sql = "SELECT * FROM TaskList ORDER BY " + column6 + " DESC";
        else 
            sql = "SELECT * FROM TaskList ORDER BY " + column6 + " ASC"; 
        break;    
        case "column7":
            if (order == "desc")
            sql = "SELECT * FROM TaskList ORDER BY " + column7 + " DESC";
            else 
            sql = "SELECT * FROM TaskList ORDER BY " + column7 + " ASC"; 
            break;     
        case "column8":
            if (order == "desc")
            sql = "SELECT * FROM TaskList ORDER BY " + column8 + " DESC";
            else 
            sql = "SELECT * FROM TaskList ORDER BY " + column8 + " ASC"; 
            break;    
        default:
        sql = "SELECT * FROM TaskList ORDER BY oid"; 
        sort = ""; // define this as NULL if invalid value
        break;    
    }
    var params = []
    db.all(sql, params, (err, rows) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        // res.json({
        //     "message":"success",
        //     "data":rows
        // })
        //res.send('<html>\n<head><title>' + myTitle + '</title></head>\n<body>\n' + dataToTable(rows) + '\n<a href="/">Return to Home</a>\n</body>\n</html>')      
        res.send('<html>\n<head><title>View all Task</title></head>\n<body>\n' + viewTasks(rows) + '\n<a href="/">Return to Home</a>\n</body>\n</html>')      
   
      });
});

//Get a single user by id
app.get("/api/task/:id", (req, res, next) => {
    var sql = "select * from TaskList where oid = ?"
    var params = [req.params.id]
    db.get(sql, params, (err, row) => {
        if (err) {
          res.status(400).json({"error":err.message});
          return;
        }
        res.json({
            "message":"success",
            "data":row
        })
      });
});

// Create a new task
app.post("/api/task/", (req, res, next) => {
    var errors=[]
    myTitle = "Task Creation"
    if (!req.body.rowNum){
        errors.push("No rowNum provided");
    }
    if (!req.body.title){
        errors.push("No title provided");
    }
    if (errors.length){
        res.status(400).json({"error":errors.join(",")});
        return;
    }
    var data = {
        // name: req.body.name,
        // email: req.body.email,
        // password : md5(req.body.password)
        rowNum: req.body.rowNum,
        dateCreated: req.body.dateCreated,
        dueDate: req.body.dueDate,
        title: req.body.title,
        comments: req.body.comments,
        priority: req.body.priority,
        completion: req.body.completion,
        status: req.body.status         
    }
    var sql ='INSERT INTO TaskList(rowNum, dateCreated, dueDate, title, comments, priority, completion, status) VALUES(?,?,?,?,?,?,?,?)'
    var params =[data.rowNum, data.dateCreated, data.dueDate, data.title, data.comments, data.priority, data.completion, data.status]
    db.run(sql, params, function (err, result) {
        if (err){
            res.status(400).json({"error": err.message})
            res.send('<html>\n<head><title>' + myTitle + '</title></head>\n<body>\n' + err.message + '\n<a href="/">Return to Home</a>\n</body>\n</html>')     
            return;
        }
        else {
            messageBody = 'Task was created successfully!' + '<a href="./' + this.lastID +'">Click here to view newly created task.</a>';
            res.send('<html>\n<head><title>' + myTitle + '</title></head>\n<body>\n' + messageBody  + '\n<hr/><a href="/">Home</a> | <a href="../tasks">View all Tasks</a>\n</body>\n</html>')     
        }        
            // res.json({
            //     "message": "success",
            //     "data": data,
            //     "id" : this.lastID            
            // })
    });
})


// Create a new task
app.get("/add", (req, res, next) => {
    myTitle = "Add a task"
    res.send('<html>\n<head><title>' + myTitle + '</title></head>\n<body>\n' + addTask() + '\n<a href="/">Return to Home</a>\n</body>\n</html>')     

})

//Update an user
app.patch("/api/task/:id", (req, res, next) => {
    var data = {
        // name: req.body.name,
        // email: req.body.email,
        // password : req.body.password ? md5(req.body.password) : null
        rowNum: req.body.rowNum,
        dateCreated: req.body.dateCreated,
        dueDate: req.body.dueDate,
        title: req.body.title,
        comments: req.body.comments,
        priority: req.body.priority,
        completion: req.body.completion,
        status: req.body.status 
    }
    db.run(
        // `UPDATE user set 
        //    name = COALESCE(?,name), 
        //    email = COALESCE(?,email), 
        //    password = COALESCE(?,password) 
        //    WHERE id = ?`,
        // [data.name, data.email, data.password, req.params.id],
        `UPDATE TaskList set 
            rowNum = COALESCE(?,rowNum), 
            dateCreated = COALESCE(?,dateCreated), 
            dueDate = COALESCE(?,dueDate), 
            title = COALESCE(?,title), 
            comments = COALESCE(?,comments), 
            priority = COALESCE(?,priority), 
            completion = COALESCE(?,completion), 
            status = COALESCE(?,status)
            WHERE oid = ?`,
        [data.rowNum, data.dateCreated, data.dueDate, data.title, data.comments, data.priority, data.completion, data.status, req.params.id],
                
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            res.json({
                message: "success",
                data: data,
                changes: this.changes
            })
    });
})

//Delete an task api
app.delete("/api/task/:id", (req, res, next) => {
    db.run(
        'DELETE FROM TaskList WHERE oid = ?',
        req.params.id,
        function (err, result) {
            if (err){
                res.status(400).json({"error": res.message})
                return;
            }
            else {
                messageBody = 'Task was deleted successfully!' + 'Changes to database made: ' + this.changes;
                res.send('<html>\n<head><title>' + myTitle + '</title></head>\n<body>\n' + messageBody  + '\n<hr/><a href="/">Home</a> | <a href="../tasks">View all Tasks</a>\n</body>\n</html>')     
            }  
            //res.json({"message":"deleted", changes: this.changes})
    });
})

//Delete a task page
app.get("/delete", (req, res, next) => {
    oid = req.query.oid;
    myTitle = "Delete Confirmation";
    var tableString = "Are you sure you want to delete the following task?\n<br />"; 
        tableString +='oid = ' + oid + '\n<br />';    
        tableString += '<form method="post" action="/api/task/' + oid +'?_method=DELETE">';   
        //tableString +='<input type="hidden" id="oid" name="oid" value="' + oid + '" />\n<br />';                  
        tableString += '<br /><input type="submit" value="Confirm">'; 
        tableString += "</form>\n";
    
    res.send('<html>\n<head><title>' + myTitle + '</title></head>\n<body>\n' + tableString + '\n<hr/><a href="/">Home</a> | <a href="../tasks">View all Tasks</a>\n</body>\n</html>')    

})

// Default response for any other request
app.use(function(req, res){
    res.status(404);
});

//sort and view all tasks
function viewTasks(data) {
    var tableString = "";
    tableString += '<table border="1">\n<thead>';      
    tableString +='<tr>';
    if ((sort == "column1") && (order =="asc"))
    tableString += '<th>&uarr; <a href="./tasks?sort=column1&order=desc">Row Number</a></th>';
    else if ((sort == "column1") && (order =="desc"))
    tableString += '<th>&darr; <a href="./tasks?sort=column1&order=asc">Row Number</a></th>';
    else 
    tableString += '<th><a href="./tasks?sort=column1&order=asc">Row Number</a></th>';
  
    if ((sort == "column2") && (order =="asc"))
    tableString += '<th>&uarr; <a href="./tasks?sort=column2&order=desc">Date Created</a></th>';
    else if ((sort == "column2") && (order =="desc"))
    tableString += '<th>&darr; <a href="./tasks?sort=column2&order=asc">Date Created</a></th>';
    else 
    tableString += '<th><a href="./tasks?sort=column2&order=asc">Date Created</a></th>';
  
    if ((sort == "column3") && (order =="asc"))
    tableString += '<th>&uarr; <a href="./tasks?sort=column3&order=desc">Due Date</a></th>' ; 
    else if ((sort == "column3") && (order =="desc"))
    tableString += '<th>&darr; <a href="./tasks?sort=column3&order=asc">Due Date</a></th>' ;
    else
    tableString += '<th><a href="./tasks?sort=column3&order=asc">Due Date</a></th>' ; 
  
    if ((sort == "column4") && (order =="asc"))
    tableString += '<th>&uarr; <a href="./tasks?sort=column4&order=desc">Title</a></th>';
    else if ((sort == "column4") && (order =="desc"))
    tableString += '<th>&darr; <a href="./tasks?sort=column4&order=asc">Title</a></th>';
    else
    tableString += '<th><a href="./tasks?sort=column4&order=asc">Title</a></th>';
  
    if ((sort == "column5") && (order =="asc"))
    tableString += '<th>&uarr; <a href="./tasks?sort=column5&order=desc">Comments</a></th>';
    else if ((sort == "column5") && (order =="desc"))
    tableString += '<th>&darr; <a href="./tasks?sort=column5&order=asc">Comments</a></th>';
    else
    tableString += '<th><a href="./tasks?sort=column5&order=asc">Comments</a></th>';
  
    if ((sort == "column6") && (order =="asc"))
    tableString += '<th>&uarr; <a href="./tasks?sort=column6&order=desc">Priority</a></th>';
    else  if ((sort == "column6") && (order =="desc"))
    tableString += '<th>&darr; <a href="./tasks?sort=column6&order=asc">Priority</a></th>';
    else
    tableString += '<th><a href="./tasks?sort=column6&order=asc">Priority</a></th>';
  
    if ((sort == "column7") && (order =="asc"))
    tableString += '<th>&uarr; <a href="./tasks?sort=column7&order=desc">Completion</a></th>' ; 
    else if ((sort == "column7") && (order =="desc"))
    tableString += '<th>&darr; <a href="./tasks?sort=column7&order=asc">Completion</a></th>' ; 
    else
    tableString += '<th><a href="./tasks?sort=column7&order=asc">Completion</a></th>' ; 
  
    if ((sort == "column8") && (order =="asc"))
    tableString += '<th>&uarr; <a href="./tasks?sort=column8&order=desc">Status</a></th>' ; 
    else if ((sort == "column7") && (order =="desc"))
    tableString += '<th>&darr; <a href="./tasks?sort=column8&order=asc">Status</a></th>' ; 
    else
    tableString += '<th><a href="./tasks?sort=column8&order=asc">Status</a></th>' ; 
  
    tableString += '<th>Options</th>';
    tableString += '</tr>';  
    tableString += "</thead>\n<tbody>\n";  
  
    for(var i in data) {
        var task = data[i];
        tableString +="<tr><td>" + task.rowNum  
                    + "</td><td>" + task.dateCreated
                    + "</td><td>" + task.dueDate
                    + "</td><td>" + task.title
                    + "</td><td>" + task.comments
                    + "</td><td>" + task.priority
                    + "</td><td>" + task.completion
                    + "</td><td>" + task.status
                    + '</td><td><a href="../edit?oid=' + task.oid + '">Edit</a> | <a href="../delete?oid=' + task.oid + '">Delete</a> '                                  
                    + "</td></tr>\n";                           
    }
    tableString += "</tbody>\n</table>\n";
    //console.log(tableString);     
    return tableString;                    
  }    

// form to add a task
function addTask() {
	var tableString = "";
	tableString += '<form action="/api/task/" method="POST">';   
    tableString +='<label for="rowNum">rowNum: </label><input type="text" id="rowNum" name="rowNum" value="" /><br />'
            + '<label for="dateCreated">dateCreated: </label><input type="text" id="dateCreated" name="dateCreated" value="" /><br />' 
            + '<label for="dueDate">dueDate: </label><input type="text" id="dueDate" name="dueDate" value="" /><br />'
            + '<label for="title">title: </label><input type="text" id="title" name="title" value="" /><br />'
            + '<label for="comments">comments: </label><input type="text" id="comments" name="comments" value="" /><br />'
            + '<label for="priority">priority: </label><input type="text" id="priority" name="priority" value="" /><br />'
            + '<label for="completion">completion: </label><input type="text" id="completion" name="completion" value="" /><br />'
            + '<label for="status">status: </label><input type="text" id="status" name="status" value="" /><br />'                               
            + '<br /><input type="submit" value="Add">'; 

	tableString += "</form>\n";
	//console.log(tableString);     
	return tableString;                    
}