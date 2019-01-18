class File {
  readFile(JsonClass,data,file,inApp = true){
    var Format = JsonClass.readFormat;
    var textType = /text.*/;
    if (file.type.match(textType)) {
      var reader = new FileReader();
      reader.readAsText(file);
      reader.onload = function(e) {
        var result;
        var Passwords = reader.result;
        if (Format == "JSON") {    
          Store.save('passwords',Passwords);
          return JsonClass.readJsonDecrypted(JsonClass,Passwords,inApp);  
        } else {   
          Store.save('passwords',Passwords);
          return JsonClass.readJsonCrypted(JsonClass,Passwords,inApp);          
        }        
      }      
      //createOs();
    } else {
      app.showToast('error','<strong>Error!</strong> File not supported!');
    }    
  }
  writeFile(content, filename='pass',extension='txt') {
    var dom = document.createElement('a');
   
    var blob = new Blob([content],{type: 'text/csv;charset=utf-8;'});
    var url = URL.createObjectURL(blob);
    dom.href = url;
    dom.setAttribute('download', filename+'.'+extension);
    dom.click();
  }
} 