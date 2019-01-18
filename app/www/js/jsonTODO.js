class Json {  
  constructor() {
    var readFormat;// JSON OR CRYPT
    var Obj;
  }  

  readJsonDecrypted(JsonClass,result,inApp = true){
    result = JsonClass.decodeJson(JsonClass,result);
    if(result){
      this.Obj = result;
    }else{
      app.showToast('error','<strong>Error!</strong> Senha ou Arquivo inválido.');
      return false;
    }
    if(inApp){
      JsonClass.finishLoad();
    }else{    
      this.getCategories(this.Obj,true,true);
      jQuery("#items").append('<li><a href="#'+this.Obj.Passwords+'">'+this.Obj.Passwords+'</a></li>');
    }
  }

  readJsonCrypted(JsonClass,result,inApp = true){
    MasterPass = app.inputPass();
    result = Crypt.decryptJSON(result,MasterPass);
    if(!result){
      app.showToast('error','<strong>Error!</strong> Senha ou Arquivo inválido.');
      return false;
    }
    this.Obj = result;   
    if(inApp){
      this.Obj = JsonClass.splitJson(this.Obj);
      JsonClass.finishLoad();
    }else{      
      this.getCategories(this.Obj,true,true);
      jQuery("#items").append('<li><a href="#'+this.Obj.Passwords+'">'+this.Obj.Passwords+'</a></li>') 
    }
  }

  readJsonCryptedbyItems(result,MasterPass,Item){
    if(!MasterPass){
      Item.MasterPass = Item.inputPass();
      MasterPass = Item.MasterPass;
    }
    result = Crypt.decryptJSON(result,MasterPass);        
    if(!result){
      Item.showToast('error','<strong>Error!</strong> Senha ou Arquivo inválido.');
      Item.MasterPass = "";      
      return false;
    }
    this.Obj = result;        
    //TODO getCategories chama sbubCreate que salva cada item descriptografado
    this.getCategories(this.Obj,true,false);
    //Item.tbItems = Item.tbItems.passwords;
    Item.save();
  }

  finishLoad(){    
    app.loadJson(this.Obj); 
    app.loadView();    
    createOs();    
    return true;
  }

  decodeJson(JsonClass,json){
    if(JsonClass.isJson(json)){
      return JSON.parse(json);
    }else{      
      return false;
    }
    
  }

  encodeJson(json){
    return JSON.stringify(json);
  }

  assignValues(data, key) {
    var categories = data.Entry[key].Categories.split(",");
    var changeFather = false;
    var changeChild = false;
    if (jQuery("#categoryFather").val() != categories[0]) {
        changeFather = true;
    }
    if (jQuery("#categoryChild").val() != categories[1]) {
        changeChild = true;
    }
    changeCategory(changeFather, changeChild, jQuery("#categoryFather").val(), jQuery("#categoryChild").val(), categories);
    data.Entry[key].Title = jQuery("#title").val();
    data.Entry[key].Desc = jQuery("#desc").val();
    data.Entry[key].Link = jQuery("#link").val();
    data.Entry[key].Credentials.Login = jQuery("#login").val();
    data.Entry[key].Credentials.Pass = jQuery("#pass").val();
    return data;
  }

  isJson(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
  }

  splitJson(Obj){
    var NewObj = ({"Passwords":[]});    
    jQuery.each(Obj.Passwords, function(index, data) {
      if (data.Entry) {
          jQuery.each(data.Entry, function(key2, data2) {              
            NewObj.Passwords.push(data2);             
          });
      } else {
          jQuery.each(data, function(key2, data2) {
              jQuery.each(data2.Entry, function(key3, data3) {                 
                NewObj.Passwords.push(data3);
              })
          });
      }
    });
    return NewObj;
  };

  joinJson(Obj){

  }

  getCategories(Obj,save = false,reload = false){
    var NewObj = ({"Passwords":[]});    
    jQuery.each(Obj.Passwords, function(key, data) {
      app.Categories.push(key);
      if (!data.Entry && Object.keys(data).length > 0) {
        var hasSub = 0;
        jQuery.each(data, function(key2, data2) {
            if (hasSub == 0) {
              app.Categories[key] = new Array;
                hasSub = 1;
            }
            app.Categories[key].push(key2);
            jQuery.each(data2, function(key3, data3) {
              NewObj.Passwords.push(data3);
              if(save){
                saveData(data3, key, key2);
              }
            });
        })
      } else {
        jQuery.each(data, function(key2, data2) {
          NewObj.Passwords.push(data2);
          if(save){
            saveData(data2, key, key2);
          }
        });
      };
    });
    if(reload){
      location.reload();
    }
  }

  createJsonExport() {
    var Result = {}
    Result.Passwords = {}
    for (var i in this.tbItems) {
        var ItemStored = JSON.parse(this.tbItems[i]);
        var Item = {};
        Item.Title = ItemStored.titulo;
        Item.Desc = ItemStored.desc;
        Item.Hidden = ItemStored.hidden;
        Item.Link = ItemStored.link;
        Item.Credentials = {}
        Item.Credentials.Login = ItemStored.login;
        Item.Credentials.Pass = ItemStored.pass;
        Item.id = parseInt(i) + 1;
        if (ItemStored.subcategory == "Entry" || ItemStored.subcategory == "") {
            Item.Categories = "root," + ItemStored.category;
        } else {
            Item.Categories = ItemStored.category + "," + ItemStored.subcategory;
        }

        // Item.selected_index = i;
        if (!Result.Passwords[ItemStored.category]) {
            Result.Passwords[ItemStored.category] = {}
        }
        if (ItemStored.subcategory == "Entry" || ItemStored.subcategory == "") {
            if (!Result.Passwords[ItemStored.category]['Entry']) {
                Result.Passwords[ItemStored.category]['Entry'] = new Array();
            }
            Result.Passwords[ItemStored.category]['Entry'].push(Item);
        } else {
            if (!Result.Passwords[ItemStored.category][ItemStored.subcategory]) {
                Result.Passwords[ItemStored.category][ItemStored.subcategory] = {};
                Result.Passwords[ItemStored.category][ItemStored.subcategory]['Entry'] = new Array();
            }
            Result.Passwords[ItemStored.category][ItemStored.subcategory]['Entry'].push(Item);
        }
    }
    //return (Result);
    return JSON.stringify(Result, null, 4);
  }
}

