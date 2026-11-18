/* Comprueba el cliente HTTP con servidor falso en memoria (NO ejecuta Laravel). */
const fs=require('node:fs'),vm=require('node:vm'),path=require('node:path'),assert=require('node:assert/strict');
let js=fs.readFileSync(path.join(__dirname,'../public/assets/js/app.js'),'utf8');
const cut=js.lastIndexOf('  if(!API_MODE) initData();');
if(cut<0)throw new Error('No se halló la inicialización del frontend');
js=js.slice(0,cut)+'  globalThis.testBridge={get data(){return data},set openedID(v){openedID=v},submitReport,saveStatus,deleteReport,refreshRemote};\n})();';
js=js.replace(/function showView\(view\)\{[\s\S]*?\n  function renderDashboard/, 'function showView(view){}\n  function renderDashboard');
js=js.replace(/function updateAll\(\)\{[\s\S]*?\n  function getFormCoord/, 'function updateAll(){}\n  function getFormCoord');
js=js.replace(/function closeDetails\(\)\{[\s\S]*?\n  async function saveStatus/, 'function closeDetails(){}\n  async function saveStatus');
let elements={};
const E=(sel)=>elements[sel]??=( {value:'',textContent:'',innerHTML:'',disabled:false,classList:{add(){},remove(){}},style:{},reset(){},checkValidity(){return true},reportValidity(){}} );
let server=[];
let sequence=0;
const sandbox={
 document:{querySelector(sel){if(sel==='meta[name="vc-api-mode"]')return {content:'laravel'};if(sel==='meta[name="csrf-token"]')return{content:'testcsrf'};return E(sel)},querySelectorAll(){return []}},
 window:{},localStorage:{getItem(){return null},setItem(){}},
 location:{href:''},
 FormData:class{entries(){return Object.entries({title:'Hueco de prueba',type:'Hueco o bache',severity:'Alta',sector:'Centro',address:'Calle muestra',description:'Texto de prueba suficientemente largo.',lat:'1.61549',lng:'-75.60412'})}},
 fetch:async(url,opts={})=>{const method=opts.method||'GET';let result;
   if(method==='GET')result={reports:server};
   if(method==='POST'&&url==='/api/reportes'){
      const body=JSON.parse(opts.body);result={report:{...body,id:'AV-TEST-'+(++sequence),status:'Pendiente',createdAt:new Date().toISOString(),history:[],demo:false}};server.unshift(result.report);
   } else if(method==='PATCH'){
      let id=url.split('/')[3];let i=server.findIndex(r=>r.id===id);server[i].status=JSON.parse(opts.body).status;result={report:server[i]};
   } else if(method==='DELETE'){
      let id=url.split('/')[3];server=server.filter(x=>x.id!==id);result={deleted:true};
   }
   if(!result)throw new Error('Petición simulada inesperada: '+method+' '+url);
   return{ok:true,status:200,redirected:false,json:async()=>result};
 },
 confirm:()=>true, setTimeout:()=>1,clearTimeout(){},console,Date,JSON,Intl,Math,Number,String,Image:class {},URL:class {}, Blob:class {},
};
vm.createContext(sandbox);vm.runInContext(js,sandbox);
(async()=>{
 const api=sandbox.testBridge;
 await api.refreshRemote();assert.equal(api.data.length,0);
 await api.submitReport({preventDefault(){}});
 assert.equal(server.length,1);assert.equal(api.data.length,1);
 api.openedID=server[0].id;E('#detailStatus').value='En revisión';await api.saveStatus();
 assert.equal(server[0].status,'En revisión');
 api.openedID=server[0].id;await api.deleteReport();assert.equal(server.length,0);assert.equal(api.data.length,0);
 console.log('PASS: carga GET, creación POST, cambio PATCH, eliminación DELETE en servidor simulado.');
})().catch(e=>{console.error(e);process.exitCode=1});
