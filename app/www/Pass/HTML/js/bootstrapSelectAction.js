function createSelect(){
  var content = "<input type=text onKeyDown='event.stopPropagation();' onKeyPress='addSelectInpKeyPress(this,event)' onClick='event.stopPropagation()' placeholder='Add item'> <span class='glyphicon glyphicon-plus addnewicon' onClick='addSelectItem(this,event,1);'></span>";
 
  var divider = jQuery('<option/>')
          .addClass('divider')
          .data('divider', true);
          
 
  var addoption = jQuery('<option/>')
          .addClass('additem')
          .data('content', content)
      
  jQuery('.selectpicker')
          .append(divider)
          .append(addoption)
          .selectpicker();
 
}
 
function addSelectItem(t,ev)
{
   ev.stopPropagation();
 
   var txt=jQuery(t).prev().val().replace(/[|]/g,"");
   if (jQuery.trim(txt)=='') return;
   var p=jQuery(t).closest('.bootstrap-select').prev();
   var o=jQuery('option', p).eq(-2);
   o.before( jQuery("<option>", { "selected": true, "text": txt}) );
   p.selectpicker('refresh');
}
 
function addSelectInpKeyPress(t,ev)
{
   ev.stopPropagation();
 
   // do not allow pipe character
   if (ev.which==124) ev.preventDefault();
 
   // enter character adds the option
   if (ev.which==13)
   {
      ev.preventDefault();
      addSelectItem(jQuery(t).next(),ev);
   }
}