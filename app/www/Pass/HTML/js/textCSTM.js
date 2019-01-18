jQuery(document).ready(function() {
    var color = 0;
    var count = 0;
    var mobile = false;
    var fileInput = document.getElementById('fileInput');
    var fileDisplayArea = document.getElementById('fileDisplayArea');
    var colors = ["1E88E5", "673ab7", "ff9800", "00bcd4", "009688"];
    var colorID = 0;
    var cardClassColor = "";
    var id = 0;
    var idCount = 0;
    var encrypted;
    var Obj;
    var Categories = new Array;
    var readFormat = "CRYPT"; // JSON OR CRYPT    
    var isMobile = window.matchMedia("only screen and (max-width: 760px)");
        if (isMobile.matches) {
            mobile = true;
            appendMobileScript();                        
        }else{
          jQuery('#colors').remove();
        }
    fileInput.focus();
    fileInput.addEventListener('change', function(e) {        
        var file = fileInput.files[0];
        var textType = /text.*/;

        if (file.type.match(textType)) {
            var reader = new FileReader();

            reader.onload = function(e) {
                if (readFormat == "JSON") {
                    Obj = jQuery.parseJSON(reader.result);
                } else {
                    Obj = decryptJSON(reader);
                }
                init(Obj);
                //jQuery("#items").append('<li><a href="#'+Obj.Passwords+'">'+Obj.Passwords+'</a></li>');
            }

            reader.readAsText(file);
        } else {
            fileDisplayArea.innerText = "File not supported!";
        }
        jQuery('.collapse').collapse('hide');
    });

    function init() {      
        
        jQuery.each(Obj.Passwords, function(key, data) {
            Categories.push(key);
            if (!data.Entry && Object.keys(data).length > 0) {
                var itensMenu = '<li class="dropdown"><a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false">' + key + '<span class="caret"></span></a><ul class="dropdown-menu">';
                var content = "";
                var hasSub = 0;
                jQuery.each(data, function(key2, data2) {
                    if (hasSub == 0) {
                        Categories[key] = new Array;
                        hasSub = 1;
                    }
                    Categories[key].push(key2);
                    itensMenu += '<li id="li' + id + '" onclick="activeButton(' + id + ');"><a  href="#cor' + id + '" >' + key2 + '</a></li>';
                    content += '<div id="cor' + id + '" class="entry container-fluid color' + colorID + '"><h2 onclick="activeButton(' + id + ');" >' + key2 + '</h2>';
                    content = returnContent(content, colorID, colors, data2, 1, key, key2);
                    id++;
                })
                jQuery("#items_list").append(itensMenu);
                content += '</ul></li>';
            } else {
                jQuery("#items_list").append('<li id="li' + id + '" onclick="activeButton(' + id + ');"><a  href="#cor' + id + '" >' + key + '</a></li>');
                var content = '<div id="cor' + id + '" class="entry container-fluid color' + colorID + '"><h2 onclick="activeButton(' + id + ');" >' + key + '</h2>';
                content = returnContent(content, colorID, colors, data, 0, 'root', key);
                id++;
            }
            jQuery("#items").hide().append(content).show('fast');
            for (i = 0; i < count; i++) {
                jQuery('a[href="#ex' + i + '"]').click(function(event) {
                    event.preventDefault();
                    jQuery(this).modal({
                        fadeDuration: 150
                    });
                    /* jQuery('.modal').css("top", '5vh');
                     jQuery('.modal').css("left", '5vw');
                     jQuery('.modal').css("position", 'absolute');*/
                    // }
                });
            }
        });
    }

    function decryptJSON(reader) {
        passPhrase = this.inputPass("load");
        Obj = decrypt(reader.result, passPhrase);
        Obj = jQuery.parseJSON(Obj);
        return Obj;
    }

    jQuery('#exportJsonFormated').click(function() { // When arrow is clicked
        createOutput(Obj, true);
    });

    jQuery('#exportCrypted').click(function() { // When arrow is clicked
        var crypted = JSON.stringify(Obj);
        crypted = encrypt(crypted);
        result = crypted;
        createOutput(result);
        //result = (crypted.toString());
    });

    jQuery('#generateCrypted').click(function() { // When arrow is clicked
        createOutput(Obj, true, '450', "<input type='button' class='btn btn-warning' id='clearText' value='Clear text'><input style='float:right' type='button' class='btn btn-success' id='generate' value='Generate'>");
        jQuery('#clearText').click(function() {
            jQuery("#textarea").val('');
        });
        jQuery('#generate').click(function() {
            var crypted = JSON.stringify(JSON.parse(jQuery("#textarea").val()));
            crypted = encrypt(crypted);
            result = crypted;
            jQuery("#textarea").val(result);
            //result = (crypted.toString());
        });
    });

    function createOutput(val, formatJSON, sizeText = 500, htmlBottom) {
        var newDiv = jQuery("<div />");
        var textArea = jQuery('<textarea id="textarea" style="height:' + sizeText + 'px; width:100%" />');
        if (formatJSON) {
            val = (JSON.stringify(val, null, '\t'));
        }
        textArea.text(val);
        newDiv.append(textArea);
        newDiv.append(htmlBottom);
        event.preventDefault();
        jQuery(newDiv).modal({
            fadeDuration: 150
        });
    }

    jQuery('#newEntry').click(function() {
        edit();
    });

    showHide = function() {
        if (jQuery(".password").attr("type") == "password") {
            jQuery(".password").attr("type", "text");
            jQuery(".showHide").addClass("closed");
        } else {
            jQuery(".password").attr("type", "password");
            jQuery(".showHide").removeClass("closed");
        }
    }

    edit = function(result) {
        createOutputCRUD(result);
    };

    function findReplaceObjJson(objectId, assign = false) {
        jQuery.each(Obj.Passwords, function(index, data) {
            if (data.Entry) {
                jQuery.each(data.Entry, function(key2, data2) {
                    if (data2.id == objectId) {
                        result = data2;
                        if (assign) {
                            data = assignValues(data, key2);
                        }
                    }
                });
            } else {
                jQuery.each(data, function(key2, data2) {
                    jQuery.each(data2.Entry, function(key3, data3) {
                        if (data3.id == objectId) {
                            result = data3;
                            if (assign) {
                                data = assignValues(data2, key3);
                            }
                        }
                    })
                });
            }
        });
        return result;
    }
    findCategory = function(categoryFather, categoryChild) {
        console.log(Categories);
        jQuery.each(Categories, function(index, val) {

            if (Array.isArray(Categories[val])) {
                jQuery.each(Categories[val], function(index2, val2) {

                });
            } else {

            }
        });
        if (find) {
            return category;
        } else {
            alert('categoria não encontrada, deseja criar?');
            return false;
        }
    }
    putOnCategory = function() {

    }
    createCategory = function() {

    }
    changeCategory = function(changeFather, changeChild, categoryFather, categoryChild, categories) {
        category = findCategory(categoryFather, categoryChild);
        if (category) {
            putOnCategory();
        } else {
            createCategory(category);
        }
        removeFromCategory(categories);
    }
    assignValues = function(data, key) {
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
    save = function(result) {
        findReplaceObjJson(result, true);
        jQuery("#items").empty();
        jQuery.each(jQuery("#items_list").children('li'), function(index, val) {
            if (index > 1) {
                //jQuery("#items_list").children('li').eq(val).remove();
                val.remove();
            }
        });

        init(Obj);
        jQuery('#Edit').remove();
        jQuery('#Create').remove();
        jQuery('.jquery-modal').remove();
    }

    cancel = function() {
        jQuery('#Edit').remove();
        jQuery('#Create').remove();
        jQuery('.jquery-modal').remove();
    };

    function verifyCategory(categories, val, indice) {
        if (val == categories[indice]) {
            selected = "selected";
        } else {
            selected = "";
        }
        return selected;
    }

    function getCategories(nivel, categories) {
        var categories = categories.split(",");
        var select = '<select class="selectpicker" id="category' + nivel + '">';
        var selected = "";
        if (nivel == "Father") {
            select += '<option value="root" >Category Root</option>';
        } else {
            select += '<option>Category Child</option>';
        }
        jQuery.each(Categories, function(index, val) {
            if (nivel == "Father") {
                selected = verifyCategory(categories, val, 0);
                select += '<option ' + selected + ' value="' + val + '">' + val + '</option>';
            } else { //TODO: name="father" para quando escolher um pai no CHILD, bloquear o Father					
                if (Array.isArray(Categories[val])) {
                    jQuery.each(Categories[val], function(index2, val2) {
                        selected = verifyCategory(categories, val2, 1);
                        select += '<option ' + selected + ' value="' + val + ',' + val2 + '">' + val + ' -> ' + val2 + '</option>';
                    });
                    selected = "";
                } else {
                    selected = verifyCategory(categories, val, 1);
                    select += '<option name="father" ' + selected + ' value="' + val + '">' + val + '</option>';
                    selected = "";
                }
            }
        });
        select += '</select>';

        return select;
    }

    function createOutputCRUD(result, sizeText = 500) {
        var Title = Desc = Link = Login = Pass = id = "";
        if (result) {
            var Item = findReplaceObjJson(result);
            Title = Item.Title;
            Desc = Item.Desc;
            Link = Item.Link;
            Login = Item.Credentials.Login;
            Pass = Item.Credentials.Pass;
            itemID = Item.id;
            var newDiv = jQuery("<div id='Edit' />");
            var pageTitle = "Edit";
            var Categories = Item.Categories;
        } else {
            var newDiv = jQuery("<div id='Create' />");
            itemID = idCount + 1;
            var pageTitle = "Create";
            var Categories = "";
        }
        var categoriesFather = getCategories('Father', Categories);
        var categoriesChild = getCategories('Child', Categories);
        var form = jQuery('<h2>' + pageTitle + '</h2><table cellpadding="10" style="width:100%" ><tr><td><label>Title:</label></td><td colspan="2"><input type="text" id="title" class="form-control" style="width:100%" value="' + Title + '" ></td></tr><tr><td><label>Category:</label></td><td>' + categoriesFather + '</td><td>' + categoriesChild + '</td></tr><tr><td><label>Desc:</label></td><td colspan="2"><textarea id="desc" class="form-control"style="width:100%" >' + Desc + '</textarea></td></tr><tr><td><label>Link:</label></td><td colspan="2"><input type="text" id="link" class="form-control" style="width:100%" value="' + Link + '" /></td></tr><tr><td><label>Login:</label></td><td colspan="2"><input type="text" id="login" class="form-control"style="width:100%" value="' + Login + '" /></td></tr><tr><td><label>Pass:</label></td><td colspan="2"><input type="text" id="pass" class="form-control" style="width:100%" value="' + Pass + '" /></td></tr></table><br /><input  class="btn btn-warning"  type="button" onclick="cancel()" id="cancel" value="Cancel"><input style="float:right" class="btn btn-primary"  onclick="save(' + itemID + ')" type="button" id="save" value="Save">');
        newDiv.append(form);
        event.preventDefault();
        jQuery(newDiv).modal({
            closeExisting: true, // Close existing modals. Set this to false if you need to stack multiple modal instances.
            escapeClose: false, // Allows the user to close the modal by pressing `ESC`
            clickClose: false, // Allows the user to close the modal by clicking the overlay
            closeText: 'Close', // Text content for the close <a> tag.
            closeClass: '', // Add additional class(es) to the close <a> tag.
            showClose: false, // Shows a (X) icon/link in the top-right corner
            modalClass: "modal", // CSS class added to the element being displayed in the modal.
            spinnerHtml: null, // HTML appended to the default spinner during AJAX requests.
            showSpinner: true, // Enable/disable the default spinner during AJAX requests.
            fadeDuration: 150, // Number of milliseconds the fade transition takes (null means no transition)
            fadeDelay: 1.0 // Point during the overlay's fade-in that the modal begins to fade in (.5 = 50%, 1.5 = 150%, etc.)    		    
        });
        var father = "";
        jQuery("#categoryChild").change(function() {
            father = jQuery("#categoryChild").val().split(",");;
            if (father[1] != undefined) {
                jQuery("#categoryFather").val(father[0]).change();
            }
        });
        createSelect();

    }

    function returnContent(content, colorID, colors, data, hasSub, categoryFather, categoryChild) {
        colorID++;
        if (colorID >= colors.length) {
            colorID = 0;
        }
        content += '<style>#items.color #cor' + id + '{background-color: #' + colors[colorID] + '}</style>';
        content += '<div class="row col6" id="items' + id + '">';
        jQuery.each(data.Entry, function(index, val) {
            idCount = idCount + 1;
            data.Entry[index].id = idCount;
            if (val.Credentials.Login == "") {
                login = "EMPTY";
            } else {
                login = val.Credentials.Login
            }
            if (val.Image == "") {
                val.Image = "no-image.png";
            }
            if (val.Credentials.Pass == "") {
                pass = "EMPTY";
                cardClassColor = "cardRed";
            } else {
                pass = val.Credentials.Pass
                cardClassColor = "";
            }
            if (val.Desc == undefined) {
                val.Desc = val.Title;
            }

            val.Categories = categoryFather + ',' + categoryChild;
            classHidden = "";
            style = '';
            if (val.Hidden == "true") {
                classHidden = "hideItem";
                style += "display:none;";
            }
            content += '<div class="card ' + cardClassColor + ' ' + classHidden + '" style="' + style + '" >';
            content += '<a href="#ex' + count + '"  >' + val.Title + '</a>'; //removido rel="modal:open"
            content += '<div class="modal" id="ex' + count + '" style="display:none;"> <h2>' + val.Title + '</h2><strong>' + val.Title + '</strong><br />';
            if (val.Desc !== undefined) {
                content += ' <strong>Desc: </strong>' + val.Desc + '<br />';
            }
            if (val.Link !== undefined) {
                content += ' <strong>Link: </strong><a target=\'_blank\' href=' + val.Link + ' >' + val.Link + '</a><br />';
            }
            content += '<strong>Login</strong>: ' + login + '<br /><strong>Pass: </strong>  <input type="password" class="password form-control" style="width:60%; display:inherit" value="' + pass + '" /> <div class="showHide" onclick="showHide()"></div><br /><input type="button" id="edit" class="btn btn-success" value="Edit" onclick="edit(' + idCount + ')" style="float:right"> </div>';
            content += '<button type="button" class="btn btn-default btn-ls"  onclick="copyToClipboard(this,\'' + val.Title + '\',\'' + pass + '\')" >';
            content += '<span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
            content += 'Copy Pass</button></div>';
            count++;
        })
        content += '</div></div>';
        if (hasSub) {
            jQuery.each(data.Entry, function(key2, data2) {
                content += '</div>';
            })
        }
        //console.log(Obj);
        return content;
    }

    jQuery('#hideEmptyPass').click(function() {
        jQuery('.cardRed').toggle('fast');
        jQuery('#hideEmptyPass').find("p").toggle('fast');
    });
    jQuery('#hideHidden').click(function() {
        jQuery('.hideItem').toggle('fast');
        jQuery('#hideHidden').children("p").toggle('fast');

    });

    jQuery("#color").click(function() {
        changeColor();
    });

    function changeColor() {
        if (color == 0) {
            color = 1;
            jQuery("#items").addClass('color');
        } else {
            color = 0;
            jQuery("#items").removeClass('color');
        }

    }
    activeButton = function(id) {
        obj = "#li" + id;
        var ul = jQuery(obj).parent();
        if (ul.hasClass("dropdown-menu")) {
            ul = jQuery(obj).parent().parent().parent();
        }
        for (i = 0; i <= ul.children().length; i++) {
            $(ul.children()[i]).removeClass();
            jQuery("#cor" + i).removeClass("active");
            if (!mobile) {
                jQuery("#cor" + i).animate({ opacity: 0.6 }, 0);
            }
        }
        jQuery.each(ul.children().children(), function(key, data) {
            $("#li" + key).removeClass('active');
        })
        jQuery(obj).addClass("active");
        jQuery("#cor" + id).addClass("active");
        if (!mobile) {
            jQuery('body,html').animate({ scrollLeft: jQuery("#cor" + id).offset().left - 500 }, 300);
            jQuery("#cor" + id).animate({ opacity: 100 }, 300);
        }

    }

    copyToClipboard = function(Obj, Title, val) {
            if (val == "EMPTY") {
                jQuery(".message").html('<div class="alert alert-danger fade in"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Error!</strong> Empty Pass.</div>')
            } else {
                var $temp = jQuery("<input>");
                jQuery("body").append($temp);
                $temp.val(val).select();
                document.execCommand("copy");
                $temp.remove();
                jQuery(".message").html('<div class="alert alert-success fade in"> <a href="#" class="close" data-dismiss="alert" aria-label="close">&times;</a><strong>Success!</strong> ' + Title + ' copied to your clipboard.</div>');
            }
        }
        // ===== Scroll to Top ==== 
    $(window).scroll(function() {
        if ($(this).scrollTop() >= 50) { // If page is scrolled more than 50px
            $('#return-to-top').fadeIn(200); // Fade in the arrow
        } else {
            $('#return-to-top').fadeOut(200); // Else fade out the arrow
        }
    });
    $('#return-to-top').click(function() { // When arrow is clicked
        $('body,html').animate({
            scrollTop: 0 // Scroll to top of body
        }, 500);
    });


    /*var obj = {
        name: 'Dhayalan',
        score: 100
    };

    localStorage.setItem('gameStorage', JSON.stringify(obj));	
    var obj = JSON.parse(localStorage.getItem('gameStorage'));
    window.localStorage.removeItem('gameStorage');*/

});
(function($, window) {
    var adjustAnchor = function() {
        var $anchor = $(':target'),
            fixedElementHeight = 50;

        if ($anchor.length > 0) {
            $('html, body')
                .stop()
                .animate({
                    scrollTop: $anchor.offset().top - fixedElementHeight
                }, 200);
        }
    };

    $(window).on('hashchange load', function() {
        adjustAnchor();
        //fecha o menu
        jQuery('.collapse').collapse('hide');
    });

})(jQuery, window);

decode = function() {
    /*var password;
    var pass1 = "U2FsdGVkX1+18KlUHujNJvIx/O/3Ij2rMRBoYFFOkEI=";
    pass1 = (decrypt(pass1, "pass"));
    password = prompt('Please enter your password to view this page!', ' ');
    crypted = encrypt(password);
    decrypted = decrypt(encrypted, "pass");
    if (decrypted == pass1) {} else {
        window.location = "Error.html";
    }*/
}
inputPass = function(strFn) {
  var MasterPass = prompt('Please enter your Master Password to '+strFn+' the Passwords', ' ');
  MasterPass = MasterPass.trim();        
  return MasterPass;
}

encrypt = function(val) {
    passPhrase = this.inputPass("store");
    encrypted = CryptoJS.AES.encrypt(val, passPhrase);
    var plaintext = encrypted.toString(CryptoJS.enc.Utf8);
    //console.log(encrypted.toString());		
    return encrypted;
}

decrypt = function(encrypted, val) {
    passPhrase = this.inputPass("load");
    var decrypted = CryptoJS.AES.decrypt(encrypted, passPhrase);
    var plaintext = decrypted.toString(CryptoJS.enc.Utf8);
    return (plaintext);
}
// REFERENCE ICONS http://getbootstrap.com/components/ e http://www.w3schools.com/bootstrap/bootstrap_ref_comp_glyphs.asp
function changeColor(val){
  jQuery('body').removeClass();
  jQuery('body').addClass(val.value);
  jQuery('.collapse').collapse('hide');
}
function appendMobileScript(){
/*   OPTION 1 - RELOAD HTML :(
jQuery('<link>')
    .appendTo('head')
    .attr({
        type: 'text/css',
        rel: 'stylesheet',
        href: 'HTML/css/mobile.css'
    });
    */
   /*OPTION 2 
   document.getElementsByTagName('head')[0].appendChild( ... );
   */
  /*OPTION 3 
  $('head').append($('<link rel="stylesheet" type="text/css" />').attr('href', 'http://example.com/example.css'));
  */
  link=document.createElement('link');
  link.href='HTML/css/mobile.css';
  link.rel='stylesheet';

  document.getElementsByTagName('head')[0].appendChild(link);
}
