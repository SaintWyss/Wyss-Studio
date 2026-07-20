export type ComponentKind='text'|'button'|'switch'|'card'|'clock'|'chip'|'slider'|'progress'|'list'|'bars'|'ring'|'hue';
export type ActionType='none'|'navigate'|'wyss.command';
export interface StudioAction{type:ActionType;value:string}
export interface StudioComponent{
  id:string;kind:ComponentKind;x:number;y:number;width:number;height:number;
  label:string;background:string;color:string;radius:number;fontSize:number;action:StudioAction;
  /** slider/progress/hue: valor 0-100 */
  value?:number;
  /** color secundario: relleno de slider/progress, barras, bullets/chips de lista */
  accent?:string;
  /** list: filas ("Texto" o "Chip|Texto") · bars: "Etiqueta|alto%|tope" · ring: colores de segmento */
  items?:string[];
}
export interface StudioScreen{id:string;name:string;width:number;height:number;background:string;components:StudioComponent[]}
export interface StudioProject{schemaVersion:'1.0'|'1.1';id:string;name:string;updatedAt:string;screens:StudioScreen[]}
