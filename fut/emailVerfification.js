import Imap from 'imap';

export default function emailVerification(config) {

  return new Promise((resolve, reject) => {
    let tries = 0;
    const MAX_TRIES = 30;
    function runConnection(){
      tries++;
      if(tries <= MAX_TRIES){
        setTimeout(getCode, 10000);
      } else {
        reject('error while trying to get verification code');
      }
    }

    function getCode(){

      var imap = new Imap({
        user: config.email,
        password: config.password,
        host: config.imapAddress,
        port: 993,
        tls: true
      });
      function openInbox(cb) {
        imap.openBox('INBOX', false, cb);
      }
      imap.once('ready', function() {
        openInbox(function(err, box) {
          if (err){
            reject(err);
          }
          if(box.messages.total == 0){
            imap.end();
            runConnection();
          }

          var f = imap.seq.fetch(box.messages.total + ':*', { bodies: ['HEADER.FIELDS (FROM)','TEXT'] });
          f.on('message', function(msg, seqno) {
            var prefix = '(#' + seqno + ') ';
            msg.on('body', (stream, info) => {
              var buffer = '', count = 0;
              stream.on('data', function(chunk) {
                count += chunk.length;
                buffer += chunk.toString('utf8');
              });
              stream.once('end', () => {
                if (info.which === 'TEXT'){
                  var matches = buffer.match(/([0-9]+)<\/b>/);
                  if(matches){
                    imap.addFlags(box.messages.total + ':*', ['DELETED'], function(err){if(err) {console.log(err)};});
                    imap.closeBox(true, function(a){});
                    resolve( matches[1]);
                  } else {
                    if(tries <= MAX_TRIES){
                      runConnection();
                    } else {
                      reject("Cannot get verification code. Max. tries reached.")
                    }
                  }
                }
              });
            });
          });
          f.once('error', function(error) {
            reject(error);
          });

        });
      });
      imap.once('error', function(error) {
        reject(error);
      });
      imap.connect();
    }
    runConnection();
  });

}
