const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const createError = require("http-errors");

// internal imports
const User = require("../models/People");

// Get login page
function getLogin(req,res,next){
    res.render("index")
}

// User login
async function login(req,res,next){
    try{
        // find user
        const user = await User.findOne({
            $or:[{email:req.body.username}, {mobile:req.body.username}],//either email or mobile
        })
        if(user && user._id){
            const isValidPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );
            if(isValidPassword){
                const userObject = {
                    username:user.name,
                    mobile:user.mobile,
                    email:user.email,
                    role:"user",
                };
                // Generate Token
                const token = jwt.sign(userObject,process.env.JWT_SECRET, {
                    expiresIn:process.env.JWT_EXPIRY,
                });

                // Set Cookie
                res.cookie(process.env.COOKIE_NAME, token, {
                    maxAge : process.env.JWT_EXPIRY,
                    httpOnly : true,
                    signed:true,
                })

                res.locals.loggedInUser = userObject;
                res.render("inbox");
            }
            else{
                throw createError("Login Failed")
            }
        }
        else{
            throw createError("Login Failed");
        }

    }
    catch(e){
        res.render("index",{
            data:{
                username:req.body.username,
            },
            errors:{
                common:{
                    msg:e.message,
                }
            }
        })
    }   
}

function logout(req,res){
    res.clearCookie(process.env.COOKIE_NAME);
    res.send("Logged Out User");
}
module.exports = {
    getLogin,
    login,
    logout,
}