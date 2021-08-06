const {Discord, MessageEmbed} = require('discord.js');
const ref = require('../refrance');
const isimler = require('../Schemas/isimler');
const kayitlar = require('../Schemas/kayitlar');

exports.execute = async (client, message, args, embed) => {
    if(!message.member.hasPermission(8) &&!ref.KayitSistem.kurucuRoller.some(x => message.member.roles.cache.has(x)) && !ref.KayitSistem.registerci.some(x => message.member.roles.cache.has(x))) return;
  const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
  if(!uye) return message.channel.send("**Hata**: `İsim geçmişine baka bilmem için bir üye belirt lütfen!`").then(x => x.delete({timeout: 10000}))
  await isimler.findOne({guildID: message.guild.id, userID: uye.id}, async (err, res) => {
      if(!res) return message.channel.send("**Hata**: `Belirttiğiniz üyeninin isim geçmişi bulunmamaktadır!`").then(x => x.delete({timeout: 10000}))
      let gecmis = res.isimler.map(x=> `\`${ref.Sunucu.tag} ${x.isim}\`  (${x.cinsiyet}) <@${x.yetkili}>`)
      if(gecmis > 15) gecmis = 15
      message.channel.send(embed.setDescription(`
      ${uye} Üyenin toplamda \`${res.isimler.length}\` isim kayıtı bulunuyor!

      ${gecmis.join("\n")}`)).then(m => m.delete({timeout: 10000}))
  })
  message.react('✅')
  return;
}
  
  
exports.conf = {
    command: 'isimler',
    description: '',
    aliases: []
}