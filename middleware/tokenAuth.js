import jwt from 'jsonwebtoken';
import config from '../config';

export default (req, res, next) => {
    //send in as Bearer <TOKEN>
    const token = req.headers.authorization.split(" ")[1];
    if (token) {
        jwt.verify(token, config.secret, (err, tokenData) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                req.tokenData = tokenData;
                next();
            }
        });
    }
    else {
        return res.status(401).send({
            success: false,
            message: 'No token provided.'
        });
    }
};
