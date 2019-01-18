jQuery(".btnCopy").click(function() {
  var targetBtn = "#"+this.id;    
  assignAnimation(targetBtn);   
});
function assignAnimation(targetBtn){
  var target = targetBtn+" .text"; 
  anime({
    targets: target,
    duration: 750,
    opacity: "0",
    color:'#fff',
  }) 
  var pathEls = jQuery(targetBtn+" .check"); 
  for (var i = 0; i < pathEls.length; i++) {
    var pathEl = pathEls[i];
    var offset = anime.setDashoffset(pathEl);
    pathEl.setAttribute("stroke-dashoffset", offset);
  }
  var basicTimeline = anime.timeline({
    autoplay: false
  });
  basicTimeline
  .add({
    targets: targetBtn,
    width: 80,
    height: 80,
    delay:100,
    duration: 750,
    borderRadius: 80,   
    backgroundColor: "#71DFBE"
  })
  .add({
    targets: pathEl,
    strokeDashoffset: [offset, 0],
    duration: 200,
    easing: "easeInOutSine"
  });
  basicTimeline.play();
}