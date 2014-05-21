module.exports = Message;

function Message(_ToUserName, _FromUserName, _CreateTime, _MsgType, _Content, _MsgId){
	// console.log(_ToUserName);
	this.ToUserName = _ToUserName;
	this.FromUserName = _FromUserName;
	this.CreateTime = _CreateTime;
	this.MsgType = _MsgType;
	this.Content = _Content;
	if(_MsgId != null){
		this.MsgId = _MsgId;
	}
}
Message.prototype.getPrepareXmlBuilding = function() {
	return {xml: [{ToUserName: { _cdata: this.ToUserName}}, {FromUserName: {_cdata: this.FromUserName}}
				, {CreateTime: this.CreateTime}, {MsgType: {_cdata: this.MsgType}}
				, {Content: {_cdata: this.Content}}]};
	// return {xml: [{ToUserName: {_cdata: 'name'}}, {FromUserName: 'name'}]};
};
