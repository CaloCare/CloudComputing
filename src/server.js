let hapi = require('@hapi/hapi');
let routes = require('./routes');

let init = async() => {
    let server = hapi.server({
        port: process.env.PORT || 9000,
        host: '0.0.0.0',
        routes: {
            cors: {
                origin: ['*'],
            },
        },
    });

    server.route(routes);

    await server.start();
    console.log(`Server running on ${server.info.uri}`);
};

init();