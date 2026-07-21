import type {StudioComponent,StudioProject,StudioScreen} from './types';

// DISEÑO PROPUESTO (mockup v2) — NO es lo que corre hoy en el panel.
// Incluye habitaciones + Colmena en Hogar y tabs Biblioteca/Equipos en Media, que
// requieren la extensión del contrato v2.1 (rooms en DeviceState, devices/library en
// MediaState). Para el estado real implementado ver panelProject.ts.
const T={
  canvas:'#F4EFE6',surface:'#FFFFFF',ink:'#2A211C',muted:'#8A7A6C',line:'#E8DFD2',
  ambarBg:'#FFE9C4',ambar:'#A96A0C',cieloBg:'#D8ECF6',cielo:'#1F6E93',
  selvaBg:'#D9F1DE',selva:'#1E7F49',lilaBg:'#E9E2F7',lila:'#6248AC',
  coralBg:'#F5D8CC',coral:'#C2502F',ok:'#3E9B6C',
  night:'#221C18',nightInk:'#EAE2D6',nightMuted:'#8F8377',nightChip:'#2E2620',
};

let seq=0;const id=(p:string)=>`${p}-${(++seq).toString(36)}`;
type Part=Partial<StudioComponent>&Pick<StudioComponent,'kind'|'x'|'y'|'width'|'height'>;
const C=(p:string,d:Part):StudioComponent=>({
  id:id(p),label:'',background:'transparent',color:T.ink,radius:0,fontSize:14,
  action:{type:'none',value:''},...d});

// Rail de navegación (64px) que comparte cada pantalla del modo manual.
const NAV=[['⌂','inicio'],['💡','hogar'],['♪','media'],['🗓','agenda'],['⚙','sistema']] as const;
const rail=(sel:number):StudioComponent[]=>[
  C('rail',{kind:'card',x:0,y:0,width:64,height:480,background:T.surface,radius:0}),
  C('brand',{kind:'chip',x:13,y:12,width:38,height:38,label:'W',background:T.coral,color:'#FFFFFF',radius:19,fontSize:15}),
  ...NAV.map(([ic,dest],i)=>C('nav',{kind:'button',x:8,y:64+i*56,width:48,height:48,label:ic,
    background:i===sel?T.coralBg:'transparent',color:i===sel?T.coral:T.muted,radius:16,fontSize:20,
    action:{type:'navigate',value:dest}})),
  C('conn',{kind:'chip',x:16,y:446,width:32,height:20,label:'●',color:T.ok,fontSize:10}),
];

const eyebrow=(p:string,x:number,y:number,label:string,color:string,width=180)=>
  C(p,{kind:'text',x,y,width,height:14,label,color,fontSize:10});

// ============ INICIO ============
const inicio:StudioScreen={id:'inicio',name:'Inicio',width:800,height:480,background:T.canvas,components:[
  ...rail(0),
  C('hora',{kind:'clock',x:80,y:14,width:110,height:34,fontSize:30,color:T.ink}),
  C('fecha',{kind:'text',x:200,y:28,width:200,height:18,label:'Lunes 20 de julio',color:T.muted,fontSize:13}),
  C('resumen',{kind:'text',x:472,y:28,width:268,height:18,label:'2 luces encendidas · música en pausa',color:T.muted,fontSize:12}),
  C('ring',{kind:'ring',x:752,y:16,width:26,height:26,background:T.canvas,items:[T.ok,T.ambar,T.selva,T.lila]}),
  // Clima
  C('clima',{kind:'card',x:80,y:58,width:252,height:352,background:T.cieloBg,radius:22}),
  C('temp',{kind:'text',x:96,y:72,width:120,height:52,label:'21',fontSize:52,color:T.ink}),
  C('deg',{kind:'text',x:164,y:78,width:40,height:22,label:'°C',fontSize:20,color:T.cielo}),
  C('cond',{kind:'text',x:96,y:134,width:140,height:18,label:'Despejado',fontSize:14,color:T.cielo}),
  C('lluvia',{kind:'card',x:246,y:72,width:70,height:52,background:'#ECF5FA',radius:14}),
  C('lluviaV',{kind:'chip',x:246,y:78,width:70,height:20,label:'0 %',fontSize:17,color:T.ink}),
  C('lluviaL',{kind:'chip',x:246,y:100,width:70,height:12,label:'Lluvia',fontSize:9,color:T.muted}),
  C('semana',{kind:'bars',x:96,y:176,width:222,height:214,accent:T.cielo,color:T.cielo,fontSize:10,
    items:['L|62|22°','M|70|24°','X|76|25°','J|66|23°','V|48|19°','S|60|22°','D|72|24°']}),
  // Pendientes
  C('pend',{kind:'card',x:344,y:58,width:214,height:352,background:T.ambarBg,radius:22}),
  eyebrow('pendT',360,72,'PENDIENTES',T.ambar),
  C('pendL',{kind:'list',x:360,y:94,width:182,height:302,accent:T.ambar,color:T.ink,fontSize:13,
    items:['Pagar el servicio de internet','Backup semanal del NAS','Regar las plantas del balcón','Renovar la SUBE','Turno con el dentista']}),
  // Próximo en agenda
  C('agd',{kind:'card',x:570,y:58,width:214,height:352,background:T.lilaBg,radius:22}),
  eyebrow('agdT',586,72,'PRÓXIMO EN AGENDA',T.lila),
  C('agdL',{kind:'list',x:586,y:94,width:182,height:302,accent:T.lila,color:T.ink,fontSize:13,
    items:['19:30|Llamada del equipo de la beca','21:00|Cena con Flor','Mañana|Entrega de análisis','Mié|Parcial de redes']}),
  // Acciones rápidas
  C('qa1',{kind:'chip',x:80,y:422,width:226,height:48,label:'☾ Modo noche',background:T.lilaBg,color:T.lila,radius:24,fontSize:13,action:{type:'wyss.command',value:'home.scene.night'}}),
  C('qa2',{kind:'chip',x:318,y:422,width:226,height:48,label:'⏻ Apagar todo',background:T.coralBg,color:T.coral,radius:24,fontSize:13,action:{type:'wyss.command',value:'home.all_off'}}),
  C('qa3',{kind:'chip',x:556,y:422,width:228,height:48,label:'➜ Estoy saliendo',background:T.cieloBg,color:T.cielo,radius:24,fontSize:13,action:{type:'wyss.command',value:'home.scene.leaving'}}),
]};

// ============ HOGAR ============
const hogar:StudioScreen={id:'hogar',name:'Hogar',width:800,height:480,background:T.canvas,components:[
  ...rail(1),
  // Habitaciones
  C('rLiving',{kind:'card',x:80,y:12,width:210,height:180,background:T.ambarBg,radius:20,action:{type:'wyss.command',value:'home.room.select:living'}}),
  C('rLnm',{kind:'text',x:96,y:26,width:160,height:20,label:'Living',fontSize:16,color:T.ink}),
  C('rLst',{kind:'text',x:96,y:50,width:180,height:16,label:'3 focos · 2 encendidos',fontSize:11,color:T.ambar}),
  C('rLd',{kind:'text',x:96,y:160,width:100,height:16,label:'● ● ○',fontSize:12,color:T.ambar}),
  C('rDorm',{kind:'card',x:80,y:204,width:210,height:180,background:T.surface,radius:20,action:{type:'wyss.command',value:'home.room.select:dormitorio'}}),
  C('rDnm',{kind:'text',x:96,y:218,width:160,height:20,label:'Dormitorio',fontSize:16,color:T.ink}),
  C('rDst',{kind:'text',x:96,y:242,width:180,height:16,label:'2 focos · apagados',fontSize:11,color:T.muted}),
  C('rDd',{kind:'text',x:96,y:352,width:100,height:16,label:'○ ○',fontSize:12,color:T.muted}),
  // Control de la habitación seleccionada
  C('ctrl',{kind:'card',x:302,y:12,width:482,height:372,background:T.ambarBg,radius:22}),
  C('cNm',{kind:'text',x:318,y:26,width:160,height:24,label:'Living',fontSize:19,color:T.ink}),
  C('cAv',{kind:'text',x:430,y:32,width:120,height:14,label:'DISPONIBLE',fontSize:10,color:T.ok}),
  C('fColm',{kind:'chip',x:318,y:60,width:96,height:40,label:'Colmena',background:T.ambar,color:'#FFFFFF',radius:20,fontSize:12,action:{type:'wyss.command',value:'home.light.scope:all'}}),
  C('f1',{kind:'chip',x:422,y:60,width:88,height:40,label:'● Foco 1',background:'#FFF6E3',color:T.muted,radius:20,fontSize:12,action:{type:'wyss.command',value:'home.light.scope:1'}}),
  C('f2',{kind:'chip',x:518,y:60,width:88,height:40,label:'● Foco 2',background:'#FFF6E3',color:T.muted,radius:20,fontSize:12,action:{type:'wyss.command',value:'home.light.scope:2'}}),
  C('f3',{kind:'chip',x:614,y:60,width:88,height:40,label:'○ Foco 3',background:'#FFF6E3',color:T.muted,radius:20,fontSize:12,action:{type:'wyss.command',value:'home.light.scope:3'}}),
  C('pwr',{kind:'button',x:318,y:118,width:72,height:72,label:'⏻',background:T.ambar,color:'#FFFFFF',radius:36,fontSize:25,action:{type:'wyss.command',value:'home.light.toggle'}}),
  C('brT',{kind:'text',x:406,y:118,width:80,height:14,label:'Brillo',fontSize:11,color:T.muted}),
  C('brV',{kind:'text',x:700,y:112,width:68,height:20,label:'72 %',fontSize:17,color:T.ink}),
  C('brS',{kind:'slider',x:406,y:140,width:362,height:32,value:72,accent:T.ambar,background:'#FFF6E3',radius:16,action:{type:'wyss.command',value:'home.light.brightness'}}),
  C('huT',{kind:'text',x:318,y:212,width:80,height:14,label:'Color',fontSize:11,color:T.muted}),
  C('hue',{kind:'hue',x:318,y:234,width:296,height:30,value:24,radius:15,action:{type:'wyss.command',value:'home.light.color'}}),
  C('warm',{kind:'chip',x:628,y:227,width:72,height:44,label:'🔥 Cálido',background:'#FFF6E3',color:'#B4690E',radius:22,fontSize:12,action:{type:'wyss.command',value:'home.light.preset:warm'}}),
  C('cold',{kind:'chip',x:708,y:227,width:60,height:44,label:'❄ Frío',background:'#FFF6E3',color:T.cielo,radius:22,fontSize:12,action:{type:'wyss.command',value:'home.light.preset:cold'}}),
  // Escenas
  C('sc1',{kind:'chip',x:80,y:396,width:226,height:60,label:'🎬 Noche de película',background:T.surface,color:T.ink,radius:20,fontSize:13,action:{type:'wyss.command',value:'home.scene.movie'}}),
  C('sc2',{kind:'chip',x:318,y:396,width:226,height:60,label:'📖 Lectura',background:T.surface,color:T.ink,radius:20,fontSize:13,action:{type:'wyss.command',value:'home.scene.reading'}}),
  C('sc3',{kind:'chip',x:556,y:396,width:228,height:60,label:'✦ Visitas',background:T.surface,color:T.ink,radius:20,fontSize:13,action:{type:'wyss.command',value:'home.scene.guests'}}),
]};

// ============ MEDIA ============
const media:StudioScreen={id:'media',name:'Media',width:800,height:480,background:T.canvas,components:[
  ...rail(2),
  C('mp',{kind:'card',x:80,y:12,width:452,height:444,background:T.selvaBg,radius:22}),
  eyebrow('mpT',96,26,'SPOTIFY',T.selva),
  C('mpDev',{kind:'text',x:340,y:26,width:180,height:14,label:'▸ Parlante del living',fontSize:10,color:T.selva}),
  C('cover',{kind:'chip',x:258,y:50,width:96,height:96,label:'♪',background:T.selva,color:'#FFFFFF',radius:22,fontSize:36}),
  C('tt',{kind:'chip',x:96,y:154,width:420,height:28,label:'Río arriba',fontSize:21,color:T.ink}),
  C('ar',{kind:'chip',x:96,y:186,width:420,height:18,label:'Camila Ferrer · Costas',fontSize:13,color:T.selva}),
  C('prev',{kind:'button',x:172,y:230,width:54,height:54,label:'⏮',background:'#EDF7EF',color:T.ink,radius:27,fontSize:17,action:{type:'wyss.command',value:'media.previous'}}),
  C('play',{kind:'button',x:267,y:218,width:78,height:78,label:'⏸',background:T.selva,color:'#FFFFFF',radius:39,fontSize:26,action:{type:'wyss.command',value:'media.play_pause'}}),
  C('next',{kind:'button',x:386,y:230,width:54,height:54,label:'⏭',background:'#EDF7EF',color:T.ink,radius:27,fontSize:17,action:{type:'wyss.command',value:'media.next'}}),
  C('t0',{kind:'text',x:110,y:322,width:40,height:14,label:'1:24',fontSize:11,color:T.muted}),
  C('prog',{kind:'progress',x:156,y:325,width:296,height:7,value:34,accent:T.selva,background:'#EFF8F1',radius:5}),
  C('t1',{kind:'text',x:462,y:322,width:40,height:14,label:'3:58',fontSize:11,color:T.muted}),
  C('volI',{kind:'text',x:110,y:350,width:24,height:18,label:'🔊',fontSize:14,color:T.selva}),
  C('vol',{kind:'slider',x:142,y:346,width:290,height:26,value:55,accent:T.selva,background:'#EFF8F1',radius:13,action:{type:'wyss.command',value:'media.set_volume'}}),
  C('volV',{kind:'chip',x:440,y:348,width:56,height:22,label:'55 %',fontSize:14,color:T.selva}),
  // Panel lateral: tabs + contenido
  C('side',{kind:'card',x:544,y:12,width:240,height:444,background:T.surface,radius:22}),
  C('tb1',{kind:'chip',x:558,y:26,width:64,height:34,label:'Cola',background:T.selva,color:'#FFFFFF',radius:11,fontSize:11,action:{type:'wyss.command',value:'media.panel:queue'}}),
  C('tb2',{kind:'chip',x:626,y:26,width:80,height:34,label:'Biblioteca',background:T.canvas,color:T.muted,radius:11,fontSize:11,action:{type:'wyss.command',value:'media.panel:library'}}),
  C('tb3',{kind:'chip',x:710,y:26,width:60,height:34,label:'Equipos',background:T.canvas,color:T.muted,radius:11,fontSize:11,action:{type:'wyss.command',value:'media.panel:devices'}}),
  C('cola',{kind:'list',x:560,y:74,width:208,height:330,accent:T.selva,color:T.ink,fontSize:12,
    items:['Verano en la terraza','Cielo de febrero','Ruta 11','Amanecer guaraní','Siesta de domingo']}),
  C('devAct',{kind:'chip',x:558,y:414,width:212,height:30,label:'▮▮ Parlante del living',background:T.selvaBg,color:T.selva,radius:13,fontSize:10}),
]};

// ============ AGENDA ============
const agenda:StudioScreen={id:'agenda',name:'Agenda',width:800,height:480,background:T.canvas,components:[
  ...rail(3),
  C('cal',{kind:'card',x:80,y:12,width:452,height:444,background:T.lilaBg,radius:22}),
  eyebrow('calT',96,26,'AGENDA · HOY',T.lila),
  C('calH',{kind:'text',x:96,y:46,width:420,height:24,label:'3 eventos hoy, el próximo a las 19:30',fontSize:18,color:T.ink}),
  C('calM',{kind:'text',x:96,y:74,width:300,height:14,label:'Sincronizada hace 12 min',fontSize:11,color:T.lila}),
  C('calL',{kind:'list',x:96,y:100,width:420,height:340,accent:T.lila,color:T.ink,fontSize:13,
    items:['19:30|Llamada con el equipo de la beca · Meet','21:00|Cena con Flor · Casa','Mañana|Entrega de análisis de sistemas']}),
  C('rem',{kind:'card',x:544,y:12,width:240,height:216,background:T.ambarBg,radius:22}),
  eyebrow('remT',560,26,'RECORDATORIOS',T.ambar),
  C('remB',{kind:'text',x:560,y:48,width:100,height:32,label:'3',fontSize:26,color:T.ink}),
  C('remC',{kind:'text',x:560,y:84,width:180,height:14,label:'pendientes hoy',fontSize:11,color:T.muted}),
  C('remF',{kind:'text',x:560,y:196,width:210,height:16,label:'El próximo: pagar internet',fontSize:12,color:T.ambar}),
  C('tim',{kind:'card',x:544,y:240,width:240,height:216,background:T.coralBg,radius:22}),
  eyebrow('timT',560,254,'TIMERS',T.coral),
  C('timB',{kind:'text',x:560,y:276,width:140,height:32,label:'12:40',fontSize:26,color:T.ink}),
  C('timC',{kind:'text',x:560,y:312,width:200,height:14,label:'Horno · quedan 12 min',fontSize:11,color:T.muted}),
  C('timF',{kind:'text',x:560,y:424,width:200,height:16,label:'1 timer activo',fontSize:12,color:T.coral}),
]};

// ============ SISTEMA ============
const kv=(p:string,x:number,y:number,k:string,v:string):StudioComponent[]=>[
  C(p+'k',{kind:'text',x,y,width:160,height:16,label:k,fontSize:13,color:T.muted}),
  C(p+'v',{kind:'text',x:x+180,y,width:130,height:16,label:v,fontSize:13,color:T.ink}),
];
const sistema:StudioScreen={id:'sistema',name:'Sistema',width:800,height:480,background:T.canvas,components:[
  ...rail(4),
  C('st',{kind:'card',x:80,y:12,width:704,height:96,background:T.surface,radius:22}),
  C('stD',{kind:'chip',x:100,y:34,width:52,height:52,label:'✓',background:T.ok,color:'#FFFFFF',radius:26,fontSize:22}),
  C('stH',{kind:'text',x:168,y:32,width:300,height:24,label:'Conectado a Wyss',fontSize:19,color:T.ink}),
  C('stP',{kind:'text',x:168,y:62,width:420,height:16,label:'Home Edge en línea · última respuesta hace 2 s',fontSize:12,color:T.muted}),
  C('pr',{kind:'card',x:80,y:120,width:346,height:336,background:T.surface,radius:22}),
  eyebrow('prT',96,134,'PROTOCOLO',T.cielo),
  ...kv('pr1',96,166,'Versión activa','v2'),
  ...kv('pr2',96,198,'Compatibilidad','v1 estable'),
  ...kv('pr3',96,230,'Identidad','Verificada'),
  C('dg',{kind:'card',x:438,y:120,width:346,height:336,background:T.surface,radius:22}),
  eyebrow('dgT',454,134,'DIAGNÓSTICO',T.coral),
  ...kv('dg1',454,166,'Latencia LAN','38 ms'),
  ...kv('dg2',454,198,'Reconexiones hoy','0'),
  ...kv('dg3',454,230,'Firmware','2.0.0'),
]};

// ============ DURMIENDO ============
const dormir:StudioScreen={id:'dormir',name:'Durmiendo',width:800,height:480,background:T.night,components:[
  C('conn',{kind:'chip',x:770,y:18,width:12,height:12,label:'',background:T.ok,radius:6}),
  C('clk',{kind:'clock',x:268,y:104,width:280,height:100,fontSize:96,color:T.nightInk}),
  C('dte',{kind:'chip',x:200,y:222,width:400,height:22,label:'Lunes 20 de julio',fontSize:16,color:T.nightMuted}),
  C('s1',{kind:'chip',x:196,y:346,width:150,height:40,label:'☀ 21° despejado',background:T.nightChip,color:T.nightInk,radius:14,fontSize:13}),
  C('s2',{kind:'chip',x:356,y:346,width:140,height:40,label:'🗓 19:30 llamada',background:T.nightChip,color:T.nightInk,radius:14,fontSize:13}),
  C('s3',{kind:'chip',x:506,y:346,width:130,height:40,label:'⏱ Horno 12 min',background:T.nightChip,color:T.nightInk,radius:14,fontSize:13}),
  C('wk',{kind:'chip',x:200,y:434,width:400,height:20,label:'Tocá la pantalla para despertar a Wyss',fontSize:12,color:T.nightMuted,action:{type:'navigate',value:'inicio'}}),
]};

// ============ CONVERSACIÓN ============
const conversacion:StudioScreen={id:'conversacion',name:'Conversación',width:800,height:480,background:T.canvas,components:[
  C('bk',{kind:'button',x:16,y:16,width:48,height:48,label:'←',background:T.surface,color:T.ink,radius:24,fontSize:17,action:{type:'navigate',value:'inicio'}}),
  C('halo',{kind:'ring',x:364,y:64,width:72,height:72,background:T.canvas,items:[T.coral,T.coralBg,T.coralBg,T.coralBg]}),
  C('h2',{kind:'chip',x:200,y:150,width:400,height:30,label:'¿Qué querés que haga?',fontSize:22,color:T.ink}),
  C('p',{kind:'chip',x:200,y:184,width:400,height:18,label:'Preparo un plan y te pido permiso cuando corresponde',fontSize:12,color:T.muted}),
  C('comp',{kind:'card',x:104,y:220,width:592,height:64,background:T.surface,radius:32}),
  C('ph',{kind:'text',x:130,y:243,width:420,height:18,label:'Ej.: dejá el living listo para ver una película',fontSize:14,color:T.muted}),
  C('send',{kind:'button',x:632,y:227,width:50,height:50,label:'➤',background:T.coral,color:'#FFFFFF',radius:25,fontSize:18,action:{type:'wyss.command',value:'conversation.submit'}}),
  C('sg1',{kind:'chip',x:186,y:308,width:130,height:40,label:'Bajá las luces',background:T.surface,color:T.ink,radius:20,fontSize:12,action:{type:'wyss.command',value:'conversation.suggest:1'}}),
  C('sg2',{kind:'chip',x:326,y:308,width:170,height:40,label:'Poné música tranquila',background:T.surface,color:T.ink,radius:20,fontSize:12,action:{type:'wyss.command',value:'conversation.suggest:2'}}),
  C('sg3',{kind:'chip',x:506,y:308,width:150,height:40,label:'¿Qué tengo mañana?',background:T.surface,color:T.ink,radius:20,fontSize:12,action:{type:'wyss.command',value:'conversation.suggest:3'}}),
  C('ft',{kind:'chip',x:200,y:440,width:400,height:18,label:'Las acciones sensibles siempre esperan tu confirmación',fontSize:11,color:T.muted}),
]};

export const designProject:StudioProject={
  schemaVersion:'1.1',id:'wyss-home-panel-propuesta',name:'Panel — diseño propuesto (v2.1)',
  updatedAt:new Date().toISOString(),
  screens:[inicio,hogar,media,agenda,sistema,dormir,conversacion],
};
