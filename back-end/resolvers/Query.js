const memo  = require('./Memo')

const Hangul = require('hangul-js');
module.exports = {
    translation: async(parent,args,{ db }) => {
        let ret = []
        args.code.forEach(element => {
            ret.push(memo[element])
        });
        const word = Hangul.assemble(ret); // '가나다'
        console.log(word)
        return word
    }
}