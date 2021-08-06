const Discord = require('discord.js');
const ref = require('../refrance');
const isimler = require('../Schemas/isimler');
const kayitlar = require('../Schemas/kayitlar');

exports.execute = async (client, message, args, embed) => {

let kayitTop = await kayitlar.find({guildID: message.guild.id}).sort({toplam : -1}).exec()
if(!kayitTop.length) return message.channel.send(embed.setDescription(`Sunucu'da herhangi bir **Kayıt** verisi bulunamadı!`)).then(d => 
    d.delete({timeout: 5000}));
kayitTop = kayitTop.filter(a =>
     message.guild.members.cache.has(a.userID) && a.toplam).splice(0, 15)
message.channel.send(embed.setTitle(message.guild.name, "Teyit Sıralaması").setDescription(kayitTop.map((a, b) =>
`<@${a.userID}>: \`${a.erkek}\` erkek, \`${a.kadın}\` kadın, \`${a.toplam}\` toplam`)))
}


exports.conf = {
  command: 'topteyit',
  description: '',
  aliases: ["teyittop"]
}