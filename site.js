var page=document.body.dataset.page;
function mk(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x)e.textContent=x;return e}
/* NAV */
(function(){var n=document.getElementById('nav');
n.innerHTML='<a class="logo" href="index.html" aria-label="GradSnaps home"><img src="images/logo.png" alt="GradSnaps"></a><button class="burger" id="burger" aria-label="Menu">&#9776;</button><ul id="menu"><li><a href="index.html">Home</a></li><li><a href="index.html#about">About</a></li><li><a href="gallery.html">Gallery</a></li><li><a href="index.html#packages">Packages</a></li><li><a href="reviews.html">Reviews</a></li><li><a href="index.html#contact">Contact</a></li></ul>';
var m=document.getElementById('menu');document.getElementById('burger').onclick=function(){m.classList.toggle('open')};m.onclick=function(e){if(e.target.tagName==='A')m.classList.remove('open')}})();
/* HERO IMAGE: put your photo at images/header.jpg */
(function(){var h=document.getElementById('hero');if(!h)return;var im=new Image();im.onload=function(){h.classList.add('hasimg')};im.src='images/header.jpg'})();
/* LIGHTBOX */
var lbImgs=[],lbI=0;
(function(){var d=document.createElement('div');d.className='lb';d.id='lb';
d.innerHTML='<span class="lbc" id="lbc">&times;</span><div class="lbt" id="lbt"></div><div class="lbs"><button class="ar" id="lbp" aria-label="Previous photo">&larr;</button><img id="lbm" alt=""><button class="ar" id="lbnx" aria-label="Next photo">&rarr;</button></div><div class="lbn" id="lbn"></div><div class="lbth" id="lbth"></div>';
document.body.appendChild(d);
document.getElementById('lbc').onclick=closeLb;document.getElementById('lbp').onclick=function(){lbShow(lbI-1)};document.getElementById('lbnx').onclick=function(){lbShow(lbI+1)};
d.addEventListener('click',function(e){if(e.target===d)closeLb()});
document.addEventListener('keydown',function(e){if(!d.classList.contains('open'))return;if(e.key==='Escape')closeLb();if(e.key==='ArrowLeft')lbShow(lbI-1);if(e.key==='ArrowRight')lbShow(lbI+1)});
var tx=0;d.addEventListener('touchstart',function(e){tx=e.touches[0].clientX},{passive:true});d.addEventListener('touchend',function(e){var x=e.changedTouches[0].clientX-tx;if(Math.abs(x)>50)lbShow(lbI+(x<0?1:-1))})})();
function closeLb(){document.getElementById('lb').classList.remove('open')}
function lbShow(i){lbI=(i+lbImgs.length)%lbImgs.length;document.getElementById('lbm').src=lbImgs[lbI];document.getElementById('lbn').innerHTML='<b>'+(lbI+1)+'</b> / '+lbImgs.length;
var th=document.getElementById('lbth');th.querySelectorAll('img').forEach(function(t,k){t.classList.toggle('on',k===lbI);if(k===lbI)th.scrollLeft=t.offsetLeft-th.clientWidth/2+t.clientWidth/2})}
function openLb(s){lbImgs=s.photos.slice();var th=document.getElementById('lbth');th.innerHTML='';
lbImgs.forEach(function(p,k){var t=document.createElement('img');t.src=p;t.alt='';t.onclick=function(){lbShow(k)};th.appendChild(t)});
document.getElementById('lbt').textContent=s.title;document.getElementById('lb').classList.add('open');lbShow(0)}
/* GALLERY */
function card(s){var d=mk('div','shoot');d.dataset.title=s.title;d.dataset.count=s.photos.length;var i=document.createElement('img');i.src=s.photos[0];i.alt=s.title;i.loading='lazy';i.onerror=function(){i.style.display='none'};d.appendChild(i);d.onclick=function(){openLb(s)};return d}
function gallery(limit,cats){var cat=cats[0],g=document.getElementById('grid'),tb=document.getElementById('tabs'),more=document.getElementById('more');
if(!limit){var h=decodeURIComponent(location.hash.slice(1));if(cats.indexOf(h)>-1)cat=h}
function draw(){g.innerHTML='';SHOOTS.filter(function(s){return cat==='All'||s.type===cat}).slice(0,limit||999).forEach(function(s){g.appendChild(card(s))});if(more)more.href='gallery.html#'+cat;
tb.querySelectorAll('button').forEach(function(b){b.classList.toggle('on',b.dataset.c===cat)})}
cats.forEach(function(c){var b=mk('button','',c);b.dataset.c=c;b.onclick=function(){cat=c;draw()};tb.appendChild(b)});draw()}
/* REVIEWS */
function reviews(n){var r=document.getElementById('rv');r.innerHTML='';if(!REVIEWS.length){r.appendChild(mk('div','empty','Reviews from our graduates will appear here.'));return}
REVIEWS.slice(0,n||999).forEach(function(x){var d=mk('div','rc');
if(x.bg){d.classList.add('hasbg');d.style.setProperty('--bg','url("'+x.bg.replace(/"/g,'%22')+'")')}
d.appendChild(mk('div','st','\u2605'.repeat(x.stars)+'\u2606'.repeat(5-x.stars)));d.appendChild(mk('p','','\u201c'+x.text+'\u201d'));
var f=mk('div','rf');
if(x.photo){var im=document.createElement('img');im.className='av';im.src=x.photo;im.alt=x.name;im.loading='lazy';im.onerror=function(){im.remove()};f.appendChild(im)}
f.appendChild(mk('small','',x.name));d.appendChild(f);r.appendChild(d)})}
var el=document.getElementById('emailLink');if(el){el.textContent=EMAIL;el.href='mailto:'+EMAIL}
if(page==='home'){gallery(4,['Individual','Couple','Group']);reviews(3)}
if(page==='gallery')gallery(0,['All','Individual','Couple','Group']);
if(page==='reviews')reviews();
function fig(x,b,s,c,sk){return '<g transform="translate('+x+','+b+') scale('+s+')"><path d="M-30 0L-22-110Q0-125 22-110L30 0Z" fill="'+c+'"/><circle cy="-138" r="17" fill="'+sk+'"/><path d="M-32-150L0-163L32-150L0-139Z" fill="#2b2b2d"/><path d="M-15-148V-140Q0-134 15-140V-148Z" fill="#2b2b2d"/><path d="M27-150V-126" stroke="#c9a96a" stroke-width="2"/></g>'}
(function(){var o='';for(var j=0;j<9;j++)o+=fig(70+j*135,700,2.1+(j%3)*.15,'#2b2b2d','#2b2b2d');
[[150,160,-15],[420,110,12],[700,190,-8],[960,120,20],[1100,230,-20]].forEach(function(c){o+='<path transform="translate('+c[0]+','+c[1]+') rotate('+c[2]+') scale(1.6)" d="M-18 0L0-8L18 0L0 8Z" fill="#2b2b2d"/>'});
var hb=document.getElementById('hbg');if(hb)hb.innerHTML='<svg viewBox="0 0 1200 700" preserveAspectRatio="xMidYMax slice" width="100%" height="100%"><g opacity=".09">'+o+'</g></svg>'})();
function sendReview(){var v=function(i){return document.getElementById(i).value.trim()};if(!v('rn')||!v('rt')){alert('Please add your name and review.');return}
location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('GradSnaps review from '+v('rn'))+'&body='+encodeURIComponent('Name: '+v('rn')+'\nRating: '+v('rr')+'/5\n\n'+v('rt'))}
function sendMail(){var v=function(i){return document.getElementById(i).value.trim()};
location.href='mailto:'+EMAIL+'?subject='+encodeURIComponent('GradSnaps enquiry from '+v('cn'))+'&body='+encodeURIComponent(v('cm')+'\n\nReply to: '+v('ce'))}
