console.log('hello')
const stripe = Stripe('pk_test_5bMMJoXwkUHUXkxN8IbVCbtL00BxYtU3IW');
const orderBtn = document.querySelector('#orderNow');

stripe.redirectToCheckout({
  // Make the id field from the Checkout Session creation API response
  // available to this file, so you can provide it as parameter here
  // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
  sessionId: orderBtn
}).then(function (result) {
  console.log(result)
  // If `redirectToCheckout` fails due to a browser or network
  // error, display the localized error message to your customer
  // using `result.error.message`.
});