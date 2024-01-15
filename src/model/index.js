const dbConfig = require("../db");

const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  {
    host: dbConfig.host,
    port: dbConfig.port,
    dialect: dbConfig.dialect,
    operatorsAliases: false,
    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  },
);

sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to Database");
  })
  .catch((err) => {
    console.log("error connecting to database", err);
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model")(sequelize, DataTypes);
db.product = require("./product.model")(sequelize, DataTypes);

db.brand = require("./brand.model")(sequelize, DataTypes);
db.address = require("./address.model")(sequelize, DataTypes);
db.category = require("./caregory.model")(sequelize, DataTypes);
db.cart = require("./cart.model")(sequelize, DataTypes);
db.order = require("./order.model")(sequelize, DataTypes);
db.inventory = require("./inventory.model")(sequelize, DataTypes);
db.token = require("./token.model")(sequelize, DataTypes);
db.transaction = require("./transaction.model")(sequelize, DataTypes);

// db.sequelize.sync({ alter: true, force: true }).then(() => {
//     console.log("Re-sync done");
// });

module.exports = db;
