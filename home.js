var cur=null;
function total(){return cur.name==='CREW'?cur.price*Math.max(5,+document.getElementById('pp').value||5):cur.price}
function upd(){document.getElementById('mSum').innerHTML='<b>'+cur.name+'</b> package · Total LKR '+total().toLocaleString()+'<br>Advance now: LKR 3,000 · Balance: LKR '+(total()-3000).toLocaleString()}
function openBook(n,p){cur={name:n,price:p};document.getElementById('crew').style.display=n==='CREW'?'block':'none';document.getElementById('mTitle').textContent='Book '+n;upd();document.getElementById('modal').classList.add('open')}
function closeBook(){document.getElementById('modal').classList.remove('open')}
document.getElementById('pp').addEventListener('input',upd);
document.getElementById('modal').addEventListener('click',function(e){if(e.target===this)closeBook()});
function details(){var v=function(i){return document.getElementById(i).value.trim()};
return 'GradSnaps booking%0APackage: '+cur.name+'%0ATotal: LKR '+total()+'%0AName: '+encodeURIComponent(v('fn'))+'%0APhone: '+encodeURIComponent(v('ph'))+'%0AEmail: '+encodeURIComponent(v('em'))+'%0ADate: '+v('dt')+'%0ATime: '+v('tm')+'%0AUniversity: '+encodeURIComponent(v('un'))+'%0AVenue: '+encodeURIComponent(v('vn'))+'%0ANotes: '+encodeURIComponent(v('nt'))+(cur.name==='CREW'?'%0APeople: '+v('pp'):'')}
function ok(){if(!document.getElementById('fn').value.trim()||!document.getElementById('ph').value.trim()){alert('Please enter your name and phone number.');return false}return true}
function cp(t,b){var done=function(){var o=b.textContent;b.textContent='Copied';setTimeout(function(){b.textContent=o},1500)};
  try{navigator.clipboard.writeText(t).then(done,function(){alert('Account number: '+t)})}catch(e){alert('Account number: '+t)}}
function wa(){if(!ok())return;window.open('https://wa.me/94761071584?text='+details()+'%0A%0AI have paid the LKR 3,000 advance. Payment slip attached.','_blank')}

function today(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function freeSlots(d){var b=BOOKED[d]||[];return SLOTS.filter(function(t){return b.indexOf(t)<0})}
function fillSlots(){var d=document.getElementById('dt').value,s=document.getElementById('tm'),box=document.getElementById('avail');s.innerHTML='<option value="">Select a time slot</option>';
if(!d){box.className='avail';box.textContent='Pick a date to see available times.';return}
var b=BOOKED[d]||[];SLOTS.forEach(function(t){var o=document.createElement('option');o.value=t;o.textContent=b.indexOf(t)>-1?t+' (Booked)':t;s.appendChild(o)});
var f=freeSlots(d);if(!f.length){box.className='avail bad';box.textContent='Sorry, this date is fully booked. Please choose another date.'}else{box.className='avail';box.textContent='Available times: '+f.join(', ')}}
function slotCheck(){var d=document.getElementById('dt').value,t=document.getElementById('tm').value,box=document.getElementById('avail');
if(d&&t&&(BOOKED[d]||[]).indexOf(t)>-1){var f=freeSlots(d);box.className='avail bad';box.textContent='Sorry, '+t+' is already booked on this date. '+(f.length?'Available times: '+f.join(', ')+'.':'This date is fully booked, please choose another date.');document.getElementById('tm').value='';return false}return true}
function ok(){var v=function(i){return document.getElementById(i).value.trim()};
if(!v('fn')||!v('ph')){alert('Please enter your name and phone number.');return false}
if(!v('dt')||!v('tm')){alert('Please choose a date and an available time slot.');return false}
return slotCheck()}
var _ob=openBook;openBook=function(n,p){_ob(n,p);document.getElementById('dt').min=today();fillSlots()};
document.getElementById('dt').addEventListener('change',fillSlots);document.getElementById('tm').addEventListener('change',slotCheck);
