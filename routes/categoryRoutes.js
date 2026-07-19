const express = require("express");

const router = express.Router();

const {
createCategory,
getCategories,
getCategoryBySlug,
updateCategory,
deleteCategory
}=require("../controllers/categoryController");


const upload = require("../middleware/upload");



router.post(
"/",
upload.single("image"),
createCategory
);


router.get(
"/",
getCategories
);


router.get(
"/:slug",
getCategoryBySlug
);


router.put(
"/:id",
upload.single("image"),
updateCategory
);


router.delete(
"/:id",
deleteCategory
);



module.exports = router;