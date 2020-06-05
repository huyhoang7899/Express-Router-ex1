const express = require('express');
const app = express();
const port = 3000;
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync');
const shortid = require('shortid');

const adapter = new FileSync('db.json');
const db = low(adapter);

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.set('view engine', 'pug');
app.set('views', './views');
// Set some defaults (required if your JSON file is empty)
db.defaults({ books: [], users: [] })
  .write()

app.get('/books', function(req, res) {
	res.render('books/index',
		{ books: db.get('books').value() }
	);
});

app.get('/books/create', function(req, res) {
	res.render('books/create');
});

app.get('/books/:id/update', function(req, res) {
	var id = req.params.id;
	var book = db.get('books').find({ id: id }).value();
	res.render('books/update', {
		book: book
	});
});

app.get('/books/:id/delete', function(req, res) {
	var id = req.params.id;
	db.get('books').remove({ id: id }).write();
	res.redirect('back');
});

app.get('/users', function(req, res) {
	res.render('users/index', {
		users: db.get('users').value()
	});
});

app.get('/users/create', function(req, res) {
	res.render('users/create');
});

app.get('/users/:id/views', function(req, res) {
	var id = req.params.id;
	var user = db.get('users').find({ id: id }).value();
	res.render('users/views', {
		user: user
	})
});

app.get('/users/:id/update', function(req, res) {
	var id = req.params.id;
	var user = db.get('users').find({ id: id }).value();
	res.render('users/update', {
		user: user
	})
});

app.get('/users/:id/delete', function(req, res) {
	var id = req.params.id;
	db.get('users').remove({ id: id }).write();
	res.redirect('back');
});

app.post('/books/create', function(req, res) {
	req.body.id = shortid.generate();
	db.get('books').push(req.body).write();
	res.redirect('/books');
});

app.post('/books/update', function(req, res) {
	var id = req.body.id;
	db.get('books').find({ id: id }).assign({ title: req.body.title }).write();
	res.redirect('/books');
});

app.post('/users/create', function(req, res) {
	req.body.id = shortid.generate();
	db.get('users').push(req.body).write();
	res.redirect('/users');
});

app.post('/users/update', function(req, res) {
	var id = req.body.id;
	db.get('users').find({ id: id }).assign({ name: req.body.name, age: req.body.age }).write();
	res.redirect('/users');
});

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`));