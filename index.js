if(process.env.NODE_ENV !== "production") require("dotenv").config();
const { dbSetup, dbOptions, pool } = require("./tools/db");

const {SESSION_SECRET = "test", PORT = "3000", DOMAIN = "localhost" } = process.env;

dbSetup()
    .then(() => {
        const express = require("express");
        const app = express();
        const path = require("path")
        
        const swaggerJSDoc = require("swagger-jsdoc");
        const swaggerUI = require("swagger-ui-express");
        
        const session = require("express-session");
        const MySQLStore = require("express-mysql-session")(session);
        const sessionStore = new MySQLStore(dbOptions, pool.promise);

        //create test user if doesn't exists
        
        const jsDocOptions = {
            definition: {
                openapi: "3.0.0",
                info: {
                    title: "crud sample",
                    version: "1.0.0",
                    description: "Sample of crud with using SQL, Swagger, tests, session auth and pug views"
                },
                servers: [
                    {
                        url: `http://${DOMAIN}${!["443", "80"].includes(PORT) ? ":" + PORT : ""}`
                    }
                ],
            },
            apis: ["./routes/*.js", "./index.js"]
        }
        
        const swaggerOptions = swaggerJSDoc(jsDocOptions);
        
        app.set("view engine", "pug");
        app.set("views", path.join(__dirname, "views"));
        app.use(session({
            secret: SESSION_SECRET,
            store: sessionStore,
            resave: false,
            saveUninitialized: false
        }))
        /**
         * @swagger
         *  /docs:
         *      get:
         *          summary: Swagger OpenAPI documentation
         */
        app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerOptions))
        
        
        app.use("/", require("./routes/router"));
        
        app.listen(PORT, () => {console.log("running");})
        module.exports = app;
    })
    .catch(console.log)