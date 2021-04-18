export const getCovidInfo = () => new Promise((resolve) => {
    fetch(`https://corona.lmao.ninja/v2/historical?lastdays=720`)
    .then(response => {
        return response.json();
    })
    .then(result => {
        resolve(result);
    })
    .catch(err => {
        console.error(err);
    });
});

export const getCountriesInfo = () => new Promise((resolve) => {
    fetch(`https://corona.lmao.ninja/v2/countries`)
    .then(response => {
        return response.json();
    })
    .then(result => {
        resolve(result);
    })
    .catch(err => {
        console.error(err);
    });
});

export const getTotalInfo = () => new Promise((resolve) => {
    fetch(`https://corona.lmao.ninja/v2/historical/all?lastdays=720`)
    .then(response => {
        return response.json();
    })
    .then(result => {
        resolve(result);
    })
    .catch(err => {
        console.error(err);
    });
});