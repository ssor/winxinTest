

var _                  = require('underscore');
var weixin = require('./weixinInterface');

var token = 'nodewebgis';


exports.index = function(req, res){
	var signature = req.query.signature;
	var timestamp = req.query.timestamp;
	var nonce = req.query.nonce;
	var echostr = req.query.echostr;
	if(weixin.isLegel(signature, timestamp, nonce, token) == true){
		res.send(echostr);
	}else{
		res.send('');
	}
}

exports.overview = function(req, res){
	res.render('overview');
};
exports.indexAPI = function(req, res){
	res.render('indexAPI', {title:'API Test'});
}
//*********************************************************
