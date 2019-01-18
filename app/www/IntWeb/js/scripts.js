var items;
var user;
var readFormat = "JSON"; // JSON OR CRYPT
var Obj;
var id = 0;
var idCount = 0;
var colorID = 0;
var encrypted;
var count = 0;
var Categories = new Array;
//sessionStorage.clear();

function validateRequired(form) {
    var elements = form.elements;
    Retorno = true;
    for (var i = 0, iLen = elements.length; i < iLen; i++) {
        if (elements[i].required && elements[i].value == "") {
            elements[i].classList.add("required");
            Retorno = false;
            document.getElementById('errorMessages').innerHTML = 'Preencha os campos obrigatórios e envie novamente.';
        }
    }
    return Retorno;
}

function logoff() {
    var agree = confirm("Não se esqueça de exportar e limpar este armazenamento. Esta lista não está criptografada.");
    if (agree) {
      window.location.href = "../index.html";
    }
}

function cleanRequired() {
    form = document.getElementById("frmCadastro");
    var elements = form.elements;
    for (var i = 0, iLen = elements.length; i < iLen; i++) {
        elements[i].classList.remove("required");
        elements[i].value = "";
        /*if (elements[i].type == "text") {

            elements[i].value = "";
        }
        if (elements[i].type == "textarea") {
            elements[i].value = "";
        }
        if (elements[i].type == "password") {
            elements[i].value = "";
        }*/
    }
    document.getElementById('errorMessages').innerHTML = '';
}

function toDisplayDate(dateStr) {
    const [year, month, day] = dateStr.split("-")
    return day + "/" + month + "/" + year;
}
/*
function loadCategories() {
    for (var i in items.tbItems) {
        var Item = JSON.parse(items.tbItems[i]);
        console.log(Item);
        Item.selected_index = i;
        console.log(Item.category);
        console.log(Item.subcategory);
        //Export.push(Item);
    }

}*/

function toDBDate(dateStr) {
    const [day, month, year] = dateStr.split("/")
    return year + "-" + month + "-" + day;
}

function formatDate(input, mask, e) {
    var code = ""
    var size = input.value.length;
    if (document.all) // Internet Explorer
        code = event.keyCode;
    else
        code = e.which;
    if ((code > 47 && code < 58) || (code >= 96 && code <= 105)) {
        if (size >= 10) {
            return false;
        }
        continueFormat(input, mask, code);
        return true;
    } else {
        if (code == 8 || code == 0 || code == 46) {
            continueFormat(input, mask, code);
            return true;
        } else {
            return false;
        }
    }
}

function continueFormat(input, mask, code) {
    if (code != 8) {
        if (input.value.length == input.maxlength) {
            return;
        }
        var length = input.value.length;
        var output = mask.substring(0, 1);
        var date = mask.substring(length);
        if (date.substring(0, 1) != output) {
            input.value += date.substring(0, 1);
        }
    }
}

function validateDate(input) {
    var patternDate_pt = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[1,3-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;
    if (input == "") {
        document.getElementById('errorMessages').innerHTML = 'Preencha o campo Data de execução.';
        return false;
    }
    if (!patternDate_pt.test(input)) {
        document.getElementById('errorMessages').innerHTML = "data de execução inválida";
        return false;
    }
}

function loadJson(Obj) {
    jQuery.each(Obj.Passwords, function(key, data) {
        Categories.push(key);
        if (!data.Entry && Object.keys(data).length > 0) {
            var hasSub = 0;
            jQuery.each(data, function(key2, data2) {
                if (hasSub == 0) {
                    Categories[key] = new Array;
                    hasSub = 1;
                }
                Categories[key].push(key2);
                jQuery.each(data2, function(key3, data3) {
                    saveData(data3, key, key2);
                });
            })
        } else {
            jQuery.each(data, function(key2, data2) {
                saveData(data2, key, key2);
            });
        };
    });
    console.log(Categories);
    //item.init();
    location.reload();
}

function saveData(Obj, category, subcategory) {
    jQuery.each(Obj, function(key, data) {
        item = new Item(data.Title, data.Desc, data.Hidden, data.Link, data.Credentials.Login, data.Credentials.Pass, category, subcategory);
        item.stubCreate();
    });
}
function simulateUpload(){
  jQuery('#fileInput').click();
}

function moveScroller() {  
  var anchor = jQuery("#scroller-anchor");
  var scroller = jQuery('#scroller');
  
  var move = function() {      
      var st = jQuery(window).scrollTop();
      var ot = anchor.offset().top;
      jQuery(scroller).append(jQuery('#tblLista thead'));
      if(st > ot) {
        scroller.css({
              position: "fixed",
              top: "0px"
          });
      } else {
        scroller.css({
              position: "relative",
              top: ""
          });
      }
  };
  jQuery(window).scroll(move);
  move();
}