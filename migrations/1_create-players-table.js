/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.up = (pgm) => {
    pgm.createTable("players", {
        id: {
            type: "serial",
            primaryKey: true,
        },
        name: {
            type: "varchar(255)",
            notNull: true,
        },
        points: {
            type: "varchar(255)",
            notNull: true,
            default: "0",
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 */
exports.down = (pgm) => {
    pgm.dropTable("players");
};

