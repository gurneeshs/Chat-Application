// VALIDATION FOR USER, WHILE CREATING NEW USERS

// external inputs
const {check,validationResult} = require("express-validator");
const createError = require("http-errors");
const path = require("path");
const User = require("../../models/People");
const { unlink } = require("fs");

const addUserValidators = [
    // Name Field Check
    check("name")
    .isLength({min:1})
    .withMessage("Name is required")
    .isAlpha("en-US",{ignore:" -"})
    .withMessage("Name must be only alphabet")
    .trim(),

    // Email Field Check
    check("email")
    .isEmail().withMessage("Invalid Email address")
    .trim()
    .custom(async (value) =>{
        // email already present or not
        try{
            const user = await User.findOne({email:value});
            if(user){
                throw createError("Email already in use");
            }
        }
        catch(err){
            throw createError(err.message);
        }
    }),

    // Mobile Field Check
    check("mobile")
    .isMobilePhone("bn-BD", {
        strictMode:true,//Checking country code
    }).withMessage("Mobile number must be a valid Country mobile number")
    .custom(async (value) =>{
        // email already present or not
        try{
            const user = await User.findOne({mobile:value});
            if(user){
                throw createError("Mobile already in use");
            }
        }
        catch(err){
            throw createError(err.message);
        }
    }),

    // Password Check
    check("password")
    .isStrongPassword().withMessage("Password must be at least 8 characters long, contain at least 1 lowercase, 1 uppercase, 1 number, and 1 symbole"),
]
const addUserValidationHandler = function(req,res,next){
    const errors = validationResult(req);
    const mappedErrors = errors.mapped();

    if(Object.keys(mappedErrors).length===0){
        next();// no issue
    }
    else{
        // remove uploaded files
        if(req.files.length > 0){
            const {filename} = req.files[0];
            unlink(
                path.join(__dirname, `/../public.uploads/avatars/${filename}`),
                (err)=>{
                    if(err) console.log(err);
                }
            )
        }
        res.status(500).json({
            errors:mappedErrors,
        });
    }
}

module.exports = {
    addUserValidators,
    addUserValidationHandler
}
