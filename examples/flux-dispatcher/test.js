/**
 * @file dispacther测试
 * @author Yuan Yanjun
 */

const Flux = require('../../dist/Flux');
const Dispatcher = Flux.Dispatcher;

let flightDispatcher = new Dispatcher();
let countryStore = {country: null};
let cityStore = {city: null};
let priceStore = {price: null};

countryStore.dispatchToken = flightDispatcher.register(function (payload) {
    if (payload.actionType === 'update-country') {
        countryStore.country = payload.selectCountry;
    }
    console.log('25: ', cityStore, countryStore);
});

priceStore.dispatchToken = flightDispatcher.register(function (payload) {
    switch (payload.actionType) {
        case 'update-country':
        case 'update-city':
            flightDispatcher.waitFor([cityStore.dispatchToken]);
            priceStore.price = getDefaultPrice(countryStore.country, cityStore.city);
    }
    console.log('43: ', cityStore, countryStore, priceStore);
});

cityStore.dispatchToken = flightDispatcher.register(function (payload) {
    if (payload.actionType === 'update-country') {
        flightDispatcher.waitFor([countryStore.dispatchToken]);
        cityStore.city = getDefaultCityForCountry(countryStore.country);
    }
    console.log('33: ', cityStore, countryStore);
});

flightDispatcher.register(function (payload) {
    if (payload.actionType === 'update-city') {
        cityStore.city = payload.selectCity;
    }
    console.log('18: ', cityStore, countryStore);
});

console.log('update-city: ');
flightDispatcher.dispatch({
    actionType: 'update-city',
    selectCity: 'paris'
});

console.log('update-country: ');
flightDispatcher.dispatch({
    actionType: 'update-country',
    selectCountry: 'australia'
});

function getDefaultCityForCountry() {
    return 'BeiJing';
}

function getDefaultPrice(country, city) {
    console.log('country: ', country, 'city: ', city);
    return 111111;
}
