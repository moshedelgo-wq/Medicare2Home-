
const menu=document.querySelector('.menu');
const nav=document.querySelector('.main-nav');
if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));});}
document.querySelectorAll('.tabs button').forEach(btn=>btn.addEventListener('click',()=>{const wrap=btn.closest('.form-card');wrap.querySelectorAll('.tabs button').forEach(b=>b.classList.remove('active'));wrap.querySelectorAll('.form').forEach(f=>f.classList.remove('active'));btn.classList.add('active');wrap.querySelector('#'+btn.dataset.tab).classList.add('active');}));
function formToMailto(form){
  const labels=[...form.querySelectorAll('label')]; const lines=[];
  labels.forEach(label=>{const field=label.querySelector('input:not([type=file]):not([type=checkbox]),textarea,select');if(field&&field.value.trim()){const name=label.childNodes[0]?.textContent?.trim()||field.name||'Field';lines.push(name+': '+field.value.trim());}});
  const lang=document.documentElement.lang; const subject=lang==='ru'?'Запрос с сайта Medicare':lang==='en'?'Medicare website inquiry':'פנייה מאתר מדיקר';
  const note=lang==='ru'?'Если необходимо, приложите рецепт/документы к этому письму.':lang==='en'?'If needed, please attach the prescription/documents to this email.':'במידת הצורך, יש לצרף למייל את המרשם/המסמכים.';
  location.href='mailto:PHARMACY@MEDICARE.CO.IL?subject='+encodeURIComponent(subject)+'&body='+encodeURIComponent(lines.join('\n')+'\n\n'+note);
}
document.querySelectorAll('form').forEach(form=>form.addEventListener('submit',e=>{e.preventDefault();if(form.reportValidity())formToMailto(form);}));

/* V7.1 mobile navigation behavior */
(function(){
  const menuBtn=document.querySelector('.menu');
  const mainNav=document.querySelector('.main-nav');
  if(!menuBtn||!mainNav) return;
  const closeMenu=()=>{
    mainNav.classList.remove('open');
    menuBtn.setAttribute('aria-expanded','false');
  };
  mainNav.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));
  document.addEventListener('keydown',e=>{if(e.key==='Escape') closeMenu();});
  document.addEventListener('click',e=>{
    if(!mainNav.contains(e.target) && !menuBtn.contains(e.target)) closeMenu();
  });
})();

(function(){
 const dialog=document.getElementById('site-search-dialog'); if(!dialog)return;
 const input=dialog.querySelector('#site-search-input'), form=dialog.querySelector('.site-search-form'), results=dialog.querySelector('#search-results'), status=dialog.querySelector('#search-status'), closeBtn=dialog.querySelector('.search-close');
 let opener=null; const lang=document.documentElement.lang||'he'; const idx=(window.MEDICARE_SEARCH_INDEX||{})[lang]||[];
 const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function open(b){opener=b;dialog.hidden=false;document.body.style.overflow='hidden';setTimeout(()=>input.focus(),0)}
 function close(){dialog.hidden=true;document.body.style.overflow='';results.innerHTML='';input.value='';if(opener)opener.focus()}
 document.querySelectorAll('.search-open').forEach(b=>b.addEventListener('click',()=>open(b))); closeBtn.addEventListener('click',close); dialog.addEventListener('click',e=>{if(e.target===dialog)close()});
 document.addEventListener('keydown',e=>{
   if(e.key==='Escape'&&!dialog.hidden){close();return;}
   if(e.key==='Tab'&&!dialog.hidden){
     const focusable=[...dialog.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(el=>!el.hidden&&el.offsetParent!==null);
     if(!focusable.length)return;
     const first=focusable[0],last=focusable[focusable.length-1];
     if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
     else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
   }
 });
 form.addEventListener('submit',e=>{e.preventDefault();const q=input.value.trim().toLocaleLowerCase(lang);results.innerHTML='';if(q.length<2)return;const terms=q.split(/\s+/);const m=idx.map(x=>{const hay=(x.title+' '+x.description+' '+x.text).toLocaleLowerCase(lang);const score=terms.reduce((n,t)=>n+(hay.includes(t)?1:0),0)+(x.title.toLocaleLowerCase(lang).includes(q)?3:0);return{x,score}}).filter(o=>o.score>0).sort((a,b)=>b.score-a.score).slice(0,12);if(!m.length){const no=dialog.dataset.noResults||'No results';results.innerHTML='<p>'+esc(no)+'</p>';status.textContent=no;return}results.innerHTML=m.map(o=>'<a class="search-result" href="'+esc(o.x.url)+'"><b>'+esc(o.x.title)+'</b><span>'+esc(o.x.description)+'</span></a>').join('');status.textContent=String(m.length)});
})();
