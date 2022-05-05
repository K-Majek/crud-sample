const {DB_HOST = "localhost", DB_PORT = 3306, DB_USER = "mysql", DB_PASS = "mysql"} = process.env
const mysql = require("mysql2");



exports.dbOptions = {
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS
}
const pool = mysql.createPool({
    ...exports.dbOptions, multipleStatements: true
})


/**
 * Creates a new user.
 * @returns {Promise<Array<import("mysql2").RowDataPacket>|Error>}
 */
exports.dbSetup = () => new Promise ((resolve, reject) => {
    const fs = require("fs");
    const path = require("path");
    
    if(fs.existsSync(path.join(__dirname, "..", "setup.sql"))) {
        fs.readFile(path.join(__dirname, "..", "setup.sql"), (err, query) => {
            if(query) pool.query(query, (err, result, fields) => {
                if(err) reject(err);
                else resolve([result, fields]);
            })
            else reject(new Error("No data to process"));
        })
    }
    else reject(new Error("SQL file does not exist"));
})

/**
 * Creates a new user.
 * @param {object} data object data
 * @param {string} data.user_id user ID string 
 * @param {string} data.user user ID string 
 * @param {string} data.password user ID string 
 * @returns {Promise<Array<import("mysql2").RowDataPacket>|Error>}
 */
exports.createUser = (data) => new Promise((resolve, reject) => {
    const {user_id, user, password} = data;
    const query = `INSERT INTO sample.users (user_id, user, password) VALUES (?, ?, ?)`

    pool.query(query, [user_id, user, password], (err, result, fields) => {
        if(err) reject(err);
        else resolve([result, fields]);
    })
});

/**
 * Gets user by specific user_id
 * @param {object} data object data
 * @param {string} data.user_id user ID string 
 * @returns {Promise<Array<import("mysql2").RowDataPacket>|Error>}
 */
exports.getUserById = (data) => new Promise((resolve, reject) => {
    const {user_id} = data;
    const query = `SELECT user_id, user FROM sample.users WHERE user_id = ?`;

    pool.query(query, [user_id], (err, result, fields) => {
        if(err) reject(err);
        else resolve([result, fields]);
    })
});

/**
 * Gets user by any data, if object is empty, returns all entries
 * @param {object} data object data
 * @param {string} data.user user name
 * @returns {Promise<Array<import("mysql2").RowDataPacket>|Error>}
 */
exports.getUserByUsername = (data) => new Promise((resolve, reject) => {
    const {user} = data;
    const query = `SELECT user_id, user FROM sample.users WHERE user = ?`;

    pool.query(query, [user], (err, result, fields) => {
        if(err) reject(err);
        else resolve([result, fields]);
    })
});

/**
 * Gets user by specific user name
 * @param {object} data object data
 * @param {string=} data.user user name
 * @param {string=} data.user_id user ID string 
 * @returns {Promise<Array<import("mysql2").RowDataPacket>|Error>}
 */
exports.searchUserByAny = (data) => new Promise((resolve, reject) => {
    const {user, user_id} = data;
    const obj = {user, user_id};
    const whereConditions = [];
    const values = [];

    for(const key in obj) {
        if(typeof obj[key] === "string" && obj[key].length > 0) {
            whereConditions.push(`(${key} IS NOT NULL AND ${key} LIKE ?)`);
            values.push(`%${obj[key]}%`);
        }
    }

    const baseQuery = `SELECT user_id, user FROM sample.users`;
    const whereClause = `
    WHERE (
        ${whereConditions.join(" AND ")}
    )`
    const query = whereConditions.length > 0 ? baseQuery + whereClause : baseQuery;

    pool.query(query, values, (err, result, fields) => {
        if(err) reject(err);
        else resolve([result, fields]);
    })
});




/**
 * Updates user with any data
 * @param {object} data object data
 * @param {string} data.user_id user ID string 
 * @param {Array<string>} data.fields Array of fields to be updated
 * @param {Array<string>} data.values Array of values to be updated with
 * @returns {Promise<Array<import("mysql2").RowDataPacket>|Error>}
 */
exports.updateUser = (data) => new Promise((resolve, reject) => {
    const {fields, values, user_id} = data;
    const query = `UPDATE sample.users SET ${fields.join(",")} WHERE user_id = ?`

    pool.query(query, [...values, user_id], (err, result, fields) => {
        if(err) reject(err);
        else resolve([result, fields]);
    })
})

/**
 * Deletes user with specific ID
 * @param {object} data object data
 * @param {string} data.user_id user ID string 
 * @returns {Promise<Array<import("mysql2").RowDataPacket>|Error>}
 */
exports.deleteUser = (data) => new Promise((resolve, reject) => {
    const {user_id} = data;

    const query = `DELETE FROM sample.users WHERE user_id = ?`;

    pool.query(query, [user_id], (err, result, fields) => {
        if(err) reject(err);
        else resolve([result, fields]);
    })
})

/**
 * Gets password, username and user_id.
 * @param {object} data object data
 * @param {string} data.user_id user ID string 
 * @returns {Promise<Array<import("mysql2").RowDataPacket>|Error>}
 */
exports.getAuthData  = (data) => new Promise((resolve, reject) => {
    const {user} = data;
    const query = `SELECT user_id, user, password FROM sample.users WHERE user = ?`;

    pool.query(query, [user], (err, result, fields) => {
        if(err) reject(err);
        else resolve([result, fields]);
    })
})

/**
 * Creates new item
 * @param {object} data object data
 * @param {string} data.item_id item ID string
 * @param {string} data.user_id user ID string 
 * @param {string} data.name item name
 * @returns {Promise<Array<import("mysql2").RowDataPacket>|Error>}
 */
exports.createItem  = (data) => new Promise((resolve, reject) => {
    const {user_id, item_id, name} = data;
    const query = `INSERT INTO sample.items (item_id, user_id, name) VALUES (?, ? ,?)`;

    pool.query(query, [item_id, user_id, name], (err, result, fields) => {
        if(err) reject(err);
        else resolve([result, fields]);
    })
})

/**
 * Deletes item with specific item_id
 * @param {object} data object data
 * @param {string} data.item_id item ID string
 * @returns {Promise<Array<import("mysql2").RowDataPacket>|Error>}
 */
exports.deleteItem = (data) => new Promise((resolve, reject) => {
    const {item_id} = data;
    const query = `DELETE FROM sample.items WHERE item_id = ?`;

    pool.query(query, [item_id], (err, result, fields) => {
        if(err) reject(err);
        else resolve([result, fields]);
    })
})

/**
 * Updates item data
 * @param {object} data object data
 * @param {string} data.item_id item ID string
 * @param {Array<string>} data.fields Array of fields to be updated
 * @param {Array<string>} data.values Array of values to be updated with
 * @returns {Promise<Array<import("mysql2").RowDataPacket>|Error>}
 */
exports.updateItem = (data) => new Promise((resolve, reject) => {
    const {item_id, fields, values} = data;
    const query = `UPDATE sample.items SET ${fields.join(",")} WHERE item_id = ?`;

    pool.query(query, [...values, item_id], (err, result, fields) => {
        if(err) reject(err);
        else resolve([result, fields]);
    })
})



/**
 * Gets item by specific item id
 * @param {object} data object data
 * @param {string} data.item_id item ID string
 * @returns {Promise<Array<import("mysql2").RowDataPacket>|Error>}
 */
exports.getItemById = (data) => new Promise((resolve, reject) => {
    const {item_id} = data;
    const query = `SELECT 
        t1.item_id, 
        t1.user_id, 
        t1.name, 
        j1.name AS username
    FROM sample.items t1 
    INNER JOIN sample.users j1 ON t1.user_id = j1.user_id
    WHERE t1.item_id = ?`;

    pool.query(query, [item_id], (err, result, fields) => {
        if(err) reject(err);
        else resolve([result, fields]);
    })
})

/**
 * Gets all items by specific user id
 * @param {object} data object data
 * @param {string} data.user_id user ID string
 * @returns {Promise<Array<import("mysql2").RowDataPacket>|Error>}
 */
exports.getItemsByUserId = (data) => new Promise((resolve, reject) => {
    const {user_id} = data;
    const query = `SELECT 
        t1.item_id, 
        t1.user_id, 
        t1.name, 
        j1.name AS username
    FROM sample.items t1 
    INNER JOIN sample.users j1 ON t1.user_id = j1.user_id
    WHERE t1.user_id = ?`;

    pool.query(query, [user_id], (err, result, fields) => {
        if(err) reject(err);
        else resolve([result, fields]);
    })
})


/**
 * Gets items by specific user name
 * @param {object} data object data
 * @param {string=} data.user_id user ID string 
 * @param {string=} data.item_id user ID string 
 * @param {string=} data.name user ID string 
 * @returns {Promise<Array<import("mysql2").RowDataPacket>|Error>}
 */
exports.searchUserByAny = (data) => new Promise((resolve, reject) => {
    const {user_id = "", item_id = "", name = ""} = data;
    const obj = {user_id, item_id, name};
    const whereConditions = [];
    const values = [];

    for(const key in obj) {
        if(typeof obj[key] === "string" && obj[key].length > 0) {
            whereConditions.push(`(${key} IS NOT NULL AND ${key} LIKE ?)`);
            values.push(`%${obj[key]}%`);
        }
    }

    const baseQuery = `SELECT user_id, user FROM sample.users`;
    const whereClause = `
    WHERE (
        ${whereConditions.join(" AND ")}
    )`
    const query = whereConditions.length > 0 ? baseQuery + whereClause : baseQuery;

    pool.query(query, values, (err, result, fields) => {
        if(err) reject(err);
        else resolve([result, fields]);
    })
});

/**
 * Item template
 * @param {object} data object data
 * @param {string=} data.item_id item ID string
 * @param {string=} data.user_id user ID string 
 * @param {string=} data.name item name
 * @returns {Promise<Array<import("mysql2").RowDataPacket>|Error>}
 */