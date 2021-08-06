const Discord = require("discord.js");
const config = require("../config");
const client = global.client;

exports.execute = async () => {
    client.user.setPresence({ activity: { name: config.botOynuyor}, status: "online" });
};

exports.conf = {
  event: "ready"
};