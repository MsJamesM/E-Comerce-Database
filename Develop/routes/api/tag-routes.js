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

// creates a new tag
router.post("/", async (req, res) => {
  try {
    const productTagData = await Tag.create(req.body);
    res.status(200).json(productTagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// updates a tag's name by its `id` value
router.put("/:id", async (req, res) => {
  try {
    const updatedTag = await Tag.update(
      { tag_name: req.body.tag_name },
      {
        where: { id: req.params.id },
      }
    );
    res.status(200).json({ message: "Tag updated successfully!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// deletes a tag by id
router.delete("/:id", async (req, res) => {
  try {
    const productTagData = await Tag.destroy({
      include: [{ model: Product }],
    });
    if (!productData) {
      res.status(404).json({ message: "No tag with this id!" });
      return;
    }
    res.status(200).json(productTagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
