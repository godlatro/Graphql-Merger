/* Godlatro Graphql merger v.1.1.4 */
const { readFileSync, readdirSync } = require('fs');
const merger = (options) => {

  const Debug = options && options.debug && options.debug || false;
  const Dir = options && options.dir && options.dir || this.__dirname;
  const FType = options && options.type && options.type || 'graphql';
  if(Debug){
    console.log('Merger directory ', Dir);
  }

  const Querys = [];
  const Muts = [];
  const files = readdirSync(Dir)
  .filter(s => s.endsWith(`.${FType}`))
  .map(file => {
    if(!file) return null;
    let Cont = readFileSync(`${Dir}/${file}`, { encoding: 'utf8' })
    .replace(/\t/g, " ")
    .replace(/\t\t/g, " ")
    .replace(/  /g, " ")
    .replace(/\s\s/g, "\n")
    .replace(/\r\n/g, "\n")
    .replace(/\n\n/g, "\n")
    .replace(/^\s$\s/g, "")
    .replace(/^ /g, "")
    .replace(/^\s/g, "");
    let Query = Cont.match(/(type[\s]+Query[\s]+{)[\s\S]*?}/g);
    let Mutation = Cont.match(/(type[\s]+Mutation[\s]+{)[\s\S]*?}/g);
    Cont = Cont.replace(/#.*/gi,'');
    if(Debug){
      console.log('merger debug for file', file)
      console.log('merger Qery =',Query)
      console.log('merger Mutation =',Mutation)
      console.log('merger file debug end')
    }

      Query && Query.length && Query.forEach(e => {
        let S = e.replace(/type[\s]+Query[\s]+{/g,'')
        .replace(/}/g,'');
        Querys.push(S);
      });

      Mutation && Mutation.length && Mutation.forEach(e => {
        let S = e.replace(/type[\s]+Mutation[\s]+{/g,'')
        .replace(/}/g,'');
        Muts.push(S);
      });

    Cont = Cont.replace(/(type[\s]+Query[\s]+{)[\s\S]*?}/g,'')
    .replace(/(type[\s]+Mutation[\s]+{)[\s\S]*?}/g, '');
    return Cont;
  })
  .join('');

  if(!files) return null;
  const Q = `\n type Query{${Querys.join('')}} \n`;
  const M = `\n type Mutation{${Muts.join('')}} \n`;
  const typeDefs = `${files} \n ${Querys && Querys.length && Q} \n ${Muts && Muts.length && M}`;
  
  if(Debug){
    console.log('merger debug for typedefs')
    console.log(typeDefs)
    console.log('merger end')
  }

  return typeDefs;
}

module.exports.merger = merger;