const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
      next();
    } else {
      //req.session.error = "You have to Login first";
      return res.redirect("/signIn");
    }
  };
  
  module.exports = {isAuth};
  