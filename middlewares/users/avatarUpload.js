const uploader = require("../../utilities/singleUploader");
function avatarUpload(req,res,next){
    const upload = uploader(
        // Parameters
        "avatars", 
        ["image/jpeg","image/jpg","image/png"], 
        10000000,
        "Only .jpg, jpeg, png format allowed"
    );

    upload.any()(req,res,(err)=>{
        if(err){
            res.status(500).json({
                error:{
                    avatar:{
                        msg:err.message,
                    }
                }
            })
        }
        else{
            next();
        }
    });
}

module.exports = avatarUpload;