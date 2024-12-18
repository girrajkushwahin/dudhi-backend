const mongoose = require("mongoose");
const Category = require("../models/Category");
const Product = require("../models/Product")
const fs = require("fs");

//POST PricingAndFeesCategory
exports.createCategory = async (req, res) => {
  const category = await Category.create({
    Category: req.body.Category,
    Parent_Category: req.body.Parent_Category,
    Logo: req.file.path,
    subtitle: req.body.subtitle,
    detail1: req.body.detail1,
    detail2: req.body.detail2
  });
  // console.log(req.body);
  if (!category) {
    return res.status(500).json({ message: "Category Not Created" });
  } else {
    return res.json({ success: true, data: category });
  }
};

// GET CategoryAll
exports.getAllCategory = async (req, res) => {
  const allCategories = await Category.find()
  const allProduct = await Product.find().select('_id name category logo')
  if (!allCategories || !allProduct) {
    return res.status(500).json({ message: "Categories data Not found" });
  } else {
    const finalData = allCategories.map(elem => {
      let id1 = JSON.stringify(elem._id)

      const data2 = allProduct.filter(elem2 => {
        let id2 = JSON.stringify(elem2.category)
        return id1 === id2
      })
      const { _id, Category, subtitle, detail1, detail2, Logo, Parent_Category } = elem
      return { _id, Category, subtitle, detail1, detail2, Logo, Parent_Category, productData: data2 }
    })
    return res.status(200).json({ success: true, data: finalData });
  }
};

// PARAM getCategoryById
exports.getCategoryById = async (req, res, next, id) => {
  // console.log(id);
  const singleCategory = await Category.findById(id);
  if (!singleCategory) {
    return res.status(500).json({ message: "Category Not Found" });
  } else {
    req.Category = singleCategory;
    next();
  }
};

// GET SINGLE CATEGORY
exports.getSingleCategory = async (req, res) => {
  const category = await Category.findOne({ _id: req.Category._id });
  if (!category) {
    return res.status(500).json({ message: "Category not found" });
  } else {
    return res.status(200).json(category);
  }
};

// GET ALL PARENT CATEGORY
exports.getAllParentCategory = async (req, res) => {
  try {
    const parentCategory = await Category.find({ Parent_Category: null });
    if (parentCategory.length > 0) {
      res.json({
        success: true,
        message: `All parent category`,
        data: parentCategory,
      });
    } else if (parentCategory.length == 0) {
      res.json({
        success: true,
        message: `no parent category found`,
      });
    }
  } catch (error) {
    res.json({
      status: false,
      message: `get all parent category error`,
      data: error,
    });
  }
};

//GET CategoryByParentId
exports.getCategoryByParent = async (req, res) => {
  const categoryByParent = await Category.find({
    Parent_Category: req.Category._id,
  });
  res.json({
    status: true,
    data: categoryByParent,
    message: `categories by parent`,
  });
};

exports.updateCategory = async (req, res) => {
  try {
    if (req.files && req.body) {

      await fs.unlink(req.Category.Logo, (err) => {
        if (err) {
          return res.status(400).json({ error: "Failed to delete old photo" });
        }
      })

      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.categoryId,
        {
          $set: {
            Category: req.body.Category,
            Parent_Category: req.body.Parent_Category,
            Logo: req.file.path,
            subtitle: req.body.subtitle,
            detail1: req.body.detail1,
            detail2: req.body.detail2
          },
        },
        { new: true, useFindAndModify: false }
      );

      if (!updatedCategory) {
        return res.status(400).json({ error: "Category not found" });
      }

      res.json({ success: true, message: "Category updated successfully" });
    } else {
      const updatedCategory = await Category.findByIdAndUpdate(
        req.params.categoryId,
        {
          $set: {
            Category: req.body.Category,
            Parent_Category: req.body.Parent_Category,
            subtitle: req.body.subtitle,
            detail1: req.body.detail1,
            detail2: req.body.detail2
          },
        },
        { new: true, useFindAndModify: false }
      );

      if (!updatedCategory) {
        return res.status(400).json({ error: "Category not found" });
      }

      res.json({ success: true, message: "Category updated successfully" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.deleteCategory = async (req, res) => {
  const category = await Category.findById(req.params.categoryId);
  if (!category) {
    return res.status(500).json({ message: "No Category Found" });
  }
  if (category.Parent_Category == null) {
    async function deleteCategoryAndSubCategory() {
      const childCategories = await Category.find({
        Parent_Category: category._id,
      });

      if (childCategories) {
        childCategories.map(async (singleChild) => {
          const logo = singleChild.Logo;
          if (logo) {
            await fs.unlink(singleChild.Logo, (err, singlechild) => {
              if (err) {
                res.status(400).json({ error: "no subCategory Logo present" });
              }
              return;
            });
          }

          await Category.findByIdAndDelete(singleChild._id);
        });
      }

      const ParentLogo = category.Logo;
      if (ParentLogo) {
        await fs.unlink(ParentLogo, (err, photo) => {
          if (err) {
            res.status(404).json({ error: "no Category Logo present" });
          }
          return;
        });
      }

      const mainCategory = await category.deleteOne();
      if (!mainCategory) {
        return res.status(500).json({ message: "Parent Category Not Found" });
      } else {
        res
          .status(200)
          .json({ success: true, category: `${category._id} is deleted` });
      }
    }
    deleteCategoryAndSubCategory();
  } else {
    const photo = category.Logo; //this is logo of sub category;

    if (photo) {
      fs.unlink(photo, (err, photo) => {
        if (err) {
          res.status.json({ error: "no category Logo present" });
        }
        return;
      });
    }

    const subCategory = await category.deleteOne();
    if (!subCategory) {
      return res.status(500).json({ message: "Sub Category Not Found" });
    } else {
      res
        .status(200)
        .json({ success: true, category: `${category._id} is deleted` });
    }
  }
};
