const db = require('../database')

exports.all = async () => {
    const { rows } = await db.getPool().query("select * from games order by id");
    return db.camelize(rows);
}

exports.allForConsole = async (console) => {
    const { rows } = await db.getPool().query(`select games.* from games`, [console.id]);
    return db.camelize(rows);
}

exports.add = async (game) => {
    return await db.getPool()
        .query("INSERT INTO games(title, genre_id, release_date, developer, rating, console_id) VALUES($1, $2, $3, $4, $5, %6) RETURNING *",
            [game.title, game.genre_id, game.release_date, game.developer, game.rating, game.console_id]);
}

exports.get = async (id) => {
    const { rows } = await db.getPool().query("select * from games where id = $1", [id]);
    return db.camelize(rows)[0];
}

exports.update = async (game) => {
    return await db.getPool()
        .query("update games set title = $1, genre_id = $2, release_date = $3, developer = $4, rating = $5, console_id = $6  where id = $7 RETURNING *",
            [game.title, game.genre_id, game.release_date, game.developer, game.rating, game.console_id, game.id]);
}

exports.upsert = async (game) => {
    if (game.id) {
        return exports.update(game);
    } else {
        return exports.add(game);
    }
}