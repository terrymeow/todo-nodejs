
/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const up = async (knex) => {
	await knex.schema.alterTable('todos', (table) => {
		table.integer('priority').notNullable().unsigned().defaultTo(0)
	});
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export const down = async (knex) => {
	await knex.schema.alterTable('todos', (table) => {
		table.dropColumn('priority')
	});
};
