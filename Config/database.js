require("dotenv").config();

const { Pool } = require("pg");

console.log("Mot de passe chargé :", process.env.DB_PASSWORD);

const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "Soutenancedb",
    password: process.env.DB_PASSWORD,
    port: 5432
});

module.exports = pool;