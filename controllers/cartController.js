const Product = require("../models/Product");
const Cart = require("../models/Cart");

// =======================
// GET CART
// =======================
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate("products.product");

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        products: [],
      });
    }
     // ✅ ICI TU NETTOIES LE PANIER
    cart.products = cart.products.filter(
      item => item.product !== null
    );

    await cart.save();

    res.status(200).json({
      success: true,
      cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// ADD TO CART
// =======================
const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
/*stock*/
const product = await Product.findById(productId);

if (!product) {
    return res.status(404).json({
        success: false,
        message: "Produit introuvable"
    });
}
if (product.stock === 0) {
    return res.status(400).json({
        success: false,
        message: "Produit en rupture de stock",
    });
}

if (Number(quantity) > product.stock) {
    return res.status(400).json({
        success: false,
        message: `Seulement ${product.stock} produit(s) disponible(s)`,
    });
}

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        products: [],
      });
    }

    const index = cart.products.findIndex(
      p => p.product.toString() === productId
    );

  if (index > -1) {

    const newQuantity = cart.products[index].quantity + Number(quantity);

    if (newQuantity > product.stock) {
        return res.status(400).json({
            success: false,
            message: `Seulement ${product.stock} produit(s) disponible(s)`,
        });
    }

    cart.products[index].quantity = newQuantity;

} else {

    cart.products.push({
        product: productId,
        quantity: Number(quantity),
    });

}

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate("products.product");

    res.status(200).json({
      success: true,
      message: "Produit ajouté au panier",
      cart: updatedCart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// REMOVE FROM CART
// =======================
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Panier introuvable",
      });
    }

    cart.products = cart.products.filter(
      item => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate("products.product");

    res.status(200).json({
      success: true,
      message: "Produit supprimé du panier",
      cart: updatedCart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// UPDATE CART (quantity)
// =======================
const updateCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
const product = await Product.findById(productId);

if (!product) {
    return res.status(404).json({
        success: false,
        message: "Produit introuvable"
    });
}

if (Number(quantity) > product.stock) {
    return res.status(400).json({
        success: false,
        message: `Seulement ${product.stock} produit(s) disponible(s)`
    });
}
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Panier introuvable",
      });
    }

    const item = cart.products.find(
      p => p.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Produit non trouvé dans le panier",
      });
    }

    if (Number(quantity) <= 0) {
      cart.products = cart.products.filter(
        p => p.product.toString() !== productId
      );
    } else {
      item.quantity = Number(quantity);
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id)
      .populate("products.product");

    res.status(200).json({
      success: true,
      message: "Panier mis à jour",
      cart: updatedCart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// CLEAR CART
// =======================
const clearCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Panier introuvable",
      });
    }

    cart.products = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Panier vidé",
      cart,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// GET TOTAL
// =======================
const getCartTotal = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id })
      .populate("products.product");

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Panier introuvable",
      });
    }

    let total = 0;

    cart.products.forEach(item => {
      total += item.product.price * item.quantity;
    });

    res.status(200).json({
      success: true,
      total,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  updateCart,
  clearCart,
  getCartTotal,
};