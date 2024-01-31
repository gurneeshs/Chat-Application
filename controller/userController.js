// external input
const bcrypt = require("bcrypt");
const path = require("path");

// internal path
const User = require("../models/People");
const { unlink } = require("fs");

// get User  from database
async function getUser(req,res,next){

    try{
        const users = await User.find();
        res.render("users",{
            users:users,
        })
    }
    catch(err){
        next(err);
    }
}

// add user to database
async function addUser(req,res,next){
    let newUser;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    if(req.files && req.files.length > 0){
        // with image
        newUser = new User({
            ...req.body,
            avatar:req.files[0].filename,
            password:hashedPassword
        });
    }
    else{
        //without image
        newUser = new User({
            ...req.body,
            password:hashedPassword,
        })
    }

    // Save Data
    try{
        const result = await newUser.save();
        res.status(200).json({
            message:"User added successfully",
        })
    }
    catch(err){
        res.status(500).json({
            errors:{
                common:{
                    message:"Unknown Error Occured",
                }
            }
        })
    }
}

// remove user
async function removeUser(req,res,next){
    try{
        const user = await User.findByIdAndDelete({
            _id:req.params.id,
        })

        // remove user avatar
        if(user.avatar){
            unlink(
                path.join(__dirname, `/../public/uploads/avatars/${user.avatar}`),
                (err) =>{
                    if(err) console.log(err);
                }
            )
        }

        res.status(200).json({
            message:"User removed successfully",
        });
    }
    catch(err){
        res.status(500).json({
            errors:{
                common:{
                    msg:"Could not delete the user"
                }
            }
        })
    }
}
module.exports = {
    getUser,
    addUser,
    removeUser
}