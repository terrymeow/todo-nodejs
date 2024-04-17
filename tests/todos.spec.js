import test from 'ava'
import supertest from 'supertest'
import { app } from '../src/app.js'
import { db } from '../src/db.js';

test.beforeEach(async () => await db.migrate.latest());

test.afterEach(async () => await db.migrate.rollback());

test('it renders a list of todos', async (t) => {
	const response = await supertest(app).get('/');
	t.assert(response.text.includes('<h1>TODO list</h1>'));
});

test.serial('create new todo in db', async (t) => {
	await db('todos').insert({ title: 'My todo' });

	const response = await supertest(app).get('/');
	t.assert(response.text.includes('My todo'));
});

test.serial('create new todo with form', async (t) => {
	await supertest(app)
		.post('/add-todo')
		.type('form')
		.send({ title: 'My todo' })
		.redirects(1);

	const response = await supertest(app).get('/');
	t.assert(response.text.includes('My todo'));
});
