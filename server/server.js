const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const config = require('../webpack.config.js');
const compiler = webpack(config);
const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const sPort = 3030;

app.use(
  middleware(compiler, {
    publicPath: config.output.publicPath
  })
);

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies


app.listen(sPort, function () {
    console.log('Example app listening on port '+sPort+'!\n');
});

app.get('/test', function(req,res){
    console.log('test endpoint');
    res.end(JSON.stringify({test:'ok'}));
});
