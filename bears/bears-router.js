const router = require("express").Router();
const knex = require("knex");

const knexConfig = {
  client: "sqlite3",
  useNullAsDefault: true,
  connection: {
    filename: "./data/lambda.sqlite3"
  }
};

const db = knex(knexConfig);

router.get("/", (req, res) => {
  db("bears")
    .then(bears => {
      res.status(200).json(bears);
    })
    .catch(() => {
      res.status(500).json({ error: "The bears could not be retrieved." });
    });
});

router.get("/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .then(bear => {
      if (bear) {
        res.status(200).json(bear);
      } else {
        res
          .status(404)
          .json({ errorMessage: "A bear with that ID does not exist." });
      }
    })
    .catch(() => {
      res.status(500).json({ error: "The bear could not be retrieved." });
    });
});

router.post("/", (req, res) => {
  const bearInfo = req.body;

  if (!bearInfo.name)
    return res
      .status(400)
      .json({ errorMessage: "Please provide a name for the bear." });

  db("bears")
    .insert(req.body)
    .then(ids => {
      const [id] = ids;

      db("bears")
        .where({ id })
        .then(bear => {
          res.status(201).json(bear);
        });
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "There was an error while saving the bear." });
    });
});

router.delete("/:id", (req, res) => {
  db("bears")
    .where({ id: req.params.id })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).json({ message: "Bear has been deleted." });
      } else {
        res
          .status(404)
          .json({ errorMessage: "A bear with that ID does not exist." });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "There was an error while deleting the bear." });
    });
});

router.put("/:id", (req, res) => {
  const bearInfo = req.body;

  if (!bearInfo.name)
    return res
      .status(400)
      .json({ errorMessage: "Please provide a name to be updated." });

  db("bears")
    .where({ id: req.params.id })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        db("bears")
          .where({ id: req.params.id })
          .then(bear => {
            res.status(200).json(bear);
          });
      } else {
        res
          .status(404)
          .json({ errorMessage: "A bear with that ID does not exist." });
      }
    })
    .catch(() => {
      res
        .status(500)
        .json({ error: "There was an error while updating the bear." });
    });
});

module.exports = router;
