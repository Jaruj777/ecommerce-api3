import asyncHandler from "express-async-handler";
import Product from "../model/Product.js";
import Category from "../model/Category.js";
import Brand from "../model/Brand.js";

//@desc Create new product
//@route POST/api/v1/ products
//@access Private/admin
export const createProductCtr = asyncHandler(async (req, res) => {
  const convertImgs = req.files.map((item) => item.path);
  const { name, description, category, sizes, colors, price, totalQty, brand } =
    req.body;

  //проверить существуют ли уже продукты, которые мы хотим создать
  const productExists = await Product.findOne({ name }); // собираюсь найти по названию продукта.

  //Итак, если продукт действительно найден,мы собираемся выдать новую ошибку.
  if (productExists) {
    throw new Error("Product Already Exists");
  }
  //find the category
  const categoryFound = await Category.findOne({
    name: category,
  });
  if (!categoryFound) {
    throw new Error(
      "Category not found, please create category first or check category name"
    );
  }

  //find the brand
  const brandFound = await Brand.findOne({
    name: brand?.toLowerCase(),
  });
  if (!brandFound) {
    throw new Error(
      "Brand not found, please create brand first or check brand  name"
    );
  }

  //В противном случае вы идете вперед и создаете продукт.
  const product = await Product.create({
    name,
    description,
    category,
    sizes,
    colors,
    user: req.userAuthId,
    price,
    totalQty,
    brand,
    images: convertImgs,
  });

  //push the  product into category
  brandFound.products.push(product._id);
  //reseave - пересохранять
  await brandFound.save();

  //push the  product into brand
  categoryFound.products.push(product._id);
  //reseave - пересохранять
  await categoryFound.save();

  //собираемся поместить созданный продукт в поле категории, а это означает, что когда я выбираю категорию или нахожу категорию, я хочу знать, сколько продуктов существует в этой конкретной категории.
  //push the product into category
  // send response
  res.json({
    status: "success",
    message: "product created successfully",
    product,
  });
});

//контроллер для получения нашего продукта
//@desc Get All product
//@route GET/api/v1/ products
//@access Public
export const getProductCtr = asyncHandler(async (req, res) => {
  //query
  let productQuery = Product.find(); // отлавлеваем сам запрос!! даже начало запроса!! (мно использовать для фильтрации) без await!!!!!
  //search by name
  //Мы можем продолжить и выполнить некоторые операции над запросом,прежде чем ожидать его и вернуться обратно к пользователю.

  if (req.query.name) {
    productQuery = productQuery.find({
      name: { $regex: req.query.name, $options: "i" },
      //$regex для игнорировать регистр запятых, независимо от того, имеет ли пользователь верхний или нижний регистр или значение,
      //$options Итак, мы игнорируем запятую.
    });
  }
  //Filter by brand
  if (req.query.brand) {
    productQuery = productQuery.find({
      brand: { $regex: req.query.brand, $options: "i" },
    });
  }
  //Filter by category
  if (req.query.category) {
    productQuery = productQuery.find({
      category: { $regex: req.query.category, $options: "i" },
    });
  }
  //Filter by color
  if (req.query.color) {
    productQuery = productQuery.find({
      colors: { $regex: req.query.color, $options: "i" },
    });
  }
  //Filter by size
  if (req.query.size) {
    productQuery = productQuery.find({
      sizes: { $regex: req.query.size, $options: "i" },
    });
  }

  //Filter by price range
  if (req.query.price) {
    const priceRange = req.query.price.split("-");
    //gte: greate or equal --- Мы собираемся использовать то, что называется GTE, что означает больше или равно.
    //lte: less than or equal --- что означает меньше или равно.
    //Итак, я собираюсь передать эти две операции в запрос
    productQuery = productQuery.find({
      price: { $gte: priceRange[0], $lte: priceRange[1] },
    });
  }

  //Pagination
  //page - Страница — это то, что видно пользователю.
  const page = req.query.page ? parseInt(req.query.page) : 1; //если пользователь предоставляет страницу, вы можете использовать эту страницу.В противном случае мы будем использовать первую страницу.
  //limit - просто означает, что на одной странице сколько записей данных мы хотим сохранить или отобразить
  const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
  //startIdx
  const startIdx = (page - 1) * limit;
  //endIdx
  const endIdx = page * limit;
  //total - общий продукт или запись.
  const total = await Product.countDocuments();

  productQuery = productQuery.skip(startIdx).limit(limit);

  //pagination results
  const pagination = {};
  if (endIdx < total) {
    pagination.next = { page: page + 1, limit };
  }
  if (startIdx > 0) {
    pagination.prev = { page: page - 1, limit };
  }
  //await the query
  const products = await productQuery.populate("reviews");
  res.json({
    status: "success",
    total,
    results: products.length,
    pagination,
    message: "Products fetched successfully",
    products,
  });
});

//контроллер для получения одного даного продукта
//@desc Get single product
//@route GET/api/v1/products/:id
//@access Public
export const getProductByIdCtr = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("reviews");
  if (!product) {
    throw new Error("Product not found");
  }
  res.json({
    status: "success",
    message: "Product fetched successfully",
    product,
  });
});

//@desc update product
//@route PUT/api/v1/products/:id/update
//@access Private/Admin
export const updateProductCtr = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    sizes,
    colors,
    user,
    price,
    totalQty,
    brand,
  } = req.body;

  //update
  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      name,
      description,
      category,
      sizes,
      colors,
      user,
      price,
      totalQty,
      brand,
    },
    { new: true }
  );

  res.json({
    status: "success",
    message: "Product updated successfully",
    product,
  });
});

//@desc delete product
//@route DELETE/api/v1/products/:id/delete
//@access Private/Admin
export const deleteProductCtr = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  res.json({
    status: "success",
    message: "Product deleted successfully",
  });
});
