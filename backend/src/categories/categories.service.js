import categoryModel from "./category.model.js";

async function createCategory(req, res) {
  try {
    const { name } = req.body;

    const exists = await categoryModel.findOne({ name: name.trim() });
    if (exists) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await categoryModel.create({ name: name.trim() });
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error?.message || String(error) });
  }
}

async function getAllCategories(req, res) {
  try {
    const categories = await categoryModel.find().sort({ createdAt: -1 });
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error?.message || String(error) });
  }
}

async function getCategoryById(req, res) {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error?.message || String(error) });
  }
}

async function updateCategory(req, res) {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    if (req.body.name != null) {
      const newName = String(req.body.name).trim();
      const exists = await categoryModel.findOne({
        name: newName,
        _id: { $ne: category._id },
      });
      if (exists) {
        return res.status(400).json({ message: "Category already exists" });
      }
      category.name = newName;
    }

    if (req.body.active != null) {
      category.active = req.body.active;
    }

    await category.save();
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: error?.message || String(error) });
  }
}

async function deleteCategory(req, res) {
  try {
    const category = await categoryModel.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    await categoryModel.findByIdAndDelete(category._id);
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error?.message || String(error) });
  }
}

export const CategoryService = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
