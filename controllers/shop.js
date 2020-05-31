const Product = require('../models').Product;
const shopRoutes = require('../routes/shop');
const path = require('path');
const isAuthenticated = require('../utility/isAuthenticated');
const { validationResult } = require('express-validator');
var fs = require('fs')
  , gm = require('gm').subClass({imageMagick: true});
const { Op } = require('sequelize');
const stripe = require('stripe')(process.env.STRIPE_SK)
const models = require( '../models/index');

exports.getSearch = (req, res, next) => {
  if(req.query.searchValue) {
    const regex = new RegExp(escapeRegex(req.query.searchValue), 'gi');
    const searchValue = req.query.searchValue
    Product.findAll({ where: { title: { [Op.regexp]: searchValue}}})
    .then(product => {
      if(!product) {
        res.redirect('/shop')
      }
      const id = product.id
      res.render(`index`, {
        products: product,
        messages: [],
        success_messages: []
      })
    })
    .catch(err => {
      console.log(err)
    })
  }
};

exports.getIndex  = (req, res, next) => {
  Product.findAll()
  .then(products => {
    res.render('index', {
      pageTitle: 'Home',
      products: products,
      messages: req.flash('success_messages'),
      success_messages: req.flash('success'),
      path: '/',
      isAuthenticated: req.session.isLoggedIn
    });  
  })
  .catch(err => {
    console.log(err)
  })
};

exports.getAddProduct = (req, res, next) => {
  res.render('add-product', {
    pageTitle: 'Add Product',
    messages: req.flash('success_messages'),
    path: '/shop/add-product',
    isAuthenticated: req.session.isLoggedIn,
  })
}

exports.postProduct = (req, res, next) => {
  const title = req.body.title;
  const description = req.body.description;
  let image = req.file.filename;
  const fileName = req.file.filename.split('.')[0];
  const fileName2 = req.file.filename.split('.')[1];
  const fullName = fileName + fileName2 + '.jpg';
  const price = req.body.price;


  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array()[0].param)
    return res.status(422).render('add-product', { 
      errors: errors.array()[0].msg,
      path: 'shop/add-product',
      pageTitle: 'Add Product',
      errorsTitle: errors.array()[0].param,
      isAuthenticated: req.session.isLoggedIn,
      title: req.body.title,
      price: req.body.price,
      description: req.body.description
    });
  }

  if(req.file.mimetype === 'image/heic') {
    gm('public/images/' + req.file.filename)
    .write(`public/images/${fullName}`, function(err) {
      if (err) console.log(err)
    });
    image = fullName;
  }

  req.user.createProduct({
    title: title,
    price: price,
    imageUrl: image,
    description: description,
    isAuthenticated: req.session.isLoggedIn
  })
  .then(result => {
    req.flash('success_messages', 'Product created!')
  })
  .then(result => {
    res.redirect('/shop')
  })
  .catch(err => {
    console.log(err)
  })
};

exports.deleteProduct = (req, res, next) => {
  if(isAuthenticated) {
    const id = req.params.id;
    Product.findOne({ where: { id: id }})
    .then(product => {
      if(!product) {
        res.redirect('/')
      }
      product.destroy()
    })
      .then(result => {
        req.flash('success', 'Successfully deleted!')
        res.redirect('/shop/products')
    })
    .catch(err => {
      console.log(err)
    })
  }

};

exports.getProduct = async (req, res, next) => {
  try {
    const id = req.params.id;
    console.log(id)
    const findProduct = await Product.findOne({ where: { id: id }})  
      if(!findProduct) {
        res.redirect('/shop')
      }
      res.render('product-detail', {
        product: findProduct,
        pageTitle: 'Product Detail',
        path: '/shop/products',
        isAuthenticated: req.session.isLoggedIn
      })
  }
  catch {
    console.log(err)
  }
};

exports.getProductList = (req, res, next) => {
  const id = req.user.id;
  Product.findAll({ where: { userId: id}})
  .then(products => {
    res.render('product-list', {
      products: products,
      pageTitle: 'All Products',
      messages: req.flash('success'),
      path: '/shop/products',
      isAuthenticated: req.session.isLoggedIn
    })
  })
  .catch(err => {
    console.log(err)
  })
};
 
exports.postCart = (req, res, next) => {
  let fetchedCart;
  let newQuantity = 1;
  const id = req.body.id;
  req.user.getCart()
  .then(cart => {
    fetchedCart = cart;
   return cart.getProducts({where: { id: id }})
    .then(products => {
      let product;
      if(products.length > 0) {
        product = products[0];
      }
      if(product) {
        let oldQuantity = product.CartItem.qty;
        newQuantity = oldQuantity + 1;
        return product;
      }
      return Product.findByPk(id)
    })
    .then(product => {
      return fetchedCart.addProduct(product, {
        through: { qty: newQuantity}
      })
    })
    .then(() => {
      res.redirect('/shop/add-to-cart')
    })
    .catch(err => {
      console.log(err)
    })
  })
  .catch(err => {
    console.log(err)
  });
};

exports.getCart = (req, res, next) => {
  const id = req.body.id
  req.user.getCart()
  .then(cart => {
    cart.getProducts()
    .then(products => {
      let cartItem;
      if(products[0] === undefined) {
        cartItem = ''
      } else {
        cartItem = products.CartItem 
      }      
      res.render('cart', {
        products: products,
        pageTitle: 'Shopping Cart',
        cartItem: cartItem,
        path: '/shop/add-to-cart',
        isAuthenticated: req.session.isLoggedIn
      })
    })
    .catch(err => {
      console.log(err)
    })
  })
  .catch(err => {
    console.log(err)
  })
};

exports.deleteCart = (req, res, next) => {
  const id = req.params.id
  req.user.getCart()
  .then(cart => {
   return cart.getProducts({ where: { id: id }})
    .then(products => {
      products[0] .CartItem.destroy()
    })
    .then(result => {
      res.redirect('/shop/add-to-cart')
    })
    .catch(err => {
      console.log(err)
    })
  }).catch(err => {
    console.log(err)
  })
}

exports.getEditProduct = (req, res, next) => {
  const id = req.params.id;
  req.user.getProducts({ where: { id: id}})
  
  .then(product => {
    res.render('edit-product', {
      pageTitle: 'Edit Product',
      id: id,
      product: product[0],
      path: '/shop/add-product',
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => {
    console.log(err)
  })
};

exports.postEditProduct = (req, res, next) => {
  const id = req.params.id
  const title = req.body.title;
  const price = req.body.price;
  const imageUrl = path.join('/images/somecutie.jpeg');
  const description = req.body.description;
  const errors = validationResult(req);
  const isAuthenticated = req.session.isLoggedIn

  if (!errors.isEmpty()) {
    return res.status(422).render('add-product', { 
      errors: errors.array()[0].msg,
      path: 'shop/edit-product',
      pageTitle: 'Edit Product',
      isAuthenticated: true
    });
  }

  Product.update({
    title: title,
    price: price,
    imageUrl: imageUrl,
    description: description },
    { where: { id: id }})
  .then(editedProduct => {
    res.redirect('/shop/products')
  })
  .catch(err => {
    console.log(err)
  })
};

exports.getCheckoutSuccess = (req, res, next) => {
  const id = req.body.id;
  req.user.getOrders({ include: ['Products']})
  .then(orders => {
    console.log(orders[0].products[0])
    res.render('orders', {
      pageTitle: 'Orders',
      path: '/shop/orders',
      orders: orders,
      isAuthenticated: req.session.isLoggedIn,
    });
  }).catch(err => {
    console.log(err)
  })
};

exports.getOrder = (req, res, next) => {
  const id = req.body.id;
  req.user.getOrders({ include: ['Products']})
  .then(orders => {
    console.log(orders)
    res.render('orders', {
      pageTitle: 'Orders',
      path: '/shop/orders',
      orders: orders,
      isAuthenticated: req.session.isLoggedIn,
    });
  }).catch(err => {
    console.log(err)
  })
};

exports.getCheckout = (req, res, next) => {
  let product;
  let cartItem;
  let total;
  const id = req.body.id
  req.user.getCart()
  .then(cart => {
    cart.getProducts()
    .then(products => {
      product = products
      total = 0;
      if(products[0] === undefined) {
        cartItem = ''
      } else {
        cartItem = products.CartItem 
      }
      products.forEach(product => {
        total += product.CartItem.qty * product.price;
      })     

      return stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: product.map(prod => {
          return {
            name: prod.dataValues.title,
            amount: prod.dataValues.price * 100,
            description: prod.dataValues.description,
            currency: 'usd',
            quantity: prod.CartItem.qty
          }
        }),
        success_url: req.protocol + '://' + req.get('host') + '/shop/checkout/success',
        cancel_url: req.protocol + '://' + req.get('host') + '/shop/checkout/cancel'
      })
    })
      .then(session => {
        res.render('checkout', {
          products: product,
          pageTitle: 'Checkout',
          cartItem: cartItem,
          path: '/shop/checkout',
          isAuthenticated: req.session.isLoggedIn,
          totalSum: total,
          sessionId: session.id
      })
    })
    .catch(err => {
      console.log(err)
    })
  })
  .catch(err => {
    console.log(err)
  })
};

exports.postOrder = (req, res, next) => {
  let fetchedCart;
  req.user.getCart()
  .then(cart => {
    fetchedCart = cart;
    return cart.getProducts()
    .then(products => {
      return req.user.createOrder()
    .then(order => {
      order.addProducts(products.map(product => {
        product.OrderItem = { qty: product.CartItem.qty}
        return product;
      }))
    })
    .catch(err => {
      console.log(err)
    })
  })
  .then(result => {
    return fetchedCart.setProducts(null);
  })
  .then(result => {
    res.redirect('/shop/orders');
  })
  .catch(err => {
    console.log(err)
  })
})
  .catch(err => {
    console.log(err)
  })
};


function escapeRegex(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};