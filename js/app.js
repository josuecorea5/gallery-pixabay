const result = document.querySelector('#resultado');
const form = document.querySelector('#formulario');
const pagination = document.querySelector('#paginacion');
const recordsPerPage = 40;
let totalPages;
let iterator;
let actualPage = 1;

window.onload = () => {
  form.addEventListener('submit', formValidate);
}

function formValidate(e) {
  e.preventDefault();
  const searchTerm = document.querySelector('#termino').value;

  if(searchTerm === '') {
    showAlert('Agrega un término de búsqueda');
    return;
  }
  searchImages();
}

function showAlert(message) {
  const existAlert = document.querySelector('.alert');
  if(!existAlert) {
    const alert = document.createElement('p');
    alert.classList.add('bg-red-100','border-red-400','text-red-700','px-4','py-3','rounded','max-w-lg','mx-auto','mt-6','text-center','alert');
    alert.innerHTML = `
      <strong class="font-bold">Error...</strong>
      <span class="block sm:inline">${message}</span>
    `;
    form.appendChild(alert);
  
    setTimeout(() => {
      alert.remove();
    }, 3000);
  }
}

function searchImages() {
  const term = document.querySelector('#termino').value;
  const key = '24423371-0409b800c9df5edccfac1307e';
  const URL = `https://pixabay.com/api/?key=${key}&q=${term}&per_page=${recordsPerPage}&page=${actualPage}`;
  fetch(URL)
    .then(response => response.json())
    .then(data => {
      totalPages = calculatePages(data.totalHits);
      showImages(data.hits);
    })
}

//generator to registar number of elements for each page
function *createPager(total) {
  for(let i = 1; i <= total; i++) {
    yield i;
  }
}

function calculatePages(total) {
  return parseInt( Math.ceil(total / recordsPerPage));
}

function showImages(images) {
  while(result.firstChild) {
    result.removeChild(result.firstChild);
  }
  const div = document.createElement('div');

  div.classList.add('gallery');
  images.forEach(image => {
    const { webformatURL, likes, views, largeImageURL} = image;
    const imgContainer = document.createElement('div');
    imgContainer.classList.add('container-img')
    const capa = document.createElement('div');
    capa.classList.add('capa');
    capa.innerHTML = `
      <p class="pb-2">${likes} <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline align-text-bottom" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg> 
      </p>
      <p class="pb-2">${views} <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline align-text-bottom" viewBox="0 0 20 20" fill="currentColor">
        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" /></svg>
      </p>
      <a href="${largeImageURL}" class="hover:underline pb-2" target="_blank" rel="noopener noreferrer">
        Ver imagen
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 inline align-text-bottom" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
      </a>
    `;
    imgContainer.addEventListener('mouseover', () => capa.classList.add('showCapa'));
    imgContainer.addEventListener('mouseout', () => capa.classList.remove('showCapa'))
    const img = document.createElement('img');
    img.src = webformatURL;
    img.style.marginBottom = '.5em'
    img.classList.add('block','rounded')
    imgContainer.appendChild(img);
    imgContainer.appendChild(capa)
    div.appendChild(imgContainer);
  })
  result.appendChild(div);
  cleanPaginatorHTML();
  printPager();
}

function printPager() {
  iterator = createPager(totalPages);
  while(true) {
    const { value, done } = iterator.next();
    if(done) return;
    const button = document.createElement('a');
    button.href = "#";
    button.dataset.page = value;
    button.textContent = value;
    button.classList.add('siguiente','bg-yellow-400','px-4','py-1','mr-2','font-bold','mb-5','rounded');
    button.onclick = () => {
      actualPage = value;
      searchImages()
    }
    pagination.appendChild(button);
  }
}

function cleanPaginatorHTML() {
  while(pagination.firstChild) {
    pagination.removeChild(pagination.firstChild);
  }
}