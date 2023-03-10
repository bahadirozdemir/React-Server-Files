var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port =3001;
app.get("/",function(req,res){
    res.send('Youtbe')
})


http.listen(port,function(){
    console.log("server çalışıyor : http://localhost:"+port);
})