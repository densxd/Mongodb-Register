const { Schema, model } = require("mongoose");

const kayit = Schema({
    guildID: {type: String, default: ""},
    userID: {type: String, default: ""},
    erkek: {type: Number, default: ""},
    kadın: {type: Number, default: ""},
    toplam: { type: Number, default: ""},
    kayıtlar: Array
    
});
module.exports = model("kayitlar", kayit ,"kayitlar");