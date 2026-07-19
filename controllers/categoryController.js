const Category = require("../models/Category");


// CREATE CATEGORY
exports.createCategory = async (req,res)=>{

    try{

        const {
            name,
            slug,
            description
        } = req.body;


        const image = req.file 
            ? req.file.filename 
            : "";


        const category = await Category.create({

            name,
            slug,
            description,
            image

        });


        res.status(201).json({

            success:true,
            message:"Catégorie créée",
            category

        });


    }catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};



// GET ALL CATEGORIES

exports.getCategories = async(req,res)=>{

    try{


        const categories = await Category.find();


        res.json({

            success:true,
            categories

        });



    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};




// GET CATEGORY BY SLUG

exports.getCategoryBySlug = async(req,res)=>{

    try{


        const category = await Category.findOne({

            slug:req.params.slug

        });


        if(!category){

            return res.status(404).json({

                message:"Catégorie introuvable"

            });

        }


        res.json({

            success:true,
            category

        });



    }catch(error){

        res.status(500).json({

            message:error.message

        });

    }

};





// UPDATE CATEGORY

exports.updateCategory = async(req,res)=>{

try{


const category = await Category.findById(req.params.id);


if(!category){

return res.status(404).json({

message:"Catégorie introuvable"

});

}



category.name = req.body.name;
category.slug = req.body.slug;
category.description = req.body.description;


if(req.file){

category.image = req.file.filename;

}



await category.save();



res.json({

success:true,
category

});



}catch(error){

res.status(500).json({

message:error.message

});

}

};





// DELETE CATEGORY

exports.deleteCategory = async(req,res)=>{


try{


await Category.findByIdAndDelete(req.params.id);


res.json({

success:true,
message:"Catégorie supprimée"

});


}catch(error){

res.status(500).json({

message:error.message

});

}


};