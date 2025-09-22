// src/middlewares/corsConfig.js
const cors = require("cors");

// const allowedOrigins = [
//     "https://skyconnectshopify.skyvisionitsolutions.online",
//     "http://localhost:3000"
// ];
const allowedOrigins = [
    '*'
];

const corsOptions = {
    // origin: function (origin, callback) {
    //     if (!origin) return callback(null, true); // allow non-browser requests like Postman
    //     if (allowedOrigins.indexOf(origin) !== -1) {
    //         callback(null, true);
    //     } else {
    //         callback(new Error("Not allowed by CORS"));
    //     }
    // },
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true // if you need cookies/auth
};

module.exports = cors(corsOptions);
