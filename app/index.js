/**
 * @file The main module which creates the HTTP server.
 */
var http = require('http');
var httpPort = 8888;

/**
 * Output the HTML head to the HTTP response.
 *
 * @param {{object}} response - A reference to the HTTP response that will be sent to the browser.
 */
function writeHead(response) {
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write('<!DOCTYPE HTML><html><head><title>Home Page</title></head><body>');
}

/**
 * Output the footer to the HTTP response.
 *
 * @param {object} response - A reference to the HTTP response that will be sent to the browser.
 */
function writeFooter(response) {
    response.write('</body></html>');
}

/**
 * Output the home page content to the HTTP response.
 *
 * @param {object} request - A reference to the HTTP request that was sent to the web server.
 * @param {object} response - A reference to the HTTP response that will be sent to the browser.
 */
function writeHTTPContent(request, response) {
    writeHead(response);
    response.write('<article class="hello-world">Hello World!</article>');
    writeFooter(response);
    response.end();
}

/** HTTP server response handler */
module.exports = writeHTTPContent;

// Export HTTP server as a module to make it possible for tests to use the server.
if (!module.parent) {
    http.createServer(writeHTTPContent).listen(httpPort, function () {
        console.log('HTTP server is listening on port ' + httpPort);
    });
}
