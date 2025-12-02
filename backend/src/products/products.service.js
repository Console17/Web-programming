import productsModel from "./products.model.js";
import cloudinary from "../config/cloudinary.config.js";

async function getAllProducts(req, res) {
  let { page = 1, limit = 10, sort } = req.query;
  page = parseInt(page);
  limit = parseInt(limit);

  let sortObj = {};
  switch (sort) {
    case "priceAsc":
      sortObj.price = 1;
      break;
    case "priceDesc":
      sortObj.price = -1;
      break;
    case "titleAsc":
      sortObj.title = 1;
      break;
    case "titleDesc":
      sortObj.title = -1;
      break;
    default:
      sortObj.createdAt = -1;
  }

  const products = await productsModel
    .find()
    .populate("seller", "userName email")
    .sort(sortObj)
    .skip((page - 1) * limit)
    .limit(limit);

  const totalProducts = await productsModel.countDocuments();

  res.json({
    page,
    limit,
    totalPages: Math.ceil(totalProducts / limit),
    totalProducts,
    products,
  });
}

async function getProductById(req, res) {
  const productId = req.params.id;

  const product = await productsModel
    .findById(productId)
    .populate("seller", "userName email");

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  res.json(product);
}

async function createProduct(req, res) {
  const { title, category, description, price } = req.body;
  if (!req.file) return res.status(400).json({ message: "Image is required" });

  const uploadFromBuffer = (buffer) =>
    new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: "products" },
        (error, result) => {
          if (result) resolve(result);
          else reject(error);
        }
      );
      stream.end(buffer);
    });

  const resultUpload = await uploadFromBuffer(req.file.buffer);

  const newProduct = await productsModel.create({
    title,
    category,
    description,
    price,
    seller: req.user.userId,
    imageUrl: resultUpload.secure_url,
    imageId: resultUpload.public_id,
  });

  res.status(201).json(newProduct);
}

async function getMyProducts(req, res) {
  // all products if admin, filtered products if seller.
  const filter = req.user.role === "admin" ? {} : { seller: req.user.userId };
  const products = await productsModel
    .find(filter)
    .populate("seller", "userName email");
  res.json(products);
}

async function updateProduct(req, res) {
  const productId = req.params.id;
  const product = await productsModel.findById(productId);

  if (!product) return res.status(404).json({ message: "Product not found" });

  if (
    product.seller.toString() !== req.user.userId &&
    req.user.role !== "admin"
  ) {
    return res
      .status(403)
      .json({ message: "Not allowed to update this product" });
  }

  if (req.file) {
    await cloudinary.uploader.destroy(product.imageId);

    const uploadFromBuffer = (buffer) =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "products" },
          (error, result) => {
            if (result) resolve(result);
            else reject(error);
          }
        );
        stream.end(buffer);
      });

    const resultUpload = await uploadFromBuffer(req.file.buffer);
    req.body.imageUrl = resultUpload.secure_url;
    req.body.imageId = resultUpload.public_id;
  }

  const updatedProduct = await productsModel.findByIdAndUpdate(
    productId,
    req.body,
    {
      new: true,
    }
  );

  res.json(updatedProduct);
}

async function deleteProduct(req, res) {
  const productId = req.params.id;
  const product = await productsModel.findById(productId);

  if (!product) return res.status(404).json({ message: "Product not found" });

  if (
    product.seller.toString() !== req.user.userId &&
    req.user.role !== "admin"
  ) {
    return res
      .status(403)
      .json({ message: "Not allowed to delete this product" });
  }

  if (product.imageId) {
    try {
      await cloudinary.uploader.destroy(product.imageId);
    } catch (err) {
      console.log(err);
    }
  }

  await productsModel.findByIdAndDelete(productId);
  res.json({ message: "Product deleted successfully" });
}

export const ProductService = {
  getAllProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
