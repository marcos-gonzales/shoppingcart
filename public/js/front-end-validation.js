const error = document.querySelector('.errorMessage');
const title = document.querySelector('#title');
const description = document.querySelector('#description');

title.addEventListener('focusout', validateFormTitle);
description.addEventListener('focusout', validateFormDescription);

function validateFormTitle() {
  if(title.value.length < 3) {
    title.classList.add('error');
    error.textContent = "title must container 3 or more characters";
  }
  if(title.value.length >= 3) {
    title.classList.remove('error');
    error.textContent = '';
  }
};

function validateFormDescription() {
  if(description.value.length < 5) {
    description.classList.add('error');
    error.textContent = "description must contain 5 or more characters";
  }
  if(description.value.length >=5) {
    description.classList.remove('error');
    error.textContent = '';
  }
}

