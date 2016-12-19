var app = new (require('express'))();
var url = require('url');
var secret = '<SECRET>';

app.get('/', (request, response) => {
    if (!validateSecret(request, response)) return;
    getContext(request);
    response.send('Hello World');
});

app.post('/', (request, response) => {
    if (!validateSecret(request, response)) return;
    response.send('Hello World');
});

app.delete('/', (request, response) => {
    if (!validateSecret(request, response)) return;
    response.send('Hello World');
});

function validateSecret(request, response){
    var context = getContext(request);
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    var token = query.token;
    if (token === secret){
        return true;
    }
    response.status(401).send('Unauthorized');
    return false;
}

function getContext(request){
    return request.webtaskContext;
}

module.exports = app;