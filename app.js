const express = require('express')
const app = express()
const axios = require('axios');
const fs = require("fs")


// 设置允许跨域访问该服务.
app.all('*', function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Content-Type', 'application/json;charset=utf-8');
  next();
});

app.get('/', (req, res) => res.send('Hello World!'))

var sessionkey = '';
var loginid = '';
var password = '';
app.get('/getSessionKey', function (req, res) {
	axios.get('http://w.hnthinker.com:89/client.do?method=login&loginid=1200348&password=YOit5p8fSak%3D%0A&isneedmoulds=1&client=1&clientver=6.5.49.1&udid=866412032163396&token=&clientos=OPM1.171019.019&clientosver=8.1.0&clienttype=android&language=zh&country=CN&authcode=&dynapass=&tokenpass=&relogin=0&clientuserid=&tokenFromThird=&encryptpassword=1&signatureValue=&signAlg=&randomNumber=&cert=')
      .then(function (response) {
      	sessionkey = response.data.sessionkey;
      	res.json(response.data);
        console.log(sessionkey);
      })
      .catch(function (error) {
        console.log(error);
      });
  	
});

app.get('/searchCheckInfo', async function (req, res) {
	let loginidTemp = req.param('loginid');
	let passwordTemp = req.param('password');
	console.log(req.param('loginid'));
	console.log(req.param('password'));
	if(sessionkey == '' || loginid != loginidTemp){
		console.log('111111111');
		let key = await getSessionKey(loginidTemp, passwordTemp);
  		let info = await searchCheckInfo(key);
  		res.json(info)
	}else{
		console.log('2222222222');
		let data = await searchCheckInfo(sessionkey);
		res.json(data)
	}
  	
});

app.get('/checkin', async function (req, res) {
	if(sessionkey == ''){
		console.log('111111111');
		let key = await getSessionKey();
  		let info = await checkin(key);
  		res.json(info)
	}else{
		console.log('2222222222');
		let data = await checkin(sessionkey);
		res.json(data)
	}
  	
});

app.get('/checkout', async function (req, res) {
	if(sessionkey == ''){
		console.log('111111111');
		let key = await getSessionKey();
  		let info = await checkout(key);
  		res.json(info)
	}else{
		console.log('2222222222');
		let data = await checkout(sessionkey);
		res.json(data)
	}
  	
});

// 获取sessionKey
async function getSessionKey(loginid,password){
	let url = 'http://w.hnthinker.com:89/client.do?method=login&loginid='+loginid+'&password='+password+'&isneedmoulds=1&client=1&clientver=6.5.49.1&udid=866412032163396&token=&clientos=OPM1.171019.019&clientosver=8.1.0&clienttype=android&language=zh&country=CN&authcode=&dynapass=&tokenpass=&relogin=0&clientuserid=&tokenFromThird=&encryptpassword=1&signatureValue=&signAlg=&randomNumber=&cert=';
	console.log('url--->' + url);
	return await axios.get(url)
      .then(function (response) {
      	sessionkey = response.data.sessionkey;
        console.log('sessionkey == ' + sessionkey);
        return sessionkey;
      })
      .catch(function (error) {
        console.log(error);
      });
}

//查询check信息
async function searchCheckInfo(sessionkey){
	return await axios.get('http://w.hnthinker.com:89/client.do?method=checkin&type=getStatus&sessionkey=abcZiHARWZxnoezf7oaXw',
		{
			headers: {"Cookie": 'userid=433; userKey=cf0ddb4d-ef5a-45dd-a354-9d94eb404453; JSESSIONID='+sessionkey+'; ClientUDID=866412032163396; ClientToken=; ClientVer=6.5.49.1; ClientType=android; ClientLanguage=zh; ClientCountry=CN; ClientMobile=; setClientOS=OPM1.171019.019; setClientOSVer=8.1.0; Pad=false'},
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
async function checkin(sessionkey){
	return await axios.get('http://w.hnthinker.com:89/client.do?method=checkin&type=checkin&latlng=34.805278,113.539343&addr=%E6%B2%B3%E5%8D%97%E7%9C%81%E9%83%91%E5%B7%9E%E5%B8%82%E4%B8%AD%E5%8E%9F%E5%8C%BA%E7%8E%89%E5%85%B0%E8%A1%9795%E9%9D%A0%E8%BF%91%E6%B2%B3%E5%8D%97%E6%80%9D%E7%BB%B4',
		{
			headers: {"Cookie": 'userid=433; userKey=cf0ddb4d-ef5a-45dd-a354-9d94eb404453; JSESSIONID='+sessionkey+'; ClientUDID=866412032163396; ClientToken=; ClientVer=6.5.49.1; ClientType=android; ClientLanguage=zh; ClientCountry=CN; ClientMobile=; setClientOS=OPM1.171019.019; setClientOSVer=8.1.0; Pad=false'},
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
async function checkout(sessionkey){
	return await axios.get('http://w.hnthinker.com:89/client.do?method=checkin&type=checkout&latlng=34.805278,113.539343&addr=%E6%B2%B3%E5%8D%97%E7%9C%81%E9%83%91%E5%B7%9E%E5%B8%82%E4%B8%AD%E5%8E%9F%E5%8C%BA%E7%8E%89%E5%85%B0%E8%A1%9795%E9%9D%A0%E8%BF%91%E6%B2%B3%E5%8D%97%E6%80%9D%E7%BB%B4',
		{
			headers: {"Cookie": 'userid=433; userKey=cf0ddb4d-ef5a-45dd-a354-9d94eb404453; JSESSIONID='+sessionkey+'; ClientUDID=866412032163396; ClientToken=; ClientVer=6.5.49.1; ClientType=android; ClientLanguage=zh; ClientCountry=CN; ClientMobile=; setClientOS=OPM1.171019.019; setClientOSVer=8.1.0; Pad=false'},
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


app.listen(3010, () => console.log('Example app listening on port 3000!'))