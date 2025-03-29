const cryptoHash=require('crypto');

const nodes=(input)=>{
    const wallet_pk=input;
    var hash=cryptoHash.createHash('ripemd160');
    data=hash.update(wallet_pk);
    gen_hash= data.digest('hex');
    return gen_hash;
}


module.exports=nodes;
