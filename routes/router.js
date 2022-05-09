const router = require("express").Router();
const service = require("./controllers/service");
const path = require("path");
const html = path.join(__dirname, "..", "views", "index.html");

/*API*/
router.post("/api/login", service.login);
router.post("/api/logout", service.apiAuthGate, service.logout);
router.post("/api/register", service.register);
router.get("/api/getAuth", service.getAuth)

router.post("/api/createItem", service.apiAuthGate, service.createItem);
router.put("/api/updateItem", service.apiAuthGate, service.updateItem);
router.get("/api/readItem", service.readItem);
router.delete("/api/deleteItem", service.apiAuthGate, service.deleteItem);

router.post("/api/searchItems", service.apiAuthGate, service.searchItems);
router.post("/api/searchUsers", service.apiAuthGate, service.searchUsers);

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