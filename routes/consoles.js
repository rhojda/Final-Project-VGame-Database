const express = require('express');
const Console = require('../models/console');
const Game = require('../models/game');
//const Genre = require('../models/genre');
//const userConsole = require('../models/user_console');
const router = express.Router();

router.get('/', async (req, res, next) => {
    const consoles = await Console.all()
    res.render('consoles/index', { title: 'Video Game Database || Consoles', consoles: consoles });
});

router.get('/form', async (req, res, next) => {
    res.render('consoles/form', { title: 'Video Game Database || Consoles', games: await Game.all(), genres: await Genre.all() });
});

router.get('/edit', async (req, res, next) => {
    let consoleId = req.query.id;
    let console = await Console.get(consoleId);
    console.gameIds = (await Console.allForConsole(console)).map(game => game.id);
    res.render('consoles/form', { title: 'Video Game Database || Consoles', console: console, games: await Game.all(), genres: await Genre.all() });
});

router.get('/show/:id', async (req, res, next) => {
    const console = await Console.get(req.params.id)
    let templateVars = {
        title: 'Video Game Database || Consoles',
        console: console,
        consoleId: req.params.id,
    }
    console.games = await Game.allForConsole(console);
    if (console.genreId) {
        templateVars['genre'] = await Genre.get(console.genreId);
    }
    if (req.session.currentUser) {
        templateVars['userConsole'] = await userConsole.get(console, req.session.currentUser);
    }
    res.render('consoles/show', templateVars);
});

router.post('/upsert', async (req, res, next) => {
    console.log('body: ' + JSON.stringify(req.body))
    await Console.upsert(req.body);
    let createdOrupdated = req.body.id ? 'updated' : 'created';
    req.session.flash = {
        type: 'info',
        intro: 'Success!',
        message: `the console has been ${createdOrupdated}!`,
    };
    res.redirect(303, '/consoles')
});

module.exports = router;