#!/usr/bin/env node
if (process.env.NODE_ENV !== 'production' && false) {
  if (!require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json$)/i
    })) {
    return;
  }
} 
require('../server.babel');
require('../fut/fut');