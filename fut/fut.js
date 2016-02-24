import connectToWebApp from '../fut/connector';

connectToWebApp({email: 'januszmatyja@gmail.com'})
  .then(serverData => console.log(serverData))
  .catch(error => console.log(error));