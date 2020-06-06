const bcrypt = require('bcrypt');
const User = require('../models').User;
const authRoutes = require('../routes/auth');
const saltRounds = 10;
const sgMail = require('@sendgrid/mail');
const key = process.env.SEND_GRID_KEY;
const isAuthenticated = require('../utility/isAuthenticated');
const { validationResult } = require('express-validator');
const crypto = require('crypto');
const { Op } = require('sequelize');


exports.getSignup = (req, res, next) => {
  res.render('auth/signup', {
    pageTitle: 'Sign Up',
    path: '/signup',
    isAuthenticated: req.session.isLoggedIn,
    errors: req.flash('errors'),
    errorMessages: req.flash('error'),
    errorpassword: req.flash('errorpassword')
  });
};

exports.postSignup = (req, res, next) => {
  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log(errors.array())
    return res.status(422).render('auth/signup', { 
      errors: errors.array()[0].msg,
      pageTitle: 'Signup',
      path: '/signup',
      errorMessages: req.flash('error', 'Something went wrong!')
    });
  }
  
  User.findOne({ where: { email: email}})
  .then(user => {
    if(user) {
      req.flash('errors', 'oops someone with that email address already exists')
      res.redirect('/signup')
    } else {
     if(password === confirmPassword) {
       bcrypt.hash(password, saltRounds)
       .then(hash => {
        if(!password) {
          res.redirect('/signup')
        }
         user = new User({
          name: name,
          email: email,
          password: hash,
          resetToken: null,
          resetTokenAuthentication: null
        })
        return user.save()
      })
      .then(user => {
      return user.createCart()
      })
      .then(user => {
        sgMail.setApiKey(key)
        const msg = {
          to: email,
          from: 'markymarrk@gmail.com',
          subject: 'Thanks for signing up!',
          text: 'Welcome to ShopsRus',
          html: `<h1>Hello, <strong>${name}</strong></h1> 
          <p>Thank you for signing up ${name}. Don't forget to check out and follow me on twitter <a href="https://twitter.com/marrky_marrk">markymarrk</p>`
        };
        sgMail.send(msg)
        .then(() => {}, error => {
          console.error(error);
     
          if (error.response) {
            console.error(error.response.body)
         }
        })
      })
      .then(() => {
        req.flash('success', 'You have successfully created an account.')
        res.redirect('/login')
      })
      .catch(err => {
        console.log(err)
      });
    } else {
      req.flash('errorpassword', 'passwords dont match!')
      res.redirect('/signup')
    } 
  } 

  })
  .catch(err => {
    console.log(err)
  })

};

exports.getLogin = (req, res, next) => {
  res.render('auth/login', {
    path: '/login',
    pageTitle: 'Login',
    errorMessages: req.flash('error'),
    successMessages: req.flash('success'),
    isAuthenticated: req.session.isLoggedIn
  })
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ where: { email: email }})
  .then(user => {
    if(!user) {
      req.flash('error', 'Oops password or email is not valid')
      res.redirect('/login')
    }
   return bcrypt.compare(password, user.password)
    .then(match => {
      if(!match) {
        req.flash('error', 'Oops password or email is not valid')
        res.redirect('/login')
      }
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save()
    })
  })
  .then(() => {
    req.flash('success', 'You have logged in!')
  })
  .then(() => {
    res.redirect('/shop')
    })
    .catch(err => {
      console.log(err)
    })
  .catch(err => {
    console.log(err)
  })
}

exports.postLogout = (req, res, next) => {
  req.session.isLoggedIn = false;
  req.session.destroy(function(err) {
    if(err) {
      console.log(err)
    }
  })
  res.redirect('/login');
};

exports.getResetPassword = (req, res, next) => {
  res.render('auth/reset-password', {
    pageTitle: 'Reset Password',
    path: 'reset-password',
    success: req.flash('success'),
    error: req.flash('error')
  })
};

exports.postResetPassword = (req, res, next) => {
  const email = req.body.email
  const buffer = crypto.randomBytes(48).toString('hex');
  const date = Date.now() + 320000;
  User.findOne({where: { email: email }})
  .then(user => {
    if(!user) {
      res.redirect('/login')
    }
    user.resetToken = buffer;
    user.resetTokenExpiration = date;
      user.save()
      return user
  })
  .then(user => {
    sgMail.setApiKey(key)
    const msg = {
      to: email,
      from: 'markymarrk@gmail.com',
      subject: 'Forgot Password :( ???',
      text: 'No problem just follow the instructions below',
      html: `<h1>Hello, <strong>${email}</strong></h1> 
      <p> Hello. Click here to reset your password. </p>
      <a href="http://shopsrus.herokuapp.com/reset-password/${buffer}">Reset Password</a>`
    }
    sgMail.send(msg)
    .then(() => {}, error => {
      console.error(error);

      if (error.response) {
        console.error(error.response.body)
      }
    })
  })
      
  .then(() => {
    res.redirect('/login')
  })
  .catch(err => {
    console.log(err)
  })
};

exports.getResetPasswordWithToken = (req, res, next) => {
  const token = req.params.resetPasswordToken;
  User.findOne({where: { resetToken: token, resetTokenExpiration: { [Op.gte]:  Date.now() }}})
  .then(user => {
    res.render('auth/reset-password-token', {
      pageTitle: 'ResetPassword',
      token: token
    })
  });
};

exports.postResetPasswordWithToken = (req, res, next) => {
  const password = req.body.password;
  const confirmpassword = req.body.confirm-password;
  const token = req.params.resetPasswordToken;
  User.findOne({where: { resetToken: token, resetTokenExpiration: { [Op.gte]: Date.now()}}})
  .then(user => {
    if(!user) {
      req.flash('error', 'oops something went wrong')
      res.redirect('/login')
    }
    return bcrypt.hash(password, saltRounds)
    .then(hash => {
      user.update({
        password: hash,
        resetToken: null,
        resetTokenExpiration: null
      })
    })
    .then(user => {
      req.flash('success', 'you have successfully changed your password.')
      res.redirect('/login')
    })
    .catch(err => {
      console.log(err)
    })
  })
  .catch(err => {
    console.log(err)
  })
  
};