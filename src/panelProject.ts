import type {StudioComponent,StudioProject,StudioScreen} from './types';

// ESTADO ACTUAL DEL FIRMWARE — espejo de wyss-home-panel @ 01a473a.
// Fuente autoritativa: firmware/include/wyss/ui/design_tokens.hpp (colores y geometría
// de rail, power, brillo, matiz, presets, escenas y acciones rápidas) y
// firmware/src/adapters/lvgl_panel_view.cpp (todo lo demás).
// Si tocás el firmware, actualizá este archivo en el mismo commit.
// El diseño que todavía NO está implementado vive en designProject.ts.

// Tokens: hex idénticos a design_tokens.hpp.
const T={
  canvas:'#F4EFE6',surface:'#FFFFFF',ink:'#2A211C',muted:'#6E6154',line:'#E8DFD2',
  ambarBg:'#FFE9C4',ambar:'#8A5509',cieloBg:'#D8ECF6',cielo:'#1F6E93',
  selvaBg:'#D9F1DE',selva:'#196B3D',lilaBg:'#E9E2F7',lila:'#6248AC',
  coralBg:'#F5D8CC',coral:'#C2502F',coralInk:'#A33F22',
  green:'#3E9B6C',amber:'#C98A2B',red:'#B84034',
  night:'#221C18',nightInk:'#EAE2D6',nightMuted:'#9A8E82',nightChip:'#2E2620',
};

let seq=0;const id=(p:string)=>`${p}-${(++seq).toString(36)}`;
type Part=Partial<StudioComponent>&Pick<StudioComponent,'kind'|'x'|'y'|'width'|'height'>;
const C=(p:string,d:Part):StudioComponent=>({
  id:id(p),label:'',background:'transparent',color:T.ink,radius:0,fontSize:14,
  action:{type:'none',value:''},...d});

// Las páginas del modo manual arrancan en x=64 (ancho del rail) y miden 736 px.
// tile()/panel() del firmware aplican pad_all=16, así que el contenido de una
// tarjeta en (X,Y) se dibuja desde (X+16, Y+16). Acá ya está resuelto en absoluto.
const PAGE=64;
const px=(pageX:number)=>PAGE+pageX;

// Rail: marca circular, 5 iconos de 48 px y el estado de conexión al pie.
const NAV=[['⌂','inicio'],['⚡','hogar'],['♪','media'],['☰','agenda'],['⚙','sistema']] as const;
const rail=(sel:number):StudioComponent[]=>[
  C('rail',{kind:'card',x:0,y:0,width:64,height:480,background:T.surface,radius:0}),
  C('brand',{kind:'chip',x:13,y:12,width:38,height:38,label:'W',background:T.coral,color:'#FFFFFF',radius:19,fontSize:16}),
  ...NAV.map(([ic,dest],i)=>C('nav',{kind:'button',x:8,y:64+i*56,width:48,height:48,label:ic,
    background:i===sel?T.coralBg:T.surface,color:i===sel?T.coral:T.muted,radius:16,fontSize:20,
    action:{type:'navigate',value:dest}})),
  C('conn',{kind:'text',x:22,y:446,width:24,height:20,label:'≋',color:T.red,fontSize:16}),
];

const eyebrow=(p:string,x:number,y:number,label:string,color:string,width=200)=>
  C(p,{kind:'text',x,y,width,height:14,label,color,fontSize:12});

// ============ INICIO (pages_[0]) ============
// Tira de resumen sobre el canvas + tres tiles de 352 px + píldoras de acción.
const WBAR=['62','74','96','54','40','68','88'];
const inicio:StudioScreen={id:'inicio',name:'Inicio',width:800,height:480,background:T.canvas,components:[
  ...rail(0),
  C('sum',{kind:'text',x:px(16),y:22,width:560,height:22,label:'Hogar: 2 de 3 luces encendidas - 2 disponibles',fontSize:16,color:T.ink}),

  // Clima: tile cielo 252×352 en (16,58).
  C('wCard',{kind:'card',x:px(16),y:58,width:252,height:352,background:T.cieloBg,radius:22}),
  C('wTemp',{kind:'text',x:px(32),y:78,width:120,height:44,label:'28.5',fontSize:36,color:T.ink}),
  C('wUnit',{kind:'text',x:px(126),y:86,width:40,height:20,label:'°C',fontSize:16,color:T.cielo}),
  C('wCond',{kind:'text',x:px(32),y:130,width:130,height:20,label:'Despejado',fontSize:14,color:T.cielo}),
  C('wRain',{kind:'card',x:px(168),y:74,width:84,height:56,background:T.surface,radius:14}),
  C('wRainV',{kind:'text',x:px(168),y:82,width:84,height:20,label:'70%',fontSize:16,color:T.ink}),
  C('wRainT',{kind:'text',x:px(168),y:106,width:84,height:16,label:'Lluvia',fontSize:12,color:T.muted}),
  C('wRail',{kind:'card',x:px(32),y:222,width:220,height:124,background:T.surface,radius:10}),
  ...['29','27','23','21','22','25','28'].map((m,i)=>C('wMax',{kind:'text',x:px(32+i*31),y:200,
    width:31,height:16,label:m,fontSize:12,color:T.ink})),
  C('wBars',{kind:'bars',x:px(32),y:226,width:217,height:116,value:0,accent:T.cielo,items:WBAR}),
  ...['17','18','19','20','21','22','23'].map((d,i)=>C('wDay',{kind:'text',x:px(32+i*31),y:350,
    width:31,height:16,label:d,fontSize:12,color:T.cielo})),

  // Pendientes: tile ámbar 214×352 en (284,58), 6 filas cada 48 px.
  C('tCard',{kind:'card',x:px(284),y:58,width:214,height:352,background:T.ambarBg,radius:22}),
  eyebrow('tEye',px(300),74,'PENDIENTES',T.ambar,182),
  C('tRow',{kind:'text',x:px(300),y:110,width:182,height:20,label:'Sin sincronizar',fontSize:14,color:T.muted}),

  // Próximo en agenda: tile lila 206×352 en (514,58), 5 filas cada 52 px.
  C('aCard',{kind:'card',x:px(514),y:58,width:206,height:352,background:T.lilaBg,radius:22}),
  eyebrow('aEye',px(530),74,'PROXIMO EN AGENDA',T.lila,174),
  C('aRow',{kind:'text',x:px(530),y:110,width:174,height:44,label:'Sin sincronizar',fontSize:14,color:T.muted}),

  // Acciones rápidas: tokens::quick_actions.
  C('qa1',{kind:'chip',x:px(16),y:420,width:226,height:48,label:'Modo noche',background:T.lilaBg,color:T.lila,radius:24,fontSize:14,action:{type:'wyss.command',value:'quick_action:0'}}),
  C('qa2',{kind:'chip',x:px(254),y:420,width:226,height:48,label:'Apagar todo',background:T.coralBg,color:T.coralInk,radius:24,fontSize:14,action:{type:'wyss.command',value:'quick_action:1'}}),
  C('qa3',{kind:'chip',x:px(492),y:420,width:228,height:48,label:'Estoy saliendo',background:T.cieloBg,color:T.cielo,radius:24,fontSize:14,action:{type:'wyss.command',value:'quick_action:2'}}),
]};

// ============ HOGAR (pages_[1]) ============
// Tres selectores de LUZ individual (no habitaciones) + control + 3 escenas.
const LIGHTS=[['Living','Encendida',T.ambarBg,T.ink],['Escritorio','No disponible',T.surface,T.muted],
              ['Ambiente','Encendida',T.surface,T.ink]] as const;
const hogar:StudioScreen={id:'hogar',name:'Hogar',width:800,height:480,background:T.canvas,components:[
  ...rail(1),
  ...LIGHTS.flatMap(([nm,st,bg,ink],i)=>[
    C('lSel',{kind:'button',x:px(16),y:12+i*130,width:210,height:118,background:bg as string,radius:20,
      action:{type:'wyss.command',value:`device:${i}`}}),
    C('lLbl',{kind:'text',x:px(24),y:56+i*130,width:178,height:36,label:`${nm}\n${st}`,fontSize:14,color:ink as string}),
  ]),

  // Control de la luz seleccionada: tile ámbar 478×378 en (242,12) — centro 481.
  C('ctrl',{kind:'card',x:px(242),y:12,width:478,height:378,background:T.ambarBg,radius:22}),
  C('cNm',{kind:'text',x:px(264),y:30,width:300,height:26,label:'Living',fontSize:20,color:T.ink}),
  C('cAv',{kind:'text',x:px(588),y:36,width:116,height:16,label:'Disponible',fontSize:12,color:T.green}),
  C('cSt',{kind:'text',x:px(264),y:62,width:300,height:16,label:'Encendida',fontSize:12,color:T.ambar}),
  C('pwr',{kind:'button',x:px(258),y:118,width:72,height:72,label:'⏻',background:T.surface,color:T.ambar,radius:36,fontSize:26,action:{type:'wyss.command',value:'light.toggle'}}),
  C('brT',{kind:'text',x:px(346),y:108,width:80,height:16,label:'Brillo',fontSize:12,color:T.ambar}),
  C('brV',{kind:'text',x:px(614),y:100,width:90,height:26,label:'68 %',fontSize:20,color:T.ink}),
  C('brS',{kind:'slider',x:px(346),y:132,width:358,height:44,value:68,accent:T.ambar,background:T.surface,radius:22,action:{type:'wyss.command',value:'light.brightness'}}),
  // Color: paleta centrada (289..673) con los predefinidos debajo.
  C('huT',{kind:'text',x:px(289),y:200,width:384,height:16,label:'Color',fontSize:12,color:T.ambar}),
  C('hue',{kind:'hue',x:px(289),y:231,width:384,height:30,value:24,radius:15,action:{type:'wyss.command',value:'light.color'}}),
  C('warm',{kind:'chip',x:px(349),y:290,width:124,height:44,label:'Calido',background:T.surface,color:T.ambar,radius:22,fontSize:12,action:{type:'wyss.command',value:'light.preset:FFB45C'}}),
  C('cold',{kind:'chip',x:px(489),y:290,width:124,height:44,label:'Frio',background:T.surface,color:T.cielo,radius:22,fontSize:12,action:{type:'wyss.command',value:'light.preset:CFE4F2'}}),

  // Escenas: tokens::scene_buttons, etiqueta desde el estado.
  C('sc1',{kind:'chip',x:px(16),y:402,width:226,height:56,label:'Sin escena',background:T.surface,color:T.muted,radius:28,fontSize:14,action:{type:'wyss.command',value:'scene:0'}}),
  C('sc2',{kind:'chip',x:px(254),y:402,width:226,height:56,label:'Sin escena',background:T.surface,color:T.muted,radius:28,fontSize:14,action:{type:'wyss.command',value:'scene:1'}}),
  C('sc3',{kind:'chip',x:px(492),y:402,width:228,height:56,label:'Sin escena',background:T.surface,color:T.muted,radius:28,fontSize:14,action:{type:'wyss.command',value:'scene:2'}}),
]};

// ============ MEDIA (pages_[2]) ============
// Una sola vista: tile selva 452×432 + tarjeta de cola 236×432. Sin tabs.
const media:StudioScreen={id:'media',name:'Media',width:800,height:480,background:T.canvas,components:[
  ...rail(2),
  C('mCard',{kind:'card',x:px(16),y:12,width:452,height:432,background:T.selvaBg,radius:22}),
  C('mLogo',{kind:'chip',x:px(32),y:28,width:28,height:28,label:'♫',background:T.selva,color:'#FFFFFF',radius:14,fontSize:14}),
  eyebrow('mEye',px(72),28,'SPOTIFY',T.selva,150),
  C('mDev',{kind:'text',x:px(252),y:30,width:200,height:16,label:'Escritorio',fontSize:12,color:T.selva}),
  C('mTit',{kind:'text',x:px(32),y:92,width:420,height:34,label:'Midnight City',fontSize:26,color:T.ink}),
  C('mArt',{kind:'text',x:px(32),y:132,width:420,height:20,label:'M83',fontSize:14,color:T.selva}),
  C('mPrev',{kind:'button',x:px(96),y:188,width:64,height:64,label:'◀◀',background:T.surface,color:T.ink,radius:32,fontSize:20,action:{type:'wyss.command',value:'media.previous'}}),
  C('mPlay',{kind:'button',x:px(196),y:174,width:92,height:92,label:'❚❚',background:T.selva,color:'#FFFFFF',radius:46,fontSize:30,action:{type:'wyss.command',value:'media.play_pause'}}),
  C('mNext',{kind:'button',x:px(324),y:188,width:64,height:64,label:'▶▶',background:T.surface,color:T.ink,radius:32,fontSize:20,action:{type:'wyss.command',value:'media.next'}}),
  C('mFav',{kind:'button',x:px(177),y:282,width:130,height:44,label:'Favorito',background:T.surface,color:T.selva,radius:22,fontSize:12,action:{type:'wyss.command',value:'media.favorite'}}),
  C('mT0',{kind:'text',x:px(32),y:348,width:48,height:16,label:'1:14',fontSize:12,color:T.muted}),
  C('mProg',{kind:'progress',x:px(80),y:352,width:300,height:8,value:31,accent:T.selva,background:T.surface,radius:4}),
  C('mT1',{kind:'text',x:px(388),y:348,width:60,height:16,label:'4:04',fontSize:12,color:T.muted}),
  C('mVol',{kind:'text',x:px(32),y:388,width:24,height:20,label:'🔊',fontSize:16,color:T.muted}),
  C('mVolS',{kind:'slider',x:px(68),y:380,width:260,height:40,value:42,accent:T.selva,background:T.surface,radius:20,action:{type:'wyss.command',value:'media.volume'}}),

  C('qCard',{kind:'card',x:px(484),y:12,width:236,height:432,background:T.surface,radius:22}),
  eyebrow('qEye',px(500),28,'A CONTINUACION',T.selva,204),
  C('qList',{kind:'list',x:px(500),y:62,width:204,height:210,fontSize:14,color:T.ink,
    items:['Nikes','Frank Ocean','Self Control','Frank Ocean','Zamba de mi esperanza','Los Chalchaleros']}),
]};

// ============ AGENDA (pages_[3]) ============
const agenda:StudioScreen={id:'agenda',name:'Agenda',width:800,height:480,background:T.canvas,components:[
  ...rail(3),
  C('agCard',{kind:'card',x:px(16),y:12,width:452,height:444,background:T.lilaBg,radius:22}),
  eyebrow('agEye',px(32),28,'AGENDA',T.lila,200),
  C('agSt',{kind:'text',x:px(32),y:56,width:420,height:26,label:'Proximo: Reunion de producto',fontSize:20,color:T.ink}),
  C('agMt',{kind:'text',x:px(32),y:90,width:420,height:16,label:'Actualizado hace 3 min - solo lectura',fontSize:12,color:T.lila}),
  C('agEv',{kind:'list',x:px(32),y:128,width:420,height:184,fontSize:14,color:T.ink,
    items:['18/07  10:00  Reunion de producto','18/07  15:30  Revision semanal  [TENTATIVO]','19/07  TODO EL DIA  Feriado local','20/07  09:00  Planificacion']}),
  C('rmCard',{kind:'card',x:px(484),y:12,width:236,height:210,background:T.ambarBg,radius:22}),
  eyebrow('rmEye',px(500),28,'RECORDATORIOS',T.ambar,204),
  C('rmSt',{kind:'text',x:px(500),y:60,width:204,height:60,label:'2 pendientes\n\nProximo:\nTomar medicacion',fontSize:14,color:T.ink}),
  C('tmCard',{kind:'card',x:px(484),y:234,width:236,height:222,background:T.coralBg,radius:22}),
  eyebrow('tmEye',px(500),250,'TIMERS',T.coralInk,204),
  C('tmSt',{kind:'text',x:px(500),y:282,width:204,height:60,label:'1 activos\n\nHorno\n05:00',fontSize:14,color:T.ink}),
]};

// ============ SISTEMA (pages_[4]) ============
const sistema:StudioScreen={id:'sistema',name:'Sistema',width:800,height:480,background:T.canvas,components:[
  ...rail(4),
  C('sCard',{kind:'card',x:px(16),y:12,width:704,height:92,background:T.surface,radius:22}),
  C('sDot',{kind:'chip',x:px(32),y:36,width:44,height:44,label:'',background:T.red,radius:22}),
  C('sTxt',{kind:'text',x:px(92),y:46,width:600,height:26,label:'Home Edge: sin conexion',fontSize:20,color:T.red}),
  C('pCard',{kind:'card',x:px(16),y:116,width:346,height:340,background:T.surface,radius:22}),
  eyebrow('pEye',px(32),132,'PROTOCOLO',T.cielo,314),
  C('pTxt',{kind:'text',x:px(32),y:164,width:314,height:20,label:'v1 estable - v2 opt-in',fontSize:14,color:T.ink}),
  C('dCard',{kind:'card',x:px(370),y:116,width:350,height:340,background:T.surface,radius:22}),
  eyebrow('dEye',px(386),132,'DIAGNOSTICO',T.coralInk,318),
  C('dTxt',{kind:'text',x:px(386),y:164,width:318,height:20,label:'Sin datos de latencia todavia',fontSize:14,color:T.ink}),
]};

// ============ DURMIENDO (sleeping_layer_) ============
const dormir:StudioScreen={id:'dormir',name:'Durmiendo',width:800,height:480,background:T.night,components:[
  C('slT',{kind:'text',x:24,y:22,width:120,height:20,label:'Wyss',fontSize:14,color:T.nightMuted}),
  C('slC',{kind:'text',x:750,y:24,width:26,height:20,label:'≋',fontSize:14,color:T.red}),
  C('slCore',{kind:'ring',x:316,y:92,width:168,height:168,background:T.nightChip,accent:T.coral,radius:84}),
  C('slLbl',{kind:'text',x:316,y:150,width:168,height:52,label:'Wyss\ndurmiendo',fontSize:20,color:T.nightInk}),
  C('slSum',{kind:'text',x:30,y:344,width:740,height:40,label:'Resistencia - 28 C - Despejado - actualizado hace 3 min   -   proximo: Reunion de producto   -   2 recordatorios - Tomar medicacion   -   Horno 05:00',fontSize:14,color:T.nightMuted}),
  C('slBtn',{kind:'button',x:300,y:410,width:200,height:52,label:'Toca para despertar',background:T.nightChip,color:T.nightInk,radius:26,fontSize:14,action:{type:'wyss.command',value:'shell.manual'}}),
]};

// ============ CONVERSACIÓN (conversation_layer_) ============
const conversacion:StudioScreen={id:'conversacion',name:'Conversación',width:800,height:480,background:T.canvas,components:[
  C('cvBack',{kind:'button',x:16,y:12,width:48,height:48,label:'‹',background:T.surface,color:T.ink,radius:24,fontSize:16,action:{type:'navigate',value:'inicio'}}),
  eyebrow('cvEye',80,30,'Conversacion con Wyss',T.coralInk,240),
  C('cvSt',{kind:'text',x:36,y:82,width:600,height:26,label:'Que queres que haga?',fontSize:20,color:T.ink}),
  C('cvHint',{kind:'text',x:36,y:118,width:620,height:18,label:'Yo preparo un plan y te pido permiso cuando corresponde.',fontSize:12,color:T.muted}),
  C('cvIn',{kind:'card',x:36,y:154,width:610,height:68,background:T.surface,radius:32}),
  C('cvPh',{kind:'text',x:60,y:178,width:560,height:20,label:'Ej.: deja el living listo para ver una pelicula',fontSize:14,color:T.muted}),
  C('cvGo',{kind:'button',x:664,y:154,width:100,height:68,label:'›',background:T.coral,color:'#FFFFFF',radius:34,fontSize:20,action:{type:'wyss.command',value:'conversation.submit'}}),
  C('cvEx',{kind:'text',x:36,y:240,width:728,height:58,label:'Listo para orquestar.',fontSize:14,color:T.muted}),
  C('cvKb',{kind:'card',x:36,y:282,width:728,height:190,background:T.surface,radius:16}),
]};

export const panelProject:StudioProject={
  schemaVersion:'1.1',id:'wyss-home-panel',name:'Wyss Home Panel — estado actual (01a473a)',
  updatedAt:new Date().toISOString(),
  screens:[inicio,hogar,media,agenda,sistema,dormir,conversacion],
};
