var express = require('express');

var port = process.env.PORT || 3000;

app = express();

app.set('views', __dirname + '/app/views');
app.set('view engine', 'jade');

app.use(express.static(__dirname + '/public'))

app.get('/templates/:template', function(req, res, next) {
  return res.render('templates/'+req.params.template);
});

app.get('/*', function(req, res, next) {
  return res.render('layout', {});
});

server = app.listen(port, function() {
  console.log('Express server started on port '+ port);
});
