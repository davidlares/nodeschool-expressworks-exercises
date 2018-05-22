var express = require('express');
var path = require('path');
var fs = require('fs');
var bodyparser = require('body-parser');
var app = express();

// stylus middleware
app.use(require('stylus').middleware('public'))

// static middleware render
app.use(express.static(process.argv[3] || path.join(__dirname, 'public')))

// post request middleware (passing x-www-form-urlencoded)
app.use(bodyparser.urlencoded({extended: false}));

// setting view directory
app.set('views',path.join(__dirname, 'templates'));

// view engine
app.set('view engine','pug')

// routes
app.get('/home', function(req,res){
	// using pug
	res.render('index.pug', { date: new Date().toDateString() })
});

app.get('/form', function(req,res){
	res.render('form.pug');
});

app.post('/form', function(req,res){
	res.send(req.body.str.split('').reverse().join(''));
});

app.get('/search', function(req,res){
	res.send(req.query)
});

app.get('/books', function(req,res){
	
	fs.readFile(process.argv[3], function(err,data) {
		if(err) return err;
		books = JSON.parse(data);
		res.json(books)
	})
});

app.put('/message/:id', function(req,res){
	
	var sha1 = require('crypto')
		.createHash('sha1')
		.update(new Date().toDateString() + req.params.id)
		.digest('hex')

	res.send(sha1);
});

app.listen(process.argv[2]);
