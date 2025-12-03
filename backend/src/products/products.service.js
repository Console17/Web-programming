import productsModel from "./products.model.js";
import cloudinary from "../config/cloudinary.config.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check if Cloudinary is configured
const isCloudinaryConfigured = () => {
  return process.env.CLOUD_NAME && 
         process.env.CLOUD_API_KEY && 
         process.env.CLOUD_API_SECRET &&
         process.env.CLOUD_NAME !== 'your_cloud_name';
};

// Upload image locally or to Cloudinary
const uploadImage = async (file) => {
  console.log('File upload info:', {
    originalname: file.originalname,
    mimetype: file.mimetype,
    size: file.size,
    encoding: file.encoding
  });
  
  if (isCloudinaryConfigured()) {
    // Upload to Cloudinary
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
    
    const result = await uploadFromBuffer(file.buffer);
    return {
      url: result.secure_url,
      id: result.public_id,
      storage: 'cloudinary'
    };
  } else {
    // Save locally
    const uploadsDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
      console.log('Created uploads directory:', uploadsDir);
    }
    
    const filename = `${Date.now()}-${file.originalname}`;
    const filepath = path.join(uploadsDir, filename);
    
    console.log('Saving file to:', filepath);
    fs.writeFileSync(filepath, file.buffer);
    console.log('File saved successfully');
    
    // Use full URL for local storage so frontend can access it
    const baseUrl = process.env.BASE_URL || 'http://localhost:7001';
    const imageUrl = `${baseUrl}/uploads/${filename}`;
    console.log('Image URL:', imageUrl);
    
    return {
      url: imageUrl,
      id: filename,
      storage: 'local'
    };
  }
};

// Delete image from local storage or Cloudinary
const deleteImage = async (imageId, storage = 'local') => {
  if (storage === 'cloudinary' && isCloudinaryConfigured()) {
    try {
      await cloudinary.uploader.destroy(imageId);
    } catch (err) {
      console.log('Error deleting from Cloudinary:', err);
    }
  } else {
    // Delete local file
    try {
      const filepath = path.join(__dirname, '../../uploads', imageId);
      if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
      }
    } catch (err) {
      console.log('Error deleting local file:', err);
    }
  }
};

async function getAllProducts(req, res) {
  try {
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
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ 
      message: "Failed to fetch products",
      error: error.message 
    });
  }
}

async function getProductById(req, res) {
  try {
    const productId = req.params.id;

    const product = await productsModel
      .findById(productId)
      .populate("seller", "userName email");

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    console.error("Error getting product:", error);
    res.status(500).json({ 
      message: "Failed to fetch product",
      error: error.message 
    });
  }
}

async function createProduct(req, res) {
  try {
    const { title, category, description, price } = req.body;
    if (!req.file) return res.status(400).json({ message: "Image is required" });

    const uploadResult = await uploadImage(req.file);

    const newProduct = await productsModel.create({
      title,
      category,
      description,
      price,
      seller: req.user.userId,
      imageUrl: uploadResult.url,
      imageId: uploadResult.id,
      imageStorage: uploadResult.storage,
    });

    res.status(201).json(newProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ 
      message: "Failed to create product",
      error: error.message 
    });
  }
}

async function getMyProducts(req, res) {
  try {
    // all products if admin, filtered products if seller.
    const filter = req.user.role === "admin" ? {} : { seller: req.user.userId };
    const products = await productsModel
      .find(filter)
      .populate("seller", "userName email");
    res.json(products);
  } catch (error) {
    console.error("Error getting my products:", error);
    res.status(500).json({ 
      message: "Failed to fetch your products",
      error: error.message 
    });
  }
}

async function updateProduct(req, res) {
  try {
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
      // Delete old image
      await deleteImage(product.imageId, product.imageStorage);
      
      // Upload new image
      const uploadResult = await uploadImage(req.file);
      req.body.imageUrl = uploadResult.url;
      req.body.imageId = uploadResult.id;
      req.body.imageStorage = uploadResult.storage;
    }

    const updatedProduct = await productsModel.findByIdAndUpdate(
      productId,
      req.body,
      {
        new: true,
      }
    );

    res.json(updatedProduct);
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ 
      message: "Failed to update product",
      error: error.message 
    });
  }
}

async function deleteProduct(req, res) {
  try {
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
      await deleteImage(product.imageId, product.imageStorage);
    }

    await productsModel.findByIdAndDelete(productId);
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ 
      message: "Failed to delete product",
      error: error.message 
    });
  }
}

export const ProductService = {
  getAllProducts,
  getProductById,
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
