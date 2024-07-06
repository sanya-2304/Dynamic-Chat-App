const express = require('express');
const user_route = express.Router();
const path = require('path');
const multer = require('multer');
const bodyParser = require('body-parser');
const session = require('express-session');
require('dotenv').config();
const auth=require('../middlewares/auth')
const { SESSION_SECRET } = process.env;

user_route.use(session({ secret: SESSION_SECRET, resave: false, saveUninitialized: true }));
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '../public/images'));
    },
    filename: function (req, file, cb) {
        const name = Date.now() + '-' + file.originalname;
        cb(null, name);
    }
});

const upload = multer({ storage: storage });
const userController = require('../controllers/userController');

user_route.get('/register',auth.isLogout, userController.registerLoad);
user_route.post('/register', upload.single('image'), userController.register);

// Use '/' for both GET and POST for login
user_route.get('/',auth.isLogout, userController.loadLogin);
user_route.post('/', userController.login);

user_route.get('/logout', auth.isLogin  ,userController.logout);
user_route.get('/dashboard',auth.isLogin, userController.loadDashboard);
user_route.post('/save-chat', userController.saveChat)

user_route.post('/delete-chat', userController.deleteChat)

user_route.get('*', (req, res) => res.redirect('/'));

module.exports = user_route;
