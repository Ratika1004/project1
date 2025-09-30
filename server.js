const express = require('express');
const server = express();

server.get('/item',(req,res) => {
   res.send("items list");
});

server.get('/item/:id',(req,res) => {
   res.send("item id is " + req.params.id);
})

server.post('/item',(req,res) =>{
    res.send("item added");
});

server.put('/item/:id',(req,res) =>{
    res.send("item id  updated");
});

server.delete('/item/:id',(req,res) =>{
    res.send("item id  deleted");
});

server.listen(3000, () => {
    console.log("server is running at http://localhost:3000")
})

