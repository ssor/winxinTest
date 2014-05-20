

var crypto=require("crypto");

exports.isLegel = isLegel;

function isLegel(signature,timestamp,nonce,token){
	console.log('signature => ' + signature);
	console.log('timestamp => ' + timestamp);
	console.log('nonce     => ' + nonce);

	var array=new Array();
	array[0]=timestamp;
	array[1]=nonce;
	array[2]=token;
	array.sort();
	var hasher=crypto.createHash("sha1");
	var msg=array[0]+array[1]+array[2];
	hasher.update(msg);
	var msg=hasher.digest('h<span></span>ex');//计算SHA1值
	console.log('msg => ' + msg);
	if(msg==signature){
	  return true;
	}else{
	  return false;
	}
}
