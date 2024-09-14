import fetch from 'node-fetch';
const API_URL = 'https://api.escuelajs.co/api/v1';

//función que va a recibir como argumento la url que queremos llamar
// y esto retornará el llamado de fetch: una promesa

function fetchData(urlApi) {
  return fetch(urlApi);
}

//hacemos el llamado de la función fetchData y le pasamos como argumento la url que queremos llamar
//la respuesta del fetch es una promesa, por lo tanto podemos usar.then para obtener los datos

// fetchData(`${API_URL}/products`)
//   .then(response => response.json()) //convertimos la respuesta a json
//   .then(products => console.log(products)) //imprimimos los productos
//   .then(() => {
//     console.log('hola');
//   })
//   .catch(() => {
//     console.log('error'); //si hay un error en el llamado de la api, se ejecuta esta función
//   });

fetchData(`${API_URL}/products`)
  .then(response => response.json())
  .then(products => {
    return fetchData(`${API_URL}/products/${products[0].id}`);
  })
  .then(response => response.json())
  .then(products => {
    console.log(products.title);
    return fetchData(`${API_URL}/categories/${products.category.id}`);
  })
  .then(response => response.json())
  .then(category => {
    console.log(category.name);
  })
  .catch(() => {
    console.log('error'); //si hay un error en el llamado de la api, se ejecuta esta función
  })
  .finally(() => {
    console.log('finalmente');
  }); //se ejecuta siempre al final del fetch
