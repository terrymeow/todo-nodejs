import express from 'express'
import knex from 'knex'
import knexfile from './knexfile.js';

const app = express();
const db = knex(knexfile);

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const getTodo = async (req, res, next) => {
	res.locals.todo = await db('todos').select('*').where('id', req.params.id).first();
	if (!res.locals.todo) {
		return res.status(404).send("This TODO doesn't exist!");
	}
	next();
};

app.get('/', async (req, res) => {
	const todos = await db('todos').select('*');
	res.render('todo-list', {
		todos,
	});
});

app.post('/add-todo', async (req, res) => {
	const title = req.body.title.trim();
	if (title.length > 0) {
		const todo = {
			title: req.body.title,
			done: false,
		};
		await db('todos').insert(todo);
	}
	res.redirect(303, '/');
});

app.get('/todo/:id', getTodo, (req, res) => {
	res.render('todo-detail', {
		todo: res.locals.todo,
	});
});

app.post('/rename-todo/:id', getTodo, async (req, res) => {
	const newTitle = req.body.title.trim();
	if (newTitle.length > 0) {
		await db('todos').update({ title: newTitle }).where('id', res.locals.todo.id);
	}
	res.redirect(303, 'back');
})

app.get('/toggle-done/:id', getTodo, async (req, res) => {
	await db('todos').update({ done: !res.locals.todo.done }).where('id', res.locals.todo.id);
	res.redirect(303, 'back');
});

app.get('/remove-todo/:id', async (req, res) => {
	await db('todos').where('id', req.params.id).del();
	res.redirect(303, '/');
});

app.listen(3000, () => {
	console.log("Server listening");
});
