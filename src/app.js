import express from 'express';
import { updateTodoForAllConnections } from './websockets.js';
import { getAllTodos, getTodo, insertTodo, updateTodo, deleteTodo } from './db.js';

export const app = express();

app.set('view engine', 'ejs');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

const getTodoMiddleware = async (req, res, next) => {
	res.locals.todo = await getTodo(req.params.id);
	if (!res.locals.todo) {
		return res.status(404).send(`
			<p><strong>This TODO doesn't exist!</strong></p>
			<p><a href="/">back to the list</a></p>`
		);
	}
	next();
};

app.get('/', async (req, res) => {
	const todos = await getAllTodos();
	res.render('todo-list', {
		todos,
	});
});

app.post('/add-todo', async (req, res) => {
	const title = req.body.title.trim();
	const priority = Number(req.body.priority);
	if (title.length > 0) {
		const todo = {
			title: req.body.title,
			done: false,
			priority: [-1, 0, 1].includes(priority) ? priority : 0,
		};
		await insertTodo(todo);
		updateTodoForAllConnections();
	}
	res.redirect(303, '/');
});

app.get('/todo/:id', getTodoMiddleware, (req, res) => {
	res.render('todo-detail', {
		todo: res.locals.todo,
	});
});

app.post('/rename-todo/:id', getTodoMiddleware, async (req, res) => {
	const newTitle = req.body.title.trim();
	if (newTitle.length > 0) {
		const id = res.locals.todo.id;
		await updateTodo(id, { title: newTitle });
		updateTodoForAllConnections(id);
	}
	res.redirect(303, 'back');
});

app.post('/change-priority/:id', getTodoMiddleware, async (req, res) => {
	const newPriority = Number(req.body.priority);
	if ([-1, 0, 1].includes(newPriority)) {
		const id = res.locals.todo.id;
		await updateTodo(id, { priority: newPriority });
		updateTodoForAllConnections(id);
	}
	res.redirect(303, 'back');
});

app.get('/toggle-done/:id', getTodoMiddleware, async (req, res) => {
	const id = res.locals.todo.id;
	await updateTodo(id, { done: !res.locals.todo.done });
	updateTodoForAllConnections(id);
	res.redirect(303, 'back');
});

app.get('/remove-todo/:id', async (req, res) => {
	const id = req.params.id;
	await deleteTodo(id);
	updateTodoForAllConnections(id);
	res.redirect(303, '/');
});
