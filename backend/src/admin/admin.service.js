import userModel from "../users/user.model.js";
import productsModel from "../products/products.model.js";
import orderModel from "../orders/order.model.js";

const STATUS_LIST = [
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
  "Refunded",
];

async function reports(req, res) {
  try {
    const usersByRoleAgg = await userModel.aggregate([
      { $group: { _id: "$role", total: { $sum: 1 } } },
    ]);

    const usersByRole = usersByRoleAgg.reduce((acc, row) => {
      acc[row._id] = row.total;
      return acc;
    }, {});

    const totalUsers = await userModel.countDocuments();
    const totalProducts = await productsModel.countDocuments();
    const totalOrders = await orderModel.countDocuments();

    const itemsByStatusAgg = await orderModel.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.status",
          total: { $sum: 1 },
        },
      },
    ]);

    const itemsByStatus = STATUS_LIST.reduce((acc, s) => {
      acc[s] = 0;
      return acc;
    }, {});

    for (const row of itemsByStatusAgg) {
      if (row._id && itemsByStatus[row._id] != null) {
        itemsByStatus[row._id] = row.total;
      }
    }

    const revenueAgg = await orderModel.aggregate([
      { $unwind: "$items" },
      { $match: { "items.status": { $ne: "Refunded" } } },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
        },
      },
    ]);

    const totalRevenue = revenueAgg[0]?.total || 0;

    res.json({
      totalUsers,
      usersByRole,
      totalProducts,
      totalOrders,
      totalRevenue,
      items: {
        Processing: itemsByStatus.Processing,
        Shipped: itemsByStatus.Shipped,
        Delivered: itemsByStatus.Delivered,
        Cancelled: itemsByStatus.Cancelled,
        Refunded: itemsByStatus.Refunded,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error?.message || String(error) });
  }
}

export const AdminService = {
  reports,
};
