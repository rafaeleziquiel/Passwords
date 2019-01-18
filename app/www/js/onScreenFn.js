function createOs(){
  var i = 0;  
  var speed = 100;
  function anim(){
    //console.log(jQuery('.column'));
    jQuery('.column').children().each(function(count,element) {      
      window.setTimeout( show_popup, ++count * speed );
      function show_popup(){
        jQuery(element).animate({left:0, opacity:1})
      };
    });
  }
  
  function enter(element,count){ 
    anim(); 
    window.setTimeout( show_popup, ++count * speed );
      function show_popup(){
        jQuery(element).animate({left:0, opacity:1})
      };
  };

  function leave(elem,counter){     
    jQuery(elem)
    .delay(++counter * speed)
    .animate({left:100, opacity:0})
  }

  var osVertical = new OnScreen({
    //container: '.page__content .lazy-list',
    container: '.columns .column',
    tolerance: 0
  });

  osVertical.on('enter', '.column .item', function (element) {  
    // You can use jQuery with $(element)   
    enter(element,i);
   // console.log(element);
    i++;
  });

  osVertical.on('leave', '.column .item', function (element) {  
    i = 0;
    // You can use jQuery with $(element)  
    //leave(element);
  });

}