/* EcoDomus — interazioni sito */
(function(){
  "use strict";

  /* ---- mobile nav ---- */
  var toggle=document.querySelector('.nav-toggle');
  var menu=document.getElementById('nav-menu');
  if(toggle&&menu){
    toggle.addEventListener('click',function(){
      var o=menu.classList.toggle('open');toggle.classList.toggle('open',o);
      toggle.setAttribute('aria-expanded',o?'true':'false');
    });
    menu.querySelectorAll('a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('open');toggle.classList.remove('open');});});
  }

  /* ---- reveal on scroll (safety net) ---- */
  var reveals=document.querySelectorAll('[data-reveal]');
  if('IntersectionObserver' in window && reveals.length){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.style.opacity=1;e.target.style.transform='none';io.unobserve(e.target);}});},{threshold:.08,rootMargin:'0px 0px -6% 0px'});
    reveals.forEach(function(el){el.style.opacity=0;el.style.transform='translateY(18px)';el.style.transition='opacity .6s ease, transform .6s ease';io.observe(el);});
    setTimeout(function(){reveals.forEach(function(el){el.style.opacity=1;el.style.transform='none';});},1500);
  }

  /* ============ ENERGY SAVINGS CALCULATOR ============ */
  var calc=document.getElementById('eco-calc');
  if(calc){
    var state={area:100, cls:'vecchio', fuel:'gas', work:'cappotto'};
    // kWh/m²·anno per stato dell'edificio
    var BASE={vecchio:175, medio:115, recente:70};
    // % risparmio per intervento
    var WORK={cappotto:0.30, serramenti:0.12, entrambi:0.42, completa:0.62};
    var WORKCLASS={cappotto:'C', serramenti:'D', entrambi:'B', completa:'A'};
    // €/kWh termico equivalente per vettore
    var COST={gas:0.12, gasolio:0.15, elettrico:0.28, pompa:0.11};
    var CO2={gas:0.20, gasolio:0.27, elettrico:0.35, pompa:0.12}; // kg CO2 / kWh

    function euro(n){return '€ '+Math.round(n).toLocaleString('it-IT');}
    function calcRun(){
      var annual=state.area*BASE[state.cls];
      var pct=WORK[state.work];
      var savedK=annual*pct;
      var savedE=savedK*COST[state.fuel];
      var co2=savedK*CO2[state.fuel]/1000; // tonnellate
      document.getElementById('r-euro').textContent=euro(savedE);
      document.getElementById('r-kwh').textContent=Math.round(savedK).toLocaleString('it-IT')+' kWh';
      document.getElementById('r-co2').textContent=co2.toFixed(1)+' t';
      document.getElementById('r-pct').textContent='-'+Math.round(pct*100)+'%';
      document.getElementById('r-class').textContent='classe '+WORKCLASS[state.work];
      document.getElementById('r-euro10').textContent=euro(savedE*10);
    }
    // segmented buttons
    calc.querySelectorAll('[data-seg]').forEach(function(group){
      var key=group.getAttribute('data-seg');
      group.querySelectorAll('button').forEach(function(b){
        b.addEventListener('click',function(){
          group.querySelectorAll('button').forEach(function(x){x.classList.remove('on');});
          b.classList.add('on');state[key]=b.getAttribute('data-val');calcRun();
        });
      });
    });
    var areaIn=document.getElementById('calc-area');
    if(areaIn){areaIn.addEventListener('input',function(){var v=parseInt(areaIn.value||'0',10);state.area=isNaN(v)?0:v;calcRun();});}
    calcRun();
  }

  /* ============ CHATBOT WIDGET ============ */
  var chatBtn=document.getElementById('eco-chat-btn');
  var chat=document.getElementById('eco-chat');
  if(chatBtn&&chat){
    var body=chat.querySelector('.eco-chat-body');
    var input=chat.querySelector('input');
    var history=[];
    function add(text,who){
      var d=document.createElement('div');d.className='msg '+who;d.textContent=text;
      body.appendChild(d);body.scrollTop=body.scrollHeight;return d;
    }
    chatBtn.addEventListener('click',function(){
      chat.classList.toggle('open');
      if(chat.classList.contains('open') && !body.dataset.init){
        body.dataset.init='1';
        add('Ciao! Sono l’assistente EcoDomus 🌿 Come posso aiutarti? Puoi chiedermi dei nostri servizi, dei progetti o come acquistare/ristrutturare.','bot');
      }
    });
    // rule-based fallback quando la funzione IA non è ancora collegata
    function fallback(q){
      q=q.toLowerCase();
      if(/prezz|costo|quanto|listino/.test(q)) return 'I prezzi dipendono dal progetto. Per una stima rapida prova il nostro Calcolatore di risparmio energetico, oppure scrivici su WhatsApp al 351 626 3082 per un preventivo gratuito.';
      if(/contatt|telefono|whatsapp|email|chiama/.test(q)) return 'Ci trovi su WhatsApp al 351 626 3082 e via email a omaredilesrls@gmail.com. Vuoi che ti ricontattiamo noi? Lascia i dati nella pagina Contatti.';
      if(/serviz|cosa fate|edilizia|pmo|investiment|ristruttura/.test(q)) return 'Ci occupiamo di edilizia sostenibile, project management (PMO), investimento immobiliare e soluzioni IA per l’edilizia. Vuoi approfondire uno di questi?';
      if(/investi|rendita|affitt/.test(q)) return 'Sviluppiamo e riqualifichiamo immobili in chiave green per la rivendita o la rendita. Raccontaci il tuo obiettivo su WhatsApp e ti proponiamo un’opportunità.';
      if(/sostenib|green|energ|cappotto|classe/.test(q)) return 'La sostenibilità è il nostro cuore: cappotto, efficientamento e materiali sani riducono i consumi fino al 60% e aumentano il valore. Prova il calcolatore per una stima!';
      return 'Grazie! Per una risposta su misura scrivici su WhatsApp al 351 626 3082: ti rispondiamo entro 24 ore. Nel frattempo posso aiutarti su servizi, progetti e sostenibilità.';
    }
    function send(){
      var q=(input.value||'').trim();if(!q)return;
      add(q,'me');input.value='';history.push({role:'user',content:q});
      var typing=add('…','bot');
      fetch('/.netlify/functions/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({messages:history})})
        .then(function(r){if(!r.ok)throw 0;return r.json();})
        .then(function(d){typing.textContent=d.reply||fallback(q);history.push({role:'assistant',content:typing.textContent});})
        .catch(function(){typing.textContent=fallback(q);});
    }
    chat.querySelector('button.send').addEventListener('click',send);
    input.addEventListener('keydown',function(e){if(e.key==='Enter')send();});
  }
})();
