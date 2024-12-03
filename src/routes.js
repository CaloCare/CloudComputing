const { addFoodHandler, getAllFoodHandler, searchFoodHandler, deleteFoodByNameHandler } = require("./handler");

let routes = [
    {
        method: 'POST',
        path: '/food',
        handler: addFoodHandler,
    },
    {
        method: 'GET',
        path: '/food',
        handler: getAllFoodHandler,
    },
    {
        method: 'POST',
        path: '/food/search',  
        handler: searchFoodHandler,
    },
    {
        method: 'DELETE',
        path: '/food/delete-by-name',
        handler: deleteFoodByNameHandler,
    },    
];

module.exports = routes;