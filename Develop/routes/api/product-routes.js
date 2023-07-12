const router = require("express").Router();
const { Product, Category, Tag, ProductTag } = require("../../models");

// gets all products
router.get("/", async (req, res) => {
  try {
    const productData = await Product.findAll({
      include: [{ model: Product }],
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
      include: [{ model: Product }],
    });
    res.json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// creates new product
router.post("/", async (req, res) => {
  try {
    const productData = await Product.create({
      product_name: "Basketball",
      price: 200.0,
      stock: 3,
      tagIds: [1, 2, 3, 4],
    });
    res.json(productData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// create a new product
router.post("/", async (req, res) => {
  try {
    const product = await Product.create(req.body);

    // if there are associated tags, create pairings to bulk create in the ProductTag model
    if (req.body.tagIds && req.body.tagIds.length) {
      const productTagIdArr = req.body.tagIds.map((tag_id) => ({
        product_id: product.id,
        tag_id,
      }));
      await ProductTag.bulkCreate(productTagIdArr);
    }

    res.status(200).json(product);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update product
router.put("/:id", async (req, res) => {
  try {
    // update product data
    await Product.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (req.body.tagIds && req.body.tagIds.length) {
      // find all associated tags for the product
      const productTags = await ProductTag.findAll({
        where: { product_id: req.params.id },
      });

      // create filtered list of new tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => ({
          product_id: req.params.id,
          tag_id,
        }));

      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions in a transaction
      await Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    }

    // fetch updated product data
    const updatedProduct = await Product.findByPk(req.params.id, {
      include: [{ model: Tag, through: ProductTag }],
    });

    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json(err);
  }
});

// delete one product by its `id` value
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
