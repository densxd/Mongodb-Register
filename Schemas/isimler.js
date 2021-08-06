
const { Schema, model } = require("mongoose");

const schema = Schema({
    guildID: {type: String, default: ""},
    userID: {type: String, default: ""},
    isimler: Array
    
});
module.exports = model("isimler", schema ,"isimler");