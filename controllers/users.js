const User = require("../models/user");

module.exports.renderRegisterForm = (req, res) => {
    res.render("users/register");
}

module.exports.registerUser = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        const user = new User({ username, email });
        const registeredUser = await User.register(user, password);

        req.login(registeredUser, err => {
            if (err) next(err);
            req.flash("success", "Welcome to YelpCamp!")
            res.redirect("/campgrounds")
        });
    }
    catch (e) {
        req.flash("error", e.message);
        res.redirect("register")
    }

}

module.exports.renderLoginForm = (req, res) => {
    res.render("users/login");
}

module.exports.loginUser = (req, res) => {
    req.flash('success', "Welcome Back!");
    const returnSession = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo
    res.redirect(returnSession)
}

module.exports.logoutUser = (req, res) => {
    req.logout();
    req.flash('success', "Successfully logged out!")
    res.redirect("/campgrounds")
}