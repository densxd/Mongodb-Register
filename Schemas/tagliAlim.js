const { Schema, model } = require("mongoose");

const tagliAlim = Schema({
    guildID: {type: String, default: ""},
    tagli: {type: Boolean, default: false}
    
});
module.exports = model("tagli-alim", tagliAlim,"tagli-alim");