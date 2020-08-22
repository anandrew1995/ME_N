import User from '../models/user';
import express from 'express';
import axios from 'axios';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from '../config';
import tokenAuth from '../middleware/tokenAuth';

const router = express.Router();
const saltRounds = 10;

router.get('/', tokenAuth, (req, res) => {
    // axios.get('https://randomapi.com/api/6de6abfedb24f889e0b5f675edc50deb?fmt=raw&sole')
    // .then(users => {
    //     res.status(200).json(users.data);
    // })
    // .catch(error => {
    //     res.send(error);
    // });
	User.find((err, users) => {
        if (err) throw err;
        else res.status(200).json(users);
    })
});

router.post('/', (req, res) => {
    const user = new User(req.body);
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
        user.password = hash;
        user.save((err, user) => {
            if (err) throw err;
            else res.status(201).json({ success: true, message: 'User Created.' });
        });
    });
});

router.patch('/', tokenAuth, (req, res) => {
    const user = req.body;
    bcrypt.hash(user.password, saltRounds, (err, hash) => {
        user.password = hash;
        User.update({ _id: req.tokenData._id }, { $set: user }, (err, user) => {
            if (err) throw err;
            else res.status(200).json({ success: true, message: 'User edited.' });
        });
    });
});

router.delete('/', tokenAuth, (req, res) => {
    User.findById(req.tokenData._id, (err, user) => {
        if (err) throw err;
        if (!user) {
            res.status(400).json({ success: false, message: 'User does not exist.' });
        }
        else {
            user.remove((err) => {
                if (err) throw err;
                res.status(200).json({ success: true, message: 'User deleted.' });
            });
        }
    });
});

router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (err) throw err;
        if (!user) {
            res.status(401).json({ success: false, message: 'Authentication failed. User not found.' });
        }
        else {
            bcrypt.compare(req.body.password, user.password, (err, match) => {
                if (match === false) {
                    res.status(401).json({ success: false, message: 'Authentication failed. Incorrect password.' });
                }
                else {
                    const token = jwt.sign({
                        _id: user._id,
                        email: user.email
                    }, config.secret, {
                        expiresIn: 3600
                    });

                    res.status(200).json({
                        success: true,
                        message: 'Token issued.',
                        token: token
                    });
                }
            });
        }
    })
});

router.get('/email/:email', (req, res) => {
	User.find({ email: req.params.email }, (err, users) => {
        if (err) throw err;
        else res.status(200).json(users);
    });
});

export default router;
