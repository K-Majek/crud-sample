const request = require("supertest");
const index = require("./index");
const crypto = require("crypto");

const {TEST_USER, TEST_PASS} = process.env;


    /*
        routes:
            views: 
            - GET /
            - GET /docs
            - GET /items/
            - GET /items/:id
            - GET /register
            - GET /login
            - GET /logout

            service:
            - POST /login
            - POST /register
            - POST /items, {itemId, ...data}
            - PUT /items, {itemId, ...data} => 301 => 200 /items/
            - DELETE /items/:id

    */
describe("Website routes", () => {
    it("GET / => status 200" , () => {
        return request(index)
            .get("/")
            .expect(200);
    });    
    it("GET /items => status 200" , () => {
        return request(index)
            .get("/items")
            .expect(200);
    });
    it("GET /login => status 200 || 302" , () => {
        return request(index)
            .get("/login")
            .expect((res) => {
                if(![200, 302].includes(res.status)) throw new Error(`Invalid status code. Expected 200, 302, got ${res.status}`)
            });
    });    
    it("GET /register => status 200 || 302" , () => {
        return request(index)
            .get("/register")
            .expect((res) => {
                if(![200, 302].includes(res.status)) throw new Error(`Invalid status code. Expected 200, 302, got ${res.status}`)
            });
    });    
    it("GET /docs => status 200" , () => {
        return request(index)
            .get("/docs")
            .expect(200);
    });    
})

describe("User creation cycle", () => {
    let cookies = "";
    const user = crypto.randomBytes(10).toString("hex");
    const password = crypto.randomBytes(10).toString("hex");
    it("Should register new user successfully", () => {
        return request(index)
            .post("/register")
            .send({user, password})
            .set("Cookie", cookies)
            .expect(201);
    })
    it("Should be denied from attempting to create an account using the same data", () => {
        return request(index)
            .post("/register")
            .send({user, password})
            .set("Cookie", cookies)
            .expect(409);
    })
    it("Should login and receive cookies", () => {
        return request(index)
            .post("/login")
            .send({user, password})
            .set("Cookie", cookies)
            .expect(200)
            .then(response => {
                cookies = response.headers['set-cookie'] ? response.headers['set-cookie'].join(";") : "";
            })
    })
    it("Should enter protected route", () => {
        return request(index)
            .get("/items")
            .set("Cookie", cookies)
            .expect(200);
    })
    it("Should logout and destroy a session", () => {
        return request(index)
            .get("/logout")
            .set("Cookie", cookies)
            .expect(200)
            .then(response => {
                cookies = "";
            });
    })
    it("Should be restricted from entering protected route", () => {
        return request(index)
            .get("/items")
            .set("Cookie", cookies)
            .expect(302);
    })
    it("Should login", () => {
        return request(index)
            .post("/login")
            .send({user, password})
            .set("Cookie", cookies)
            .expect(200)
            .then(response => {
                cookies = response.headers['set-cookie'] ? response.headers['set-cookie'].join(";") : "";
            })
    })
    it("Should delete own account", () => {
        return request(index)
            .delete("/deleteUser")
            .set("Cookie", cookies)
            .expect(200)
            .then(response => {
                cookies = "";
            })
    })
})

describe("CRUD lifecycle", () => {
    let cookies = "";
    let item_id = "";
    it("Should login using predefined credentials and receive cookies", () => {
        return request(index)
            .post("/login")
            .send({user: TEST_USER, password: TEST_PASS})
            .set("Cookie", cookies)
            .expect(200)
            .then(response => {
                cookies = response.headers['set-cookie'] ? response.headers['set-cookie'].join(";") : "";
            })
    })
    it("Should create item successfully", () => {
        return request(index)
            .post("/item")
            .send({name: "test item"})
            .set("Cookie", cookies)
            .expect(201)
            .then(response => {
                item_id = response.data.item_id;
            });
    })
    it("Should read item", () => {
        return request(index)
            .get("/items/" + item_id)
            .set("Cookie", cookies)
            .expect(200)
    })
    it("Should update item", () => {
        return request(index)
            .put("/item")
            .set("Cookie", cookies)
            .send({name: "changed test item"})
            .expect(200)
    })
    it("Should delete item", () => {
        return request(index)
            .delete("/items/" + item_id)
            .set("Cookie", cookies)
            .expect(200)
    })
    it("Should logout", () => {
        return request(index)
            .get("/logout")
            .set("Cookie", cookies)
            .expect(200)
            .then(response => {
                cookies = "";
            });
    })
});
//can connect to the database