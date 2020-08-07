const memo  = require('./Memo')
const fs = require('fs');
const request = require('request')
const Hangul = require('hangul-js');

const CLIENT_ID = process.env.CLIENT_ID
const CLEENT_SECRET = process.env.CLIENT_SECRET
module.exports = {
    translation: async(parent,args,{ db }) => {
        let ret = []
        args.code.forEach(element => {
            if(memo[element] == undefined) return;
            ret.push(memo[element])
        });
        const word = Hangul.assemble(ret); // '가나다'
        let api_url = 'https://naveropenapi.apigw.ntruss.com/voice/v1/tts';
        const { insertedId } = await db.collection('audio').insertOne({text:args.text})
        let options = {
            url:api_url,
            form:{speaker:'mijin',speed:'0',text:word},
            headers:{'X-NCP-APIGW-API-KEY-ID':CLIENT_ID,'X-NCP-APIGW-API-KEY':CLEENT_SECRET},
        }

        let writeStream = fs.createWriteStream(`./audio/${insertedId}.mp3`);
        let _req = request.post(options).on('response', function(response){
            console.log(response.statusCode)
            console.log(response.headers['content-type'])
        })
        _req.pipe(writeStream)
        return {word:word,audio:`http://localhost:7777/audio/${insertedId}.mp3`}
    }
}