/* Godlatro Graphql merger v.2.2.2 */
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
  const Subs = [];
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

  if(Debug){
    console.log('++++++++++Old+++++++++++++++++');
    console.log(files)
    console.log('++++++++++Old+++++++++++++++++');
  }

  if(!files) return null;

  if(Replace){
    files = files
    .replace(/#.*/g,'')
    .replace(/:/gi,': ')
    .replace(/\(\):/gi,': ')
    .replace(/\(\)/gi,'')
    .replace(/}/gi,'}\n')
    .replace(/{/gi,' {\n')
    .replace(/\|\n/g,'| ')
    .replace(/\|/g,' | ')

    .replace(/\t/gi,' ')
    .replace(/    /gi,' ')
    .replace(/  /gi,' ')
    .replace(/[\r\n]+/gi,'\n')
    
    .replace(/(?:\r\n|\r|\n)/gi,'\n')
    .replace(/[\n]+/gi,'\n')
    
    .replace(/[,.]/gi,'')
    // .replace(/[^\w\d:{}\s=|\[\]!'"]/g,'');
  }
  
  // let alltype = files.match(/type.*{[\s\S]*?}/g) || [];
  // let allinput = files.match(/input.*{[\s\S]*?}/g) || [];
  // let allinterface = files.match(/interface.*{[\s\S]*?}/g) || [];
  // let allunion = files.match(/union.*=.*/g) || [];
  // let allenum = files.match(/enum.*{[\s\S]*?}/g) || [];
  // All.push(...alltype, ...allinput, ...allinterface, ...allunion, ...allenum);
  // let AllFiles = All.join('\n');
  

  let q = files.match(/type\s*Query\s*{[\s\S]*?}/g);
  let m = files.match(/type\s*Mutation\s*{[\s\S]*?}/g);
  let s = files.match(/type\s*Subscription\s*{[\s\S]*?}/g);

  files = files.replace(/type\s*Query\s*{[\s\S]*?}/g, '');
  files = files.replace(/type\s*Mutation\s*{[\s\S]*?}/g, '');
  files = files.replace(/type\s*Subscription\s*{[\s\S]*?}/g, '');
  files = files.replace(/[\n]+/gi,'\n');

  q && q.length && q.forEach(e => {
        let S = e.replace(/type\s*Query\s*{/g,'\n')
        .replace(/}/g,'\n');
        if(!S) return null;
        Ques.push(S);
      });
  m && m.length && m.forEach(e => {
        let S = e.replace(/type\s*Mutation\s*{/g,'\n')
        .replace(/}/g,'\n');
        if(!S) return null;
        Muts.push(S);
      });
  s && s.length && s.forEach(e => {
        let S = e.replace(/type\s*Subscription\s*{/g,'\n')
        .replace(/}/g,'\n');
        if(!S) return null;
        Subs.push(S);
      });

  const Q = `\ntype Query {\n${Ques.join('\n').replace(/[\n]+/gi,'\n')}} \n`;
  const M = `\ntype Mutation {\n${Muts.join('\n').replace(/[\n]+/gi,'\n')}} \n`;
  const S = `\ntype Subscription {\n${Subs.join('\n').replace(/[\n]+/gi,'\n')}} \n`;
  if(Debug){
    console.log('++++++Debug++++++');
    console.log(Q)
    console.log(M)
    console.log(S)
    console.log('++++++Debug++++++');
  }
  const typeDefs = `${files}\n${Ques && Ques.length && Q || ''}\n${Muts && Muts.length && M || ''}\n${Subs && Subs.length && S || ''}`;
  
  if(Debug){
    console.log('++++++++++result+++++++++++++++++');
    console.log(typeDefs)
    console.log('++++++++++result+++++++++++++++++');
  }

  return typeDefs;
}

module.exports.merger = merger;