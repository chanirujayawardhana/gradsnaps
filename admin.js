/* GradSnaps gallery manager. Works entirely in your browser: nothing is uploaded anywhere. */
(function(){
var CATS=['Individual','Couple','Group'];
var MAX_SIDE=1800, QUALITY=0.86;
var orig=(window.SHOOTS||[]);
var shoots=orig.map(function(s){return{type:s.type,title:s.title,open:false,photos:s.photos.map(function(p){return{path:p,file:null,url:p}})}});
var filter='All',dirty=false,focusNew=false;

function $(id){return document.getElementById(id)}
function dirname(p){return p.replace(/\/[^\/]*$/,'')}
function base(p){return p.split('/').pop()}
function h(tag,props){var e=document.createElement(tag);for(var k in (props||{})){var v=props[k];if(v==null||v===false)continue;if(k==='class')e.className=v;else if(k.slice(0,2)==='on')e[k]=v;else e.setAttribute(k,v)}
  for(var i=2;i<arguments.length;i++){var c=arguments[i];if(c==null||c===false)continue;if(Array.isArray(c)){c.forEach(function(x){e.appendChild(x)});continue}e.appendChild(typeof c==='string'?document.createTextNode(c):c)}return e}
function btn(label,fn,cls){return h('button',{class:'sb'+(cls?' '+cls:''),type:'button',onclick:fn},label)}
function toast(m){var t=$('toast');t.textContent=m;t.style.opacity=1;clearTimeout(toast.t);toast.t=setTimeout(function(){t.style.opacity=0},3800)}
function touch(){dirty=true;status()}
function status(msg){$('status').textContent=msg||(dirty?'Unsaved changes':'No changes yet');$('save').disabled=!dirty}

/* ---------- drawing ---------- */
function render(){
  var tb=$('tabs');tb.innerHTML='';
  ['All'].concat(CATS).forEach(function(c){var b=h('button',{class:c===filter?'on':'',type:'button',onclick:function(){filter=c;render()}},c);tb.appendChild(b)});
  var list=$('list');list.innerHTML='';
  var vis=[];shoots.forEach(function(s,i){if(filter==='All'||s.type===filter)vis.push(i)});
  if(!vis.length)list.appendChild(h('div',{class:'empty'},'No shoots here yet. Click “+ New shoot”.'));
  vis.forEach(function(i,vi){list.appendChild(row(i,vi,vis))});
  if(focusNew){focusNew=false;var f=list.querySelector('.fields input');if(f){f.focus();f.select();window.scrollTo(0,0)}}
}
function move(i,vis,vi,dir){var j=vis[vi+dir];if(j==null)return;var t=shoots[i];shoots[i]=shoots[j];shoots[j]=t;touch();render()}
function row(i,vi,vis){
  var s=shoots[i],cover=s.photos[0];
  var title=h('input',{value:s.title,'aria-label':'Shoot title',placeholder:'Title'});
  title.oninput=function(){s.title=title.value;touch()};
  var type=h('select',{'aria-label':'Category'},CATS.map(function(c){return h('option',{value:c},c)}));
  type.value=s.type;type.onchange=function(){s.type=type.value;touch();render()};
  var head=h('div',{class:'ah'},
    h('div',{class:'cv'},cover?h('img',{src:cover.url,alt:''}):null),
    h('div',{class:'fields'},title,type,h('span',{class:'cnt'},s.photos.length+(s.photos.length===1?' photo':' photos'))),
    h('div',{class:'acts'},
      btn('▲',function(){move(i,vis,vi,-1)}),btn('▼',function(){move(i,vis,vi,1)}),
      btn(s.open?'Hide photos':'Photos',function(){s.open=!s.open;render()}),
      btn('Delete',function(){if(confirm('Delete “'+(s.title||'this shoot')+'” from the gallery?')){shoots.splice(i,1);touch();render()}},'red')));
  var box=h('div',{class:'srow'},head);
  if(s.open)box.appendChild(photoGrid(s));
  return box;
}
function photoGrid(s){
  var g=h('div',{class:'pg'});
  s.photos.forEach(function(p,k){
    var bar=h('div',{class:'pb'},
      k===0?h('span',{class:'cov'},'Cover'):btn('★ Cover',function(){s.photos.unshift(s.photos.splice(k,1)[0]);touch();render()}),
      k>0?btn('◀',function(){var t=s.photos[k-1];s.photos[k-1]=s.photos[k];s.photos[k]=t;touch();render()}):null,
      k<s.photos.length-1?btn('▶',function(){var t=s.photos[k+1];s.photos[k+1]=s.photos[k];s.photos[k]=t;touch();render()}):null,
      btn('✕',function(){s.photos.splice(k,1);touch();render()},'red'));
    g.appendChild(h('div',{class:'pt'},h('img',{src:p.url,alt:'',loading:'lazy'}),bar));
  });
  var inp=h('input',{type:'file',accept:'image/*',multiple:'multiple'});
  inp.onchange=function(){addFiles(s,inp.files)};
  var tile=h('label',{class:'addt'},'+ Add photos',inp);
  tile.ondragover=function(e){e.preventDefault();tile.classList.add('over')};
  tile.ondragleave=function(){tile.classList.remove('over')};
  tile.ondrop=function(e){e.preventDefault();tile.classList.remove('over');addFiles(s,e.dataTransfer.files)};
  g.appendChild(tile);
  return g;
}
function addFiles(s,fl){
  var a=Array.prototype.slice.call(fl).filter(function(f){return /^image\//.test(f.type)||/\.(jpe?g|png|webp|gif)$/i.test(f.name)});
  if(!a.length){toast('Please choose image files (JPG or PNG).');return}
  a.sort(function(x,y){return x.name.localeCompare(y.name,undefined,{numeric:true})});
  a.forEach(function(f){s.photos.push({path:null,file:f,url:URL.createObjectURL(f)})});
  s.open=true;touch();render();
}
$('newShoot').onclick=function(){
  var t=CATS.indexOf(filter)>-1?filter:'Individual';
  var n=shoots.filter(function(s){return s.type===t}).length+1;
  shoots.unshift({type:t,title:t+' '+n,open:true,photos:[]});focusNew=true;touch();render();
};

/* ---------- saving ---------- */
async function toJpeg(file){
  var bmp;
  try{bmp=await createImageBitmap(file)}catch(e){
    bmp=await new Promise(function(res,rej){var im=new Image();im.onload=function(){res(im)};im.onerror=function(){rej(new Error('Could not read '+file.name+'. Try saving it as a JPG first.'))};im.src=URL.createObjectURL(file)})}
  var w=bmp.width||bmp.naturalWidth,hh=bmp.height||bmp.naturalHeight,sc=Math.min(1,MAX_SIDE/Math.max(w,hh));
  var c=document.createElement('canvas');c.width=Math.round(w*sc);c.height=Math.round(hh*sc);
  var x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(bmp,0,0,c.width,c.height);
  var blob=await new Promise(function(r){c.toBlob(r,'image/jpeg',QUALITY)});
  if(!blob)throw new Error('Could not convert '+file.name);
  return new Uint8Array(await blob.arrayBuffer());
}
var CRC=(function(){var t=[];for(var n=0;n<256;n++){var c=n;for(var k=0;k<8;k++)c=c&1?0xEDB88320^(c>>>1):c>>>1;t[n]=c>>>0}return t})();
function crc32(u){var c=0xFFFFFFFF;for(var i=0;i<u.length;i++)c=CRC[(c^u[i])&255]^(c>>>8);return(c^0xFFFFFFFF)>>>0}
function makeZip(files){
  var enc=new TextEncoder(),parts=[],cent=[],off=0,d=new Date();
  var time=(d.getHours()<<11)|(d.getMinutes()<<5)|(d.getSeconds()>>1),date=((d.getFullYear()-1980)<<9)|((d.getMonth()+1)<<5)|d.getDate();
  files.forEach(function(f){
    var nm=enc.encode(f.name),crc=crc32(f.data),sz=f.data.length;
    var l=new DataView(new ArrayBuffer(30));
    l.setUint32(0,0x04034b50,true);l.setUint16(4,20,true);l.setUint16(6,0x0800,true);l.setUint16(8,0,true);l.setUint16(10,time,true);l.setUint16(12,date,true);
    l.setUint32(14,crc,true);l.setUint32(18,sz,true);l.setUint32(22,sz,true);l.setUint16(26,nm.length,true);l.setUint16(28,0,true);
    parts.push(new Uint8Array(l.buffer),nm,f.data);
    var c=new DataView(new ArrayBuffer(46));
    c.setUint32(0,0x02014b50,true);c.setUint16(4,20,true);c.setUint16(6,20,true);c.setUint16(8,0x0800,true);c.setUint16(10,0,true);c.setUint16(12,time,true);c.setUint16(14,date,true);
    c.setUint32(16,crc,true);c.setUint32(20,sz,true);c.setUint32(24,sz,true);c.setUint16(28,nm.length,true);c.setUint32(42,off,true);
    cent.push(new Uint8Array(c.buffer),nm);
    off+=30+nm.length+sz;
  });
  var cs=0;cent.forEach(function(x){cs+=x.length});
  var e=new DataView(new ArrayBuffer(22));
  e.setUint32(0,0x06054b50,true);e.setUint16(8,files.length,true);e.setUint16(10,files.length,true);e.setUint32(12,cs,true);e.setUint32(16,off,true);
  return new Blob(parts.concat(cent,[new Uint8Array(e.buffer)]),{type:'application/zip'});
}
function q(str){return JSON.stringify(str)}
function dataFile(list){
  return '// ===== GRADSNAPS GALLERY (written by admin.html, but safe to edit by hand) =====\n'+
  '// ---- GALLERY: one line = one shoot. The FIRST photo is the cover.\n'+
  "// TIP: you don't need to edit this by hand. Open admin.html in your browser,\n"+
  '// add / remove / rearrange photos there, and it will give you a new copy of this file.\n'+
  'var SHOOTS = [\n'+list.map(function(s){return '  {type:'+q(s.type)+', title:'+q(s.title)+', photos:['+s.photos.map(q).join(',')+']},'}).join('\n')+'\n];\n';
}
var README='HOW TO PUBLISH THESE GALLERY CHANGES\r\n\r\n'+
'1. Unzip this file.\r\n'+
'2. Copy gallery-data.js into your GradSnaps site folder and replace the old one.\r\n'+
'3. Copy the "images" folder into your site folder. If asked, choose "Merge" / "Keep both" so your existing photos are not removed.\r\n'+
'4. Upload your site folder to your hosting again.\r\n\r\n'+
'Note: photos or shoots you deleted are removed from the gallery, but their files stay inside your images folder. You can delete those files by hand if you want to save space.\r\n';

async function save(){
  for(var a=0;a<shoots.length;a++){if(!shoots[a].photos.length){shoots[a].open=true;filter='All';render();toast('“'+(shoots[a].title||'A shoot')+'” has no photos. Add some or delete it.');return}}
  $('save').disabled=true;
  try{
    var usedF={},usedN={};
    function note(p){var d=dirname(p);usedF[d]=1;(usedN[d]=usedN[d]||{})[base(p)]=1}
    orig.forEach(function(s){s.photos.forEach(note)});
    shoots.forEach(function(s){s.photos.forEach(function(p){if(!p.file)note(p.path)})});
    var total=0,done=0,files=[],out=[];
    shoots.forEach(function(s){s.photos.forEach(function(p){if(p.file)total++})});
    for(var i=0;i<shoots.length;i++){
      var s=shoots[i],folder=null,paths=[];
      for(var k=0;k<s.photos.length;k++){var o=s.photos[k];if(!o.file){folder=dirname(o.path);break}}
      for(var k2=0;k2<s.photos.length;k2++){
        var p=s.photos[k2];
        if(!p.file){paths.push(p.path);continue}
        if(!folder){var slug=s.type.toLowerCase(),n=1;while(usedF['images/'+slug+'-'+n])n++;folder='images/'+slug+'-'+n;usedF[folder]=1}
        var names=usedN[folder]=usedN[folder]||{},nx=1;
        Object.keys(names).forEach(function(b){var m=parseInt(b,10);if(!isNaN(m)&&m>=nx)nx=m+1});
        var nm=nx+'.jpg';names[nm]=1;
        status('Preparing photo '+(done+1)+' of '+total+'…');
        files.push({name:folder+'/'+nm,data:await toJpeg(p.file)});
        paths.push(folder+'/'+nm);done++;
      }
      out.push({type:s.type,title:(s.title||'').trim()||s.type,photos:paths});
    }
    var enc=new TextEncoder();
    files.unshift({name:'gallery-data.js',data:enc.encode(dataFile(out))},{name:'README - how to publish.txt',data:enc.encode(README)});
    var url=URL.createObjectURL(makeZip(files));
    var a2=document.createElement('a');a2.href=url;a2.download='gradsnaps-gallery-update.zip';document.body.appendChild(a2);a2.click();a2.remove();
    setTimeout(function(){URL.revokeObjectURL(url)},10000);
    toast('Downloaded! Unzip it and copy the files into your site folder.');
    status('Downloaded. Keep editing or finish.');
  }catch(err){toast(err&&err.message?err.message:'Something went wrong while saving.');status()}
  $('save').disabled=false;
}
$('save').onclick=save;
window.addEventListener('beforeunload',function(e){if(dirty){e.preventDefault();e.returnValue=''}});
render();status();
})();
