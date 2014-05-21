var _                  = require('underscore');
var Q                  = require('q');
var xml2js             = require('xml2js');
var index = require('../routes/index');
require("should");


var msgRequest = '<xml><URL><![CDATA[http://111.67.197.251]]></URL><ToUserName><![CDATA[ssor@qq.com]]></ToUserName><FromUserName><![CDATA[zhangqzh]]></FromUserName><CreateTime>123456</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[test中文]]></Content><MsgId>8989787</MsgId></xml>';
var msgRequest2 = '<xml><URL><![CDATA[http://111.67.197.251]]></URL><ToUserName><![CDATA[ssor@qq.com]]></ToUserName><CreateTime>123456</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[test中文]]></Content><MsgId>8989787</MsgId></xml>';


describe('demo test => ', function(){
	it('named para test =>', function(){
		return;
		var a = [1,2,3,4,5];
		var mapa = _.chain(a).map(function(_num){
			if(_num % 2 == 0) return null;
			else return _num;
		}).without(null).value();
		console.dir(mapa);
	});
	it('parseComingInMessage => ', function(){
		index.parseComingInMessage(msgRequest).then(function(_obj){
			console.dir(_obj);
		}).catch(function(err){
			console.log(err.message);
		})
		index.parseComingInMessage(msgRequest2).then(function(_obj){
			console.dir(_obj);
		}).catch(function(err){
			console.log(err.message);
		})		
	})
});















