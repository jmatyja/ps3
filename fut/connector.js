import vasync from 'vasync';
import rp from 'request-promise';
import FileCookieStore from 'tough-cookie-filestore';


export default function connectToWebApp(config) {
  var serverData = {};

  var options = {
    uri: 'https://www.easports.com/uk/fifa/ultimate-team/web-app',
    timeout: 10000,
    headers: {
      'User-Agent': 'Mozilla/6.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0'
    },
    jar: rp.jar(new FileCookieStore('./fut/cookies.json')),
    followAllRedirects :true,
    resolveWithFullResponse: true
  };
  return new Promise((resolve, reject) => {
    vasync.waterfall([
      callback => {
        rp(Object.assign(options, {jar: true}))
          .then(response => callback(null, response.request.uri.href))
          .catch(error => callback(error));
      },
      (loginUrl, callback) => { 
        rp(Object.assign(options, 
          {
            uri: loginUrl,
            headers: Object.assign(options.headers, {
              jar: true,
              'Content-Type': 'application/x-www-form-urlencoded',
              'Referer': loginUrl,
              'Host': 'signin.ea.com'
            }),
            method: "POST",
            form: {email: 'psjmone@gmail.com', password: 'Klebuzsek2', remeberMe: 'on', _eventId: 'submit', gCaptchaResponse: ''}
          })
        )
          .then(response => {console.log(response);})
          .catch(error => callback(error));
      }
    ], (error) => {
      error ? reject(error) : resolve('doneabc');
    });
  });
}
