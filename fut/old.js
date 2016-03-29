var config = {
    email: 'psjmone@gmail.com',
    password = 'Klebuzsek2',
    config.hash
}

var login = function(url){
      
         var options = {
            url: url,
            timeout: timeout,
            headers: {
                'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': '	https://signin.ea.com/p/web/login?execution=e744207582s2&initref=https%3A%2F%2Faccounts.ea.com%3A443%2Fconnect%2Fauth%3Fscope%3Dbasic.identity%2Bbasic.persona%2Bsignin%2Boffline%2Bsecurity.challenge%26redirect_uri%3Dhttp%253A%252F%252Fwww.easports.com%252Ffifa%252Flogin_check%26locale%3Duk%26state%3DKkX4rynEFkwOgSNSOKp77YFc1ijgW4ms_gNnjIxJHFk%26response_type%3Dcode%26client_id%3DEASFC-web',
                'Host': 'signin.ea.com'
            },
            method: 'POST',
            form: {email: config.email, password: config.password, _remeberMe: 'on', remeberMe: 'on', _eventId: 'submit', gCaptchaResponse: ''},
            jar: j,
            followAllRedirects :true
        };
        request(options, function (error, response, body) {
            var url = response.request.uri.href;

            if(url == 'https://www.easports.com/uk/fifa/ultimate-team/web-app'){
                isLoggedInd();
                console.log('isloggedin')
                   
            } else {
                console.log(url);
                setTimeout(function(){
                    getCode(url);        
                },3000);
            }
        });
        
  }
  function expires(ms) {
        return new Date(Date.now() + ms).toUTCString();
  }
  var isLoggedInd = function(){
      var options = {
            url: 'https://www.easports.com/fifa/api/isUserLoggedIn',
            timeout: timeout,
            headers: {
                'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            jar: j,
            followAllRedirects :true
        };
        request(options, function (error, response, body) {
            console.log(body);
            if(body.charAt(0) != '{'){
                j = null;
                j = request.jar(); 
                //j.setCookie('expires=' + expires(0), config.utasServer);
                setTimeout(function(){
                    getMainPage();      
                },3000);
                
            }else{
                var b = JSON.parse(body);
                if(!b.isLoggedIn){
                    //j.setCookie('expires=' + expires(0));
                     j = null;
                     j = request.jar(); 
                    setTimeout(function(){
                        getMainPage();      
                    },30000);
                } else {
                    getNuclesId();
                }
            }
            
            
            
        });
  }
  var loginSecond = function(url, code){
         var options = {
            url: url,
            timeout: timeout,
            headers: {
                'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Host': 'signin.ea.com',
                'Connection': 'keep-alive',
                 'Origin': 'https://signin.ea.com',
                 'Content-Length': '75',	
                'Referer': '	https://signin.ea.com/p/web/login?execution=e744207582s2&initref=https%3A%2F%2Faccounts.ea.com%3A443%2Fconnect%2Fauth%3Fscope%3Dbasic.identity%2Bbasic.persona%2Bsignin%2Boffline%2Bsecurity.challenge%26redirect_uri%3Dhttp%253A%252F%252Fwww.easports.com%252Ffifa%252Flogin_check%26locale%3Duk%26state%3DKkX4rynEFkwOgSNSOKp77YFc1ijgW4ms_gNnjIxJHFk%26response_type%3Dcode%26client_id%3DEASFC-web'
            },
            method: 'POST',
             //body: JSON.stringify({_eventId: 'submit', _trustThisDevice: 'on', trustThisDevice: 'on', twofactorCode: code}),
            form: {_eventId: 'submit', _trustThisDevice: 'on', trustThisDevice: 'on', twofactorCode: code},
            jar: j,
            followAllRedirects :true
        };
        console.log(options);
        
        request(options, function (error, response, body) {
            //console.log(body);
            var url2 = response.request.uri.href;
            console.log(body);
          
           
            if(url2 == 'https://www.easports.com/uk/fifa/ultimate-team/web-app'){
                getNuclesId();
            } else {
                loginThird(url2); 
            }
          
        });
        
  }
    var loginThird = function(url, code){
        var options = {
            url: url,
            timeout: timeout,
            headers: {
                'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Host': 'signin.ea.com',
                'Origin': 'https://signin.ea.com',
                'Connection': 'keep-alive',
                'Content-Length': '32',	
                'Referer': 'https://signin.ea.com/p/web/login?execution=e720872344s3&initref=https%3A%2F%2Faccounts.ea.com%3A443%2Fconnect%2Fauth%3Fscope%3Dbasic.identity%2Bbasic.persona%2Bsignin%2Boffline%2Bsecurity.challenge%26redirect_uri%3Dhttp%253A%252F%252Fwww.easports.com%252Ffifa%252Flogin_check%26locale%3Dpl_PL%26state%3D160gABfm-M-6iNxfUcM1htXhhFi-n99w7D_SzQ2C7YE%26response_type%3Dcode%26client_id%3DEASFC-web'
            },
            method: 'POST',
            //body: JSON.stringify({_eventId: 'cancel', appDevice: 'IPHONE'}),
            form: {_eventId: 'cancel', appDevice: 'IPHONE'},
            jar: j,
            followAllRedirects :true
        };
        console.log(options);
        request(options, function (error, response, body) {
            //console.log(body);
            var url2 = response.request.uri.href;
            //console.log(body);
            console.log(url2);
            if(url2 == 'https://www.easports.com/uk/fifa/ultimate-team/web-app'){
                getNuclesId();
            } else {
                console.log('err')

            }

        });

    }
  var getCode = function(url){
     
          //return loginSecond(url, '56653455');
      //config.password
      emailVerify.getCode(config.email, "Klebuzsek1213", function(code){
        if( false == code){

                setTimeout(function(){
                    getCode(url);
                },20000);
            
        } else{
            loginSecond(url, code);
           
        }
            
        });
  }
  var getNuclesId = function(){
        var options = {
            url: urls.nucleus,
            timeout: timeout,
            headers: {
                'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0'
            },
            jar: j,
            followAllRedirects :true
        };
        config.code = 'code';
        request(options, function (error, response, body) {
         // console.log(response.statusCode);
         // console.log(body);
         if(body){
             
         
		  var match =  body.match(/var\ EASW_ID = '(\d*)';/g); 
		  if(!match) { 
			setTimeout(function(){
               // j.setCookie(';', config.utasServer);
                
                getMainPage();
                 console.log(body);     
                 console.log('nucerr')
            },10000);
		  } else {
          
          var str = match[0];
          config.nuclesId = str.replace( /\D+/g, '');
          console.log('nucleus');
          console.log(config.nuclesId);
          getShards();
		  }
          } else {
              setTimeout(function(){
               // j.setCookie(';', config.utasServer);
                
                getMainPage();
                 
            },10000);
          }
        });
  }
  
  var getShards = function(){

        
        var options = {
            url: urls.shards + new Date().getTime(),
            timeout: timeout,
            headers: {
                'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
                'Easw-Session-Data-Nucleus-Id': config.nuclesId,
                'X-UT-Route': 'https://utas.s2.fut.ea.com:443',
                'X-UT-Embed-Error': 'true',
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                'Accept': 'text/html,application/xhtml+xml,application/json,application/xml;q=0.9,image/webp,*/*;q=0.8',
                           // https://www.easports.com/iframe/fut15/?baseShowoffUrl=https%3A%2F%2Fwww.easports.com%2Fpl%2Ffifa%2Fultimate-team%2Fweb-app%2Fshow-off&guest_app_uri=http%3A%2F%2Fwww.easports.com%2Fpl%2Ffifa%2Fultimate-team%2Fweb-app&locale=en_GB
                'Referer': 'http://www.easports.com/iframe/fut/?baseShowoffUrl=http%3A%2F%2Fwww.easports.com%2Fuk%2Ffifa%2Ffootball-club%2Fultimate-team%2Fshow-off&guest_app_uri=http%3A%2F%2Fwww.easports.com%2Fuk%2Ffifa%2Ffootball-club%2Fultimate-team&locale=en_GB',
                'Accept-Language': 'en-US,en;q=0.8'
            },
            jar: j,
            followAllRedirects :true
        };
        request(options, function (error, response, body) {
            console.log(error);
           getUserAccounts();
        });

  }
  var getUserAccounts = function(){

        var options = {
            url: urls.accounts,
            timeout: timeout,
            headers: {
                'Accept': 'text/json',
                'Accept-Encoding':	null,
                'Accept-Language': 'en-US,en;q=0.8',
                'Connection': 'keep-alive',
                'Easw-Session-Data-Nucleus-Id': config.nuclesId,
                'Host': 'www.easports.com',
                'Referer': 'https://www.easports.com/iframe/fut16/?locale=pl_PL&baseShowoffUrl=https%3A%2F%2Fwww.easports.com%2Fpl%2Ffifa%2Fultimate-team%2Fweb-app%2Fshow-off&guest_app_uri=http%3A%2F%2Fwww.easports.com%2Fpl%2Ffifa%2Fultimate-team%2Fweb-app',
                'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
                'X-Requested-With': 'XMLHttpRequest',
                'X-UT-Embed-Error': 'true',
                'X-UT-Route': 'https://utas.s2.fut.ea.com:443'

            },
            jar: j,
            followAllRedirects :true
        };
        request(options, function (error, response, body) {
           console.log(body);
           if(body){
            config.userAccounts = JSON.parse(body);
            console.log(config.userAccounts);
           getSessionId();
           } else {
               setTimeout(function(){
					getUserAccounts()
									
				},1000);
               
           }
        });
  }
  var getSessionId = function(){
        var personaId = config.userAccounts.userAccountInfo.personas[0].personaId;
        var personaName = config.userAccounts.userAccountInfo.personas[0].personaName;
        var platform = 'ps3';

        var data = {
                clientVersion :1,
                gameSku: "FFA16PS3",
                identification: {
                    'authCode' : ''
                },
                isReadOnly: false,
                locale: 'en-CA',
                method: 'authcode',
                nucleusPersonaDisplayName: personaName,
                nucleusPersonaId: personaId,
                nucleusPersonaPlatform: platform,
                priorityLevel: 4,
                sku: 'FUT16WEB'
            };
           
            var options = {
            url: urls.sid,
            timeout: timeout,
            headers: {
                'Accept': 'application/json, text/javascript',
                'Accept-Encoding': null,
                'Accept-Language': 'en-US,en;q=0.8',
                'Connection': 'keep-alive',
                'Content-Type': 'application/json',
                'Easw-Session-Data-Nucleus-Id': config.nuclesId,
                'Host': 'www.easports.com',
                'Origin': 'http://www.easports.com',
                'Referer': 'https://www.easports.com/iframe/fut16/?locale=pl_PL&baseShowoffUrl=https%3A%2F%2Fwww.easports.com%2Fpl%2Ffifa%2Fultimate-team%2Fweb-app%2Fshow-off&guest_app_uri=http%3A%2F%2Fwww.easports.com%2Fpl%2Ffifa%2Fultimate-team%2Fweb-app',
                'X-Requested-With': 'XMLHttpRequest',
                'X-UT-Embed-Error': 'true',
                'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
                'X-UT-Route': 'https://utas.s2.fut.ea.com:443'
            },
            method: 'POST',
            body: JSON.stringify(data),
            jar: j,
            followAllRedirects :true
        };
        request(options, function (error, response, body) {

            console.log(body);

            var jbody = JSON.parse(body);
			if(!jbody.sid) {
				console.log('siderr');
				setTimeout(function(){
					getSessionId();
									
				},1000);
			} else {
				config.sid = jbody.sid;
				console.log('sessid');
				console.log( config.sid);
				getPhishing();
			}
        });
  }
  var getPhishing = function(){

        var options = {
            url: urls.phishing + new Date().getTime(),
            timeout: timeout,
            headers: {
                'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
                'Easw-Session-Data-Nucleus-Id': config.nuclesId,
                'X-UT-Route': 'https://utas.s2.fut.ea.com:443',
                'X-UT-SID': config.sid,
                'X-UT-Embed-Error': 'true',
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/json',
                'Accept': 'application/json, text/javascript',
                'Referer':  'http://www.easports.com/iframe/fut/?baseShowoffUrl=http%3A%2F%2Fwww.easports.com%2Fuk%2Ffifa%2Ffootball-club%2Fultimate-team%2Fshow-off&guest_app_uri=http%3A%2F%2Fwww.easports.com%2Fuk%2Ffifa%2Ffootball-club%2Fultimate-team&locale=en_GB',
                'Accept-Language': 'en-US,en;q=0.8'
            },
            jar: j,
            followAllRedirects :true
        };
        request(options, function (error, response, body) {
            console.log('phishing');
          
           config.questionStatus = body;
           if(config.questionStatus.debug != undefined && config.questionStatus.debug == 'Already answered question.'){
               config.phishingToken = config.questionStatus.token;
               startFun();
           } else {
               validate();
           }
        }); 
  }
  var validate = function(){
    

         var options = {
            url: urls.validate,
            timeout: timeout,
            headers: {
                'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
                'Easw-Session-Data-Nucleus-Id': config.nuclesId,
                'X-UT-Route': 'https://utas.s2.fut.ea.com:443',
                'X-UT-SID': config.sid,
                'X-UT-Embed-Error': 'true',
                'X-Requested-With': 'XMLHttpRequest',
                'Content-Type': 'application/x-www-form-urlencoded'
                //'Accept': 'text/html,application/xhtml+xml,application/json,application/xml;q=0.9,image/webp,*/*;q=0.8',
               // 'Referer': 'http://www.easports.com/iframe/fut/?baseShowoffUrl=http%3A%2F%2Fwww.easports.com%2Fuk%2Ffifa%2Ffootball-club%2Fultimate-team%2Fshow-off&guest_app_uri=http%3A%2F%2Fwww.easports.com%2Fuk%2Ffifa%2Ffootball-club%2Fultimate-team&locale=en_GB',
                //'Accept-Language': 'en-US,en;q=0.8'
            },
            jar: j,
            method: 'POST',
            body: "answer="+config.hash,
            followAllRedirects :true
        };
        request(options, function (error, response, body) {
            console.log('validate');
            console.log(body);
            var jbody = JSON.parse(body);
            if(jbody.token){
                config.phishingToken = jbody.token;
              saveConfig(config, function(){
                    saveCookieFile(j, function(){
                        startFun();
                    });
                });
            } else {
                online = false;
                console.log('gmainpage');
                setTimeout(function(){
                    getMainPage(true);
                },300000);
                return;
            }
            
            //console.log(config.phishingToken)
        });
       
  }
 
  var getMainPage = function(nj){

       var options = {
            url: urls.main,
            timeout: timeout,
            headers: {
                'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0'
            },
            jar: j,
            followAllRedirects :true
        };
        request(options, function (error, response, body) {
           
           if(response){
               var url = response.request.uri.href;
               login(url);
           } else {
               console.log(error);
               console.log(body);
               console.log(config.email);
                setTimeout(function(){
                    getMainPage(true);
                },300000);
           }
           
        });
  }