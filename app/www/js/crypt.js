class Crypt { 
  constructor() {
    var Obj;  
  }
  decryptJSON(result,passPhrase) {
    var result = this.decrypt(result, passPhrase);
    if(!result){return false;}
    this.Obj = result;
    this.Obj = jQuery.parseJSON(this.Obj);
    return this.Obj;
  }
  encrypt(val,passPhrase) {
    var encrypted = CryptoJS.AES.encrypt(val, passPhrase);
    var plaintext = encrypted.toString(CryptoJS.enc.Utf8);
    //console.log(encrypted.toString());		
    return encrypted;
  }
  decrypt(encrypted, passPhrase) {
    var decrypted = CryptoJS.AES.decrypt(encrypted, passPhrase);
    try
    {
        var plaintext = decrypted.toString(CryptoJS.enc.Utf8);
        return (plaintext);
    }
    catch (e)
    {
      console.log(e);
        return false;
    }        
  }
}