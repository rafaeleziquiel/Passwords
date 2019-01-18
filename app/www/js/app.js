File = new File();
Json = new Json();
Crypt = new Crypt();
Store = new Store();
var OldTheme;
app = new Vue({
  el: '#app', 
  data: {
    hasStoredPass:false,
    backgroundToggle: true,
    headerColorToggle:false,
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
    headerFilter: 1,
    background:0,
    bgColor:'fff',
    bgAtual: "",
    copyTrigger: false,
    passActive: true,
  },
  mounted () {
    this.init();    
  },
  watch: {    
    headerColorToggle: function (newValue) {      
      app.backgroundToggle = !newValue;
      app.toggleBackground();
    },
    backgroundToggle:function (newValue) {
      app.headerColorToggle = !newValue;      
    }
  },
  methods: {
    init(){
      var Config = Store.loadConfig();     
      this.assignConfig(Config);
      this.hasStoredPass ? jQuery( "#callLoadStored" ).focus() : jQuery( "#callUpload" ).focus();      
      this.loadSettings();
      this.fileUpload();
      this.changeTheme(app.Theme);
      this.search(); 
      this.stub();
      jQuery("#app").fadeIn('slow');
      //TODO: HIDE PHONEGAP SPLASH SCREEN
      //navigator.splashscreen.hide();      
    },
    showPass(Password){
      if(app.passActive){
        jQuery('#pass').val(Password.Credentials.Pass);
        jQuery('.eye').removeClass('eyeClosed');
      }else{
        jQuery('#pass').val('***');
        jQuery('.eye').addClass('eyeClosed');
      }
      app.passActive = !app.passActive;
    },
    assignConfig(Config,restrict=false){
      if(!restrict){
        if(Config.backgroundToggle!=null){        
          app.backgroundToggle = Config.backgroundToggle;  
          app.headerColorToggle = !app.backgroundToggle;
          this.toggleBackground();
        }   
      }
      //TODO:
      if(Config.passwords){
        jQuery('#callUpload').hide();
      }else{
        jQuery('#callLoadStored').hide();
      }
      if(Config.theme!=null){
        app.Theme = Config.theme;
      }
      if(Config.headerFilter!=null){
        app.headerFilter = Config.headerFilter;
      }      
      if(Config.background!=null){
        app.background = Config.background;
      }
      if(Config.bgColor!=null){        
        app.bgColor = Config.bgColor;
      }
    },
    toggleBackground(){            
      var Config = Store.loadConfig();
      this.assignConfig(Config,true);
      switch(app.backgroundToggle){        
        case true:
          this.loadBackground(jQuery('#settings .fixed-plugin a').eq( app.background ));
        break;
        case false:
          this.changeHeaderColor(app.bgColor);
        break;
      }
      Store.save('backgroundToggle',app.backgroundToggle);
    },
    stub(){     
      /*WARNING - REMEMBER TO DELETE AFTER TEST*/
      return;
      pass = "";
      /*WARNING - REMEMBER TO DELETE AFTER TEST*/
      Config = Store.loadConfig();      
      let data = new FormData();
        Json.readFormat = "CRYPT";     
        app = this;   
        //Json.readJsonCrypted(Json,Config.passwords); 
        var result = Crypt.decryptJSON(Config.passwords,pass);
        Json.Obj = result;    
        Json.Obj = Json.splitJson(Json.Obj);
        Json.finishLoad();
    },   
    stubAction(){
      
    },
    inputPass() {
      var MasterPass = prompt('Please enter your Master Password to load the Passwords', ' ');
      MasterPass = MasterPass.trim();        
      return MasterPass;
    },
    fileUpload(){
      /*Upload File*/        
      jQuery( "#upload" ).change(function(e) {
        e.preventDefault();  
        e.stopPropagation();           
        var files = e.target.files;        
        file = files[0];
        let data = new FormData();
        Json.readFormat = "CRYPT";        
        File.readFile(Json,data,file);          
      });     
    },
    //TODO:
    loadPassStored(){
      Config = Store.loadConfig();      
      let data = new FormData();
        Json.readFormat = "CRYPT";        
        Json.readJsonCrypted(Json,Config.passwords); 
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
          var top = search.offset().top - jQuery('nav.navbar').height() - search.parent().height();
          jQuery('html,body').animate({scrollTop: (top) },'slow');    
          jQuery('.navbar-toggler').click();
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
      /*MODAL*/
      /*anime({
        targets: '#ItemInfo',
        scale: 0,
        duration: 500   
      });
      jQuery('#ItemInfo').on('hidden.bs.modal', function () {
        anime({
          targets: '#ItemInfo',
          scale: 0,
          duration: 500   
        });
      });*/
    },    
    openModal(elem){      
     /* anime({
        targets: '#ItemInfo',
        scale: 1,
        duration: 500   
      });*/
      if(this.copyTrigger == false){  
        vm = this;
        vm.Password = elem;     
        jQuery('#ItemInfo').modal('show');
        // To update Pass on modal open
        app.passActive = !app.passActive;
        app.showPass(elem);
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
      var current = this.hasStoredPass ? jQuery( "#callLoadStored" ) : jQuery( "#callUpload" );  
      jQuery('#callLoadStored').fadeOut("slow");
      jQuery('#callUpload').fadeOut("slow");
      jQuery(current).fadeOut("slow", function() {
        jQuery('#callUpload').remove();
        app.showMain(true,false);         
        jQuery('#actions').animate({
          opacity: '1',
          height: '100%',
        });                
        jQuery(".column").fadeIn( "slow", function() {
          app.changeTheme(app.Theme);
        });
        
      });          
    },
    loadJson(Obj){
      vm = this;
      vm.items = Obj.Passwords;
      this.Passwords = Obj.Passwords;
    }, 
    /*SETTINGS*/    
    loadSettings(){
      this.loadBackground(jQuery('#settings .fixed-plugin a').eq( app.background ));
      this.changeHeaderColor(app.bgColor);
      /*Slider for Header-filter Strength*/
      console.log(this.headerFilter);
      if(!app.headerFilter){
        app.headerFilter = this.headerFilter;
      }
      var sliderHeaderFilter = document.getElementById('sliderHeaderFilter');    
      noUiSlider.create(sliderHeaderFilter, {
        start: app.headerFilter,
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
        app.headerFilter = parseInt(val)
        Store.save("headerFilter", app.headerFilter);
      });
      
    },
    /*Change the Background of Header*/
    loadBackground(obj,save=false){
      jQuery(this.bgAtual).parent().removeClass('active');
      this.bgAtual = obj;
      var img = (jQuery(obj).children('img').attr('src'));      
      jQuery('.page-header').fadeOut('fast', function () {  
        jQuery('.page-header').css('background-image','url("'+img+'")');          
        jQuery('.page-header').fadeIn('fast');
      });
      jQuery(obj).parent().addClass('active');
      //jQuery('html,body').animate({scrollTop: jQuery('.page-header').offset().top },'slow');
      this.backgroundToggle = true;      
      if(save){
        app.background = jQuery(".fixed-plugin a").index( obj );
        Store.save("background",app.background);
      }
    },
    /*Change color of Header*/
    changeHeaderColor(color,save=false){//EEE  
      jQuery('.jscolor').val(color);
      jQuery('.page-header').fadeOut('fast', function () {  
        jQuery('.page-header').css('background','#'+color);
        jQuery('.page-header').fadeIn('fast');
      });
      this.headerColorToggle = true;
      if(save){
        app.bgColor = color;
        Store.save('bgColor',app.bgColor);
      }
      jQuery('#sliderHeaderFilter input').val(app.bgColor);
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
         // this.Vibrate["#callUpload"] = val;
         // this.assignVibrate(button,val);
        break;
      }      
    },*/
    /*assignVibrate(button,val){
      switch(val){
        case '20ms':
        //jQuery(button).vibrate("short");
        break;        
      }
      console.log(button);
      console.log(val);
    },    
    */
    /* For Themes */
    changeTheme(theme='',save=false){
      jQuery('.nav-color').removeClass('bg-'+OldTheme);      
      jQuery('.btn-color').removeClass('btn-'+OldTheme);
      jQuery('.text-color').removeClass('text-'+OldTheme);
      app.Theme = theme;
      OldTheme = theme;
      jQuery('.nav-color').addClass('bg-'+app.Theme);      
      jQuery('.btn-color').addClass('btn-'+app.Theme);
      jQuery('.text-color').addClass('text-'+app.Theme);      
      // jQuery('.navbar-toggler').click();       
      if(save){
        Store.save("theme",app.Theme);
      }
    },    
  },  
});
Vue.component('item-component', {
  props: ['item'],
  computed: {
    theme: function () {
      return "btn-"+app.Theme;                   
    } 
  },
  template:`<div  v-bind:class="[item.Credentials.Pass ? '' : 'disabled']" class="card list-group list-group-flush item" v-on:click="app.openModal(item)">  
    <!--<div class="list-group-item"><p class="text-color">{{item.Categories}}</p></div>-->
    <div>
      <div class="desc">
        <div class="list-group-item">{{ item.Title }}</div>
      </div>
      <div class="copy">
        <div v-bind:class="theme" v-bind:id="'list-' + item.id" class="btnCopy btn btn-copy  btn-color btn-sm" v-on:click="app.copyToClipboard(item)">
        <div class="text">Copy Pass</div>        
        </div>        
      </div>
    </div>
    </div>`,
});
Vue.component('item-desc',{
  props: ['Password'],
  computed: {
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
        <div class="modal-body">
          <h4 class="card-title">Category {{ cleanedCategory }}</h4>          
          <!--LOGIN-->
          <h6 v-if="Password.Credentials && Password.Credentials.Login" class="card-subtitle mb-2 text-muted">Login: <span>{{Password.Credentials.Login}}</span></h6>  
          <h6 v-else class="card-subtitle mb-2 text-muted">Login: <span>Empty</span></h6>  
          <!--PASS-->
          <ul class="credentialsPass">
            <li>
              <h6 v-if="Password.Credentials && Password.Credentials.Pass" class="card-subtitle mb-2 text-muted">Pass: <span>
              <input disabled id="pass" type="text" class="" value="***"> 
              </span></h6>
              <h6 v-else class="card-subtitle mb-2 text-muted">Pass: <span>Empty</span></h6>  
            </li>
            <li>
            <!--EYE-->
            <div v-on:click="app.showPass(Password)" class="eye eyeClosed"></div> 
            </li>
          </ul>
          <div class="clr"></div>
          <!--DESC AND LINK-->
          <p v-if="Password.Desc" class="card-text">{{Password.Desc}}</p>
          <a v-if="Password.Link" v-bind:href="''+Password.Link+''" class="text-color card-link">{{Password.Link}}</a>

          </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <div id="list-0" class="btnCopy btn btn-color" v-on:click="app.copyToClipboard(Password)">
            <div class="text">Copy Pass</div>            
          </div>          
        </div>
      </div>
    </div>
  </div>`,
});