var _                  = require('underscore');
var Q                  = require('q');
var request = require('request');
httpRequestGet = Q.denodeify(request.get);
var xml2js             = require('xml2js');
var index = require('../routes/index');
var NewsMessage = require('../routes/NewsMessage');

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
		return
		index.parseComingInMessage(msgRequest).then(function(_obj){
			console.log('obj => ');
			console.dir(_obj);
			console.log('xml => ');
			var xml = index.buildXml(_obj.getPrepareXmlBuilding());
			console.dir(xml);
		}).catch(function(err){
			console.log(err.message);
		})
		return;
		index.parseComingInMessage(msgRequest2).then(function(_obj){
			console.dir(_obj);
		}).catch(function(err){
			console.log(err.message);
		})		
	})

	it('initial NewsMessage => ', function(){
		return
		var NewsMessage1 = new NewsMessage('to1', 'former', 12345);
		NewsMessage1.addItem('订单状态查询', '最新位置：', '/image/pic1.png', '');
		var xml = index.buildXml(NewsMessage1.getPrepareXmlBuilding());
		console.log(xml);
	})

	it('request bagage status =>', function(){
		return;
		httpRequestGet('http://127.0.0.1:9002/getBagageStatus4Weixin/b111')
		.then(function(_response, _body){
			console.dir(_response);
			console.dir(_body);
			console.dir(_response.body);
			var data = _response[0].body;
			console.log(data);
			try{
				var list = JSON.parse(data);
			}catch(e){
				console.log(data.error);
		}}).catch(function(error){
				console.log('error <= '.error);
		});
	})

	it('obj property =>', function(){

		var pro1 = {property1: 'propertytest1'};
		var obj1 = initialSelector(pro1);
		console.dir(obj1);
		(_.isEqual(obj1, pro1)).should.be.true;

		var pro2 = {property2: null};
		var obj2 = initialSelector(pro2);
		console.dir(obj2);
		console.log(_.chain(obj2).keys().size().value());
		(_.chain(obj2).keys().size().value() == 0).should.be.true;

	})
});

function initialSelector(opts){
	if(opts == null) return {};
	var obj = {};
	_.chain(opts).keys().reduce(function(memo, _key){
		if(opts[_key] != null){
			memo[_key] = opts[_key];
		}
	}, obj).value();
	return obj;
}














