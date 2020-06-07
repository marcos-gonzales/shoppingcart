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
  console.log(hamburgerIconContent.classList[0])
  if(hamburgerIconContent.classList[0] === "hamburger-icon-content") {
    hamburgerIconContent.classList.remove('hamburger-icon-content')
    hamburgerIconContent.classList.add('hamburger-icon-contents')
    return
  }

  if(hamburgerIconContent.classList[0] === "hamburger-icon-contents") {
    hamburgerIconContent.classList.remove('hamburger-icon-contents')
    hamburgerIconContent.classList.add('hamburger-icon-content-out')

    return
  }
  if(hamburgerIconContent.classList[0] === 'hamburger-icon-content-out') {
    hamburgerIconContent.classList.remove('hamburger-icon-content-out')
    hamburgerIconContent.classList.add('hamburger-icon-contents')
    return
  }
})



function checkforstuff(e) {
  if(e.target !== hamburgerIconContent) {
    hamburgerIconContent.classList.remove('hamburger-icon-contents')
    hamburgerIconContent.classList.add('hamburger-icon-content-out')
  }
}
