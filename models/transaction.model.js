/**
 * Transaction model
 */

 const { DataTypes } = require("sequelize");
 const DB = require("../database");
 
 /**
  * @typedef Token
  */
 const Transaction = DB.define(
   "transactions",
   {
     id: {
       autoIncrement: true,
       type: DataTypes.INTEGER,
       allowNull: false,
       primaryKey: true,
     },
     desc: {
       type: DataTypes.STRING,
       allowNull: false,
     },
     type: {
       type: DataTypes.ENUM(['goal','liquidation']),
       allowNull: false,
     },
     status: {
       type: DataTypes.ENUM(["error", "success"]),
       allowNull: false,
     },
     amount: {
       type: DataTypes.INTEGER,
       allowNull: false,
     },
     goal: {
      type: DataTypes.INTEGER,
      allowNull: false
     }
   },
   {
     DB,
     tableName: "transactions",
     timestamps: true,
     indexes: [
       {
         name: "PRIMARY",
         unique: true,
         using: "BTREE",
         fields: [{ name: "id" }],
       },
     ],
   }
 );
 
 // WARNING: Passing true to force will drop the existing table from db
 Transaction.sync({ force: false })
   .then(() => {})
   .catch((err) => console.error(`Transaction model error: ${err}`));
 
 module.exports = Transaction;
 