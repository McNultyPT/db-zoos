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
    db('zoos')
        .then(zoos => {
            res.status(200).json(zoos);
        })
        .catch(err => {
            res.status(500).json(err)
        });
});

router.post('/', (req, res) => {
    const zooInfo = req.body;

    if (!zooInfo.name)
        return res.status(400).json({ errorMessage: 'Please provide the name of the zoo.' });

    db('zoos')
        .insert(req.body)
        .then(ids => {
            const [id] = ids;

            db('zoos')
                .where({ id })
                .then(zoo => {
                    res.status(201).json(zoo);
                });
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error while saving the zoo.' });
        });
});

module.exports = router;

