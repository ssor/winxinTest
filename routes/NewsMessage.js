var _                  = require('underscore');
module.exports = NewsMessage;

function NewsMessage(_ToUserName, _FromUserName, _CreateTime){
	this.ToUserName = _ToUserName;
	this.FromUserName = _FromUserName;
	this.CreateTime = _CreateTime;
	this.MsgType = 'news';
	this.Articles = [];
}
NewsMessage.prototype.addItem = function(_title, _description, _picUrl, _url){
	this.Articles.push({Title: _title, Description: _description, PicUrl: _picUrl, Url: _url})
}
NewsMessage.prototype.getPrepareXmlBuilding = function() {
	var ArticleCount = _.size(this.Articles);
	var items = _.chain(this.Articles)
				.map(function(_article){
					return {item: 
								[
									{Title: {_cdata: _article.Title}},
									{Description: {_cdata: _article.Description}},
									{PicUrl: {_cdata: _article.PicUrl}},
									{Url: {_cdata: _article.Url}}
			  				    ]
							}
				}).value();

	return {xml: 
				[
					{ToUserName: {_cdata: this.ToUserName}}, 
					{FromUserName: {_cdata: this.FromUserName}}, 
					{CreateTime: this.CreateTime}, 
					{MsgType: {_cdata: this.MsgType}}, 
					{ArticleCount: ArticleCount},
					{Articles: items}
				]
			};
};





