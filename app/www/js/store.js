class Store {  
  constructor() {
    var Configs;
    this.Configs= new Object();
  }  
  save(item,val){
    this.Configs[item] = val;
    localStorage.setItem("Passwords", JSON.stringify(this.Configs));    
  }
  loadConfig(){    
    var result = JSON.parse(localStorage.getItem("Passwords"));
    if (result != null) {
      this.Configs = result;
    }    
    return this.Configs;   
  }
  clearStorage(){
    localStorage.clear();
  }
}