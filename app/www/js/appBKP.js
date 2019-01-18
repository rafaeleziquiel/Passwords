Json = new Json();
Crypt = new Crypt();
Notice = new Notice();
Details = new Details();
var Theme;
var items = [];
Vue.component('item-component', {
  props: ['item'],
  template:`<div  v-bind:class="[item.Credentials.Pass ? '' : 'disabled']" class="card list-group list-group-flush item" v-on:click="app.openModal(item)">
  
    <!--<div class="list-group-item"><p class="text-color">{{item.Categories}}</p></div>-->
    <div>
      <div class="desc">
        <div class="list-group-item">{{ item.Title }}</div>
      </div>
      <div class="copy">
        <button type="button" class="btn btn-copy  btn-color btn-sm" id="btnCopy" v-on:click="app.copyToClipboard(item)">
          Copy Pass
        </button>
      </div>
    </div>
    </div>`,
});
Vue.component('item-desc',{
  props: ['Password'],
  data: {
    isActive: false
  },
  methods: {
    filterPass: function(item){
        this.isActive = !this.isActive;
        
       this.showPass();
      // some code to filter users
    }
  },
  computed: {
    showPass: function(){      
      if(this.isActive){
        return Password.Credentials.Pass;
      }else{
        return '***';
      }
    },
    cleanedCategory: function () {
      if(this.Password.Categories && this.Password.Categories.match(/root/)){
        return this.Password.Categories.replace('root,','');
      }else{
        if(this.Password.Categories && this.Password.Categories.match(/,/)){
          return this.Password.Categories.replace(',',' ');
        }else{
          return this.Password.Categories;
        }
      }      
    }
 
  },
  template:
  `<div class="modal fade" id="ItemInfo" tabindex="-1" role="dialog" aria-labelledby="ItemInfoLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title text-color" id="ItemInfoLabel">{{Password.Title}}</h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <button v-on:click="filterPass(Password)">Pass</button>
        <div class="modal-body">
          <h4 class="card-title">Category {{ cleanedCategory }}</h4>          
          <h6 v-if="Password.Credentials && Password.Credentials.Login" class="card-subtitle mb-2 text-muted">Login: <span>{{Password.Credentials.Login}}</span></h6>  
          <h6 v-else class="card-subtitle mb-2 text-muted">Login: <span>Empty</span></h6>  
          <h6 v-if="Password.Credentials && Password.Credentials.Pass" class="card-subtitle mb-2 text-muted">Pass: <span>{{showPass}}</span></h6>
          <h6 v-else class="card-subtitle mb-2 text-muted">Pass: <span>Empty</span></h6>  
          <p v-if="Password.Desc" class="card-text">{{Password.Desc}}</p>
          <a v-if="Password.Link" v-bind:href="''+Password.Link+''" class="text-color card-link">{{Password.Link}}</a>

          </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn btn-color" v-on:click="app.copyToClipboard(Password)">Copy pass</button>
        </div>
      </div>
    </div>
  </div>`,
});

app = new Vue({
  el: '#app',  
  data: {    
    items: [],
    Title: 'Passwords',
    desc: 'Load your passwords',
    categories: [
      'Sculpture',
      'Humor',
      'Suspense',
    ],
    Password: '', 
    Theme: "",
    bgAtual: "",
    copyTrigger: false,
  },
  mounted () {
    this.init()
  }, 
  methods: {
    init(){  
      jQuery( "#callUpload" ).focus();
      this.loadSettings();
      this.fileUpload();
      this.changeTheme(this.Theme);
      this.search(); 
      navigator.splashscreen.hide();
    },    
    inputPass() {        
        var MasterPass = prompt('Please enter your Master Password to load the Passwords', ' ');
        return MasterPass;
    },
    fileUpload(){
      /*Upload File*/        
      jQuery( "#upload" ).change(function(e) {
        e.preventDefault();  
        e.stopPropagation();   
        console.log(e);
        var files = e.target.files;        
        file = files[0];
        let data = new FormData();
        Json.readFormat = "CRYPT";
        Json.readJson(Json,data,file);              
      });     
    },
    search(){
      jQuery( "#search" ).click(function(event) {
        event.preventDefault();        
        jQuery.expr[":"].contains = $.expr.createPseudo(function(arg) {
          return function( elem ) {
              return $(elem).text().toUpperCase().indexOf(arg.toUpperCase()) >= 0;
          };
        });
        var text = jQuery('#searchText').val();
        var search = jQuery( ".list-group-item:contains('"+text+"')" );
        if(search.html() != undefined){          
          var top = search.offset().top - search.parent().height();
          jQuery('html,body').animate({scrollTop: (top) },'slow');     
        }         
      });
    },    
    showMain(scroll = false, hideMenu=true){      
      jQuery('.main').animate({opacity: 'show'});    
      if(scroll){
        jQuery('html,body').animate({scrollTop: jQuery('.main').offset().top},'slow');
      }
      if(hideMenu){
        jQuery('.navbar-toggler').click();
      }
    },    
    openModal(elem){  
      if(this.copyTrigger == false){  
        vm = this;
        vm.Password = elem;     
        console.log(elem);
        jQuery('#ItemInfo').modal('show');
      }
      this.copyTrigger = false;
    },
    copyToClipboard(item) {
      this.copyTrigger = true;
      Title = item.Title;
      val = item.Credentials.Pass;
      if (val == "") {
        this.showToast('error','<strong>Error!</strong> Empty Pass.')
      } else {
          var $temp = jQuery("<input>");
          jQuery("body").append($temp);
          $temp.val(val).select();
          document.execCommand("copy");
          $temp.remove();
          this.showToast('success','<strong>Success!</strong> ' + item.Title + ' copied to your clipboard.')
      }
    },
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
    },
    simulateClick(buttonID){      
      jQuery(buttonID).click();
    },    
    loadView(){   
      //Hide upload Button      
      jQuery('#callUpload').fadeOut("slow", function() {
        jQuery('#callUpload').remove();
        app.showMain(true,false);         
        jQuery('#actions').animate({
          opacity: '1',
          height: '100%',
        });
        app.changeTheme(app.Theme);
      });          
    },
    loadJson(Obj){
      vm = this;
      vm.items = Obj.Passwords;      
      this.Passwords = Obj.Passwords;      
    }, 
    /*SETTINGS*/    
    loadSettings(){        
      /*Slider for speeds*/
      var sliderSpeedCards = document.getElementById('sliderSpeedCards');
      noUiSlider.create(sliderSpeedCards, {
        start: 40,
        connect: [true,false],
        range: {
          min: 0,
          max: 100
        },
        tooltips: true,      
      });
      /*Slider for Header-filter Strength*/
      var sliderHeaderFilter = document.getElementById('sliderHeaderFilter');
      noUiSlider.create(sliderHeaderFilter, {
        start: 2,
        connect: [true,false],
        step: 1,
        range: {
          min: 0,
          max: 4
        },
        pips: {
          mode: 'positions',
          values: [0, 25, 50, 75, 100],
          density: 4
        }
      });      
      // Bind the value of function to the update event.
      sliderHeaderFilter.noUiSlider.on('update', function () {
        var val = sliderHeaderFilter.noUiSlider.get();
        var transparency = ['light','light-normal','normal','normal-heavy','heavy'];
        transparency.forEach(logArrayElements);
        function logArrayElements(element, index, array) {          
          jQuery('.header-filter').removeClass(element);
        }
        jQuery('.header-filter').addClass(transparency[parseInt(val)]);      
      });
      
    },
    /*Change the Background of Header*/
    loadBackground(obj){
      jQuery(this.bgAtual).parent().removeClass('active');
      this.bgAtual = obj;
      var img = (jQuery(obj).children('img').attr('src'));      
      jQuery('.page-header').css('background-image','url("'+img+'")');          
      jQuery(obj).parent().addClass('active');
      jQuery('html,body').animate({scrollTop: jQuery('.page-header').offset().top },'slow');
    },
    /*Change color of Header*/
    changeHeaderColor(color="9616CC"){//EEE
      jQuery('.page-header').css('background','#'+color);
    },
    /* --> function for mobile 
    vibrate(item,value){
      //Assign class Active
      jQuery(item).parent().children().removeClass('active');          
      jQuery(item).addClass('active');
      var id = jQuery(item).parent().attr("aria-labelledby");      
      jQuery("#"+id+":first-child").text(val);
      jQuery("#"+id+":first-child").val(val);                 
      //Assign to Variable
      switch(button){
        case "#callUpload":
          this.Vibrate["#callUpload"] = val;
          this.assignVibrate(button,val);
        break;
        case "#btnCopy":
          this.Vibrate["#btnCopy"] = val;
          this.assignVibrate(button,val);
        break;
        case "nav a":
          this.Vibrate["nav a"] = val;
          this.assignVibrate(button,val);
        break;
      }      
    },*/
    /*assignVibrate(button,val){
      switch(val){
        case '20ms':
        jQuery(button).vibrate("short");
        break;
        case '50ms':
        jQuery(button).vibrate();
        break;
        case '100ms':
        jQuery(button).vibrate("long");
        break;
        case '500ms':
        jQuery(button).vibrate(500);
        break;
        case '1000ms':
        jQuery(button).vibrate(1000);
        break;
        case '2000ms':
        jQuery(button).vibrate({
          duration: 2000,
          trigger: "touchstart"
         });
        break;
        case 'twice':
        jQuery(button).vibrate({
          pattern: [20, 200, 20]
         });
        break;
      }
      console.log(button);
      console.log(val);
    },    
    storeData(){

    },*/
    /* For Themes */
    changeTheme(theme='primary',storeData=false){
      this.Theme = theme;
      jQuery('.nav-color').removeClass('bg-'+Theme);      
      jQuery('.btn-color').removeClass('btn-'+Theme);
      jQuery('.text-color').removeClass('text-'+Theme);
      Theme=theme;
      jQuery('.nav-color').addClass('bg-'+theme);      
      jQuery('.btn-color').addClass('btn-'+theme);
      jQuery('.text-color').addClass('text-'+theme);      
      // jQuery('.navbar-toggler').click();
      if(storeData){
        this.storeData("theme",theme);
      }
    }
  },  
});
