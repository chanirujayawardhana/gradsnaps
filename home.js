var cur=null,sending=false,submitted=false,slip=null;
var SLIP_TXT='+ Upload payment slip (photo, screenshot or PDF)';
function $(i){return document.getElementById(i)}
function total(){return cur.name==='CREW'?cur.price*Math.max(5,+$('pp').value||5):cur.price}
function upd(){$('mSum').innerHTML='<b>'+cur.name+'</b> package · Total LKR '+total().toLocaleString()+'<br>Advance now: LKR 3,000 · Balance: LKR '+(total()-3000).toLocaleString()}
function msg(t,bad){var m=$('subMsg');m.className='avail'+(bad?' bad':'');m.textContent=t||''}
function today(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}

/* ---------- booked slots ---------- */
function bookedOf(d){return BOOKED[d]||[]}
function freeSlots(d){var b=bookedOf(d);return SLOTS.filter(function(t){return b.indexOf(t)<0})}
/* Pulls bookings from the Google Sheet (if BOOKING_URL is set) and merges them with the manual BOOKED list */
function loadBooked(cb){
  if(typeof BOOKING_URL==='undefined'||!BOOKING_URL){if(cb)cb();return}
  fetch(BOOKING_URL+(BOOKING_URL.indexOf('?')>-1?'&':'?')+'t='+Date.now()).then(function(r){return r.json()}).then(function(j){
    if(j&&j.booked){for(var d in j.booked){var a=BOOKED[d]=BOOKED[d]||[];j.booked[d].forEach(function(t){if(a.indexOf(t)<0)a.push(t)})}}
    if(cb)cb()
  }).catch(function(){if(cb)cb()})
}
function fillSlots(){
  var d=$('dt').value,s=$('tm'),box=$('avail'),keep=s.value;
  s.innerHTML='<option value="">Select a time slot</option>';
  if(!d){box.className='avail';box.textContent='Pick a date to see available times.';return}
  var b=bookedOf(d);
  SLOTS.forEach(function(t){var o=document.createElement('option');o.value=t;
    if(b.indexOf(t)>-1){o.textContent=t+' — Already booked';o.disabled=true}else o.textContent=t;
    s.appendChild(o)});
  if(keep&&b.indexOf(keep)<0)s.value=keep;
  var f=freeSlots(d);
  if(!f.length){box.className='avail bad';box.textContent='Sorry, this date is fully booked. Please choose another date.'}
  else{box.className='avail';box.textContent='Available: '+f.join(', ')+(b.length?'  ·  Already booked: '+b.join(', '):'')}
}
function slotCheck(){
  var d=$('dt').value,t=$('tm').value,box=$('avail');
  if(d&&t&&bookedOf(d).indexOf(t)>-1){var f=freeSlots(d);box.className='avail bad';
    box.textContent='Sorry, '+t+' is already booked on this date. '+(f.length?'Available: '+f.join(', ')+'.':'This date is fully booked, please choose another date.');
    $('tm').value='';return false}
  return true
}

/* ---------- modal ---------- */
function clearSlip(){slip=null;$('slip').value='';$('slipTxt').textContent=SLIP_TXT;$('slipPrev').hidden=true;$('slipPrev').removeAttribute('src')}
function resetForm(){['fn','ph','em','dt','un','vn','nt'].forEach(function(i){$(i).value=''});$('pp').value=5;$('tm').innerHTML='';clearSlip();submitted=false}
function openBook(n,p){
  if(submitted)resetForm();
  cur={name:n,price:p};
  $('crew').style.display=n==='CREW'?'block':'none';
  $('mTitle').textContent='Book '+n;
  $('bk').style.display='block';$('done').style.display='none';msg('');
  upd();$('dt').min=today();fillSlots();
  $('modal').classList.add('open');
  loadBooked(fillSlots);
}
function closeBook(){$('modal').classList.remove('open')}
$('pp').addEventListener('input',upd);
$('modal').addEventListener('click',function(e){if(e.target===this)closeBook()});
$('dt').addEventListener('change',fillSlots);
$('tm').addEventListener('change',slotCheck);

/* ---------- helpers ---------- */
function cp(t,b){var done=function(){var o=b.textContent;b.textContent='Copied';setTimeout(function(){b.textContent=o},1500)};
  try{navigator.clipboard.writeText(t).then(done,function(){alert('Account number: '+t)})}catch(e){alert('Account number: '+t)}}
function val(i){return $(i).value.trim()}
function details(){
  return encodeURIComponent(['GradSnaps booking','Package: '+cur.name,'Total: LKR '+total(),'Name: '+val('fn'),'Phone: '+val('ph'),'Email: '+val('em'),
    'Date: '+val('dt'),'Time: '+val('tm'),'University: '+val('un'),'Venue: '+val('vn'),'Notes: '+val('nt')].concat(cur.name==='CREW'?['People: '+val('pp')]:[]).join('\n'))
}
function wa(){window.open('https://wa.me/94761071584?text='+details()+encodeURIComponent('\n\nI have submitted my booking and payment slip on the website.'),'_blank')}

/* ---------- payment slip ---------- */
function readB64(f){return new Promise(function(res,rej){var r=new FileReader();r.onload=function(){res(r.result)};r.onerror=rej;r.readAsDataURL(f)})}
function toJpeg(f){return new Promise(function(res,rej){
  var u=URL.createObjectURL(f),im=new Image();
  im.onload=function(){var m=1600,s=Math.min(1,m/Math.max(im.width,im.height)),c=document.createElement('canvas');
    c.width=Math.round(im.width*s);c.height=Math.round(im.height*s);
    var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);
    URL.revokeObjectURL(u);res(c.toDataURL('image/jpeg',.82))};
  im.onerror=function(){URL.revokeObjectURL(u);rej(new Error('bad image'))};
  im.src=u})}
$('slip').addEventListener('change',function(){
  var f=this.files[0];slip=null;msg('');
  if(!f){clearSlip();return}
  var label='✓ '+f.name+' (tap to change)';
  if(f.type==='application/pdf'||/\.pdf$/i.test(f.name)){
    if(f.size>4*1024*1024){clearSlip();msg('That PDF is too large (max 4 MB). Please upload a screenshot instead.',true);return}
    readB64(f).then(function(u){slip={name:f.name,type:'application/pdf',data:u.split(',')[1]};$('slipPrev').hidden=true;$('slipTxt').textContent=label})
      .catch(function(){clearSlip();msg('Could not read that file. Please try again.',true)});
    return}
  toJpeg(f).then(function(u){slip={name:f.name.replace(/\.[^.]+$/,'')+'.jpg',type:'image/jpeg',data:u.split(',')[1]};
    $('slipPrev').src=u;$('slipPrev').hidden=false;$('slipTxt').textContent=label})
    .catch(function(){clearSlip();msg('Could not read that file. Please upload a JPG/PNG screenshot or a PDF.',true)})
});

/* ---------- submit ---------- */
function ok(){
  if(!val('fn')||!val('ph')){msg('Please enter your name and phone number.',true);return false}
  if(!val('dt')||!val('tm')){msg('Please choose a date and an available time slot.',true);return false}
  if(!slotCheck()){msg('That time slot is already booked. Please choose another.',true);return false}
  if(!slip){msg('Please upload your payment slip.',true);return false}
  return true
}
function submitBooking(){
  if(sending||!ok())return;
  if(typeof BOOKING_URL==='undefined'||!BOOKING_URL){msg('Online booking is not connected yet. Please send your details on WhatsApp instead.',true);$('done').style.display='none';return}
  sending=true;$('sub').disabled=true;$('sub').textContent='Sending…';msg('Uploading your booking and slip, please wait…');
  var t=total(),payload={package:cur.name,total:t,advance:3000,balance:t-3000,name:val('fn'),phone:val('ph'),email:val('em'),
    date:val('dt'),time:val('tm'),university:val('un'),venue:val('vn'),people:cur.name==='CREW'?val('pp'):'',notes:val('nt'),slip:slip};
  fetch(BOOKING_URL,{method:'POST',headers:{'Content-Type':'text/plain;charset=utf-8'},body:JSON.stringify(payload)})
    .then(function(r){return r.json()})
    .then(function(j){
      if(j&&j.ok){
        var a=BOOKED[payload.date]=BOOKED[payload.date]||[];if(a.indexOf(payload.time)<0)a.push(payload.time);
        submitted=true;msg('');$('bk').style.display='none';$('done').style.display='block';$('mTitle').textContent='Booking received';
        document.querySelector('#modal .box').scrollTop=0;
      }else if(j&&j.error==='taken'){
        msg('Sorry, that time slot was just booked by someone else. Please choose another time.',true);loadBooked(fillSlots)
      }else{throw new Error('failed')}
    })
    .catch(function(){msg('Could not send your booking. Please check your connection and try again, or send it on WhatsApp.',true)})
    .then(function(){sending=false;$('sub').disabled=false;$('sub').textContent='Submit booking'});
}

loadBooked();
