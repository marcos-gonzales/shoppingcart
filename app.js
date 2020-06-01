const express = require('express');
const app = express();
const PORT = process.env.PORT || 5000;
const bodyParser = require('body-parser');

const session = require('express-session');
const flash = require('connect-flash');
const sequelize = require('./db/db');
const path = require('path');
const cookieParser = require('cookie-parser');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const multer = require('multer');
const compression = require('compression');

const myStore = new SequelizeStore({
  db: sequelize
});

const Product = require('./models').Product;
const User = require('./models').User;
const Cart = require('./models').Cart;
const CartItem = require('./models').CartItem;
const Order = require('./models').Order;
const OrderItem = require('./models').OrderItem;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images')
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname)
  }
});

const fileSystem = (req, file, cb) => {
  if (file.mimetype === 'image/jpg' || 
    file.mimetype === 'image/jpeg' || 
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/heic') 
  {    
    cb(null, true)
  } else {
    cb(null, false)
  }
};

app.set('view engine', 'pug');
app.use(multer({dest: 'images', storage: fileStorage, fileSystem: fileSystem}).single('image'))
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'images')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('secret'));
app.use(session({resave: false, saveUninitialized: false, secret: 'Eliisthecutest', store: myStore}));
app.use(flash());

const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(compression());
app.use((req, res, next) => {
  if(!req.session.user) {
    return next()
  }
  User.findByPk(req.session.user.id)
  .then(user => {
    req.user = user;
    next()
  })
});

app.use('/shop', shopRoutes);
app.use(authRoutes);

myStore.sync()
.then(sync => {
  app.listen(PORT, () => console.log(`connected on ${PORT}`))
})
.catch(err => {
  console.log(err)
}); 

// sequelize.sync({ force: true})
// .then(sync => {
//   app.listen(port, console.log(`connected on port ${port}`))
// }).catch(err => {
//   console.log(err)
// })

// Product.belongsTo(User);
// User.hasMany(Product);
// User.hasOne(Cart);
// Cart.belongsTo(User);
// Cart.belongsToMany(Product, { through: CartItem});
// Order.belongsTo(User);
// Order.belongsToMany(Product, { through: OrderItem});
// User.hasMany(Order);
