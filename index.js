const bundler = require('./simpleBundler')
const entry = __dirname + '/test/app.js'

const fs = require('fs');
fs.writeFile('./test/bulder.js',bundler(entry),{flag:'w'},function(err){
    if(err){
        console.err(err)
    }else{
        console.log('bundle success!')
    }
})