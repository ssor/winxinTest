
var _                  = require('underscore');
var timeFormater 	   = require('./timeFormat').getCurrentTime;

exports.checkMsgList = function(_content){
	var index = _content.indexOf('#');
	if(index < 0){
		return false;
	}else{
		var msgFlag = _content.substr(0, index);
		var list = _.chain(importedMessageList).where({msgFlag: msgFlag}).value();
		return list;
	}
}

exports.addMsg = function(req, res){
	var body 	  = req.body;
	var msgFlag   = body.msgFlag;
	var msgID 	  = body.msgID;
	var content   = body.content;
	var timeStamp = timeFormater();

	if(content == null || content.length <= 0){
		res.send('error');return;
	}
	var msg = _.chain(importedMessageList).findWhere({msgID: msgID, msgFlag: msgFlag}).value();
	
	if(msg === null){
		console.log('addMsg new ');
		importedMessageList.push({msgFlag: msgFlag, msgID: msgID, content: content, timeStamp: timeStamp});
	}else{
		console.log('addMsg update ');
		msg.content = content;
		msg.timeStamp = timeStamp;
	}
	console.log('addMsg =>'.info);
	console.dir(msg);
	res.send('ok');
}
exports.msgList = function(req, res){
	var msgFlag = req.query.msgFlag;
	var list = _.chain(importedMessageList).filter(function(_msg){
		return _msg.msgFlag === msgFlag;
	}).value();
	console.log('msgList =>');
	console.dir(list);
	res.send(JSON.stringify(list));
}
exports.deleteMsg = function(req, res){
	var msgFlag = req.query.msgFlag;
	var msgID 	= req.query.msgID;
	importedMessageList = _.chain(importedMessageList).reject(function(_msg){
		return _msg.msgFlag === msgFlag && _msg.msgID === msgID;
	}).value();
	res.send('ok');
}

