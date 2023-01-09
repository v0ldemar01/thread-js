const TableName = {
  POSTS: 'posts',
  COMMENTS: 'comments'
};

const ColumnName = {
  DELETED_AT: 'deleted_at'
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async knex => {
  await knex.schema.table(TableName.POSTS, table => {
    table.dateTime(ColumnName.DELETED_AT);
  });
  await knex.schema.table(TableName.COMMENTS, table => {
    table.dateTime(ColumnName.DELETED_AT);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async knex => {
  await knex.schema.table(TableName.POSTS, table => {
    table.dropColumn(ColumnName.DELETED_AT);
  });
  await knex.schema.table(TableName.COMMENTS, table => {
    table.dropColumn(ColumnName.DELETED_AT);
  });
};

export { up, down };
