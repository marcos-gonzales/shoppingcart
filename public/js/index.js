const submitButton = document.querySelector('#submit');
if(submitButton) {
  submitButton.addEventListener('click', confirmation)
}

function confirmation(e) {
  const result = confirm('Are you sure you want to delete this post?')
  if(result == true) {
    return true
  } 
   e.preventDefault()
   return false;
};



