

var _                  = require('underscore');
var Q                  = require('q');
var xml2js             = require('xml2js');
var weixin = require('./weixinInterface');
var xml = require('xml');
var Message = require('./Message');
var NewsMessage = require('./NewsMessage');
var checkMsgList = require('./importMsg').checkMsgList;
var timeFormater 	   = require('./timeFormat').getCurrentTime;

var parser = new xml2js.Parser();
parseXml = Q.nbind(parser.parseString, parser);

// getAccessID();
// setInterval(checkBagageStatus, 5000);

exports.test = function(req, res){
	console.log('test =>');
	res.send('ok');
}
exports.tucaoIndex = function(req, res){
	res.render('index');
}
exports.getTucao = function(req, res){
	var timeStamp = req.body.timeStamp;
	var list = _.chain(tucaoMessageList).filter(function(_tucao){
		return _tucao.timeStamp > timeStamp;
	}).value();
	console.log('later than ' + timeStamp);
	console.dir(list);
	res.send(JSON.stringify(list));
}

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
		var stateDefinationList 
			= [{separator: null, returnedValue: 'bagage'}
				,{separator: '#', returnedValue: 'camera'}
				,{separator: '*', returnedValue: 'tucao'}];
		var state = checkMsgState(_receivedMsg.Content, stateDefinationList);
		console.dir(state);
		switch(state.returnedValue){
			case 'bagage':
			checkBagageStatus(_receivedMsg.Content)
			.then(function(_status){
				if(_status.status == 'ok'){
						// var url = "http://111.67.197.251:9002/bagageStatusIndex/b001";
						var resMessage = new NewsMessage(_receivedMsg.FromUserName, _receivedMsg.ToUserName, _receivedMsg.CreateTime);
						var picUrl = webgisHost + 'Image/carPos/' + _status.imageName;
						resMessage.addItem('订单状态查询', '单号'+ _receivedMsg.Content+'最新位置('+ _status.timeStamp +')', picUrl, picUrl);
						var xml = buildXml(resMessage.getPrepareXmlBuilding());
						console.log("<= " + xml);
						res.send(xml);					
				}else{
					throw new Error(_status.message);
				}
			})				
			break;
			case 'camera':
				var resMessage = new NewsMessage(_receivedMsg.FromUserName, _receivedMsg.ToUserName, _receivedMsg.CreateTime);
				var picUrl = '';
				resMessage.addItem('状态列表', '', picUrl, picUrl);
				var msgFlag   = _receivedMsg.Content.substr(0, _receivedMsg.Content.indexOf(state.separator));
				var list      = _.chain(importedMessageList).where({msgFlag: msgFlag}).value();

				_.each(list, function(_msg){
					resMessage.addItem(_msg.msgID + ' ' + _msg.content + ' ' + _msg.timeStamp, '', picUrl, picUrl);
				});
				var xml = buildXml(resMessage.getPrepareXmlBuilding());
				console.log("<= " + xml);
				res.send(xml);				
			break;
			case 'tucao':
				var tucaoContent = _receivedMsg.Content.substr(_receivedMsg.Content.indexOf(state.separator) + 1);
				var timeStamp = timeFormater();
				var newTucao = {FromUserName: _receivedMsg.FromUserName, Content: tucaoContent, timeStamp: timeStamp};
				tucaoMessageList.push(newTucao);
				console.dir(newTucao);
				res.send('');
			break;
		}

	}).catch(function(error){
		console.log(error.message.error);
		res.send('');
	})

	return;

		// var list = checkMsgList(_receivedMsg.Content);
		// console.dir(list);
		// if(list === false){
		// 	return  checkBagageStatus(_receivedMsg.Content)
		// 			.then(function(_status){
		// 				if(_status.status == 'ok'){
		// 					// var url = "http://111.67.197.251:9002/bagageStatusIndex/b001";
		// 					var resMessage = new NewsMessage(_receivedMsg.FromUserName, _receivedMsg.ToUserName, _receivedMsg.CreateTime);
		// 					var picUrl = webgisHost + 'Image/carPos/' + _status.imageName;
		// 					resMessage.addItem('订单状态查询', '单号'+ _receivedMsg.Content+'最新位置('+ _status.timeStamp +')', picUrl, picUrl);
		// 					var xml = buildXml(resMessage.getPrepareXmlBuilding());
		// 					console.log("<= " + xml);
		// 					res.send(xml);					
		// 				}else{
		// 					throw new Error(_status.message);
		// 				}
		// 			})		
		// }else{
		// 	var resMessage = new NewsMessage(_receivedMsg.FromUserName, _receivedMsg.ToUserName, _receivedMsg.CreateTime);
		// 	var picUrl = '';
		// 	resMessage.addItem('状态列表', '', picUrl, picUrl);
		// 	_.each(list, function(_msg){
		// 		resMessage.addItem(_msg.msgID + ' ' + _msg.content + ' ' + _msg.timeStamp, '', picUrl, picUrl);
		// 	});
		// 	var xml = buildXml(resMessage.getPrepareXmlBuilding());
		// 	console.log("<= " + xml);
		// 	res.send(xml);				
		// }	
}
function checkMsgState(_content, _stateList){
	var state = _.chain(_stateList).filter(function(_state){
		return _state.separator != null;
	}).find(function(_state){
		return _content.indexOf(_state.separator) > 0;
	}).value();
	if(state != null) return state 
	else return _stateList[0];
}
function checkBagageStatus(_bagageID){
	return httpRequestGet(webgisHost + 'getBagageStatus4Weixin/' + _bagageID)
			.then(function(_response){
				var data = _response[0].body;
				console.log(data);
				try{
					var list = JSON.parse(data);
					return list;
				}catch(e){
					console.log(data.error);
					throw new Error(e.message);
				}
			});
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
