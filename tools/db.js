const {DB_HOST = "localhost", DB_PORT = 3306, DB_USER = "mysql", DB_PASS = "mysql"} = process.env

exports.dbOptions = {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS
}