const optionSelected = document.getElementById('task');
const buttonSelected = document.getElementById('btn-select');
const apiUrl = 'https://api.escuelajs.co/api/v1';

optionSelected.addEventListener('change', function () {
  const selectedValue = this.value;
  // console.log('Opción seleccionada:', selectedValue);
});

const getValue = () => {
  return optionSelected.value;
};

buttonSelected.addEventListener('click', () => {
  const selectedValue = getValue();
  selectAction(selectedValue);
});

class Product {
  constructor(title, price, description, categoryId, images) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.categoryId = categoryId;
    this.images = images;
  }
}

class API {
  constructor(url) {
    this._url = url;
  }

  fetchData(path) {
    return fetch(`${this._url}${path}`);
  }

  postData(path, data) {
    return fetch(`${this._url}${path}`, {
      method: 'POST',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  updatePost(path, data) {
    return fetch(`${this._url}${path}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
  }

  deletePost(path) {
    return fetch(`${this._url}${path}`, {
      method: 'DELETE',
      mode: 'cors',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}

class Storage {
  constructor() {
    this.localStorage = localStorage;
  }

  saveLocalStorage(data) {
    this.localStorage.setItem('products', JSON.stringify(data));
  }

  getLocalStorage() {
    const product = JSON.parse(this.localStorage.getItem('products'));
    if (product === null || product === undefined) {
      console.log('El producto ya fue eliminado');
      return null;
    } else {
      return product.id;
    }
  }

  deleteLocalStorage() {
    this.localStorage.clear();
  }
}

// Función principal
function selectAction(selectedValue) {
  const api = new API(apiUrl);
  const storage = new Storage();

  if (selectedValue === '1') {
    const product = new Product(
      'SAIA',
      10000000,
      'Software de Gestión Documental',
      1,
      ['https://placeimg.com/640/480/any']
    );

    api
      .postData('/products', product)
      .then(response => response.json())
      .then(data => {
        storage.saveLocalStorage(data);
        createElement(data);
      });
  } else if (selectedValue === '2') {
    const idProduct = storage.getLocalStorage();
    if (idProduct) {
      const product = new Product(
        'Nuevo SAIA V10',
        10000000,
        'Software de Gestión Documental Ultra Plus',
        42,
        ['https://placeimg.com/640/480/any']
      );

      api
        .updatePost(`/products/${idProduct}`, product)
        .then(response => response.json())
        .then(data => {
          storage.saveLocalStorage(data);
          createElement(data);
        });
    }
  } else if (selectedValue === '3') {
    const idProduct = storage.getLocalStorage();
    if (idProduct) {
      api
        .deletePost(`/products/${idProduct}`)
        .then(() => {
          deleteElement(idProduct);
          storage.deleteLocalStorage();
        })
        .catch(error => {
          console.log('Error en la solicitud', error);
        });
    } else {
      console.log('No existe ID de producto');
    }
  } else if (selectedValue === '4') {
    api
      .fetchData('/products')
      .then(response => response.json())
      .then(data => createElement(data))
      .catch(() => {
        console.log('error');
      })
      .finally(() => {
        console.log('Finalizó el proceso.');
      });
  }
}

// Funciones para manejar elementos HTML
function createElement(data) {
  const ul = document.getElementById('products-list');

  if (Array.isArray(data)) {
    data.forEach(item => {
      const li = createListItem(item);
      ul.insertAdjacentElement('beforeend', li);
    });
  } else {
    const li = createListItem(data);
    ul.insertAdjacentElement('beforeend', li);
  }
}

function createListItem(data) {
  const li = document.createElement('li');
  li.id = data.id;

  let htmlString = '';
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      htmlString += `${key}: ${data[key]}<br>`;
    }
  }

  li.innerHTML = `<span>${htmlString}</span>`;
  return li;
}

function deleteElement(id) {
  const element = document.getElementById(id);
  if (element) {
    element.remove();
  }
}
