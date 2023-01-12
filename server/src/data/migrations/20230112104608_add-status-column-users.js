const TableName = {
  USERS: 'users'
};

const ColumnName = {
  STATUS: 'status'
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async knex => {
  await knex.schema.table(TableName.USERS, table => {
    table.text(ColumnName.STATUS);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async knex => {
  await knex.schema.table(TableName.USERS, table => {
    table.dropColumn(ColumnName.STATUS);
  });
};

export { up, down };
