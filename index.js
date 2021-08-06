const { Client, Collection } = require("discord.js");
const client = global.client = new Client({ fetchAllMembers: true });
const config = require("./config.js");
const mongoose =  require('mongoose');
client.mongoose = require('./util/mongoConnect');
client.mongoose.init();
const fs = require("fs");
client.commands = new Collection();
client.aliases = new Collection();
require('./util/functionHandler')(client);
fs.readdirSync("./commands").filter(file => file.endsWith(".js")).forEach(file => {
    let command = require(`./commands/${file}`);
    client.commands.set(command.conf.command, command);
    console.log(`[Command] ${file.replace(".js", "")} command loaded.`);
    command.conf.aliases.forEach(aliases => client.aliases.set(aliases, command));
});

fs.readdirSync("./events").filter(file => file.endsWith(".js")).forEach(file => {
    let event = require(`./events/${file}`);
    client.on(event.conf.event, event.execute);
    console.log(`[Event] ${file.replace(".js", "")} event loaded.`);
});

client.login(config.Token)
    .then(c =>
     console.log(`Bot ${client.user.tag} Olark giriş yaptı!`))
     .catch(err =>
     console.error(`Bota giriş yaparken hata verdi!`));
