const db = require("../model");
const User = db.user;
const Product = db.product;
const Brand = db.brand;
const Category = db.category;
const Wallet = db.wallet;
const Balance = db.balance;
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const hash = bcrypt.hashSync("Password$1", salt);
exports.seed = async () => {
  const user = await User.create({
    first_name: "seller",
    last_name: "seller",
    email: "seller@seller.com",
    password: hash,
    role: "seller",
    isVerified: true,
  });
  const wallet = await Wallet.create({
    userId: user.id,
  });

  const balance = await Balance.create({
    walletId: wallet.id,
    userId: user.id,
    balance: 0,
  });

  wallet.accountBalance = balance.id;
  await wallet.save();
  user.id_number = "testtte";
  user.walletId = wallet.id;
  await user.save();
  await User.create({
    first_name: "admin",
    last_name: "admin",
    email: "admin@admin.com",
    password: hash,
    role: "admin",
    isVerified: true,
  });
  await User.create({
    first_name: "leke",
    last_name: "leke",
    email: "lekejosh6wf@gmail.com",
    password: hash,
    role: "buyer",
    isVerified: true,
  });

  const brand = await Brand.create({
    name: "Addidas",
    description: "Mostly shoes",
  });
  const category = await Category.create({
    name: "shoe",
    description: "Mostly shoes",
  });
  await Product.create({
    name: "food",
    price: 1000,
    main_image: "https://google.com",
    sub_images: [
      "https://google.com",
      "https://google.com",
      "https://google.com",
      "https://google.com",
      "https://google.com",
    ],
    description: "Seeder Product",
    product_details: "Seeded Product",
    specifications: "Seeded",
    userId: user.id,
    brandId: brand.id,
    categoryId: category.id,
  });
};
