import knexfile from '../knexfile.js';
import knex from 'knex';

export const db = knex(knexfile);

export const getAllTodos = async () => {
	return await db('todos').select('*');
};

export const getTodo = async (id) => {
	return await db('todos').select('*').where('id', id).first();
};

export const insertTodo = async (todo) => {
	await db('todos').insert(todo);
};

export const updateTodo = async (id, params) => {
	await db('todos').update(params).where('id', id);
};

export const deleteTodo = async (id) => {
	await db('todos').where('id', id).del();
};
