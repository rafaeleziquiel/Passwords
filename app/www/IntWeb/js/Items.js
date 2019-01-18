var app;
Store = new Store();
Crypt= new Crypt();
Json = new Json();
File= new File();
class Item {
    constructor(titulo, desc, hidden, link, login, pass, category, subcategory) {
        var Categories = new Array;      
        var toggleCategory;
        var view = true;
        //Create or Update 
        var operation = "";
        //Indice do item selecionado da lista 
        var selected_index = "";
        //Recupera os dados armazenados
        var tbItems = "";
        var titulo;
        var desc;
        var link;
        var login;
        var pass;
        var category;
        var subcategory;
        var hidden;
        var JsonClass; 
        var app;
        var MasterPass;
        this.titulo = titulo;
        this.desc = desc;
        this.link = link;
        this.login = login;
        this.pass = pass;
        this.category = category;
        this.subcategory = subcategory;
        this.hidden = hidden;  
        this.JsonClass = JsonClass;   
        this.app = app;     
        this.MasterPass = MasterPass;        
    }

    /**
     * Inicializa 
     * */
    init() {      
      moveScroller();
      jQuery(scroller).children('thead').remove();
      jQuery("#app").fadeIn('slow');
      app = this;
      Item.app = app;
      //this.JsonClass = new Json();
      this.operation = "Create";
      this.selected_index = -1;
      if(!this.tbItems){
        this.tbItems = this.loadPass();
        //Converte string em objeto       
        this.tbItems = JSON.parse(this.tbItems);      
        //Se não há dados, iniciaiza um array vazio
        if (this.tbItems == null) {
            this.tbItems = [];
        }
      }
      this.loadCategories();
      this.read();
      this.loadFileInput();
      this.createSelects();      
    }

    /**
     * Procura pelo item
     * */
    search() {
        this.read(document.getElementById("txtPesquisa").value);
    }
    
    /**
     * Carrega o item
     * */
    loadPass() {
      /* OLD CODE WITHOUT CRYPT*/
      var string = JSON.stringify(this.tbItems);
      var Items = localStorage.getItem("tbItems", string);
      return Items; 
     // var string = JSON.stringify(this.tbItems);
      var crypted = localStorage.getItem("tbItems"/*, string*/);      
      if(crypted){    
        var Items = Crypt.decrypt(crypted,this.MasterPass);              
      }else{
        Items = null;
      }
      return Items;
    }


    /**
     * Salva o item
     * */
    save() {
      /* OLD CODE WITHOUT CRYPT*/
      var string = JSON.stringify(this.tbItems);
      localStorage.setItem("tbItems",string);
      return true; 
      var string = Json.encodeJson(this.tbItems);      
      var crypted = Crypt.encrypt(string,this.MasterPass);
      localStorage.setItem("tbItems",crypted);
      return true;
    }

    /**
     * Stub para criar os itens
     * */
    stubCreate() {
        var objItems = JSON.stringify({
            titulo: this.titulo,
            desc: this.desc,
            link: this.link,
            login: this.login,
            pass: this.pass,
            category: this.category,
            subcategory: this.subcategory,
            hidden: this.hidden
        });
        this.tbItems = this.loadPass();
        //Converte string em objeto 
        this.tbItems = JSON.parse(this.tbItems);
        //Se não há dados, iniciaiza um array vazio
        if (this.tbItems == null) {
            this.tbItems = [];
        }
        this.tbItems.push(objItems);        
        this.save();
        return true;
    }
    /**
     * Lê os passwords e cria a lista
     * */
    loadStored(){
      var stored = localStorage.getItem("Passwords");
      //Converte string em objeto 
      var parsed = JSON.parse(stored);
      this.tbItems = Json.readJsonCryptedbyItems(parsed.passwords,this.MasterPass, this);
      console.log(this.tbItems); 
     // console.log(this.tbItems);     
      this.init();
    }
    inputPass(type='load'){
      var MasterPass = prompt('Please enter your Master Password to '+type+' the Passwords', ' ');
      MasterPass = MasterPass.trim();        
      return MasterPass;
    }
    showToast(type,message){   
      //types: info, warning, error, success   
      toastr.options = {
        "closeButton": false,
        "debug": false,
        "newestOnTop": false,
        "progressBar": false,
        "positionClass": "toast-top-center",
        //top-right, bottom-right, bottom-left, top-left, top-full-width, bottom-full-width, top-center, bottom-center
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "1000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
      }
      toastr[type](message)
    }
    read(filter) {
      if(this.tbItems == '[]'){
        return;
      }
        this.cleanForm();
        var tblLista = document.getElementById("tblLista");
        tblLista.innerHTML = "";
        tblLista.innerHTML = "<thead>" + "	<tr>" + "	<th>#</th>" + "	<th>Título</th>" + "	<th>Descrição</th>" + "	<th>Link</th>" + "	<th>Actions</th>" + "	</tr>" + "</thead>" + "<tbody>" + "</tbody>";
        var content = "";
        var Items = "";
        if (filter) {
            Items = this.filter(filter);
        } else {
            Items = this.tbItems;
            Items = this.sortBy(Items);
        }        
        var subcatOld;
        var catOld;
        var catOutput;        
        for (var i in Items) {
            var item = JSON.parse(Items[i]);            
            if (item.desc == "") {
                item.desc = "--";
            }
            if (item.link == undefined) {
                item.link = "--";
            } else {
                item.link = '<a target="_blank" href="' + item.link + '">' + item.link + '</a>';
            }            
            if (item.category != catOld || item.subcategory != subcatOld) {
                subcatOld = item.subcategory;
                catOld = item.category;
                if (item.subcategory != "Entry") {
                    catOutput = ' <span class="glyphicon glyphicon-menu-right"></span> ' + item.subcategory;
                } else {
                    catOutput = "";
                }
                content += "<tr ><th colspan='5'>" +
                    "<h4 class='h2 glyphicon'>" + item.category + catOutput + "</h4>"
                "</th></tr>";
            }

            content += "<tr>" + "<td>" + (parseInt(item.selected_index) + 1) + "</td><td>" + item.titulo + "</td><td>" + item.desc + "</td><td>" + item.link + "</td>";

            content += "<td>" + "<button id='update" + item.selected_index + "'  type='button' class='btnEdit btn btn-warning btn-fab btn-round' data-toggle='modal' data-target='#myModal'onclick='items.eventUpdateItem(this)'><i class='material-icons'>edit</i></button>";

            content += "<button id='delete" + item.selected_index + "' type='button' class='btnDelete btn btn-danger btn-fab btn-round'  onclick='items.eventDeleteItem(this)'><i class='material-icons'>delete</i></button>" + "	</td>" + "</tr>";            
        }
        var body = tblLista.childNodes[1];        
        body.innerHTML = content;        
        if (Items.length > 0) {
            document.getElementById("empty").innerHTML = "";
        }
    }

    filter(filter) {
        var filtered = [];
        filter = filter.toLowerCase();
        for (var i in this.tbItems) {
            var item = JSON.parse(this.tbItems[i]);
            var titulo = item.titulo.toLowerCase();
            var desc = item.desc.toLowerCase();
            var categoria = item.category.toLowerCase();
            var subcategoria = item.subcategory.toLowerCase();
            // console.log(titulo.search(filter));
            if (titulo.search(filter) != -1 || desc.search(filter) != -1) {
                item.selected_index = i;
                filtered.push(JSON.stringify(item));
            }
        }
        //console.log(filtered);
        return filtered;
    }

    sortBy(ItemsJson) {
        var Items = [];
        var Sorted = [];
        var Result = [];
        for (var i in ItemsJson) {
            var Item = JSON.parse(ItemsJson[i]);
            Item.selected_index = i;
            Items.push(Item);
        }
        /*Items.sort(function(a, b) {
            return new Date(b.dataExec) - new Date(a.dataExec);
        });*/
        for (var i in Items) {
            Result.push(JSON.stringify(Items[i]));
        }
        return Result;
    }
    sortItems(Items) {
        Items.sort(function(a, b) {
            return new Date(b.dataExec) - new Date(a.dataExec);
        });
        return Items;
    }

    /**
     * Cria o item
     * */
    create(Obj) {
        var objItems = JSON.stringify({
            titulo: document.getElementById("txtTitulo").value,
            desc: document.getElementById("txtDesc").value,
            link: document.getElementById("txtLink").value,
            login: document.getElementById("txtLogin").value,
            pass: document.getElementById("txtPass").value,
            category: document.getElementById("txtCategoria").value,
            subcategory: document.getElementById("txtSubcategoria").value,
            hidden: jQuery("#checkHidden").is(":checked")
        });
        this.tbItems.push(objItems);
        this.save();
        this.read();
        cleanRequired();
        this.openView(false);
        return true;
    }

    /**
     * Atualiza o item
     * */
    update() {
        this.tbItems[this.selected_index] = JSON.stringify({
            titulo: document.getElementById("txtTitulo").value,
            desc: document.getElementById("txtDesc").value,
            link: document.getElementById("txtLink").value,
            login: document.getElementById("txtLogin").value,
            pass: document.getElementById("txtPass").value,
            category: document.getElementById("txtCategoria").value,
            subcategory: document.getElementById("txtSubcategoria").value,
            hidden: jQuery("#checkHidden").is(":checked")
        });
        this.save();
        //this.operation = "Update";
        this.read();
        cleanRequired();
        this.openView(false);
        return true;
    }

    /**
     * Deleta o item
     * */
    delete() {
        var agree = confirm("Deseja realmente deletar este item?");
        if (!agree) {
            return false;
        }
        this.tbItems.splice(this.selected_index, 1);
        this.save();
    }

    cleanLocalStorage() {
      var agree = confirm("Deseja realmente limpar todo o armazenamento?");
      if (agree) {
        //sessionStorage.clear();
        localStorage.removeItem("tbItems")
        location.reload();
      }    
    }

    cleanForm() {
        document.getElementById("frmCadastro").reset();
        this.operation = "Create";
    }

    /**
     * Evento Mostrar senha
     * */
    eventShowPass(item) {
        if (this.view == true) {
            this.view = false;
            jQuery("#txtPass").prop("type", "password");
            jQuery(item).addClass("close");
        } else {
            this.view = true;
            jQuery("#txtPass").prop("type", "text");
            jQuery(item).removeClass("close");

        }
    };
    /**
     * Evento Submit do formulário de cadastro
     * */
    eventSubmitItem(form) {
        var valid = validateRequired(form);
        if (!valid) {
            return valid;
        }
        if (this.operation == "Create") return this.create();
        else return this.update();
    };

    /**
     * Evento Update da lista de itens
     * */
    eventUpdateItem(record) {
        this.openView(true);
        this.operation = "Update";
        this.selected_index = parseInt(record.id.replace("update", ""));
        this.tbItems = JSON.parse(this.loadPass());
        var item = JSON.parse(this.tbItems[this.selected_index]);
        document.getElementById("txtTitulo").value = item.titulo;
        document.getElementById("txtDesc").value = item.desc;
        document.getElementById("txtLink").value = item.link;
        document.getElementById("txtLogin").value = item.login;
        document.getElementById("txtPass").value = item.pass;
        if (item.hidden) {
            item.hidden = item.hidden.toString();
        }
        if (item.hidden != "true") {
            item.hidden = false;
        }
        jQuery("#checkHidden").prop("checked", item.hidden);
        jQuery("#txtCategoria").val(item.category);
        console.log(item.category);
        this.changeSubCategory();
        jQuery("#txtSubcategoria").val(item.subcategory);
        document.getElementById("txtTitulo").focus();
    };

    createSelects() {
        var category = jQuery("#txtCategoria");
        for (var i = 0; i < this.Categories.length; i++) {
            jQuery("<option />", { value: this.Categories[i], text: this.Categories[i] }).appendTo(category);
        }

    }

    changeSubCategory() {
        var obj = jQuery("#txtCategoria");
        var subcategory = jQuery("#txtSubcategoria");
        jQuery('#txtSubcategoria').empty();
        for (var i = 0; i < this.Categories.length; i++) {
            var Subcategory = this.Categories[this.Categories[i]];
            var CategoryName = this.Categories[i];
            if (typeof Subcategory == 'object') {
                for (var j = 0; j < Subcategory.length; j++) {
                    if (CategoryName === obj.val()) {
                        jQuery("<option />", { value: Subcategory[j], text: Subcategory[j] }).appendTo(subcategory);
                    }
                }
            }
        }
    }

    /**
     * Evento Delete da lista de itens
     * */
    eventDeleteItem(record) {
        this.selected_index = parseInt(record.id.replace("delete", ""));
        this.delete();
        this.read();
    };
    cancelItem(form) {
        this.openView(false);
        cleanRequired();
        this.operation = "Create";
    }
    newItem(form) {
        this.openView(true);
        cleanRequired();
        document.getElementById("txtTitulo").focus();
        this.operation = "Create";
    }
    openView(open) {
        if (open == true) {
            //document.getElementById("frmCadastro").style.display = 'block';
        } else {
            jQuery('#myModal').modal('toggle');
            // document.getElementById("frmCadastro").style.display = 'none';
        }
    }
    loadFileInput() {
        var fileInput = document.getElementById('fileInput');
        fileInput.addEventListener('change', function(e) {
            var file = fileInput.files[0];            
            let data = new FormData();
            Json.readFormat = "CRYPT";            
            Obj = File.readFile(Json,data,file,false);  
            console.log(Obj);  
            /*if (file.type.match(textType)) {
                var reader = new FileReader();

                reader.onload = function(e) {
                    if (readFormat == "JSON") {
                        Obj = jQuery.parseJSON(reader.result);
                    } else {
                        Obj = decryptJSON(reader);
                    }
                    loadJson(Obj);
                    //jQuery("#items").append('<li><a href="#'+Obj.Passwords+'">'+Obj.Passwords+'</a></li>');
                }

                reader.readAsText(file);
            } else {
                fileDisplayArea.innerText = "File not supported!";
            }*/
        });
    }

    loadCategories() {
        this.Categories = [];
        for (var i in this.tbItems) {
            var Item = JSON.parse(this.tbItems[i]);
            if (this.Categories.indexOf(Item.category) == -1) {
                this.Categories.push(Item.category);
            }

            if (!this.Categories[Item.category]) {
                this.Categories[Item.category] = new Array;
            }

            if (Item.subcategory != "Entry") {
                if (this.Categories[Item.category].indexOf(Item.subcategory) == -1) {
                    this.Categories[Item.category].push(Item.subcategory);
                }
            }
        }
    }

    export () {            
      var Export = this.createJsonExport();
      //var crypted = Json.encodeJson(Export);
      var agree = confirm("Criptografar com o mesmo Password inserido?");
      if (agree) {
        var passPhrase = this.MasterPass;
        var crypted = Crypt.encrypt(Export,passPhrase);
        File.writeFile(crypted);
      }else{
        var passPhrase = app.inputPass('export');
        var crypted = Crypt.encrypt(Export,passPhrase);
        File.writeFile(crypted);
      }      
        //var Export = this.createArrayExport();
        //console.log(JSON.parse(Export));
        /*-------------------------------- OLD METHOD--------------------------------
        var Export = this.createJsonExport();        

        jQuery('#myModal3').modal('toggle');
        jQuery('#output').html(Export);
        ----------------------------------------------------------------------------*/
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

    copyToClipboard() {
        this.fallbackCopyTextToClipboard(jQuery("#output").text());
    }

    fallbackCopyTextToClipboard(text) {
        var textArea = document.createElement("textarea");
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        try {
            var successful = document.execCommand('copy');
            var msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
            jQuery("#myModal3").find("#errorMessages").html('<div class="alert alert-success fade in"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong> Copied to clipboard.</div>')
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
        }

        document.body.removeChild(textArea);
    }
    newCategory() {
        jQuery("#myModal2").find("#title").val("");
        this.toggleCategory = "category";
        jQuery("#myModal2").find("h4").html("Category");
    }
    newSubcategory() {
        jQuery("#myModal2").find("#title").val("");
        this.toggleCategory = "subcategory";
        jQuery("#myModal2").find("h4").html("Subcategory");
    }
    saveCategory() {
        var title = jQuery("#myModal2").find("#title").val();
        if (this.toggleCategory == "category") {
            this.Categories.push(title);
            this.Categories[title] = [];
            jQuery('#txtCategoria').empty();
            this.createSelects();
        } else {
            var Category = jQuery("#txtCategoria").val();
            this.Categories[Category].push(title);
            this.changeSubCategory();
        }
        jQuery('#myModal2').modal('toggle');
    }

}

window.onload = function(e) {
    items = new Item();    
    items.MasterPass = items.inputPass();
    items.init();
}