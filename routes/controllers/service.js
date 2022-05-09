const bcrypt = require("bcrypt");
const db = require("../../tools/db");
const {v4: uuidv4} = 'uuid';

exports.authGate = (req, res, next) => {
    if(!req.session.authorised) return res.redirect("/login");
    next();
}
exports.apiAuthGate = (req, res, next) => {
    if(!req.session.authorised) return res.status(401).json({message: "You need to log it to access this source."});
    next();
}
exports.register = async (req, res, next) => {
    const {user, password} = req.body;

    const [userRows,] = await db.getAuthData({user});
    if(userRows.length > 0) return res.render("register", {errorMessage: "User already exists"});

    const user_id = await uuidv4();
    const hash = await bcrypt.hash(password, 10);

    await db.createUser({user_id, user, password: hash});

    res.status(201).json({message: "User registered successfully."});
}

exports.login = async (req, res, next) => {
    const {user, password} = req.body;
    const [userRows, ] = await db.getAuthData({user});

    if(userRows.length === 0) return res.status(401).json({message: "There is no such user."});

    bcrypt.compare(password, userRows[0].password, (err, res) => {
        if(err) {
            console.log(err);

            return res.status(500).json({message: "Internal error. Try again later."});
        }

        if(res) {
            const {user_id} = userRows[0];

            req.session.authorised = true;
            req.session.user_id = user_id;

            return res.json({message: "Logged in successfully", user_id, authorised: true});
        }
        else {
            return res.json({message: "Password does not match."});
        }
    })
}

exports.logout = async (req, res, next) => {
    if(!req.session.authorised) return res.json({message: "You are not logged in."});

    req.session.destroy();
    return res.json({message: "Logged out successfully"});
}

exports.getAuth = async (req, res, next) => {
    const {authorised, user_id} = req.session;
    
    res.json({authorised, user_id});
}

exports.createItem = async (req, res, next) => {
    const {name} = req.body, {user_id} = req.session, item_id = uuidv4();
    await db.createItem({item_id, user_id, name});
    res.json({item_id, user_id, name, message: "Item created successfully."})
}
exports.updateItem = async (req, res, next) => {
    const {name, item_id} = req.body, {user_id} = req.session;
    const [itemRows, itemFields] = await db.getItemById({item_id});
    if(itemRows[0].user_id !== user_id) return res.status(403).json({message: "You don't have permission to edit this item."});

    const fields = ["name = ?"];
    const values = [name];

    await db.updateItem({fields, values, item_id});
    res.json({item_id, user_id, name, message: "Item updated successfully"})
}

exports.readItem = async (req, res, next) => {
    const {id} = req.body;
    const [itemRows, itemFields] = await db.getItemById({item_id: id});
    res.json({itemData: itemRows.length > 0 ? itemRows[0] : []});
}

exports.deleteItem = async (req, res, next) => {
    const {item_id} = req.body;
    const [itemRows, itemFields] = await db.getItemById({item_id});
    if(itemRows[0].user_id !== user_id) return res.status(403).json({message: "You don't have permission to edit this item."});
    await db.deleteItem({item_id});
    res.json({message: "Item deleted successfully"});
}

exports.searchItems = async (req, res, next) => {
    const {item_id, user_id, name} = req.body;
    const [itemRows, itemFields] = await db.searchItemsByAny({user_id, item_id, name});
    res.json({itemData: itemRows.length > 0 ? itemRows[0] : []});
}
exports.searchUsers = async (req, res, next) => {
    const {user_id, user} = req.body;
    const [userRows, userFields] = await db.searchUsersByAny({user_id, user});
    res.json({userData: userRows.length > 0 ? userRows[0] : []});
}