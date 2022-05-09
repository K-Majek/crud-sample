const joi = require("joi");

const schemaOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true
}
exports.registerSchema = (req, res, next) => {
    const schema = joi.object({
        user: joi.string().required(),
        password: joi.string()
            .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*\(\)\-\_\=\+\[\]\{\}\;\'\:\"\|\,\.\/\<\>\?])(?=.{8,})/)
            .required()
            .messages({
                "string.pattern.base": "Password must contain 1 number, 1 uppercase, 1 lowercase, 1 special character and be at least 8 characters long"
            })
    });
    const {error, value} = schema.validate(req.body, schemaOptions);
    if(error) {
        res.status(403);
        res.json({message: "Invalid data."});
    }
    else {
        req.body = value;
        req.verifiedSchema = true;
        next();
    }
}
exports.loginSchema = (req, res, next) => {
    const schema = joi.object({
        user: joi.string().required(),
        password: joi.string().required()
    });
    const {error, value} = schema.validate(req.body, schemaOptions);
    if(error) {
        res.status(403);
        res.json({message: "Invalid data."});
    }
    else {
        req.body = value;
        req.verifiedSchema = true;
        next();
    }
}
exports.createItemSchema = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().required()
    });
    const {error, value} = schema.validate(req.body, schemaOptions);
    if(error) {
        res.status(403);
        res.json({message: "Invalid data."});
    }
    else {
        req.body = value;
        req.verifiedSchema = true;
        next();
    }
}
exports.updateItemSchema = (req, res, next) => {
    const schema = joi.object({
        name: joi.string().required(),
        item_id: joi.string().required()
    });
    const {error, value} = schema.validate(req.body, schemaOptions);
    if(error) {
        res.status(403);
        res.json({message: "Invalid data."});
    }
    else {
        req.body = value;
        req.verifiedSchema = true;
        next();
    }
}
exports.readItemSchema = (req, res, next) => {
    const schema = joi.object({
        id: joi.string().required()
    });
    const {error, value} = schema.validate(req.query, schemaOptions);
    if(error) {
        res.status(403);
        res.json({message: "Invalid data."});
    }
    else {
        req.body = value;
        req.verifiedSchema = true;
        next();
    }
}
exports.deleteItemSchema = (req, res, next) => {
    const schema = joi.object({
        item_id: joi.string().required()
    });
    const {error, value} = schema.validate(req.query, schemaOptions);
    if(error) {
        res.status(403);
        res.json({message: "Invalid data."});
    }
    else {
        req.body = value;
        req.verifiedSchema = true;
        next();
    }
}
exports.searchItemsSchema = (req, res, next) => {
    const schema = joi.object({
        item_id: joi.string().allow(""),
        user_id: joi.string().allow(""),
        name: joi.string().allow("")
    });
    const {error, value} = schema.validate(req.body, schemaOptions);
    if(error) {
        res.status(403);
        res.json({message: "Invalid data."});
    }
    else {
        req.body = value;
        req.verifiedSchema = true;
        next();
    }
}
exports.searchUsersSchema = (req, res, next) => {
    const schema = joi.object({
        user_id: joi.string().allow(""),
        user: joi.string().allow("")
    });
    const {error, value} = schema.validate(req.body, schemaOptions);
    if(error) {
        res.status(403);
        res.json({message: "Invalid data."});
    }
    else {
        req.body = value;
        req.verifiedSchema = true;
        next();
    }
}