// Create web server
var http = require('http');
var url = require('url');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {}; // Cache file content

// Create HTTP server
var server = http.createServer(function(request, response) {
    var filePath = false;

    if (request.url == '/') {
        // Determine HTML file to be served by default
        filePath = 'public/index.html';
    } else {
        // Translate URL path to relative file path
        filePath = 'public' + request.url;
    }

    var absPath = './' + filePath;
    serveStatic(response, cache, absPath);
});

// Start HTTP server
server.listen(3000, function() {
    console.log("Server listening on port 3000.");
});

// Load custom Node module for handling Socket.IO
var chatServer = require('./lib/chat_server');
chatServer.listen(server);

// Handle 404 errors
function send404(response) {
    response.writeHead(404, {'Content-Type': 'text/plain'});
    response.write('Error 404: resource not found.');
    response.end();
}

// Serve file data
function sendFile(response, filePath, fileContents) {
    response.writeHead(
        200,
        {'Content-Type': mime.lookup(path.basename(filePath))}
    );
    response.end(fileContents);
}

// Serve static files
function serveStatic(response, cache, absPath) {
    // Check if file is cached in memory
    if (cache[absPath]) {
        // Serve file from memory
        sendFile(response, absPath, cache[absPath]);
    } else {
        // Check if file exists
        fs.exists(absPath, function(exists) {
            if (exists) {
                // Read file from disk
                fs.readFile(absPath, function(err, data) {
                    if (err) {
                        // Return 404 error
                        send404(response);
                    } else {
                        // Cache file in memory and serve file from disk
                        cache[absPath] = data;
                        sendFile(response, absPath, data);
                    }
                });
            } else {
                // Return 404 error
                send404(response);
            }
        });
    }
}
