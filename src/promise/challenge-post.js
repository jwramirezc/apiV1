// import fetch from 'node-fetch'; // Importa la función fetch desde el módulo 'node-fetch'

const optionSelected = document.getElementById('task');
const buttonSelected = document.getElementById('btn-select');
const API = 'https://api.escuelajs.co/api/v1'; // Define una constante llamada API que contiene la URL base de la API

optionSelected.addEventListener('change', function () {
  const selectedValue = this.value;
  //   console.log('Opción seleccionada:', selectedValue);
});

const getValue = () => {
  return optionSelected.value;
};
buttonSelected.addEventListener('click', () => {
  const selectedValue = getValue();
  selectAction(selectedValue);
});

//GET DE TODOS LOS DATOS

function fetchData(urlApi) {
  return fetch(urlApi);
}

//FUNCIÓN PARA CREAR DATOS
function postData(urlApi, data) {
  // Define una función llamada postData que toma una URL y un objeto de datos como argumentos
  const response = fetch(urlApi, {
    // Realiza una solicitud fetch a la URL proporcionada con la configuración especificada
    method: 'POST', // Especifica que esta es una solicitud POST
    mode: 'cors', // Establece el modo de CORS (Cross-Origin Resource Sharing) para permitir solicitudes entre dominios
    credentials: 'same-origin', // Indica que las credenciales deben ser enviadas si la solicitud y la respuesta están en el mismo origen
    headers: {
      // Configura los encabezados de la solicitud
      'Content-Type': 'application/json', // Establece el tipo de contenido del cuerpo de la solicitud como JSON
    },
    body: JSON.stringify(data), // Convierte el objeto de datos a formato JSON y lo establece como el cuerpo de la solicitud
  });
  return response; // Retorna la respuesta de la solicitud fetch
}

//UPDATE PARA EDITAR DATOS
function upDatePost(urlApi, data) {
  const response = fetch(urlApi, {
    method: 'PUT', // Establece el método de solicitud como PUT
    headers: {
      // Configura los encabezados de la solicitud
      'Content-Type': 'application/json', // Establece el tipo de contenido del cuerpo de la solicitud como JSON
    },
    body: JSON.stringify(data), // Convierte el objeto de datos a formato JSON y lo establece como el cuerpo de la solicitud
  });
  return response;
}

//ELIMINAR DATOS
function deletePost(urlApi) {
  return fetch(urlApi, {
    method: 'DELETE',
    mode: 'cors',
    credentials: 'same-origin',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
}

// Función para elegir si desea Crear, Editar o Eliminar

function selectAction(selectedValue) {
  if (selectedValue == 1) {
    const data1 = {
      // Define un objeto de datos que se enviará en la solicitud POST
      title: 'SAIA', // Título del producto
      price: 100000000, // Precio del producto
      description: 'A SOFTWARE GESTIÓN DOCUMENTAL', // Descripción del producto
      categoryId: 1, // ID de la categoría del producto
      images: [
        // Array de imágenes del producto
        'https://placeimg.com/640/480/any', // URL de la imagen del producto
      ],
    };

    postData(`${API}/products`, data1) // Llama a la función postData con la URL de productos y los datos del producto como argumentos
      .then(response => response.json()) // Convierte la respuesta a formato JSON
      .then(data => {
        saveLocalStorage(data); // Ejecuta esta función cuando la respuesta se convierte en JSON, pasando los datos como argumento y los imprime en la consola
        createElement(data); //insertar los datos en el html
      });
  } else if (selectedValue == 2) {
    const idProduct = getLocalStorage();

    const data2 = {
      // Define un objeto de datos NUEVO que se enviará en la solicitud POST
      id: idProduct, // ID del producto
      title: 'NUEVO SAIA V10', // Título del producto
      price: 700000000, // Precio del producto
      description: 'A SOFTWARE GESTIÓN DOCUMENTAL', // Descripción del producto
      categoryId: 42, // ID de la categoría del producto
      images: [
        // Array de imágenes del producto
        'https://placeimg.com/640/480/any', // URL de la imagen del producto
      ], // Datos del producto
    };

    upDatePost(`${API}/products/${data2.id}`, data2)
      .then(response => response.json()) // Convierte la respuesta en formato JSON y lo devuelve como una promesa de datos
      .then(data => {
        // Obtiene los datos del producto actualizado
        createElement(data);
        saveLocalStorage(data);
        console.log('Producto actualizado', data);
      })
      .catch(error => {
        // Captura cualquier error que ocurra
        console.log('Error en la solicitud', error);
      });
  } else if (selectedValue == 3) {
    const idProduct = getLocalStorage();

    if (idProduct === null || idProduct == undefined) {
      console.log('No existe ID de producto');
    } else {
      const deleteData = {
        id: idProduct,
      };

      deletePost(`${API}/products/${deleteData.id}`)
        .then(() => {
          console.log('Producto eliminado');
          deleteElement(idProduct);
        })
        .catch(error => {
          console.log('Error en la solicitud', error);
        });
    }
    deleteLocalStorage();
  } else if (selectedValue == 4) {
    fetchData(`${API}/products`)
      .then(response => response.json())
      .then(data => createElement(data))

      .catch(() => {
        console.log('error'); //si hay un error en el llamado de la api, se ejecuta esta función
      })
      .finally(() => {
        console.log('finalmente');
      }); //se ejecuta siempre al final del fetch
  }
}

function saveLocalStorage(data) {
  localStorage.setItem('products', JSON.stringify(data));
  //   console.log(data.id);
}

function getLocalStorage() {
  const product = JSON.parse(localStorage.getItem('products'));
  if (product === null || product == undefined) {
    console.log('El producto ya fué eliminado');
  } else {
    const idProducto = product.id;
    return idProducto;
  }
}

function deleteLocalStorage() {
  localStorage.clear();
}

function deleteElement(idProduct) {
  console.log(idProduct);
  const deleteProduct = document.getElementById(`${idProduct}`);
  deleteProduct.remove();
  //recargar pagina
  window.location.reload();
}

function createElement(data) {
  console.log(data);

  if (Array.isArray(data)) {
    for (let i = 0; i < data.length; i++) {
      const li = document.createElement('li');
      li.id = data[i].id;

      let htmlString = '';
      for (const key in data[i]) {
        if (Object.prototype.hasOwnProperty.call(data[i], key)) {
          htmlString += `${key}: ${data[i][key]}<br>`;
        }
      }

      li.innerHTML = `<span>${htmlString}</span>`;

      const ul = document.getElementById('products-list');
      if (ul) {
        ul.insertAdjacentElement('beforeend', li);
      }
    }
  } else {
    const li = document.createElement('li');
    li.id = data.id;

    let htmlString = '';
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        htmlString += `${key}: ${data[key]}<br>`;
      }
    }

    li.innerHTML = `<span>${htmlString}</span>`;

    const ul = document.getElementById('products-list');
    if (ul) {
      ul.insertAdjacentElement('beforeend', li);
    }
  }
}
