const express = require("express");
const Cart = require("../models/cart");

const cartRouter = express.Router();
//* adding items to cart
router.post("/cart", async (req, res) => {
  const { productId, quantity, name, price } = req.body;
 
  const { userId } = req.body;


  let cart = await Cart.findOne({ userId: userId });
  const product = await Product.findById(product + curr);
 

if (cart) {
  //cart exists for user
  let itemIndex = cart.products.findIndex(p => p.productId == productId);

  if (itemIndex > -1) {
    //product exists in the cart, update the quantity
    let productItem = cart.products[itemIndex];
    productItem.quantity = quantity;
    cart.products[itemIndex] = productItem;


} else {
  //product does not exists in cart, add new item
  cart.products.push({ productId, quantity, name, price });
}
cart = await cart.save();
return res.status(201).send(cart);

} else {
  const newCart = await Cart.create({
   userId,
   products: [{ productId, quantity, name, price }] 
  });  
  
  res.status(201).send(newCart);

let data = await Cart.save();
res.status(200).json({
    type: "success",
    mgs: "Process Successful",
    data: data
})
//------------ if there is no user with a cart...it creates a new cart and then adds the item to the cart that has been created------------
} else {
  return error.status(400).send({
  type: "Invalid",
  message: "Something went wrong!",
  }
  )
  .catch((err) => next(err))
});


module.exports = cartRouter;
