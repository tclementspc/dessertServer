const mongoose = require("mongoose");
const Schema = mongoose.Schema;

require("mongoose-currency").loadType(mongoose);
const Currency = mongoose.Types.Currency;

//* when I integrate the shopping cart into app

let itemSchema = new Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Quantity can not be less then 1."],
    },
    cost: {
      type: Currency,
      required: true,
    },
    total: {
      type: Currency,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("Item", itemSchema);

const cartSchema = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    items: [itemSchema],

    subtotal: {
      type: Number,
      required: true,
      default: 0,
    },
    modifiedOn: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Cart", cartSchema);
