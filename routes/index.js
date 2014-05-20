

var _                  = require('underscore');
var weixin = require('./weixinInterface');

var token = 'nodewebgis';

// getAccessID();

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
exports.receiveMsg = function(req, res){
	console.dir(req.rawBody);
	//'<xml><URL><![CDATA[http://111.67.197.251]]></URL><ToUserName><![CDATA[ssor@qq.com]]></ToUserName><FromUserName><![CDATA[zhangqzh]]></FromUserName><CreateTime>123456</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[testÖÐÎÄ]]></Content><MsgId>8989787</MsgId></xml>'

}
function getAccessID(){
	var url = "https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=ssor@qq.com&secret=0785150790";
	httpRequestGet(url).then(function(_response){
		// console.dir(_response);
		// console.log('*****************************')
		// console.dir(_response[0]);
		// console.log('*****************************')
		var data = _response[0].body;
		console.log(data);
		try{
			// {"access_token":"ACCESS_TOKEN","expires_in":7200}
			var list = JSON.parse(data);
			access_token = list.access_token;

		}catch(e){
			console.log(data.error);
		}
	}).catch(function(error){
		console.log('error <= getAccessID '.error);
	});
}


exports.overview = function(req, res){
	res.render('overview');
};
exports.indexAPI = function(req, res){
	res.render('indexAPI', {title:'API Test'});
}
//*********************************************************
