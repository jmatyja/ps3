import vasync from 'vasync';
import rp from 'request-promise';
import FileCookieStore from 'tough-cookie-filestore';


export default function connectToWebApp(config) {
  var serverData = {};

  var options = {
    timeout: 10000,
    headers: {
      'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
      'Host': 'signin.ea.com'
    },
    method: 'GET',
    jar: rp.jar(new FileCookieStore('./fut/cookies.json')),
    followAllRedirects :true
  };
  return new Promise((resolve, reject) => {
    vasync.waterfall([
      callback => {
        rp(Object.assign(options), {})
          .then($ => $)
          .catch(error => callback(error))
      },
      (extra, callback) => { callback();}
    ], (error) => {
      error ? reject(error) : resolve('doneabc');
    });
  });
}
