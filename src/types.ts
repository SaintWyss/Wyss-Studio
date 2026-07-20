export type ComponentKind='text'|'button'|'switch'|'card'|'clock';
export type ActionType='none'|'navigate'|'wyss.command';
export interface StudioAction{type:ActionType;value:string}
export interface StudioComponent{id:string;kind:ComponentKind;x:number;y:number;width:number;height:number;label:string;background:string;color:string;radius:number;fontSize:number;action:StudioAction}
export interface StudioScreen{id:string;name:string;width:number;height:number;background:string;components:StudioComponent[]}
export interface StudioProject{schemaVersion:'1.0';id:string;name:string;updatedAt:string;screens:StudioScreen[]}
