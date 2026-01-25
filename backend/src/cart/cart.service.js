import cartModel from "./cart.model.js";
import productsModel from "../products/products.model.js";

async function getCart(req, res) {
  try {
    const userId = req.user.userId;

    const cart = await cartModel
      .findOne({ user: userId })
      .populate("items.product");

    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }

    const items = (cart.items || []).filter((it) => it.product);
    const totalPrice = items.reduce(
      (sum, it) => sum + (it.product.price || 0) * it.quantity,
      0
    );

    res.json({
      _id: cart._id,
      user: cart.user,
      items,
      totalPrice,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error?.message || String(error) });
  }
}

async function addToCart(req, res) {
  try {
    const userId = req.user.userId;
    const { productId, quantity } = req.body;

    const product = await productsModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const stock = typeof product.quantity === "number" ? product.quantity : 0;

    let cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      cart = await cartModel.create({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      (it) => it.product.toString() === productId
    );

    const nextQty = existingItem ? existingItem.quantity + quantity : quantity;
    if (nextQty > stock) {
      return res.status(400).json({ message: "Quantity exceeds stock" });
    }

    if (existingItem) {
      existingItem.quantity = nextQty;
    } else {
      cart.items.push({ product: productId, quantity });
    }

    await cart.save();
    return getCart(req, res);
  } catch (error) {
    res.status(500).json({ message: error?.message || String(error) });
  }
}

async function updateCartItem(req, res) {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;
    const { quantity } = req.body;

    const product = await productsModel.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    const stock = typeof product.quantity === "number" ? product.quantity : 0;
    if (quantity > stock) {
      return res.status(400).json({ message: "Quantity exceeds stock" });
    }

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((it) => it.product.toString() === productId);
    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    item.quantity = quantity;
    await cart.save();

    return getCart(req, res);
  } catch (error) {
    res.status(500).json({ message: error?.message || String(error) });
  }
}

async function removeCartItem(req, res) {
  try {
    const userId = req.user.userId;
    const { productId } = req.params;

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const before = cart.items.length;
    cart.items = cart.items.filter((it) => it.product.toString() !== productId);

    if (cart.items.length === before) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    await cart.save();
    return getCart(req, res);
  } catch (error) {
    res.status(500).json({ message: error?.message || String(error) });
  }
}

async function emptyCart(req, res) {
  try {
    const userId = req.user.userId;

    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.json({ items: [], totalPrice: 0 });
    }

    cart.items = [];
    await cart.save();

    return res.json({ items: [], totalPrice: 0 });
  } catch (error) {
    res.status(500).json({ message: error?.message || String(error) });
  }
}

export const CartService = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  emptyCart,
};
