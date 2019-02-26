const router = require('express').Router();
const knex = require('knex');

const knexConfig = {
    client: 'sqlite3',
    useNullAsDefault: true,
    connection: {
        filename: './data/lambda.sqlite3'
    }
};

const db = knex(knexConfig);

router.get('/', (req, res) => {
    db('bears')
        .then(bears => {
            res.status(200).json(bears);
        })
        .catch(() => {
            res.status(500).json({ error: 'The bears could not be retrieved.' });
        });
});

router.get('/:id', (req, res) => {
    db('bears')
        .where({ id: req.params.id })
        .then(bear => {
            if (bear) {
                res.status(200).json(bear);
            } else {
                res.status(404).json({ errorMessage: 'A bear with that ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'The bear could not be retrieved.' });
        }); 
});

module.exports = router;