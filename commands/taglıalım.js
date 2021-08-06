const Discord = require('discord.js');
const kayitlar = require('../Schemas/kayitlar');
const isimler = require('../Schemas/isimler');
const ref = require('../refrance');
const tagliAlim = require('../Schemas/tagliAlim');

exports.execute = async (client, message, args, embed) => {
if(!message.member.hasPermission("ADMINISTRATOR") &&!ref.KayitSistem.kurucuRoller.some(x => message.member.hasPermission(x))) return;
const secim = args[0]
if(!secim || !["false","true"].includes(args[0])) return message.channel.send(`**Hata**: \`Geçerli argüman girmen gerekli ('false'=> kapat ya da 'true'=> aç)\``).then(x => x.delete({timeout: 6000}))

await tagliAlim.findOne({guildID: message.guild.id}, async (err, res) =>{
    if(!res){
        const yeni = await new tagliAlim({
            guildID: message.guild.id,
            tagli: secim
        })
        yeni.save().catch(e => (`Yeni taglı alım datasını kaydederken hata verdi! \`${e}\``))
    }else {
        res.tagli = secim
        res.save().catch(e => (`Taglı alım işleminde hata! \`${e}\``))
    }
    if(secim == "false"){
        return message.channel.send(`Başarıyla taglı alımı kapatmış bulunmaktayım!`).then(x => x.delete({timeout: 6000}))
    }else if(secim == "true"){
        return message.channel.send(`Başarıyla taglı alımı açmış bulunmaktayım!`).then(x => x.delete({timeout: 6000}))
    }
})
}


exports.conf = {
  command: 'taglıalım',
  description: '',
  aliases: ["taglı-alım","tagli-alim","taglialim"]
}