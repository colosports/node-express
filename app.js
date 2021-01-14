// const express = require('express'); 
// const app = express(); 

// app.get('/', (req, res) => { 
// 	res.send("This is the Demo page for"
// 	+ " setting up express server !") 
// }); 

// app.listen(3000, (err) => { 
// 	if (err) { console.log(err); } 
// 	else { 
//         console.log('Server started ' 
//         + 'at http://localhost:3000'); 
//     } 
// }); 

const express = require('express'); 
const helmet = require('helmet'); 
const app = express(); 

app.use(helmet()); 

app.get('/', (req, res) => { 
	res.send("This is the Demo page for"
		+ " setting up express server !") 
}); 

app.listen(3000, (err) => { 
	if (err) { console.log(err); } 
	else { console.log('Server started ' 
		+ 'at http://localhost:3000'); } 
}); 
