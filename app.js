const express = require('express')
const app = express()
const axios = require('axios');
const fs = require("fs")
const path= require("path")


app.use(express.static(__dirname+"/",{index:"index.html"}));

// 设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

// 用户信息
var user = {};
app.get('/searchInfo', async (req, res) => {
	setData(req, res, 'searchInfo');
})
app.get('/checkIn', async function (req, res) {
	setData(req, res, 'checkIn');
});
app.get('/checkOut', async function (req, res) {
	setData(req, res, 'checkOut');
});

async function setData(req, res, type){
	// 读取参数
	let id = req.param('id');
	// 填充数据
	let objUser = user[id] || null;
	if (!objUser) {
		res.json({"status":"fail","message":"无此用户！"})
		return;
	}
	let loginidTemp = objUser['loginid'];
	let passwordTemp = objUser['password'];
	let udidTemp = objUser['udid'];
	let useridTemp = objUser['userid'];
	let userKeyTemp = objUser['userKey'];
	

	// 发送查询信息
	let key = await getSessionKey(loginidTemp, passwordTemp, udidTemp);
	let info;
	if(type == 'searchInfo'){
		console.log('searchInfo-------->')
		info = await searchCheckInfo(key,udidTemp,useridTemp,userKeyTemp);
	}else if (type == 'checkIn'){
		console.log('checkIn-------->')
		info = await checkin(key,udidTemp,useridTemp,userKeyTemp);
	}else if (type == 'checkOut'){
		console.log('checkOut-------->')
		info = await checkout(key,udidTemp,useridTemp,userKeyTemp);
	}
	res.json(info)
}

// 获取sessionKey
async function getSessionKey(loginid,password,udid){
	let url = 'http://w.hnthinker.com:89/client.do?method=login&loginid='+loginid+'&password='+password+'&isneedmoulds=1&client=1&clientver=6.5.49.1&udid='+udid+'&token=&clientos=OPM1.171019.019&clientosver=8.1.0&clienttype=iPhone&language=zh&country=CN&authcode=&dynapass=&tokenpass=&relogin=0&clientuserid=&tokenFromThird=&signatureValue=&signAlg=&randomNumber=&cert=';
	console.log('url--->' + url);
	return await axios.post(url)
      .then(function (response) {
        return response.data.sessionkey;
      })
      .catch(function (error) {
        console.log(error);
      });
}

//查询check信息
async function searchCheckInfo(sessionkey,udid,userid,userKey){
	return await axios.get('http://w.hnthinker.com:89/client.do?method=checkin&type=getStatus&sessionkey=abcZiHARWZxnoezf7oaXw',
		{
			headers: {"Cookie": 'userid='+userid+'; userKey='+userKey+'; JSESSIONID='+sessionkey+'; ClientUDID='+udid+'; ClientToken=; ClientVer=6.5.49.1; ClientType=android; ClientLanguage=zh; ClientCountry=CN; ClientMobile=; setClientOS=OPM1.171019.019; setClientOSVer=8.1.0; Pad=false'},
		})
      .then(function (response) {
      	console.log(response.data);
      	return response.data
      })
      .catch(function (error) {
      	res.json(error)
        console.log(error);
      });
}

//checkin
async function checkin(sessionkey,udid,userid,userKey){
	return await axios.get('http://w.hnthinker.com:89/client.do?method=checkin&type=checkin&latlng=34.805278,113.539343&addr=%E6%B2%B3%E5%8D%97%E7%9C%81%E9%83%91%E5%B7%9E%E5%B8%82%E4%B8%AD%E5%8E%9F%E5%8C%BA%E7%8E%89%E5%85%B0%E8%A1%9795%E9%9D%A0%E8%BF%91%E6%B2%B3%E5%8D%97%E6%80%9D%E7%BB%B4',
		{
			headers: {"Cookie": 'userid='+userid+'; userKey='+userKey+'; JSESSIONID='+sessionkey+'; ClientUDID='+udid+'; ClientToken=; ClientVer=6.5.49.1; ClientType=android; ClientLanguage=zh; ClientCountry=CN; ClientMobile=; setClientOS=OPM1.171019.019; setClientOSVer=8.1.0; Pad=false'},
		})
      .then(function (response) {
      	console.log(response.data);
      	return response.data
      })
      .catch(function (error) {
      	res.json(error)
        console.log(error);
      });
}

// checkout
async function checkout(sessionkey,udid,userid,userKey){
	return await axios.get('http://w.hnthinker.com:89/client.do?method=checkin&type=checkout&latlng=34.805278,113.539343&addr=%E6%B2%B3%E5%8D%97%E7%9C%81%E9%83%91%E5%B7%9E%E5%B8%82%E4%B8%AD%E5%8E%9F%E5%8C%BA%E7%8E%89%E5%85%B0%E8%A1%9795%E9%9D%A0%E8%BF%91%E6%B2%B3%E5%8D%97%E6%80%9D%E7%BB%B4',
		{
			headers: {"Cookie": 'userid='+userid+'; userKey='+userKey+'; JSESSIONID='+sessionkey+'; ClientUDID='+udid+'; ClientToken=; ClientVer=6.5.49.1; ClientType=android; ClientLanguage=zh; ClientCountry=CN; ClientMobile=; setClientOS=OPM1.171019.019; setClientOSVer=8.1.0; Pad=false'},
		})
      .then(function (response) {
      	console.log(response.data);
      	return response.data
      })
      .catch(function (error) {
      	res.json(error)
        console.log(error);
      });
}


app.listen(3010, () => {
	// 读取本地文件
	// 同步读取
	var data = fs.readFileSync('data.json');
	//由JSON字符串转换为JSON对象
	user = JSON.parse(data); 
	// console.log("同步读取: " + user.toString());
	console.log('Example app listening on port 3010!');
})









