var app = new (require('express'))();
var bodyParser = require('body-parser');
var url = require('url');
var secret = '<SECRET>';

app.use(bodyParser.json());

app.get('/', (request, response) => {
    if (!validateSecret(request, response)) return;
    var shouldPeek = getQueryStringValue(request, 'peek');
    var onSuccess = value => response.status(200).send(value);
    var onError = (value, statusCode) => response.status(statusCode).send(value);
    if (shouldPeek){
        peek(request, onSuccess, onError);
    }
    else {
        dequeue(request, onSuccess, onError);
    }
});

app.post('/', (request, response) => {
    if (!validateSecret(request, response)) return;
    enqueue(request,
        message => response.status(201).send(''),
        error => response.status(400).send(error));
});

function getQueryStringValue(request, key){
    var url_parts = url.parse(request.url, true);
    var query = url_parts.query;
    return query[key];
}

function validateSecret(request, response){
    var context = getContext(request);
    var token = getQueryStringValue(request, 'token');
    if (token === secret){
        return true;
    }
    response.status(401).send('Unauthorized');
    return false;
}

function getContext(request){
    return request.webtaskContext;
}

function peek(request, onRetrieve, onError){
    var ctx = getContext(request);
    var cb = ctx.cb;
    ctx.storage.get((error, data)  => {
        if (error) {
            onError('Error retrieving' + error, 500);
            return cb(error);
        }
        if (data && data.length > 0){
            onRetrieve(data[0]);
        } else {
            onError('Not Found', 404);
        }
    });
}

function dequeue(request, onRetrieve, onError){
    var ctx = getContext(request);
    var cb = ctx.cb;
    peek(request, onRetrieve, onError);
    adjustQueue(ctx, queue => queue.shift());
}

function enqueue(request, onSuccess, onError){
    var ctx = getContext(request);
    var message = request.body;
    if (message){
        adjustQueue(ctx, queue => {
            queue.push(message);
            onSuccess('');
        });
    } else {
        onError('Missing request body', 400);
    }
}

function adjustQueue(ctx, queueAction, onError){
    ctx.storage.get((error, data)  => {
        if (error){
            onError('Error decoding ' + error, 500);
            return cb(error);
        }
        data = data || [];
        queueAction(data);
        ctx.storage.set(data, error => {
            if (error) return cb(error);
        });
    });
}

module.exports = app;