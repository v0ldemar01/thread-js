const TableName = {
  USERS: 'users',
  POSTS: 'posts',
  COMMENTS: 'comments',
  COMMENT_REACTIONS: 'comment_reactions'
};

const ColumnName = {
  CREATED_AT: 'created_at',
  ID: 'id',
  IS_LIKE: 'is_like',
  PASSWORD: 'password',
  USER_ID: 'user_id',
  COMMENT_ID: 'comment_id',
  UPDATED_AT: 'updated_at'
};

const RelationRule = {
  CASCADE: 'CASCADE',
  SET_NULL: 'SET NULL'
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const up = async knex => {
  await knex.schema.createTable(TableName.COMMENT_REACTIONS, table => {
    table.increments(ColumnName.ID).primary();
    table.boolean(ColumnName.IS_LIKE).notNullable().defaultTo(true);
    table
      .dateTime(ColumnName.CREATED_AT)
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .dateTime(ColumnName.UPDATED_AT)
      .notNullable()
      .defaultTo(knex.fn.now());
    table
      .integer(ColumnName.USER_ID)
      .references(ColumnName.ID)
      .inTable(TableName.USERS)
      .onUpdate(RelationRule.CASCADE)
      .onDelete(RelationRule.SET_NULL);
    table
      .integer(ColumnName.COMMENT_ID)
      .references(ColumnName.ID)
      .inTable(TableName.COMMENTS)
      .onUpdate(RelationRule.CASCADE)
      .onDelete(RelationRule.SET_NULL);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const down = async knex => {
  await knex.schema.dropTableIfExists(TableName.COMMENT_REACTIONS);
};

export { up, down };
