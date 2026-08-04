const Product = require("../models/Product");
const Category = require("../models/Category");

// =======================
// CREATE PRODUCT
// =======================
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      stock,
      sku,
      location,
      brand,
      category,
      compatibleVehicles,
    } = req.body;
const images = req.files ? req.files.map(file => file.filename) : [];
    const exists = await Product.findOne({ sku });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "SKU déjà utilisé",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      sku,
      location,
      brand,
      category,
      compatibleVehicles:
JSON.parse(compatibleVehicles || "[]"),

      seller: req.user._id, // vient du middleware JWT
       images
    });

    res.status(201).json({
      success: true,
      message: "Produit créé",
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// GET ALL PRODUCTS
// =======================
const getProducts = async (req, res) => {
  try {
    const search = req.query.search || "";
    const categorySlug = req.query.category || "";
    const vehicleId = req.query.vehicle || "";
    // Filtre par véhicule
     let filter = {};
if (vehicleId) {
  filter.compatibleVehicles = vehicleId;
}

       // Recherche globale
    if (search) {
      const category = await Category.findOne({
        slug: search.toLowerCase()
      });

      filter.$or = [
        {
          name: {
            $regex: search,
            $options: "i",
          },
        },
        {
          sku: {
            $regex: search,
            $options: "i",
          },
        },
        {
          brand: {
            $regex: search,
            $options: "i",
          },
        },
      ];

      // Recherche par catégorie
      if (category) {
        filter.$or.push({
          category: category._id,
        });
      }
    }

    // Filtre par catégorie depuis l'URL
    if (categorySlug) {
      const category = await Category.findOne({
        slug: categorySlug,
      });

      if (!category) {
        return res.json({
          success: true,
          products: [],
          count: 0,
        });
      }

      filter.category = category._id;
    }

    const products = await Product.find(filter)
      .populate("category")
      .populate("seller", "firstName lastName email")
      .populate("compatibleVehicles");

    res.status(200).json({
      success: true,
      products,
      count: products.length,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


module.exports = {
  getProducts
};
// =======================
// GET ONE PRODUCT
// =======================
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("seller", "firstName lastName email")
      .populate("compatibleVehicles")

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit introuvable",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// =======================
// UPDATE PRODUCT
// =======================
const updateProduct = async (req,res)=>{

try{

const product = await Product.findById(req.params.id);


if(!product){

return res.status(404).json({
message:"Produit introuvable"
});

}


product.name = req.body.name;
product.price = req.body.price;
product.stock = req.body.stock;
product.location = req.body.location;
product.description = req.body.description;


// nouvelles images
if(req.files && req.files.length > 0){

product.images = req.files.map(file=>file.filename);

}


await product.save();


res.json(product);


}catch(err){

res.status(500).json({
message:err.message
});

}

};

// =======================
// DELETE PRODUCT
// =======================
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Produit introuvable",
      });
    }

    await product.deleteOne();

    res.status(200).json({
      success: true,
      message: "Produit supprimé",
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
};