import co from 'co';
import rp from 'request-promise';
import emailVerification from 'emailVerfification';
import cheerio from 'cheerio';
import FileCookieStore from './lib/filestore';


const URLS = {
  'main'          : 'https://www.easports.com/uk/fifa/ultimate-team/web-app',
  'nucleus'       : 'https://www.easports.com/iframe/fut16/?locale=en_GB&baseShowoffUrl=https%3A%2F%2Fwww.easports.com%2Fuk%2Ffifa%2Fultimate-team%2Fweb-app%2Fshow-off&guest_app_uri=http%3A%2F%2Fwww.easports.com%2Fuk%2Ffifa%2Fultimate-team%2Fweb-app',
  'shards'        : 'http://www.easports.com/iframe/fut16/p/ut/shards?_=',
  'accounts'      : 'https://www.easports.com/iframe/fut16/p/ut/game/fifa16/user/accountinfo?sku=FUT16WEB&_=1442505066982',
  'sid'           : 'https://www.easports.com/iframe/fut16/p/ut/auth',
  'validate'      : 'https://www.easports.com/iframe/fut16/p/ut/game/fifa16/phishing/validate',
  'phishing'      : 'https://www.easports.com/iframe/fut16/p/ut/game/fifa16/phishing/question?_=='
};
const TIMEOUT = 20000;

export default co.wrap(function* (config) {
  //return {
  //  phishingToken: 'phishingtoken',
  //  sid: 'sid'
  //};
  let j = rp.jar(new FileCookieStore('./fut/cookies/'+config.email+'.json'));
  let responseLoginUrl = yield rp({
    url: URLS.main,
    timeout: TIMEOUT,
    jar: j,
    followAllRedirects :true,
    resolveWithFullResponse: true,
    headers: {
      'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0'
    }});
  if(responseLoginUrl.request.uri.href == 'https://www.easports.com/uk/fifa/ultimate-team/web-app') {
    return yield ajaxCalls(config, j);
  }
  let responseLogin = yield rp({
    url: responseLoginUrl.request.uri.href,
    timeout: TIMEOUT,
    headers: {
      'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
      'Content-Type': 'application/x-www-form-urlencoded',
      'Referer': '	https://signin.ea.com/p/web/login?execution=e744207582s2&initref=https%3A%2F%2Faccounts.ea.com%3A443%2Fconnect%2Fauth%3Fscope%3Dbasic.identity%2Bbasic.persona%2Bsignin%2Boffline%2Bsecurity.challenge%26redirect_uri%3Dhttp%253A%252F%252Fwww.easports.com%252Ffifa%252Flogin_check%26locale%3Duk%26state%3DKkX4rynEFkwOgSNSOKp77YFc1ijgW4ms_gNnjIxJHFk%26response_type%3Dcode%26client_id%3DEASFC-web',
      'Host': 'signin.ea.com'
    },
    method: 'POST',
    form: {email: config.email, password: config.password, _remeberMe: 'on', remeberMe: 'on', _eventId: 'submit', gCaptchaResponse: ''},
    jar: j,
    followAllRedirects :true,
    resolveWithFullResponse: true
  });
  if(responseLogin.request.uri.href == 'https://www.easports.com/uk/fifa/ultimate-team/web-app') {
    return yield ajaxCalls(config, j);
  }
  let $ = cheerio.load(responseLogin.body);
  if($('#twofactorCode').length == 0)
    return yield Promise.reject("two factor code errror");
  let code = yield emailVerification({
                                    email: config.email,
                                    password: config.emailPassword,
                                    imapAddress: config.imapAddress
                                  });
  let responseTwoFactorCode = yield rp({
    url: responseLogin.request.uri.href,
    timeout: TIMEOUT,
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
    form: {_eventId: 'submit', _trustThisDevice: 'on', trustThisDevice: 'on', twofactorCode: code},
    jar: j,
    followAllRedirects :true,
    resolveWithFullResponse: true
  });
  if(responseTwoFactorCode.request.uri.href == 'https://www.easports.com/uk/fifa/ultimate-team/web-app') {
    return yield ajaxCalls(config, j);
  }
  let responseCancelUpdate = yield rp({
    url: responseTwoFactorCode.request.uri.href,
    timeout: TIMEOUT,
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
    form: {_eventId: 'cancel', appDevice: 'IPHONE'},
    jar: j,
    followAllRedirects :true,
    resolveWithFullResponse: true
  });
  if(responseCancelUpdate.request.uri.href != 'https://www.easports.com/uk/fifa/ultimate-team/web-app') {
    return yield Promise.reject("logged in error");
  }
  return yield ajaxCalls(config, j);
});

const ajaxCalls = co.wrap(function* (config, j){
  let serverData = {};
  let responseNuclesId = yield rp({
    url: URLS.nucleus,
    timeout: TIMEOUT,
    headers: {
      'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0'
    },
    jar: j,
    followAllRedirects :true,
    resolveWithFullResponse: true
  });
  let easwMatches = responseNuclesId.body.match(/var\ EASW_ID = '(\d*)';/g);
  if(!easwMatches)
    return  Promise.reject("Error while obtaining EASW_ID");
  serverData.nuclesId = easwMatches.shift().replace(/\D+/g, '');

  let responseShards = yield rp({
    url: URLS.shards + new Date().getTime(),
    timeout: TIMEOUT,
    headers: {
      'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
      'Easw-Session-Data-Nucleus-Id': serverData.nuclesId,
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
    followAllRedirects :true,
    resolveWithFullResponse: true
  });

  let responseUserAccounts = yield rp({
    url: URLS.accounts,
    timeout: TIMEOUT,
    headers: {
      'Accept': 'text/json',
      'Accept-Encoding':	null,
      'Accept-Language': 'en-US,en;q=0.8',
      'Connection': 'keep-alive',
      'Easw-Session-Data-Nucleus-Id': serverData.nuclesId,
      'Host': 'www.easports.com',
      'Referer': 'https://www.easports.com/iframe/fut16/?locale=pl_PL&baseShowoffUrl=https%3A%2F%2Fwww.easports.com%2Fpl%2Ffifa%2Fultimate-team%2Fweb-app%2Fshow-off&guest_app_uri=http%3A%2F%2Fwww.easports.com%2Fpl%2Ffifa%2Fultimate-team%2Fweb-app',
      'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
      'X-Requested-With': 'XMLHttpRequest',
      'X-UT-Embed-Error': 'true',
      'X-UT-Route': 'https://utas.s2.fut.ea.com:443'
    },
    jar: j,
    followAllRedirects :true,
    resolveWithFullResponse: true
  });
  serverData.userAccounts = JSON.parse(responseUserAccounts.body);
  let personaId = serverData.userAccounts.userAccountInfo.personas[0].personaId;
  let personaName = serverData.userAccounts.userAccountInfo.personas[0].personaName;
  let sessionData = {
    clientVersion :1,
    gameSku:  config.gameSku,
    identification: {
      'authCode' : ''
    },
    isReadOnly: false,
    locale: 'en-CA',
    method: 'authcode',
    nucleusPersonaDisplayName: personaName,
    nucleusPersonaId: personaId,
    nucleusPersonaPlatform: config.platform,
    priorityLevel: 4,
    sku: 'FUT16WEB'
  };
  let responseSessionId = yield rp({
    url: URLS.sid,
    timeout: TIMEOUT,
    headers: {
      'Accept': 'application/json, text/javascript',
      'Accept-Encoding': null,
      'Accept-Language': 'en-US,en;q=0.8',
      'Connection': 'keep-alive',
      'Content-Type': 'application/json',
      'Easw-Session-Data-Nucleus-Id': serverData.nuclesId,
      'Host': 'www.easports.com',
      'Origin': 'http://www.easports.com',
      'Referer': 'https://www.easports.com/iframe/fut16/?locale=pl_PL&baseShowoffUrl=https%3A%2F%2Fwww.easports.com%2Fpl%2Ffifa%2Fultimate-team%2Fweb-app%2Fshow-off&guest_app_uri=http%3A%2F%2Fwww.easports.com%2Fpl%2Ffifa%2Fultimate-team%2Fweb-app',
      'X-Requested-With': 'XMLHttpRequest',
      'X-UT-Embed-Error': 'true',
      'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
      'X-UT-Route': 'https://utas.s2.fut.ea.com:443'
    },
    method: 'POST',
    body: JSON.stringify(sessionData),
    jar: j,
    followAllRedirects :true,
    resolveWithFullResponse: true
  });
  let sessionBodyJson = JSON.parse(responseSessionId.body);
  if(undefined == sessionBodyJson.sid) {
    return  Promise.reject("session error");
  }
  serverData.sid = sessionBodyJson.sid;
  let responsePhissing = yield rp({
    url: URLS.phishing + new Date().getTime(),
    timeout: TIMEOUT,
    headers: {
      'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
      'Easw-Session-Data-Nucleus-Id': serverData.nuclesId,
      'X-UT-Route': 'https://utas.s2.fut.ea.com:443',
      'X-UT-SID': serverData.sid,
      'X-UT-Embed-Error': 'true',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/json',
      'Accept': 'application/json, text/javascript',
      'Referer':  'http://www.easports.com/iframe/fut/?baseShowoffUrl=http%3A%2F%2Fwww.easports.com%2Fuk%2Ffifa%2Ffootball-club%2Fultimate-team%2Fshow-off&guest_app_uri=http%3A%2F%2Fwww.easports.com%2Fuk%2Ffifa%2Ffootball-club%2Fultimate-team&locale=en_GB',
      'Accept-Language': 'en-US,en;q=0.8'
    },
    jar: j,
    followAllRedirects :true,
    resolveWithFullResponse: true
  });
  let phissingBodyJson = JSON.parse(responsePhissing.body);
  if(phissingBodyJson.debug != undefined && phissingBodyJson.debug == 'Already answered question.') {
    serverData.phishingToken = phissingBodyJson.token;
    return Promise.resolve(serverData);
  }
  let responseAnswerQuestion = yield rp({
    url: URLS.validate,
    timeout: TIMEOUT,
    headers: {
      'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
      'Easw-Session-Data-Nucleus-Id': serverData.nuclesId,
      'X-UT-Route': 'https://utas.s2.fut.ea.com:443',
      'X-UT-SID': serverData.sid,
      'X-UT-Embed-Error': 'true',
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    jar: j,
    method: 'POST',
    body: "answer="+config.answerHash,
    followAllRedirects :true,
    resolveWithFullResponse: true
  });

  let answerQuestionBodyJson = JSON.parse(responseAnswerQuestion.body);
  if(answerQuestionBodyJson.token){
    serverData.phishingToken = answerQuestionBodyJson.token;
    return  Promise.resolve(serverData);
  } else {
    return  Promise.reject("answer secret question error");
  }
});