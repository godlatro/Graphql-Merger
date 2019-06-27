/* Godlatro Graphql merger v.2.1.3 */
const { readFileSync, readdirSync } = require('fs');
const merger = (options) => {

  const Debug = options && options.debug && options.debug || false;
  const Replace = options && options.replace && options.replace || true;
  const Dir = options && options.dir && options.dir || this.__dirname;
  const FType = options && options.type && options.type || 'graphql';
  if(Debug){
    console.log('+++++++++++++++++++++++++++');
    console.log('Merger directory ', Dir);
  }

  const Ques = [];
  const Muts = [];
  const All = [];

  let files = readdirSync(Dir)
  .filter(s => s.endsWith(`.${FType}`))
  .map(file => {
    if(!file) return null;
    let Cont = readFileSync(`${Dir}/${file}`, { encoding: 'utf8' });
    // Files.push(Cont);

    if(Debug){
      console.log('++++++++++++file+++++++++++++++',file);
      console.log(Cont)
      console.log('++++++++++++file+++++++++++++++');
    }

    return Cont;
  })
  .join('\n');

  if(!files) return null;

  if(Replace){
    files = files
    .replace(/#.*/g,'')
    .replace(/:/gi,': ')
    .replace(/}/gi,'}\n')
    .replace(/{/gi,' {\n')
    
    .replace(/\t/gi,' ')
    .replace(/    /gi,' ')
    .replace(/  /gi,' ')
    .replace(/[\r\n]+/gi,'\n')
    
    .replace(/(?:\r\n|\r|\n)/gi,'\n')
    .replace(/[\n]+/gi,'\n')
    
    .replace(/\|\n/g,'| ')
    .replace(/\|/g,' | ')
    
  
    .replace(/[,.]/gi,'')
    // .replace(/[^\w\d:{}\s=|\[\]!]/g,'');
  }
  
  let alltype = files.match(/type.*{[\s\S]*?}/g) || [];
  let allinput = files.match(/input.*{[\s\S]*?}/g) || [];
  let allinterface = files.match(/interface.*{[\s\S]*?}/g) || [];
  let allunion = files.match(/union.*=.*/g) || [];
  let allenum = files.match(/enum.*{[\s\S]*?}/g) || [];
  All.push(...alltype, ...allinput, ...allinterface, ...allunion, ...allenum);
  let AllFiles = All.join('\n');
  
  AllFiles = AllFiles

  let q = AllFiles.match(/(type[\s]*Query[\s]*{)[\s\S]*?}/g);
  let m = AllFiles.match(/(type[\s]*Mutation[\s]*{)[\s\S]*?}/g);

  q && q.length && q.forEach(e => {
        let S = e.replace(/type[\s]*Query[\s]*{/g,'')
        .replace(/}/g,'\n');
        Ques.push(S);
      });
  m && m.length && m.forEach(e => {
        let S = e.replace(/type[\s]*Mutation[\s]*{/g,'')
        .replace(/}/g,'\n');
        Muts.push(S);
      });


  const Q = `\n type Query{${Ques.join('')}} \n`;
  const M = `\n type Mutation{${Muts.join('')}} \n`;
  const typeDefs = `${files}\n${Ques && Ques.length && Q || ''}\n${Muts && Muts.length && M || ''}`;
  
  if(Debug){
    console.log('++++++++++result+++++++++++++++++');
    console.log(typeDefs)
    console.log('++++++++++result+++++++++++++++++');
  }

  return typeDefs;
}

module.exports.merger = merger;