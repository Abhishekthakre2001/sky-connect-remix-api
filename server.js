const express = require("express");
const cluster = require("cluster");
const os = require("os");
const helmet = require("helmet");
const morgan = require("morgan");
const limiter = require("./src/middlewares/rateLimiter");
const contactRoutes = require("./src/routes/contactRoutes");
const mailtemplateRoutes = require("./src/routes/mailtemplateRoutes");
const pricingRoutes = require("./src/routes/pricingRoutes");
const mailRoutes = require("./src/routes/mailRoutes");
const errorHandler = require("./src/utils/errorHandler");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 4005;

if (cluster.isMaster) {
    const numCPUs = os.cpus().length;
    console.log(`🟢 Master ${process.pid} is running`);
    console.log(`⚡ Forking ${numCPUs} workers...`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on("exit", (worker, code, signal) => {
        console.error(`❌ Worker ${worker.process.pid} died. Restarting...`);
        cluster.fork();
    });
} else {

    // ✅ Test route
    app.get("/test", (req, res) => {
        res.json({ status: "ok", message: "SkyConnect API is running 🚀" });
    });

    // ✅ Global middlewares

    // --- CORS ---
    const allowedOrigins = [
        "https://skyconnectshopify.skyvisionitsolutions.online",
        "http://localhost:3000"
    ];

    app.use(cors({
        origin: function (origin, callback) {
            // allow requests with no origin like Postman
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
                return callback(new Error(msg), false);
            }
            return callback(null, true);
        },
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true
    }));

    // handle preflight OPTIONS requests automatically
    app.options("*", cors());

    app.use(helmet());
    app.use(limiter);
    app.use(express.json());
    app.use(morgan("combined"));

    // ✅ Routes
    app.use("/api/mailtemplate", mailtemplateRoutes);
    app.use("/api", contactRoutes);
    app.use("/api/mail", mailRoutes);
    app.use("/", pricingRoutes);

    // ✅ Error Handling
    app.use(errorHandler);

    // ✅ Start Server
    app.listen(PORT, () => {
        console.log(`✅ Server running on http://localhost:${PORT} `);
    });
}
