
/**
 * Module dependencies.
 */
token               = 'nodewebgis';
access_token        = null;
webgisHost          = 'http://111.67.197.251:9002/';
  // webgisHost = 'http://127.0.0.1:9002/';
importedMessageList = [];
tucaoMessageList = [];


var colors          = require('colors');
colors.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

var Q               = require('q');

var request         = require('request');
httpRequestGet      = Q.denodeify(request.get);
httpRequestPost     = Q.denodeify(request.post);

var express         = require('express');
var routes          = require('./routes');
var http            = require('http');
var path            = require('path');
var importMsg = require('./routes/importMsg');

var app             = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
// app.use(function(req, res, next) {
//     var data = '';
//     req.setEncoding('utf8');
//     req.on('data', function(chunk) { 
//         data += chunk;
//     		console.log('=> ' + data);
//     });
//     req.on('end', function() {
//         req.rawBody = data;
//         console.log('end => ' + data);
//     		next();
//     });
    
// });
app.use(function(req, res, next){
  // console.dir(req.headers);
  if (req.is('text/*')) {
    req.rawBody = '';
    req.setEncoding('utf8');
    req.on('data', function(chunk){ req.rawBody += chunk });
    req.on('end', next);
  } else {
    next();
  }
});
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/', routes.receiveMsg);
app.post('/addMsg', importMsg.addMsg);
app.get('/msgList', importMsg.msgList);
app.get('/deleteMsg', importMsg.deleteMsg);
app.post('/getTucao',routes.getTucao);
app.get('tucao', routes.tucaoIndex);


http.createServer(app).listen(app.get('port'), function(){
  console.log(('weixin message server listening on port ' + app.get('port')).info);
});






