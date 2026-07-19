const productSchema = new mongoose.Schema({
    
    name: String,

    description: String,

    price: Number,

    stock: {
        type: Number,
        default: 0
    },

    sku: String,

    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },

    images: [String]

});