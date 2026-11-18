/* VíaClara · Prototipo académico frontend, 2026.
 * Sin backend: almacenamiento local únicamente. No hay autenticación real.
 * Datos iniciales ficticios para demostración (NO son encuestas reales).
 */
(() => {
  'use strict';
  const STORAGE_KEY = 'viaclara_florencia_reportes_v1';
  const INIT_KEY = 'viaclara_florencia_initialized_v1';
  const API_MODE = !!document.querySelector('meta[name="vc-api-mode"]');
  const API_ROOT = '/api/reportes';
  const CENTER = { lat: 1.61549, lng: -75.60412 };
  const STATUSES = ['Pendiente', 'En revisión', 'Atendido'];
  const TYPES = ['Hueco o bache', 'Grieta o fisura', 'Hundimiento', 'Inundación', 'Señalización dañada', 'Otro'];
  const SEED = [
    {title:'Hueco en vía principal del sector Centro',type:'Hueco o bache',sector:'Centro',address:'Sector Centro (ubicación ilustrativa)',severity:'Alta',status:'Pendiente',description:'Reporte de ejemplo para probar el registro de afectaciones. No corresponde a una afectación real verificada.',lat:1.6159,lng:-75.6065,days:1},
    {title:'Grietas en la superficie de rodadura',type:'Grieta o fisura',sector:'El Porvenir',address:'Sector El Porvenir (ubicación ilustrativa)',severity:'Media',status:'En revisión',description:'Registro ficticio utilizado para demostrar filtros, georreferenciación y seguimiento.',lat:1.6174,lng:-75.6117,days:2},
    {title:'Hundimiento de un tramo de vía',type:'Hundimiento',sector:'La Pradera',address:'Sector La Pradera (ubicación ilustrativa)',severity:'Alta',status:'Pendiente',description:'Registro sintético sin validación en terreno.',lat:1.6107,lng:-75.6052,days:3},
    {title:'Acumulación de agua en la calzada',type:'Inundación',sector:'San Francisco',address:'Sector San Francisco (ubicación ilustrativa)',severity:'Media',status:'Atendido',description:'Caso ilustrativo para probar la visualización de reportes atendidos.',lat:1.6228,lng:-75.6023,days:5},
    {title:'Señal preventiva deteriorada',type:'Señalización dañada',sector:'Torasso',address:'Sector Torasso (ubicación ilustrativa)',severity:'Baja',status:'En revisión',description:'Registro de demostración, no corresponde a una señalización inspeccionada.',lat:1.6123,lng:-75.5993,days:8},
    {title:'Baches consecutivos en la vía',type:'Hueco o bache',sector:'Centro',address:'Sector Centro (ubicación ilustrativa)',severity:'Media',status:'Atendido',description:'Registro de prueba para mostrar la actualización de estados.',lat:1.6190,lng:-75.6068,days:10},
    {title:'Fisura longitudinal en pavimento',type:'Grieta o fisura',sector:'Juan XXIII',address:'Sector Juan XXIII (ubicación ilustrativa)',severity:'Baja',status:'Pendiente',description:'Ejemplo sintético de fisura para pruebas de filtrado.',lat:1.6079,lng:-75.6101,days:12}
  ];
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const escapeHTML = val => String(val ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const uid = () => 'AV-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2,6).toUpperCase();
  const formatDate = date => { const d = new Date(date); return Number.isNaN(d.getTime()) ? 'Sin fecha' : new Intl.DateTimeFormat('es-CO',{day:'2-digit',month:'short',year:'numeric'}).format(d); };
  const titleCaseSlug = status => status === 'En revisión' ? 'en-revision' : status.toLowerCase();
  const statusColor = s => s === 'Pendiente' ? '#e2a23c' : s === 'En revisión' ? '#368dce' : '#2da67b';
  const typesClass = type => type.includes('Grieta') ? 'grieta' : type.includes('Inundación') ? 'inundacion' : type === 'Otro' ? 'otro' : '';
  const typeGlyph = type => type.includes('Hueco') ? '◎' : type.includes('Grieta') ? '⌁' : type.includes('Hundimiento') ? '◉' : type.includes('Inundación') ? '≈' : type.includes('Señalización') ? '⚑' : '⌖';
  const statusChip = s => `<span class="status-chip ${titleCaseSlug(s)}">${escapeHTML(s)}</span>`;
  const severityChip = s => `<span class="severity ${String(s).toLowerCase()}">${escapeHTML(s)}</span>`;
  const glyph = type => `<span class="report-glyph ${typesClass(type)}" aria-hidden="true">${typeGlyph(type)}</span>`;
  let data = [];
  let memoryWarning = false;
  let photoData = '';
  let activeView = 'inicio';
  let picking = false;
  let openedID = null;
  let editingID = null;
  let toastTimer = null;
  const map = { lat:CENTER.lat, lng:CENTER.lng, zoom:14, down:null, suppressClick:false, tileVersion:0 };

  async function api(path, method = 'GET', body = undefined) {
    const headers = {'Accept':'application/json','X-Requested-With':'XMLHttpRequest'};
    if (method !== 'GET') {headers['Content-Type']='application/json';headers['X-CSRF-TOKEN']=document.querySelector('meta[name="csrf-token"]')?.content || '';}
    const response = await fetch(path, {method,headers,credentials:'same-origin',...(body === undefined ? {} : {body:JSON.stringify(body)})});
    if (response.status === 401 || (response.redirected && response.url.includes('/ingresar'))) {location.href='/ingresar';throw new Error('La sesión terminó. Vuelve a ingresar.');}
    const result = await response.json().catch(()=>({}));
    if (!response.ok) {
      let message = result.message || `Error del servidor (${response.status}).`;
      if (result.errors) {const first = Object.values(result.errors).flat()[0];if(first)message=first;}
      throw new Error(message);
    }
    return result;
  }
  async function refreshRemote() {
    try { const result = await api(API_ROOT);data=Array.isArray(result.reports)?result.reports:[];updateAll(); }
    catch(e) {toast('No se pudieron cargar los reportes del servidor: '+e.message);}
  }
  function toast(message) {const el=$('#toast');el.textContent=message;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),4200);}
  function seedRecords() {return SEED.map((s,i)=>{const {days,...r}=s;return {...r,id:`DEMO-${String(i+1).padStart(3,'0')}`,createdAt:new Date(Date.now()-days*86400000).toISOString(),photo:'',demo:true,history:[{at:new Date(Date.now()-days*86400000).toISOString(),action:'Reporte de ejemplo creado',from:null,to:r.status}]};});}
  function initData(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw!==null){const parsed=JSON.parse(raw);data=Array.isArray(parsed)?parsed:[];return;}data=seedRecords();saveData();localStorage.setItem(INIT_KEY,'yes');}catch(err){data=seedRecords();memoryWarning=true;}}
  function saveData(){if(API_MODE) return true;try{localStorage.setItem(STORAGE_KEY,JSON.stringify(data));return true;}catch(e){memoryWarning=true;toast('No se pudo guardar: el almacenamiento del navegador está lleno o bloqueado. Exporta un respaldo JSON.');return false;}}
  function getStats(){const counts=Object.fromEntries(STATUSES.map(s=>[s,0]));const types=Object.fromEntries(TYPES.map(s=>[s,0]));const sectors=new Set();let high=0;data.forEach(r=>{if(counts[r.status]!==undefined)counts[r.status]++;if(types[r.type]!==undefined)types[r.type]++;if(r.severity==='Alta')high++;sectors.add(r.sector.toLowerCase().trim());});return {counts,types,total:data.length,high,sectors:sectors.size,done: data.length?Math.round(counts.Atendido/data.length*100):0};}
  function updateNavigation(){const s=getStats();$('#sidebarCount').textContent=s.total;}
  function showView(view){if(!$('#view-'+view))return;activeView=view;$$('.view').forEach(el=>el.classList.toggle('is-visible',el.id==='view-'+view));$$('.nav-btn').forEach(el=>el.classList.toggle('is-active',el.dataset.view===view));$('#breadcrumbTitle').textContent={inicio:'Resumen general',mapa:'Mapa de afectaciones',reportar:'Nuevo reporte',reportes:'Gestión de reportes',estadisticas:'Estadísticas',acerca:'Acerca del proyecto'}[view];$('#sidebar').classList.remove('open');$('#sidebarShade').classList.remove('open');if(view==='inicio')renderDashboard();if(view==='reportes')renderReports();if(view==='estadisticas')renderStatistics();if(view==='mapa'){renderMapCount();$('#pickBanner').classList.toggle('hidden',!picking);requestAnimationFrame(renderMap);}if(view==='reportar')updateLocationSummary();window.scrollTo({top:0,behavior:'instant'});}
  function renderDashboard(){const stats=getStats();$('#kpiTotal').textContent=stats.total;$('#kpiPending').textContent=stats.counts.Pendiente;$('#kpiReview').textContent=stats.counts['En revisión'];$('#kpiDone').textContent=stats.counts.Atendido;const sorted=[...data].sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt)).slice(0,5);$('#recentReports').innerHTML=sorted.length?sorted.map(r=>`<div class="recent-item">${glyph(r.type)}<div class="recent-title"><strong>${escapeHTML(r.title)}</strong><small>${escapeHTML(r.sector)} · ${formatDate(r.createdAt)} ${r.demo?'· Ejemplo':''}</small></div>${statusChip(r.status)}</div>`).join(''):'<div class="empty-state"><div class="empty-icon">☷</div><strong>Aún no hay reportes</strong><p>Registra una afectación para comenzar.</p></div>';
   const max=Math.max(1,...Object.values(stats.types));$('#categoryChart').innerHTML=Object.entries(stats.types).filter(([k,v])=>v>0).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([type,num])=>`<div class="chart-line"><span class="chart-title">${escapeHTML(type)}</span><div class="chart-track"><div class="chart-fill" style="width:${num/max*100}%"></div></div><span class="chart-num">${num}</span></div>`).join('')||'<div class="empty-state"><strong>Sin datos</strong></div>';
   updateNavigation();
  }
  function filterReports(){const search=($('#reportSearch').value||'').toLocaleLowerCase('es-CO').trim();const status=$('#reportStatus').value;const type=$('#reportType').value;return [...data].filter(r=>(!status||r.status===status)&&(!type||r.type===type)&&(!search||[r.title,r.sector,r.address,r.id].some(x=>String(x).toLocaleLowerCase('es-CO').includes(search)))).sort((a,b)=>Date.parse(b.createdAt)-Date.parse(a.createdAt));}
  function renderReports(){const records=filterReports();$('#reportsTbody').innerHTML=records.map(r=>`<tr><td><div class="table-report-name">${glyph(r.type)}<div><strong>${escapeHTML(r.title)}</strong><small>${escapeHTML(r.type)} ${r.demo?'· Ejemplo':''}</small></div></div></td><td><strong>${escapeHTML(r.sector)}</strong><small>${escapeHTML(r.address)}</small></td><td>${severityChip(r.severity)}</td><td>${statusChip(r.status)}</td><td>${formatDate(r.createdAt)}</td><td><div class="row-buttons"><button class="table-action" data-action="detail" data-id="${escapeHTML(r.id)}">Ver detalle</button></div></td></tr>`).join('')||'<tr><td colspan="6"><div class="empty-state"><div class="empty-icon">⌕</div><strong>No encontramos reportes</strong><p>Cambia los filtros o registra una nueva afectación.</p></div></td></tr>';$('#tableFooter').textContent=`Mostrando ${records.length} de ${data.length} reportes · Datos del servidor académico / navegador de demostración`;updateNavigation();}
  function renderStatistics(){const st=getStats();$('#statTotal').textContent=st.total;$('#statHigh').textContent=st.high;$('#statDone').textContent=st.done+'%';$('#statSectors').textContent=st.sectors;const mx=Math.max(1,...Object.values(st.types));$('#statsTypeChart').innerHTML=Object.entries(st.types).map(([t,n])=>`<div class="stat-row"><span>${escapeHTML(t)}</span><div class="chart-track"><div class="chart-fill" style="width:${n/mx*100}%"></div></div><b>${n}</b></div>`).join('');const statuses=STATUSES.map(s=>({status:s,num:st.counts[s],pc:st.total?st.counts[s]/st.total*100:0}));$('#statsStatusChart').innerHTML=`<div class="status-stack">${statuses.map(s=>`<div style="width:${s.pc}%;background:${statusColor(s.status)}"></div>`).join('')}</div><div class="status-legend">${statuses.map(s=>`<div class="status-legend-row"><span><i class="legend-dot" style="background:${statusColor(s.status)}"></i>${s.status}</span><strong>${s.num} · ${Math.round(s.pc)}%</strong></div>`).join('')}</div>`;}
  function updateAll(){updateNavigation();if(activeView==='inicio')renderDashboard();if(activeView==='reportes')renderReports();if(activeView==='estadisticas')renderStatistics();if(activeView==='mapa')renderMap();}
  function getFormCoord(){const lat=parseFloat($('input[name="lat"]').value),lng=parseFloat($('input[name="lng"]').value);return Number.isFinite(lat)&&Number.isFinite(lng)?{lat,lng}:null;}
  function updateLocationSummary(){const coord=getFormCoord();$('#locationSummary').textContent=coord?`Punto seleccionado: ${coord.lat.toFixed(6)}, ${coord.lng.toFixed(6)}`:'Todavía no has seleccionado una ubicación.';}
  function formReset(){editingID=null;$('#formModeTitle').textContent='Registrar afectación vial';$('#submitReportButton').textContent='Guardar reporte →';photoData='';$('#reportPhoto').value='';$('#photoPreview').classList.add('hidden');$('#photoPreview').innerHTML='';setTimeout(updateLocationSummary,0);}
  function imageToCompressedDataURL(file){return new Promise((resolve,reject)=>{if(!/^image\/(jpeg|png|webp)$/.test(file.type))return reject(new Error('Selecciona una imagen JPG, PNG o WEBP.'));if(file.size>5*1024*1024)return reject(new Error('La fotografía supera el límite de 5 MB.'));const image=new Image();const url=URL.createObjectURL(file);image.onload=()=>{const scale=Math.min(1,940/Math.max(image.naturalWidth,image.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*scale));canvas.height=Math.max(1,Math.round(image.naturalHeight*scale));const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,canvas.width,canvas.height);URL.revokeObjectURL(url);resolve(canvas.toDataURL('image/jpeg',.67));};image.onerror=()=>{URL.revokeObjectURL(url);reject(new Error('No fue posible leer la fotografía.'));};image.src=url;});}
  async function loadPhoto(){const file=$('#reportPhoto').files?.[0];if(!file){photoData='';return;}try{photoData=await imageToCompressedDataURL(file);$('#photoPreview').innerHTML=`<img src="${photoData}" alt="Previsualización de la imagen seleccionada"><span style="font-size:11px;color:#6d8190">Imagen preparada para guardar</span><button type="button" id="removePhoto">Quitar</button>`;$('#photoPreview').classList.remove('hidden');}catch(e){$('#reportPhoto').value='';photoData='';toast(e.message);}}
  async function submitReport(e){
    e.preventDefault();const form=$('#reportForm');
    if(!form.checkValidity()){form.reportValidity();return;}
    const fields=Object.fromEntries(new FormData(form).entries());
    const lat=parseFloat(fields.lat),lng=parseFloat(fields.lng);
    if(!Number.isFinite(lat)||!Number.isFinite(lng)||Math.abs(lat)>90||Math.abs(lng)>180){toast('Ingresa coordenadas válidas.');return;}
    if(fields.description.trim().length<12){toast('La descripción debe tener por lo menos 12 caracteres.');return;}
    const common={title:fields.title.trim(),type:fields.type,severity:fields.severity,sector:fields.sector.trim(),address:fields.address.trim(),description:fields.description.trim(),lat,lng,photo:photoData};
    if(API_MODE){
      const button=$('#submitReportButton');button.disabled=true;
      try {
        const response=editingID?await api(`${API_ROOT}/${encodeURIComponent(editingID)}`,'PUT',common):await api(API_ROOT,'POST',common);
        const index=data.findIndex(r=>r.id===response.report.id);
        if(index>=0)data[index]=response.report;else data.unshift(response.report);
        form.reset();formReset();showView('reportes');toast('Reporte '+response.report.id+' guardado en la base de datos.');
      }catch(err){toast('No se pudo guardar: '+err.message);}finally{button.disabled=false;}
      return;
    }
    const now=new Date().toISOString();
    if(editingID){
      const index=data.findIndex(r=>r.id===editingID);if(index<0){toast('No se encontró el reporte.');return;}
      const previous=data[index];data[index]={...previous,...common,updatedAt:now,history:[...(previous.history||[]),{at:now,action:'Datos del reporte actualizados',from:null,to:null}]};
      if(!saveData()){data[index]=previous;return;}
      const id=editingID;form.reset();formReset();toast('Reporte '+id+' actualizado.');showView('reportes');return;
    }
    const report={...common,id:uid(),status:'Pendiente',createdAt:now,demo:false,history:[{at:now,action:'Reporte registrado',from:null,to:'Pendiente'}]};
    data.unshift(report);if(!saveData()){data.shift();return;}
    form.reset();formReset();toast('Reporte '+report.id+' guardado en el navegador.');showView('reportes');
  }
  function openDetails(id){const r=data.find(x=>x.id===id);if(!r)return;openedID=id;$('#modalTitle').textContent=r.title;const link=`https://www.openstreetmap.org/?mlat=${encodeURIComponent(r.lat)}&mlon=${encodeURIComponent(r.lng)}#map=16/${encodeURIComponent(r.lat)}/${encodeURIComponent(r.lng)}`;$('#modalBody').innerHTML=`${r.demo?'<div class="info-tip">ⓘ Registro sintético de ejemplo, no verificado en terreno.</div>':''}<div class="modal-metadata"><div><span>Identificador</span><strong>${escapeHTML(r.id)}</strong></div><div><span>Fecha</span><strong>${formatDate(r.createdAt)}</strong></div><div><span>Tipo</span><strong>${escapeHTML(r.type)}</strong></div><div><span>Prioridad</span><strong>${escapeHTML(r.severity)}</strong></div><div><span>Sector</span><strong>${escapeHTML(r.sector)}</strong></div><div><span>Dirección</span><strong>${escapeHTML(r.address)}</strong></div><div><span>Coordenadas</span><strong>${Number(r.lat).toFixed(5)}, ${Number(r.lng).toFixed(5)}</strong></div><div><span>Estado actual</span>${statusChip(r.status)}</div></div><div class="modal-description">${escapeHTML(r.description)}</div><div class="report-history"><strong>Historial de actividad</strong><ol>${(r.history?.length?r.history:[{at:r.createdAt,action:'Reporte registrado (versión anterior)',from:null,to:r.status}]).slice(-15).reverse().map(h=>`<li><span>${escapeHTML(h.action||'Actualización')} ${h.from&&h.to?'· '+escapeHTML(h.from)+' → '+escapeHTML(h.to):''}</span><small>${formatDate(h.at)}</small></li>`).join('')}</ol></div>${r.photo?`<img class="modal-photo" src="${r.photo}" alt="Imagen del reporte">`:''}<div><a href="${link}" target="_blank" rel="noopener noreferrer" style="font-size:11px;color:#0f8b80;font-weight:800">⌖ Ver ubicación en OpenStreetMap ↗</a></div><div class="modal-status-update"><label for="detailStatus">Actualizar estado</label><select id="detailStatus">${STATUSES.map(s=>`<option ${s===r.status?'selected':''}>${s}</option>`).join('')}</select></div><div class="modal-footer"><button class="btn btn-text-danger" id="deleteReport">Eliminar reporte</button><button class="btn btn-outline" id="editReport">Editar datos</button><button class="btn btn-primary" id="saveReportStatus">Actualizar estado</button></div>`;$('#modalOverlay').classList.remove('hidden');}
  function closeDetails(){$('#modalOverlay').classList.add('hidden');openedID=null;}
  async function saveStatus(){
    const r=data.find(x=>x.id===openedID);if(!r)return;
    const next=$('#detailStatus').value;
    if(!STATUSES.includes(next)){toast('Estado no permitido.');return;}
    if(r.status===next){toast('El estado no ha cambiado.');return;}
    if(API_MODE){
      try {const result=await api(`${API_ROOT}/${encodeURIComponent(r.id)}/estado`,'PATCH',{status:next});
        const i=data.findIndex(x=>x.id===r.id);data[i]=result.report;closeDetails();updateAll();toast('Estado guardado en servidor.');
      }catch(err){toast('Error al cambiar estado: '+err.message);}return;
    }
    const old=r.status;const history=[...(r.history||[])];
    r.status=next;r.history=[...history,{at:new Date().toISOString(),action:'Cambio de estado',from:old,to:next}];
    if(!saveData()){r.status=old;r.history=history;return;}
    closeDetails();updateAll();toast('Estado e historial actualizados.');
  }
  function editReport(){const r=data.find(x=>x.id===openedID);if(!r)return;editingID=r.id;const f=$('#reportForm');for(const k of ['title','type','severity','sector','address','description','lat','lng']){const field=f.elements.namedItem(k);if(field)field.value=r[k]??'';}photoData=r.photo||'';$('#reportPhoto').value='';if(photoData){$('#photoPreview').innerHTML=`<img src="${photoData}" alt="Fotografía actual"><span>Imagen actual</span><button type="button" id="removePhoto">Quitar</button>`;$('#photoPreview').classList.remove('hidden');}else{$('#photoPreview').innerHTML='';$('#photoPreview').classList.add('hidden');}$('#formModeTitle').textContent='Editar afectación vial';$('#submitReportButton').textContent='Guardar actualización →';closeDetails();showView('reportar');}
  async function deleteReport(){
    const index=data.findIndex(x=>x.id===openedID);if(index<0)return;
    if(!confirm('¿Eliminar este reporte definitivamente?'))return;
    if(API_MODE){
      try{await api(`${API_ROOT}/${encodeURIComponent(data[index].id)}`,'DELETE');data.splice(index,1);closeDetails();updateAll();toast('Reporte eliminado de la base de datos.');}
      catch(err){toast('No se pudo eliminar: '+err.message);}return;
    }
    const removed=data.splice(index,1)[0];
    if(!saveData()){data.splice(index,0,removed);return;}
    closeDetails();updateAll();toast('Reporte eliminado del navegador.');
  }
  function exportFile(content,filename,type){const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
  function exportCSV(){const list=filterReports();const columns=['id','title','type','severity','sector','address','description','lat','lng','status','createdAt','demo'];const headers=['ID','Título','Tipo','Prioridad','Sector','Dirección','Descripción','Latitud','Longitud','Estado','Creado el','Ejemplo sintético'];const csv=[headers,...list.map(r=>columns.map(c=>c==='demo'?(r.demo?'Sí':'No'):r[c]))].map(row=>row.map(v=>'"'+String(v??'').replace(/"/g,'""')+'"').join(';')).join('\r\n');exportFile('\ufeff'+csv,'viaclara_reportes_'+new Date().toISOString().slice(0,10)+'.csv','text/csv;charset=utf-8');toast('Archivo CSV generado.');}
  function exportJSON(){const body={format:'viaclara-backup-v1',exportedAt:new Date().toISOString(),notes:'Datos del navegador; los registros demo son sintéticos.',reports:data};exportFile(JSON.stringify(body,null,2),'viaclara_respaldo_'+new Date().toISOString().slice(0,10)+'.json','application/json;charset=utf-8');toast('Respaldo JSON descargado.');}
  function importJSON(e){const file=e.target.files?.[0];if(!file)return;const reader=new FileReader();reader.onload=async()=>{try{const parsed=JSON.parse(reader.result);if(parsed.format!=='viaclara-backup-v1'||!Array.isArray(parsed.reports))throw new Error('Este archivo no es un respaldo compatible.');if(parsed.reports.length>1000)throw new Error('El respaldo supera el límite de 1000 reportes.');const cleaned=parsed.reports.map((r,i)=>{if(!r||typeof r!=='object'||!STATUSES.includes(r.status)||!TYPES.includes(r.type)||!['Alta','Media','Baja'].includes(r.severity))throw Error('Hay reportes con categorías no válidas.');if(!Number.isFinite(+r.lat)||!Number.isFinite(+r.lng)||Math.abs(+r.lat)>90||Math.abs(+r.lng)>180)throw Error('Hay coordenadas inválidas.');for(const key of ['title','sector','address','description'])if(typeof r[key]!=='string')throw Error('Hay campos incompletos.');return {id:String(r.id||`IMPORT-${i}`).slice(0,80),title:r.title.slice(0,90),type:r.type,severity:r.severity,sector:r.sector.slice(0,70),address:r.address.slice(0,120),description:r.description.slice(0,1000),lat:+r.lat,lng:+r.lng,status:r.status,createdAt:Number.isNaN(Date.parse(r.createdAt))?new Date().toISOString():r.createdAt,photo:(typeof r.photo==='string'&&/^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(r.photo)&&r.photo.length<2000000)?r.photo:'',demo:r.demo===true,history:(Array.isArray(r.history)?r.history.slice(-100).filter(h=>h&&typeof h.action==='string'&&typeof h.at==='string').map(h=>({action:h.action.slice(0,100),at:Number.isNaN(Date.parse(h.at))?new Date().toISOString():h.at,from:STATUSES.includes(h.from)?h.from:null,to:STATUSES.includes(h.to)?h.to:null})):[])};});if(!confirm(`¿Deseas REEMPLAZAR los ${data.length} reportes actuales por los ${cleaned.length} del respaldo?`))return;if(API_MODE){
        try {const response=await api(`${API_ROOT}/importar`,'POST',{format:'viaclara-backup-v1',reports:cleaned});data=response.reports;toast('Respaldo importado en el servidor.');updateAll();}
        catch(err){toast('No se pudo importar al servidor: '+err.message);}return;
      }
      const previous=data;data=cleaned;if(!saveData()){data=previous;return;}toast('Respaldo importado correctamente.');updateAll();}catch(err){toast('Error de importación: '+err.message);}finally{e.target.value='';}};reader.onerror=()=>{toast('No se pudo leer el respaldo.');e.target.value='';};reader.readAsText(file);}
  function resetDemo(){if(!confirm('¿Restablecer los ejemplos? Se eliminarán TODOS los reportes actuales de este navegador. Descarga primero un respaldo si deseas conservarlos.'))return;const previous=data;data=seedRecords();if(!saveData()){data=previous;return;}toast('Se restablecieron los ejemplos sintéticos.');updateAll();}
  // Mapa base por teselas OSM: proyección Web Mercator (sin bibliotecas externas).
  // Los puntos y la selección de coordenadas siguen operativos cuando las imágenes base no cargan.
  function lonToX(lon,z){return ((lon+180)/360)*256*2**z;}
  function latToY(lat,z){const rad=Math.max(-85.0511,Math.min(85.0511,lat))*Math.PI/180;return (1-Math.log(Math.tan(rad)+1/Math.cos(rad))/Math.PI)/2*256*2**z;}
  function xToLon(x,z){return x/(256*2**z)*360-180;}
  function yToLat(y,z){return Math.atan(Math.sinh(Math.PI*(1-2*y/(256*2**z))))*180/Math.PI;}
  function pointAt(lat,lng,rect){const centerX=lonToX(map.lng,map.zoom),centerY=latToY(map.lat,map.zoom);return {x:lonToX(lng,map.zoom)-centerX+rect.width/2,y:latToY(lat,map.zoom)-centerY+rect.height/2};}
  function coordsAt(x,y,rect){const centerX=lonToX(map.lng,map.zoom),centerY=latToY(map.lat,map.zoom);return {lat:yToLat(centerY+y-rect.height/2,map.zoom),lng:xToLon(centerX+x-rect.width/2,map.zoom)};}
  function renderMapCount(){const selected=$('#mapStatus').value;const count=data.filter(r=>!selected||r.status===selected).length;$('#mapCounter').textContent=`${count} ${count===1?'reporte ubicado':'reportes ubicados'}`;}
  function renderMap(){if(activeView!=='mapa')return;const viewport=$('#mapViewport'),rect=viewport.getBoundingClientRect();if(rect.width<50)return;const tileLayer=$('#mapTiles'),pins=$('#mapPins');tileLayer.replaceChildren();pins.replaceChildren();viewport.classList.remove('has-tiles');viewport.classList.toggle('picking',picking);const z=map.zoom;const centerX=lonToX(map.lng,z),centerY=latToY(map.lat,z);const topLeftX=centerX-rect.width/2,topLeftY=centerY-rect.height/2;const minTileX=Math.floor(topLeftX/256),maxTileX=Math.floor((topLeftX+rect.width)/256);const minTileY=Math.floor(topLeftY/256),maxTileY=Math.floor((topLeftY+rect.height)/256);const version=++map.tileVersion;const tileCount=2**z;
  for(let y=minTileY;y<=maxTileY;y++){if(y<0||y>=tileCount)continue;for(let x=minTileX;x<=maxTileX;x++){const tile=document.createElement('img');tile.alt='';tile.loading='eager';tile.draggable=false;tile.style.left=(x*256-topLeftX)+'px';tile.style.top=(y*256-topLeftY)+'px';tile.src=`https://tile.openstreetmap.org/${z}/${((x%tileCount)+tileCount)%tileCount}/${y}.png`;tile.addEventListener('load',()=>{if(version===map.tileVersion)viewport.classList.add('has-tiles');});tileLayer.append(tile);}}
  const selected=$('#mapStatus').value;data.filter(r=>!selected||r.status===selected).forEach(r=>{const point=pointAt(r.lat,r.lng,rect);if(point.x< -40||point.x>rect.width+40||point.y< -40||point.y>rect.height+45)return;const marker=document.createElement('button');marker.type='button';marker.className='map-pin';marker.title=r.title;marker.setAttribute('aria-label',r.title);marker.style.left=point.x+'px';marker.style.top=point.y+'px';marker.innerHTML=`<svg viewBox="0 0 33 40" aria-hidden="true"><path fill="${statusColor(r.status)}" stroke="#fff" stroke-width="2" d="M16.5 1C8.1 1 2.1 7.6 2.1 15.7c0 10 14.4 22.7 14.4 22.7s14.4-12.7 14.4-22.7C30.9 7.6 24.9 1 16.5 1Z"/><circle cx="16.5" cy="15.6" r="6" fill="#fff"/></svg>`;marker.addEventListener('click',e=>{e.stopPropagation();if(picking){setSelectedLocation(r.lat,r.lng);return;}openDetails(r.id);});pins.append(marker);});renderMapCount();$('#mapCoordinate').textContent=`Centro: ${map.lat.toFixed(5)}, ${map.lng.toFixed(5)} · zoom ${map.zoom}`;}
  function setSelectedLocation(lat,lng){$('input[name="lat"]').value=lat.toFixed(6);$('input[name="lng"]').value=lng.toFixed(6);picking=false;$('#pickBanner').classList.add('hidden');updateLocationSummary();toast('Ubicación geográfica seleccionada.');showView('reportar');}
  function initMapEvents(){const viewport=$('#mapViewport');viewport.addEventListener('pointerdown',e=>{if(e.target.closest('button,a'))return;map.down={x:e.clientX,y:e.clientY,moved:false};viewport.classList.add('dragging');viewport.setPointerCapture?.(e.pointerId);});viewport.addEventListener('pointermove',e=>{if(!map.down)return;if(Math.abs(e.clientX-map.down.x)+Math.abs(e.clientY-map.down.y)>8)map.down.moved=true;});viewport.addEventListener('pointerup',e=>{if(!map.down)return;const prev=map.down;map.down=null;viewport.classList.remove('dragging');const rect=viewport.getBoundingClientRect();if(prev.moved){const dx=e.clientX-prev.x,dy=e.clientY-prev.y;const middleX=lonToX(map.lng,map.zoom)-dx,middleY=latToY(map.lat,map.zoom)-dy;map.lat=yToLat(middleY,map.zoom);map.lng=xToLon(middleX,map.zoom);map.suppressClick=true;renderMap();return;}if(picking){const point=coordsAt(e.clientX-rect.left,e.clientY-rect.top,rect);setSelectedLocation(point.lat,point.lng);}});viewport.addEventListener('pointercancel',()=>{map.down=null;viewport.classList.remove('dragging');});viewport.addEventListener('wheel',e=>{e.preventDefault();const newZoom=Math.min(17,Math.max(12,map.zoom+(e.deltaY<0?1:-1)));if(newZoom!==map.zoom){map.zoom=newZoom;renderMap();}},{passive:false});$('#zoomIn').onclick=()=>{map.zoom=Math.min(17,map.zoom+1);renderMap();};$('#zoomOut').onclick=()=>{map.zoom=Math.max(12,map.zoom-1);renderMap();};$('#recenterMap').onclick=()=>{map.lat=CENTER.lat;map.lng=CENTER.lng;map.zoom=14;renderMap();};$('#mapStatus').onchange=renderMap;$('#cancelPick').onclick=()=>{picking=false;showView('reportar');};$('#pickMapButton').onclick=()=>{picking=true;const coord=getFormCoord();if(coord){map.lat=coord.lat;map.lng=coord.lng;}showView('mapa');toast('Haz clic en el mapa para elegir la ubicación.');};}
  function initEvents(){$$('[data-view]').forEach(el=>el.addEventListener('click',()=>showView(el.dataset.view)));$('#menuButton').onclick=()=>{$('#sidebar').classList.add('open');$('#sidebarShade').classList.add('open');};$('#sidebarShade').onclick=()=>{$('#sidebar').classList.remove('open');$('#sidebarShade').classList.remove('open');};$('#reportForm').addEventListener('submit',submitReport);$('#reportForm').addEventListener('reset',formReset);$$('input[name="lat"],input[name="lng"]').forEach(el=>el.addEventListener('input',updateLocationSummary));$('#reportPhoto').addEventListener('change',loadPhoto);$('#photoPreview').addEventListener('click',e=>{if(e.target.id==='removePhoto'){photoData='';$('#reportPhoto').value='';$('#photoPreview').innerHTML='';$('#photoPreview').classList.add('hidden');}});$('#reportSearch').oninput=renderReports;$('#reportStatus').onchange=renderReports;$('#reportType').onchange=renderReports;$('#reportsTbody').addEventListener('click',e=>{const btn=e.target.closest('[data-action="detail"]');if(btn)openDetails(btn.dataset.id);});$('#modalClose').onclick=closeDetails;$('#modalOverlay').addEventListener('click',e=>{if(e.target.id==='modalOverlay')closeDetails();});$('#modalBody').addEventListener('click',e=>{if(e.target.id==='saveReportStatus')saveStatus();if(e.target.id==='deleteReport')deleteReport();if(e.target.id==='editReport')editReport();});document.addEventListener('keydown',e=>{if(e.key==='Escape')closeDetails();});$('#exportCSV').onclick=exportCSV;$('#exportJSON').onclick=exportJSON;$('#importJSON').addEventListener('change',importJSON);$('#resetDemo').onclick=resetDemo;initMapEvents();window.addEventListener('resize',()=>{if(activeView==='mapa')renderMap();});}
  if(!API_MODE) initData();
  initEvents();showView('inicio');
  if(API_MODE){
    $('#resetDemo').style.display='none';
    $('#resetDemo').disabled=true;
    refreshRemote();
  } else if(memoryWarning) toast('Tu navegador puede bloquear el almacenamiento. Exporta un respaldo JSON.');
})();
