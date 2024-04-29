const db = require('../database')

exports.all = async () => {
    const { rows } = await db.getPool().query("select * from consoles order by id");
    return db.camelize(rows);
}

exports.add = async (console) => {
    const { rows } = await db.getPool()
        .query("INSERT INTO consoles(name) VALUES($1) RETURNING *",
            [console.name]);
    let newConsole = db.camelize(rows)[0]
    await addGamesToConsole(newConsole.id, console.gameIds)
    return newConsole
}

exports.get = async (id) => {
    const { rows } = await db.getPool().query("select * from consoles where id = $1", [id]);
    return db.camelize(rows)[0]
}

exports.update = async (console) => {
    const { rows } = await db.getPool()
        .query("UPDATE consoles SET name = $1 where id = $2 RETURNING *",
            [console.name, console.id]);
    let newConsole = db.camelize(rows)[0]
    await DeleteGamesForConsole(newConsole)
    await addGamesToConsole(newConsole, console.gameIds)
    return newConsole
}

exports.upsert = async (console) => {
    if (console.gameIds && !Array.isArray(console.gameIds)) {
        console.gameIds = [console.gameIds];
    }
    if (console.id) {
        return exports.update(console);
    } else {
        return exports.add(console);
    }
}

const addGamesToConsole = async (console, gameIds) => {
    gameIds.forEach(async (gameId) => {
        await db.getPool().query(`
      INSERT INTO games_consoles(game_id, console_id) values($1,$2)
      `, [gameId, console.id])
    })
}

const DeleteGamesForConsole = async (console) => {
    return db.getPool().query(`DELETE from games_books where book_id = $1`, [console.id]);
}