/* Godlatro Graphql merger v.1.1.4 */
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

  const Querys = [];
  const Muts = [];
  const All = [];
  const Files = [];

  let files = readdirSync(Dir)
  .filter(s => s.endsWith(`.${FType}`))
  .map(file => {
    if(!file) return null;
    let Cont = readFileSync(`${Dir}/${file}`, { encoding: 'utf8' });
    // Files.push(Cont);

    if(Debug){
      console.log('+++++++++++++++++++++++++++');
      console.log('file', file);
      console.log('^^^^');
      console.log(Cont)
      console.log('+++++++++++++++++++++++++++');
    }
    // Cont.replace(/#.*/g,'');
    // // .replace(/[,.]/gi,'')
    // Cont.replace(/[^\w\d:{}\s=|\[\]!]/gi,'');

    // .replace(/[\s]+type/g, "\ntype")
    // .replace(/[\s]+input/g, "\ninput")
    // .replace(/.*type/g, "type")
    // .replace(/.*input/g, "input")

    // .replace(/\t/g, " ")
    // .replace(/\t\t/g, " ")
    // .replace(/  /g, " ")
    // .replace(/\s\s/g, "\n")
    // .replace(/\r\n/g, "\n")
    // .replace(/\n\n/g, "\n")
    // .replace(/^\s$\s/g, "")
    // .replace(/^ /g, "")
    // .replace(/^\s/g, "");


    // let alltype = Cont.match(/type.*{[\s\S]*?}/g) || [];
    // let allinput = Cont.match(/input.*{[\s\S]*?}/g) || [];
    // let allinterface = Cont.match(/interface.*{[\s\S]*?}/g) || [];
    // let allunion = Cont.match(/union.*=.*/g) || [];
    // let allenum = Cont.match(/enum.*{[\s\S]*?}/g) || [];

    // All.push(...alltype, ...allinput, ...allinterface, ...allunion, ...allenum);
     
    
    // console.log('+++++++++++++++++++++++++++');
    // console.log(All);
    // console.log('+++++++++++++++++++++++++++');
    


    // let Query = Cont.match(/(type.*Query.*{)[\s\S]*?}/g);
    // let Mutation = Cont.match(/(type.*Mutation.*{)[\s\S]*?}/g);

    // if(Debug){
    //   console.log('+++++++++++++++++++++++++++');
    //   console.log('merger debug for file', file)
    //   console.log('merger debug for file', Cont )
    //   console.log('merger Qery =',Query)
    //   console.log('merger Mutation =',Mutation)
    //   console.log('merger file debug end')
    //   console.log('+++++++++++++++++++++++++++');
    // }

    //   Query && Query.length && Query.forEach(e => {
    //     let S = e.replace(/type[\s]+Query[\s]+{/g,'')
    //     .replace(/type.*Query.*{/g,'')
    //     .replace(/}/g,'');
    //     Querys.push(S);
    //   });

    //   Mutation && Mutation.length && Mutation.forEach(e => {
    //     let S = e.replace(/type[\s]+Mutation[\s]+{/g,'')
    //     .replace(/type[\s]+Mutation.*{/g,'')
    //     .replace(/}/g,'');
    //     Muts.push(S);
    //   });

    // Cont = Cont.replace(/(type[\s]+Query[\s]+{)[\s\S]*?}/g,'')
    // .replace(/(type[\s]+Mutation[\s]+{)[\s\S]*?}/g, '');
    return Cont;
  })
  .join('\n');

  if(!files) return null;

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
  
  let alltype = files.match(/type.*{[\s\S]*?}/g) || [];
  let allinput = files.match(/input.*{[\s\S]*?}/g) || [];
  let allinterface = files.match(/interface.*{[\s\S]*?}/g) || [];
  let allunion = files.match(/union.*=.*/g) || [];
  let allenum = files.match(/enum.*{[\s\S]*?}/g) || [];

  All.push(...alltype, ...allinput, ...allinterface, ...allunion, ...allenum);

  let AllFiles = All.join('\n');
  
  AllFiles = AllFiles

  
  console.log('++++++++++++files+++++++++++++++');
  console.log(AllFiles);
  console.log('++++++++++++files+++++++++++++++');
  

  let q = AllFiles.match(/(type.*Query.*{)[\s\S]*?}/g);
  let m = AllFiles.match(/(type.*Mutation.*{)[\s\S]*?}/g);
      Query && Query.length && Query.forEach(e => {
        let S = e.replace(/type[\s]+Query[\s]+{/g,'')
        .replace(/type.*Query.*{/g,'')
        .replace(/}/g,'');
        Querys.push(S);
      });

      Mutation && Mutation.length && Mutation.forEach(e => {
        let S = e.replace(/type[\s]+Mutation[\s]+{/g,'')
        .replace(/type[\s]+Mutation.*{/g,'')
        .replace(/}/g,'');
        Muts.push(S);
      });


  const Q = `\n type Query{${Querys.join('')}} \n`;
  const M = `\n type Mutation{${Muts.join('')}} \n`;
  const typeDefs = `${files}\n${Querys && Querys.length && Q || ''}\n${Muts && Muts.length && M || ''}`;
  
  if(Debug){
    console.log('+++++++++++++++++++++++++++');
    console.log('merger debug for typedefs')
    console.log(typeDefs)
    console.log('merger end')
    console.log('+++++++++++++++++++++++++++');
  }

  return typeDefs;
}

module.exports.merger = merger;