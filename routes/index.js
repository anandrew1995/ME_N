import express from 'express';

const router = express.Router();

//Get All Users
router.get('/', (req, res) => {
	res.render('index.html');
});

export default router;
