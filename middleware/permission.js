export default permit(...allowed) => {
    return (req, res, next) => {
        if (req.user && allowed.indexOf(req.user.role) > -1) {
            next();
        }
        else {
            response.status(403).json({ success: false, message: "Forbidden" });
        }
    }
}

//https://gist.github.com/joshnuss/37ebaf958fe65a18d4ff
