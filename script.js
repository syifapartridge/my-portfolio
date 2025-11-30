// Typing loop (type + erase repeatedly)
(function(){
  const el = document.getElementById('typing');
  const text = "Welcome to my creative space ૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა";
  let i = 0, forward = true, speed = 36, pause = 1000;
  function step(){
    if(!el) return;
    if(forward){
      el.textContent = text.slice(0, i+1); i++;
      el.classList.add('caret');
      if(i >= text.length){ forward = false; setTimeout(step, pause); return; }
    } else {
      el.textContent = text.slice(0, i-1); i--;
      if(i <= 0){ forward = true; setTimeout(step, 500); return; }
    }
    setTimeout(step, speed);
  }
  step();
})();

// Projects data for overlay/details
const projectData = {
  p1: {
    title: 'Kita Bisa Lolos Beasiswa',
    meta: 'Role: Chief Executive Organizer • Tools: Zoom, Canva, Docs',
    body: `Organized a webinar talk show focused on scholarship procedures (KIP-K, Bank Indonesia). Responsibilities included coordinating the event flow, ensuring platforms and devices were properly set up, and assisting in poster design and material preparation.`
  },
  p2: {
    title: 'Nine Stars — Digital Store Management',
    meta: 'Role: Secretary • Tools: Shopee, Buka Olshop, WordPress, Canva',
    body: `Grade 12 practical: my team ran Nine Stars (online/offline). I prepared reports, managed store records, assisted product production, sourced raw materials, and completed administrative and performance reporting.`
  },
  p3: {
    title: 'Daily Financial Recording System (Java)',
    meta: 'Role: System Analyst • Tools: Java',
    body: `Designed system architecture and analyzed requirements for a Java-based daily financial recording system. Responsible for overall system design and flow.`
  }
};

// overlay elements
const overlay = document.getElementById('overlay');
const detailTitle = document.getElementById('detailTitle');
const detailMeta = document.getElementById('detailMeta');
const detailBody = document.getElementById('detailBody');

function openProject(id){
  const d = projectData[id];
  if(!d) return;
  detailTitle.textContent = d.title;
  detailMeta.textContent = d.meta;
  detailBody.textContent = d.body;
  overlay.classList.add('open');
  overlay.setAttribute('aria-hidden','false');
  history.pushState({project:id}, d.title, '#project-'+id);
}
function closeOverlay(){
  overlay.classList.remove('open');
  overlay.setAttribute('aria-hidden','true');
  if(location.hash.startsWith('#project-')) history.back();
}

// wire project elements
document.querySelectorAll('.project-card').forEach(card=>{
  card.addEventListener('click', ()=> openProject(card.dataset.id));
  card.addEventListener('keydown', (e)=>{ if(e.key==='Enter' || e.key===' ') openProject(card.dataset.id); });
});
document.getElementById('closeDetail').addEventListener('click', closeOverlay);
overlay.addEventListener('click', (e)=>{ if(e.target === overlay) closeOverlay(); });
window.addEventListener('popstate', ()=>{ if(!location.hash.startsWith('#project-')) closeOverlay(); });

// skills micro-tooltips
document.querySelectorAll('.skill').forEach(s=>{
  s.addEventListener('click', ()=>{
    const label = s.dataset.skill || s.textContent;
    const tip = document.createElement('div');
    tip.textContent = label;
    tip.style.cssText = 'position:fixed;left:50%;top:12%;transform:translateX(-50%);background:#f3a6c8;color:#fff;padding:8px 12px;border-radius:12px;z-index:9999;font-family:inherit';
    document.body.appendChild(tip);
    setTimeout(()=> tip.remove(), 1000);
  });
});

// contact preview behavior (first click shows preview modal, then open)
const contactPreview = document.getElementById('contactPreview');
const previewTitle = document.getElementById('previewTitle');
const previewHref = document.getElementById('previewHref');
const openContactLink = document.getElementById('openContactLink');
let currentContactHref = '';

document.querySelectorAll('.contact-preview').forEach(btn=>{
  btn.addEventListener('click', (e)=>{
    const href = btn.dataset.href;
    const type = btn.dataset.type;
    currentContactHref = href;
    previewTitle.textContent = type === 'email' ? 'Email' : (type === 'whatsapp' ? 'WhatsApp' : 'LinkedIn');
    previewHref.textContent = href;
    contactPreview.classList.add('open');
    contactPreview.setAttribute('aria-hidden','false');
  });
});

document.getElementById('closeContactPreview').addEventListener('click', ()=> {
  contactPreview.classList.remove('open');
  contactPreview.setAttribute('aria-hidden','true');
});
openContactLink.addEventListener('click', ()=> {
  if(currentContactHref) window.open(currentContactHref, '_blank', 'noopener');
});

// form (client-side only)
function handleForm(e){
  e.preventDefault();
  const btn = e.target.querySelector('.btn');
  btn.disabled = true; btn.textContent = 'Sending...';
  setTimeout(()=>{ btn.textContent = 'Sent ✓'; e.target.reset(); setTimeout(()=>{ btn.textContent = 'Send inquiry'; btn.disabled=false; },1200); },900);
}

// custom cursor
const small = document.getElementById('cursorSmall');
const ring = document.getElementById('cursorRing');
let mx = -100, my = -100;
document.addEventListener('mousemove', (e)=>{
  mx = e.clientX; my = e.clientY;
  small.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
  ring.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
});
document.addEventListener('mousedown', ()=> { small.style.transform += ' scale(.8)'; ring.style.transform += ' scale(.95)'; });
document.addEventListener('mouseup', ()=> { small.style.transform = small.style.transform.replace(' scale(.8)',''); ring.style.transform = ring.style.transform.replace(' scale(.95)',''); });

// ensure profile photo loads cleanly (avoid hairline artifacts)
const profilePhoto = document.getElementById('profilePhoto');
const checkImg = new Image();
checkImg.onload = ()=> { /* ok */ };
checkImg.onerror = ()=> { profilePhoto.style.background = 'var(--bubble-a)'; profilePhoto.style.objectFit='cover'; };
checkImg.src = profilePhoto.src;

// entrance animation for sections
document.querySelectorAll('main section, .bottom-quotes').forEach((el, i)=>{
  el.style.opacity = 0; el.style.transform = 'translateY(8px)';
  setTimeout(()=> { el.style.transition = 'opacity .6s, transform .6s'; el.style.opacity = 1; el.style.transform = 'translateY(0)'; }, 160 * i + 140);
});

// open project from URL hash if present
if(location.hash.startsWith('#project-')){
  const id = location.hash.replace('#project-','');
  setTimeout(()=> openProject(id), 250);
}
