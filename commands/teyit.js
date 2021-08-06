const Discord = require('discord.js');
const kayitlar = require('../Schemas/kayitlar');
const ref = require('../refrance');
const isimler = require('../Schemas/isimler');

exports.execute = async (client, message, args, densembed) => {

const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
await kayitlar.findOne({ guildID: message.guild.id, userID: uye.id}, async (err,res) => {
    if(!res) return message.channel.send(densembed.setDescription(`**Hata**: \`${uye.id} üyenin kayıt hiç bilgisi bulunmamaktadır!\``))
    let kayitEdilen = await shuffle(res.kayıtlar.map(x => `<@${x}>`))
    if(kayitEdilen > 10) kayitEdilen.length = 10
    
    message.channel.send(densembed.setDescription(`
    ${uye} üyenin \`${res.erkek}\` erkek , \`${res.kadın}\` kadın, \`${res.erkek+res.kadın}\` toplamda kayıt yapmış.
    Kayıt ettiği bazı kişiler:
    ${kayitEdilen.join("\n")}
    `)).then(m => m.delete({timeout: 10000}))
})
return;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
        return array;
}


exports.conf = {
  command: 'teyit',
  description: '',
  aliases: ["teyitlerim","kayitbilgi","kaytibilgim"]
}