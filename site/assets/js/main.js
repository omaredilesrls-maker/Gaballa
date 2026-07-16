/* Omar Edile — interazioni sito */
(function(){
  "use strict";

  // Mobile nav toggle
  var toggle=document.querySelector('.nav-toggle');
  var menu=document.getElementById('nav-menu');
  if(toggle&&menu){
    toggle.addEventListener('click',function(){
      var open=menu.classList.toggle('open');
      toggle.classList.toggle('open',open);
      toggle.setAttribute('aria-expanded',open?'true':'false');
    });
    menu.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click',function(){menu.classList.remove('open');toggle.classList.remove('open');});
    });
  }

  // Before/after slider(s)
  document.querySelectorAll('.ba').forEach(function(ba){
    var range=ba.querySelector('input[type=range]');
    var before=ba.querySelector('.before');
    var handle=ba.querySelector('.handle');
    if(!range||!before||!handle) return;
    function upd(){var v=range.value;before.style.clipPath='inset(0 '+(100-v)+'% 0 0)';handle.style.left=v+'%';}
    range.addEventListener('input',upd);upd();
  });

  // Lead form (demo submit — sostituisci l'action con un servizio reale, es. Formspree)
  document.querySelectorAll('form.lead').forEach(function(f){
    f.addEventListener('submit',function(e){
      if(f.getAttribute('data-demo')==='true'){
        e.preventDefault();
        var t=f.querySelector('.thanks');
        if(t) t.style.display='block';
        f.querySelectorAll('input,select,textarea,button').forEach(function(el){el.disabled=true;});
      }
    });
  });

  // Reveal on scroll (with safety net: nothing stays hidden)
  var reveals=document.querySelectorAll('[data-reveal]');
  function showAll(){reveals.forEach(function(el){el.style.opacity=1;el.style.transform='none';});}
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(entries){
      entries.forEach(function(en){ if(en.isIntersecting){en.target.style.opacity=1;en.target.style.transform='none';io.unobserve(en.target);} });
    },{threshold:.08,rootMargin:'0px 0px -8% 0px'});
    reveals.forEach(function(el){
      el.style.opacity=0;el.style.transform='translateY(18px)';el.style.transition='opacity .6s ease, transform .6s ease';
      io.observe(el);
    });
    // Safety net: guarantee everything is visible within 1.4s regardless of scroll
    setTimeout(showAll,1400);
  }
})();
