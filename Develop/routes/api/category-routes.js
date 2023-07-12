const router = require("express").Router();
const { Category, Product } = require("../../models");

// finds all categories
router.get("/", async (req, res) => {
  const categoryData = await Category.findAll({
    include: [{ model: Product }],
  });
  res.json(categoryData);
});

// finds one category by its `id` value
router.get("/:id", async (req, res) => {
  const categoryData = await Category.findByPk(req.params.id, {
    include: [{ model: Product }],
  });
  res.json(categoryData);
});

// creates a new category
router.post("/", async (req, res) => {
  const categoryData = await Category.create(req.body);
  res.status(200).json(categoryData);
});

// updates a category by its `id` value
router.put("/:id", async (req, res) => {
  const updatedCategory = await Category.update(
    { category_name: req.body.category_name },
    {
      where: { id: req.params.id },
    }
  );
  res.status(200).json({ message: "Category updated successfully!" });
});

// deletes a category by its `id` value
router.delete("/:id", async (req, res) => {
  const categoryData = await Category.destroy({
    where: { id: req.params.id },
  });
  if (!categoryData) {
    res.status(404).json({ message: "No category with this id!" });
    return;
  }
  res.status(200).json(categoryData);
});

module.exports = router;
