import userModel from "./user.model.js";

async function deposit(req, res) {
	try {
		const userId = req.user.userId;
		const { amount } = req.body;

		const user = await userModel.findByIdAndUpdate(
			userId,
			{ $inc: { balance: amount } },
			{ new: true }
		);

		if (!user) {
			return res.status(404).json({ message: "User not found" });
		}

		res.json({ balance: user.balance });
	} catch (error) {
		res.status(500).json({ message: error?.message || String(error) });
	}
}

export const UserService = {
	deposit,
};
