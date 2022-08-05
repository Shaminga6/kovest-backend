/**
 * Transaction model
 */

 const { DataTypes } = require("sequelize");
 const DB = require("../database");
 
 /**
   * @typedef Token
   */
 const Notification = DB.define(
   "notification",
   {
     id: {
       autoIncrement: true,
       type: DataTypes.INTEGER,
       allowNull: false,
       primaryKey: true,
     },
     user_id: {
       type: DataTypes.STRING,
       allowNull: false,
     },
     goal_id: {
      type: DataTypes.STRING,
      allowNull: false,
    },
     message: {
       type: DataTypes.TEXT,
       allowNull: false,
     },
     amount: {
       type: DataTypes.INTEGER,
       allowNull: false,
     },
     goal: {
       type: DataTypes.STRING,
       allowNull: false
     }
   },
   {
     DB,
     tableName: "notification",
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
 Notification.sync({ force: false })
   .then(() => {})
   .catch((err) => console.error(`Notification model error: ${err}`));
 
 module.exports = Notification;
 