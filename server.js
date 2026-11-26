const http=require('http'),fs=require('fs'),path=require('path'),WebSocket=require('ws');
const root=path.join(__dirname,'public'),rooms=new Map(),clients=new Map();
const mime={'.html':'text/html; charset=utf-8','.js':'text/javascript','.css':'text/css','.json':'application/json'};
const server=http.createServer((req,res)=>{let u=new URL(req.url,'http://localhost'),p=decodeURIComponent(u.pathname);if(p==='/')p='/index.html';let file=path.join(root,p);if(!file.startsWith(root)){res.writeHead(403);return res.end('Forbidden')}fs.readFile(file,(e,data)=>{if(e){res.writeHead(404);return res.end('Not found')}res.writeHead(200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream','Cache-Control':'no-store'});res.end(data)})});
const wss=new WebSocket.Server({server});
function send(ws,obj){if(ws.readyState===WebSocket.OPEN)ws.send(JSON.stringify(obj))}
function broadcast(room,obj,except){for(const c of rooms.get(room)||[])if(c!==except)send(c,obj)}
wss.on('connection',ws=>{
 ws.on('message',raw=>{let m;try{m=JSON.parse(raw)}catch{return}
  if(m.type==='join'){ws.id=m.id;ws.name=String(m.name||'Hunter').slice(0,18);ws.room=String(m.room||'PINE7').slice(0,10);if(!rooms.has(ws.room))rooms.set(ws.room,new Set());let set=rooms.get(ws.room);let snapshot=[...set].map(c=>({id:c.id,name:c.name,...(c.state||{})}));set.add(ws);clients.set(ws.id,ws);send(ws,{type:'snapshot',players:snapshot});broadcast(ws.room,{type:'player',id:ws.id,name:ws.name,x:0,y:0,z:0,yaw:0},ws);return}
  if(!ws.room)return;
  if(m.type==='state'){ws.state={x:Number(m.x)||0,y:Number(m.y)||0,z:Number(m.z)||0,yaw:Number(m.yaw)||0};broadcast(ws.room,{type:'player',id:ws.id,name:ws.name,...ws.state},ws)}
  if(m.type==='signal'){let target=clients.get(m.to);if(target&&target.room===ws.room)send(target,{type:'signal',from:ws.id,data:m.data})}
  if(m.type==='event')broadcast(ws.room,{type:'event',...m},ws);
 });
 ws.on('close',()=>{if(ws.room){let set=rooms.get(ws.room);if(set){set.delete(ws);broadcast(ws.room,{type:'leave',id:ws.id});if(!set.size)rooms.delete(ws.room)}}clients.delete(ws.id)});
});
const port=process.env.PORT||8080;server.listen(port,'0.0.0.0',()=>console.log(`WILDTRACK VR running on http://localhost:${port}`));
