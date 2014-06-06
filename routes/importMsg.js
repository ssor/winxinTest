
var _                  = require('underscore');
var timeFormater 	   = require('./timeFormat').getCurrentTime;

exports.checkMsgList = function(_content){
	var indexJing = _content.indexOf('#');
	var indexMi = _content.indexOf('*');
	if(indexJing <= 0 && indexMi <= 0){
		return false;
	}else{
		if(indexJing > 0){
			var msgFlag   = _content.substr(0, index);
			var list      = _.chain(importedMessageList).where({msgFlag: msgFlag}).value();
			return list;
		}
		if(indexMi > 0){
			var content   = _content.substr(0, index);
			var timeStamp = timeFormater();
			tucaoMessageList.push({content: content, timeStamp: timeStamp});
			return true;
		}
	}
}

exports.addMsg = function(req, res){
	// console.log('addMsg => '.info);
	var body 	  = req.body;
	// console.dir(req.rawBody);
	// console.dir(body);
	var msgFlag   = body.msgFlag;
	var msgID 	  = body.msgID;
	var content   = body.content;
	var timeStamp = timeFormater();
	if(content == null || content.length <= 0){
		res.send('error');return;
	}
	var msg = _.chain(importedMessageList).findWhere({msgID: msgID, msgFlag: msgFlag}).value();
	// console.dir(msg);
	if(msg == null){
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

