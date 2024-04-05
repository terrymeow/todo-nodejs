import ejs from 'ejs';
import { WebSocketServer } from 'ws';
import { getAllTodos, getTodo } from './db.js';

const connections = new Set();

export const createWebSocketServer = (server) => {
	const wss = new WebSocketServer({ server });

	wss.on('connection', (socket) => {
		connections.add(socket);
		socket.on('close', () => {
			connections.delete(socket);
		});
	});
};

async function sendTodoListToAllConnections() {
	const todos = await getAllTodos();
	const html = await ejs.renderFile('views/_todos.ejs', {
		todos,
	});

	for (const connection of connections) {
		const payload = {
			type: 'list',
			html,
		};
		connection.send(JSON.stringify(payload));
	}
}

async function sentTodoDetailToAllConnections(id) {
	const todo = await getTodo(id);
	
	const html = todo ?
		await ejs.renderFile('views/_todo.ejs', {
			todo,
		}) :
		"<strong>This TODO was deleted.</strong>";

	for (const connection of connections) {
		const payload = {
			type: String(id),
			todoTitle: todo?.title,
			html,
		};
		connection.send(JSON.stringify(payload));
	}
}

export const updateTodoForAllConnections = async (id = null) => {
	sendTodoListToAllConnections();
	id && sentTodoDetailToAllConnections(id);
};
