const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// gets all products
router.get("/", async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag, through: ProductTag }],
    });
    res.json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// gets one product
router.get("/:id", async (req, res) => {
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag, through: ProductTag }],
    });
    res.json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// creates new product
router.post("/", async (req, res) => {
  try {
    const { tagIds, ...productData } = req.body;
    const product = await Product.create(productData);

    if (tagIds && tagIds.length) {
      await product.addTags(tagIds);
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

// updates product
router.put("/:id", async (req, res) => {
  try {
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });

      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => ({
          product_id: req.params.id,
          tag_id,
        }));

      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }

    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [{ model: Tag, through: ProductTag }],
    });

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

// deletes one product by its `id` value
router.delete("/:id", async (req, res) => {
  try {
    const productData = await Product.destroy({
      where: { id: req.params.id },
    });

    if (!productData) {
      res.status(404).json({ message: "No product with this id!" });
      return;
    }

    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
