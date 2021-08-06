const mongoose = require('mongoose');
const dens = require('../config');
module.exports = {
 init : () =>{
     const dbAyar = {
         useNewUrlParser: true,
         useUnifiedTopology: true,
         autoIndex: true,
          reconnectTries: Number.MAX_VALUE,
          reconnectInterval: 500,
          poolSize: 5,
          connectTimeoutMS: 10000,
          family: 4
     };

     mongoose.connect(dens.mongoConnect, dbAyar)

     mongoose.connection.on('connected', () => {
         console.log(`\n Mongo bağlantısı kuruldu!`);
     });

     mongoose.connection.on('err', err => {
         console.error(`Mongo bağlantı hatası: \n${err.stack}`);
     });

     mongoose.connection.on('disconnected', () => {
         console.warn('Mongo bağlantısı kesildi!');
     });
 }
}

