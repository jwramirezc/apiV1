const promise = new Promise((resolve, reject) => {
  resolve('todo correcto');
});

const cows = 15;

const countCows = new Promise((resolve, reject) => {
  if (cows > 10) {
    resolve(`Tenemos más de ${cows} vacas`);
  } else {
    reject('No tenemos vacas en la finca');
  }
});

countCows
  .then(result => {
    console.log(result);
  })
  .catch(error => {
    console.log(error);
  })
  .finally(() => console.log('Finalizamos'));
