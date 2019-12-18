'use strict';
var elasticsearch = require('elasticsearch');
var client = new elasticsearch.Client({
  host: process.env.ELASTICSEARCH_DOMAINE,
  apiVersion: '7.1', 
});

const index = "users";
const type = "user";

module.exports.main = async event => {

  console.log(JSON.stringify(event));

  for(var i= 0; i< event.Records.length; i++) {
    const record = event.Records[i];
    try{
      if(record.eventName === 'INSERT' || record.eventName === 'MODIFY') {
        await indexData(record.dynamodb.NewImage);
      } else {
        await remove(record.dynamodb.OldImage);
      }
      console.log(`success processing record`);
    } catch(e) {     
      console.log(`fail processing record`);
    }
   
  }
};

const indexData = async (image) => {
  return await client.index({
    index: index,
    type:  type,
    id: image.id.S,
    body: {
      name: image.name.S,
      age: image.age.N
    }
  });
}

const remove = async (oldImage) => {
  return await client.delete({
    index: index,
    type: type,
    id: oldImage.id.S
  });
}