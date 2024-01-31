const createError = require("http-errors");

// 404 not found
function notFoundHandler(req,res,next){
    next(createError(404, "Your Requested content was not found"));
}

// default error handler
function errorHandler(err,req,res,next){
    // res.render('error', {
    //     title:"Error Page"
    // })

    res.locals.error = process.env.NODE_ENV === "development" ? err : {message:err.message};
    res.status(err.status || 500);

    if(res.locals.html){
        // html response
        res.render("error", {
            title:"html error page",
        })
    }
    else{
        // json response
        res.json(res.locals.error);
    }

}

module.exports = {
    notFoundHandler,
    errorHandler
}