

var _                  = require('underscore');
var Q                  = require('q');
var xml2js             = require('xml2js');
var weixin = require('./weixinInterface');
var xml = require('xml');
var Message = require('./Message');

var parser = new xml2js.Parser();
parseXml = Q.nbind(parser.parseString, parser);
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
	parseComingInMessage(req.rawBody).then(function(_receivedMsg){
		var url = "http://111.67.197.251:9002/bagageStatusIndex/b007";
		var content = '点击链接查看单号状态：' + url;
		var resMessage = new Message(_receivedMsg.FromUserName, 
			_receivedMsg.ToUserName, _receivedMsg.CreateTime, 
			_receivedMsg.MsgType, content);
		var xml = buildXml(resMessage.getPrepareXmlBuilding());
		console.log("<= " + xml);
		res.send(xml);
	}).catch(function(error){
		console.log(error.message.error);
		res.send('');
	})
}

exports.parseComingInMessage = parseComingInMessage;
function parseComingInMessage(_msg){
	return parseXml(_msg).then(function(_result){
		var f = function(_obj){
			return function(_property){
				return _.has(_obj, _property)
			};
		};
		if(f(_result)('xml')){
			var resultxmlFunc = f(_result.xml);
			if(resultxmlFunc('ToUserName') && resultxmlFunc('FromUserName') && resultxmlFunc('CreateTime')
				&& resultxmlFunc('MsgType') && resultxmlFunc('MsgId') && resultxmlFunc('Content')){
				var resultxml = _result.xml;
				// console.dir(resultxml);
				// return {ToUserName: resultxml.ToUserName, FromUserName: resultxml.FromUserName
				// 		, CreateTime: resultxml.CreateTime, MsgType: resultxml.MsgType, MsgId: resultxml.MsgId
				// 		, Content: resultxml.Content};
				return new Message(resultxml.ToUserName[0], resultxml.FromUserName[0], resultxml.CreateTime[0], resultxml.MsgType[0], resultxml.Content[0], resultxml.MsgId[0]);
			}else{
				throw new Error('propertyError');
			} 
		}else{
			throw new Error('DataErrorXml');
		}
	})
}
exports.buildXml = buildXml;
function buildXml(_obj){
	return xml(_obj);
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
//*********************************************************
exports.overview = function(req, res){
	res.render('overview');
};
exports.indexAPI = function(req, res){
	res.render('indexAPI', {title:'API Test'});
}
