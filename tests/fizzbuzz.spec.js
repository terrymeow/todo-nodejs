import test from 'ava'
import { fizzbuzz } from '../src/fizzbuzz.js';

test('number 9 returns fizz', (t) => {
	const result = fizzbuzz(9);
	t.is(result, 'fizz');
});

test('number 5 returns buzz', (t) => {
	const result = fizzbuzz(5);
	t.is(result, 'buzz');
});

test('number 15 returns fizzbuzz', (t) => {
	const result = fizzbuzz(15);
	t.is(result, 'fizzbuzz');
});

test('number 4 returns 4', (t) => {
	const result = fizzbuzz(4);
	t.is(result, 4);
});
