const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// finds all tags
router.get("/", async (req, res) => {
  const tagData = await Tag.findAll({
    include: [{ model: Product }],
  });
  res.json(tagData);
});

// finds a single tag by id
router.get("/:id", async (req, res) => {
  const productTagData = await Tag.findByPk(req.params.id, {
    include: [{ model: Product }],
  });
  res.json(productTagData);
});

router.post("/", (req, res) => {
  // create a new tag
});

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
});

router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
});

module.exports = router;
