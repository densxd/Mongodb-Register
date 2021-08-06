const Discord = require('discord.js');
const ref = require('../refrance');
const isimler = require('../Schemas/isimler');
const kayitlar = require('../Schemas/kayitlar');

exports.execute = async (client, message, args, embed) => {
 if(!ref.KayitSistem.kurucuRoller.some(x => message.member.hasPermission(8))) return;
const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0])
if(!uye) return message.channel.send("**Hata**: `Kayıtsıza atmak istediğin kullanıcıyı düzgünce belirt ve tekrar dene!`").then(m => m.delete({timeout: 5000}))
if(uye.roles.cache.has(ref.KayitSistem.unregisterPermi)) return message.channel.send("**Hata**: `Kayıtsıza atmak istediğin kişi zaten kayıtsız durumda!`").then(m => m.delete({timeout: 5000}))
if (message.member.roles.highest.position <= message.guild.members.cache.get(uye.id).roles.highest.position) return message.channel.send("**Hata**: `Kendi rolünden yüksek kişilere işlem uygulayamazsın!`").then(m => m.delete({timeout: 5000}))
const sebep = args[1] || "Belirtilmedi"
message.react('✅')
message.channel.send(embed.setDescription(`
✅ ${uye} (\`${uye.id}\`) başarıyla **${sebep}** sebebiy'le <@${message.member.id}> tarafından __kayıtız'a__ atıldı!
`)).then(m => m.delete({timeout: 10000}))
uye.roles.set([ref.KayitSistem.unregisterPermi]).catch(e => console.log(`Kayıtsız işleminde üyeye unregister setlemekte hata verdi! \`${e}\``))
if(uye.manageable) uye.user.username.includes(ref.Sunucu.tag) ? await uye.setNickname(`${densref.Tag} İsim | Yaş`) : await uye.setNickname(`${densref.ikinciTag} İsim | Yaş`).catch(d => console.log(`Kayıtsıza atarken isim değiştirme işleminde hata ${e}`))
return;
}


exports.conf = {
  command: 'kayıtsız',
  description: '',
  aliases: ["kayitsiz","unregister"]
}