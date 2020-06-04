const submitButton = document.querySelector('#submit');
const hamburgerIcon = document.querySelector('#hamburger-icon');
const hamburgerIconContent = document.querySelector('#hamburger-icon-content');

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

// hamburgerIcon.addEventListener('click', hamburger)
hamburgerIconContent.addEventListener('click', checkforstuff)


hamburgerIcon.addEventListener('click', function(e) {
  if(hamburgerIconContent.style.opacity === '') {
    hamburgerIconContent.classList.add('transition-in')
    hamburgerIconContent.style.opacity = 1;
    return
  }

  if(hamburgerIconContent.style.opacity === "1") {
    hamburgerIconContent.style.opacity = 0;
    hamburgerIconContent.style.classList.add('transition-out')
    return
  }
  if(hamburgerIconContent.style.opacity === "0") {
    hamburgerIconContent.classList.add('transition-in')
    hamburgerIconContent.style.opacity = 1;
    return
  }
})



function checkforstuff(e) {
  console.log(e.target)
  if(e.target !== hamburgerIconContent) {
    hamburgerIconContent.style.opacity = 0;
    hamburgerIcon.style.classList.add('transition-out');
  }
}
