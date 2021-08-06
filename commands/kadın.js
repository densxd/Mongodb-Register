const {Discord, MessageEmbed} = require('discord.js');
const ref = require('../refrance');
const isimler = require('../Schemas/isimler');
const kayitlar = require('../Schemas/kayitlar');
const tagliAlim = require('../Schemas/tagliAlim');

exports.execute = async (client, message, args, embed) => {
if(!ref.KayitSistem.registerci.some(x => message.member.roles.cache.has(x)) && !message.member.hasPermission(8)) return;
const embd = new MessageEmbed().setColor(ref.Embed.color).setFooter(ref.Embed.altYazi)
const uye = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
if(!uye) return message.channel.send("**Hata**: `Kaydetmek istediğin kullanıcıyı düzgünce belirt ve tekrar dene!`");
if(uye.id == message.member.id) return message.channel.send("**Hata**: `Kendini kaydetemezsin! bu yüzden işlem iptal edildi.`").then(m => m.delete({timeout: 5000}))
if(ref.KayitSistem.erkekPermi.some(de => uye.roles.cache.has(de))) return message.channel.send("**Hata**: `Kayıt etmeye çalıştığınız üye zaten kayıtlı durum'da!`").then(m => m.delete({timeout: 5000}))
if(ref.KayitSistem.kadinPermi.some(de => uye.roles.cache.has(de))) return message.channel.send("**Hata**: `Kayıt etmeye çalıştığınız üye zaten kayıtlı durum'da!`").then(m => m.delete({timeout: 5000}))
if(uye.roles.cache.has(ref.Sunucu.jailedRole)) return message.channel.send(embed.setDescription('Cezalı olan birini kayıt edemezsin!'))
args = args.filter(a => a !== "" && a !== " ").splice(1);
const isim = args.filter(arg => isNaN(arg)).map(arg => arg.charAt(0).replace('i', "İ").toUpperCase()+arg.slice(1)).join(" ");
const yas = args.filter(arg => !isNaN(arg))[0] || undefined;
if(!isim)return message.channel.send("**Hata**: `Kaydetmek istediğin isim ve yaşı belirtmelisin!`").then(m => m.delete({timeout: 5000}))
if(!yas)return message.channel.send("**Hata**: `Kaydetmek istediğin isim ve yaşı belirtmelisin!`").then(m => m.delete({timeout: 5000}))

await tagliAlim.findOne({guildID: message.guild.id},async (err, db) =>{
    if(!db){
        const yeniTagli = new tagliAlim({
            guildID: message.guild.id,
            tagli: false
        })
        yeniTagli.save().catch(e => console.log(e))
    }
})
const tagli = await tagliAlim.findOne({guildID: message.guild.id, tagli: true});
if(tagli) {
    if(!message.member.hasPermission(8) && !ref.KayitSistem.kurucuRoller.some(x => message.member.roles.cache.has(x)) && !uye.user.username.includes(ref.Sunucu.tag) && !uye.roles.cache.has(ref.Sunucu.vipRole) &&!uye.roles.cache.has(ref.Sunucu.boosterRole))
        return message.channel.send('Hey! Sunucu şuanda taglı alımdadır. Üyeye tag Aldırmayı denemelisin :)')
}
await kayitlar.findOne({guildID: message.guild.id, userID: message.member.id}, async (err, db)=>{
    if(db){
        if(db.kayıtlar.includes(uye.id)){
            db.kadın
            db.toplam
            db.save().catch(e => console.log(e))
        }else{
            db.kayıtlar.push(uye.id)
            db.kadın = db.kadın+1
            db.toplam = db.toplam+1
            db.save().catch(e => console.log(e))
        }
        
    }else if(!db){
        let array = [];
        array.push(uye.id)
        const yd = await new kayitlar({
            guildID: message.guild.id,
            userID: message.member.id,
            erkek: 0,
            kadın: 1,
            toplam: 1,
            kayıtlar: array
        })
        yd.save().catch(e=>console.log(e))
        }
    })

    if(uye.user.username.includes(ref.Sunucu.tag)){
        await uye.setNickname(`${ref.Sunucu.tag} ${isim} | ${yas}`).catch(e=> console.log(e))
    }else{
        await uye.setNickname(`${ref.Sunucu.ikinciTag} ${isim} | ${yas}`)
    }
    if(uye.roles.cache.has(ref.Sunucu.boosterRole)){
        await uye.roles.add(ref.KayitSistem.kadinPermi)
        await uye.roles.remove([ref.KayitSistem.unregisterPermi])
    }else if(uye.roles.cache.has(ref.Sunucu.vipRole)){
        await uye.roles.set(ref.KayitSistem.kadinPermi)
        await uye.roles.add(ref.Sunucu.vipRole)
    }else {
        await uye.roles.add(ref.KayitSistem.kadinPermi)
    }
    await isimler.findOne({guildID: message.guild.id, userID: uye.id}, async(err, db)=>{
        if(!db){
            let array = [];
            array.push({isim:`${isim} | ${yas}`, cinsiyet: "Kadın", yetkili: message.member.id})
            let yi = await new isimler({
                guildID: message.guild.id,
                userID: uye.id,
                isimler: array
            })
            yi.save().catch(e=> console.log(e))
        }else{
            db.isimler.push({isim:`${isim} | ${yas}`, cinsiyet: "Kadın", yetkili: message.member.id})
            db.save().catch(e=> console.log(e))
        }
    })
    isimler.findOne({guildID: message.guild.id, userID: uye.id}, async (err,db) =>{

        let isimmap;
        if(!db) isimmap = "`Üyenin isim geçmişi bulunmuyor!`";
        if(db) isimmap = `Bu üyenin \`${db.isimler.length}\` adet isim geçmişi görüntülendi!\n${db.isimler.map(x => `\`${ref.Sunucu.tag} ${x.isim}\` (${x.cinsiyet})`).join("\n")}`
        
        
         message.channel.send(embd.setDescription(`
         ${uye} İsimli Kullanıcı ${message.author} Tarafından \`${isim} | ${yas}\` Adıyla Sunucuya **Kadın** Olarak Kayıt Edildi

        ${isimmap}`)).then(x=> x.delete({timeout: 5000}))
    })
    message.react('✅')
}


exports.conf = {
  command: 'kadın',
  description: '',
  aliases: ["k","wonan","kiz","kız"]
}