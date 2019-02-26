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
        .catch(() => {
            res.status(500).json({ error: 'The zoos could not be retrieved.' });
        });
});

router.get('/:id', (req, res) => {
    db('zoos')
        .where({ id: req.params.id })
        .then(zoo => {
            if (zoo) {
                res.status(200).json(zoo);
            } else {
                res.status(404).json({ errorMessage: 'A zoo with that ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'The zoo could not be retrieved.' });
        })
})

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

router.delete('/:id', (req, res) => {
    db('zoos')
        .where({ id: req.params.id })
        .del()
        .then(count => {
            if (count > 0) {
                res.status(204).json({ message: 'Zoo has been deleted.' });
            } else {
                res.status(404).json({ errorMessage: 'A zoo with that ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error while deleting the zoo.' });
        });
});

router.put('/:id', (req, res) => {
    const zooInfo = req.body;

    if (!zooInfo.name)
        return res.status(400).json({ errorMessage: 'Please provide a name to be updated.' });

    db('zoos')
        .where({ id: req.params.id })
        .update(req.body)
        .then(count => {
            if (count > 0) {
                db('zoos')
                    .where({ id: req.params.id })
                    .then(zoo => {
                        res.status(200).json(zoo);
                    });
            } else {
                res.status(404).json({ errorMessage: 'A zoo with that ID does not exist.' });
            }
        })
        .catch(() => {
            res.status(500).json({ error: 'There was an error while updating the zoo.' });
        });
});

module.exports = router;

