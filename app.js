import express from 'express'

const app = express();

let todos = [];
let idCounter = 1;

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const getTodo = (req, res, next) => {
	res.locals.todo = todos.find(todo => todo.id === Number(req.params.id));
	if (!res.locals.todo) {
		return res.status(404).send("This TODO doesn't exist!");
	}
	next();
};

app.get('/', (req, res) => {
	res.render('todo-list', {
		todos,
	});
});

app.post('/add-todo', (req, res) => {
	const title = req.body.title.trim();
	if (title.length > 0) {
		const todo = {
			id: idCounter++,
			title: req.body.title,
			done: false,
		};
		todos.push(todo);
	}
	res.redirect(303, '/');
});

app.get('/todo/:id', getTodo, (req, res) => {
	res.render('todo-detail', {
		todo: res.locals.todo,
	});
});

app.post('/rename-todo/:id', getTodo, (req, res) => {
	const newTitle = req.body.title.trim();
	if (newTitle.length > 0) {
		res.locals.todo.title = req.body.title;
	}
	res.redirect(303, 'back');
})

app.get('/toggle-done/:id', getTodo, (req, res) => {
	res.locals.todo.done = !res.locals.todo.done;
	res.redirect(303, 'back');
});

app.get('/remove-todo/:id', (req, res) => {
	todos = todos.filter(todo => todo.id !== Number(req.params.id));
	res.redirect(303, '/');
});

app.listen(3000, () => {
	console.log("Server listening");
});
