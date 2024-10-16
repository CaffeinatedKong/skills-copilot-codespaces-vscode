//Create web server
var http = require('http');
var fs = require('fs');
var url = require('url');
var path = require('path');
var port = 3000;
var server = http.createServer(function (req, res) {
    var urlObj = url.parse(req.url, true);
    var filePath = '.' + urlObj.pathname;
    if (filePath == './') {
        filePath = './index.html';
    }
    var extname = path.extname(filePath);
    var contentType = 'text/html';
    switch (extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
    }
    fs.exists(filePath, function (exists) {
        if (exists) {
            fs.readFile(filePath, function (err, data) {
                res.writeHead(200, {
                    'Content-Type': contentType
                });
                res.end(data);
            });
        } else {
            res.writeHead(404, {
                'Content-Type': contentType
            });
            res.end('404 Not dasd\n');
        }
    });
});
server.listen(port, function () {
    console.log('Server is listening on port ' + port);
});
var io = require('socket.io').listen(server);
//array to store comments
var comments = [];
io.sockets.on('connection', function (socket) {
    //send comments to client
    socket.emit('load', comments);
    //add comment to array
    socket.on('add', function (data) {
        comments.push(data);
        //send new comments to client
        io.sockets.emit('add', data);
    });
});