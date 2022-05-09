const router = require("express").Router();
const service = require("./controllers/service");
const path = require("path");
const html = path.join(__dirname, "..", "views", "index.html");
const validation = require("../tools/validation");
/*API*/
router.post("/api/login", validation.loginSchema, service.login);
router.post("/api/logout", service.apiAuthGate, service.logout);
router.post("/api/register", validation.registerSchema, service.register);
router.get("/api/getAuth", service.getAuth)

router.post("/api/createItem", service.apiAuthGate, validation.createItemSchema, service.createItem);
router.put("/api/updateItem", service.apiAuthGate, validation.updateItemSchema, service.updateItem);
router.get("/api/readItem", validation.readItemSchema, service.readItem);
router.delete("/api/deleteItem", service.apiAuthGate, validation.deleteItemSchema, service.deleteItem);

router.post("/api/searchItems", service.apiAuthGate, validation.searchItemsSchema, service.searchItems);
router.post("/api/searchUsers", service.apiAuthGate, validation.searchUsersSchema, service.searchUsers);

/*sites*/
/*private*/
router.get("/dashboard", service.authGate, (req, res) => {
    res.sendFile(html);
});
router.get("/profile/:id", service.authGate, (req, res) => {
    res.sendFile(html);
});
router.get("/item/:id", service.authGate, (req, res) => {
    res.sendFile(html);
});
router.get("/search", service.authGate, (req, res) => {
    res.sendFile(html);
});
/*public*/
router.get("/login", (req, res) => {
    res.sendFile(html);
});
router.get("/", (req, res) => {
    res.sendFile(html);
});
router.get("*", (req, res) => {
    res.redirect("/");
});
module.exports = router;