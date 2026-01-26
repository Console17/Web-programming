import cartModel from "../cart/cart.model.js";
import orderModel from "./order.model.js";
import productsModel from "../products/products.model.js";
import userModel from "../users/user.model.js";

const canTransition = (from, to) => {
  if (from === to) return true;
  if (from === "Delivered" || from === "Cancelled") return false;
  if (from === "Processing") return to === "Shipped" || to === "Cancelled";
  if (from === "Shipped") return to === "Delivered";
  return false;
};

async function checkout(req, res) {
  const buyerId = req.user.userId;

  try {
    const cart = await cartModel
      .findOne({ user: buyerId })
      .populate({ path: "items.product", populate: { path: "seller" } });

    if (!cart || !cart.items || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    const items = cart.items.filter((it) => it.product);
    if (items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    // validate stock
    let totalPrice = 0;
    for (const it of items) {
      const stock =
        typeof it.product.quantity === "number" ? it.product.quantity : 0;
      if (it.quantity > stock) {
        return res
          .status(400)
          .json({ message: "Insufficient product quantity" });
      }
      totalPrice += (it.product.price || 0) * it.quantity;
    }

    // deduct balance
    const buyerAfterCharge = await userModel.findOneAndUpdate(
      { _id: buyerId, balance: { $gte: totalPrice } },
      { $inc: { balance: -totalPrice } },
      { new: true },
    );

    if (!buyerAfterCharge) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    const sellerCredits = new Map();

    const orderItems = [];

    // decrease quantity
    for (const it of items) {
      const updated = await productsModel.findOneAndUpdate(
        { _id: it.product._id, quantity: { $gte: it.quantity } },
        { $inc: { quantity: -it.quantity } },
        { new: true },
      );

      if (!updated) {
        throw new Error("Insufficient product quantity");
      }

      const sellerId = String(it.product.seller._id || it.product.seller);
      const subTotal = (it.product.price || 0) * it.quantity;
      // calculate total per seller
      sellerCredits.set(
        sellerId,
        (sellerCredits.get(sellerId) || 0) + subTotal,
      );

      orderItems.push({
        productId: it.product._id,
        sellerId,
        price: it.product.price,
        quantity: it.quantity,
        status: "Processing",
      });
    }

    // add balance to seller
    for (const [sellerId, amount] of sellerCredits.entries()) {
      await userModel.findByIdAndUpdate(sellerId, {
        $inc: { balance: amount },
      });
    }

    const order = await orderModel.create({
      customerId: buyerId,
      items: orderItems,
      totalPrice,
    });

    cart.items = [];
    await cart.save();

    res.status(201).json({ order, totalPrice });
  } catch (error) {
    const msg = error?.message || String(error);
    if (msg === "Insufficient product quantity") {
      return res.status(400).json({ message: "Insufficient product quantity" });
    }
    res.status(500).json({ message: msg });
  }
}

async function getMyOrders(req, res) {
  try {
    const customerId = req.user.userId;
    const orders = await orderModel
      .find({ customerId })
      .sort({ createdAt: -1 })
      .populate("items.productId");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error?.message || String(error) });
  }
}

async function getSellerOrders(req, res) {
  try {
    const sellerId = req.user.userId;

    const orders = await orderModel
      .find({ "items.sellerId": sellerId })
      .sort({ createdAt: -1 })
      .populate("items.productId");

    const filtered = orders.map((o) => {
      const items = (o.items || []).filter(
        (it) => String(it.sellerId) === String(sellerId),
      );

      return {
        _id: o._id,
        customerId: o.customerId,
        items,
        totalPrice: items.reduce((sum, it) => sum + it.price * it.quantity, 0),
        createdAt: o.createdAt,
      };
    });

    res.json(filtered);
  } catch (error) {
    res.status(500).json({ message: error?.message || String(error) });
  }
}

async function updateOrderItemStatus(req, res) {
  try {
    const sellerId = req.user.userId;
    const { orderId, itemId } = req.params;
    const { status } = req.body;

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const item = order.items.id(itemId);
    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    if (
      String(item.sellerId) !== String(sellerId) &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (!canTransition(item.status, status)) {
      return res.status(400).json({ message: "Invalid status transition" });
    }

    item.status = status;
    await order.save();

    res.json({ message: "Status updated", item });
  } catch (error) {
    res.status(500).json({ message: error?.message || String(error) });
  }
}

export const OrdersService = {
  checkout,
  getMyOrders,
  getSellerOrders,
  updateOrderItemStatus,
};
