// ─── Primitives ──────────────────────────────────────────────────────────────
export type OrderType = 'single' | 'fulfillment';
export type AssignmentStrategy = 'request-based' | 'on-route';
export type ExecutionTrigger = 'dispatch' | 'qr-scan';
export type StationSelectionMode = 'static' | 'mapping-based';
export type ConfirmationMode = 'auto' | 'manual';
export type StationType = 'point' | 'staging';
export type ActionTypePick = 'pick' | 'auto-hitch';
export type ActionTypeDrop = 'drop' | 'auto-unhitch';
export type UIMode = 'legacy' | 'structured';
export type OrderCategory = 'material' | 'container';
export type TrolleyScope = 'from-sku' | 'manual';
export type ExecutionSourceType = 'requester' | 'mes' | 'supervisor' | 'dispatcher';
export type ConnectionStatus = 'connected' | 'disconnected';
export type WorkflowTab = 'requester' | 'receiver';

// ─── Material Configuration (3-level) ────────────────────────────────────────
export interface MatSubSku {
  id: string;
  name: string;
  code: string;
}

export interface MatSku {
  id: string;
  skuType: string;
  skuCode: string;
  containerType: string;
  containerSubType: string;
  subSkus: MatSubSku[];
}

export interface MatMaterial {
  id: string;
  className: string;   // Material Type Name
  materialCode: string; // Prefix
  preprocessingTime: number;
  stagingArea?: string;
  maxQty: number;
  skus: MatSku[];
}

// ─── Material (legacy) ────────────────────────────────────────────────────────
export interface MaterialSubSku { id: string; name: string; code: string; }
export interface MaterialSkuEntry { id: string; skuType: string; skuCode: string; subSkus: MaterialSubSku[]; }
export interface MaterialClass { id: string; className: string; classCode: string; skuType: string; qty: number; preprocessingTime: number; skus: MaterialSkuEntry[]; }
export interface MaterialInstance { id: string; name: string; code: string; active: boolean; }
export interface MaterialClassItem { id: string; name: string; code: string; preprocessingTime: number; maxQuantity: number; active: boolean; instances: MaterialInstance[]; }
export interface MaterialFamily { id: string; name: string; code: string; skuType: string; classes: MaterialClassItem[]; }
export interface MaterialCategory { id: string; name: string; code: string; families: MaterialFamily[]; }
export interface Material { id: string; name: string; code: string; skus: MatSku[]; }

// ─── Material (legacy flat model) ─────────────────────────────────────────────
export interface SubSku {
  id: string;
  code: string;            // Sub-SKU code / name
  skuType: string;         // SKU Type (category) — new in v2.0
  subSkuType: string;      // Sub-SKU Type — new in v2.0
  preprocessingTime: number; // minutes — new in v2.0
  active: boolean;           // Active / Inactive — new in v2.0
  maxQuantity: number;
}

export interface Sku {
  id: string;
  name: string;
  aliases: string[];
  containerType: string;
  containerSubType: string;
  subSkus: SubSku[];
}

// ─── Container ───────────────────────────────────────────────────────────────
export interface Container {
  id: string;
  serialNo: number;
  type: string;       // Trolley | Pallet | Bin
  subType: string;
  containerId: string;
  dimensions: string; // formatted string "Type: 100(L)*100(W)*100(H)"
  hitchLength: number;
  qty: number;
}

// ─── Staging Area ─────────────────────────────────────────────────────────────
export interface StagingAreaCell {
  row: number;
  col: number;
  status: 'empty' | 'filled' | 'reserved' | 'blocked';
  containerSubType?: string;
}

export interface StagingArea {
  id: string;
  name: string;
  fleet: string;
  rows: number;
  cols: number;
  active: boolean;
  updatedMinsAgo: number;
  utilisedCells: number;
  totalCells: number;
  cells: StagingAreaCell[];
}

// ─── Workflow ─────────────────────────────────────────────────────────────────
export interface PickupConfig {
  stationSelectionMode: StationSelectionMode;
  mappingId?: string;
  stationType: StationType;
  confirmationMode: ConfirmationMode;
  actionType: ActionTypePick;
}

export interface DropConfig {
  stationSelectionMode: StationSelectionMode;
  mappingId?: string;
  actionType: ActionTypeDrop;
}

export interface Workflow {
  id: string;
  name: string;
  productionUnit?: string;
  tab: WorkflowTab;
  orderCategory: OrderCategory;            // 'material' | 'container'
  orderType: OrderType;
  assignmentStrategy: AssignmentStrategy;
  executionTrigger?: ExecutionTrigger;     // only for on-route
  // Material order fields
  materialScope?: 'sku' | 'alias' | 'parent';
  selectedSkus?: string[];
  selectedAliases?: string[];
  parentMaterials?: string[];
  // Container order fields
  trolleyScope?: TrolleyScope;
  selectedTrolleys?: string[];
  pickupConfig: PickupConfig;
  dropConfig: DropConfig;
  fleet: string;
}

// ─── Execution Sources (replaces Device Configuration) ───────────────────────
export interface RequesterSource {
  id: string;
  type: 'requester';
  name: string;
  deviceId: string;
  username: string;
  boundProcessingArea: string;       // NEW — Bound Processing Area
  boundWorkflows: string[];
  visibleStagingAreas: string[];
  uiMode: UIMode;
}

export interface MESSource {
  id: string;
  type: 'mes';
  name: string;                      // Workflow event mapping name
  keyValuePairs: { key: string; value: string }[];
  materialCode: string;
  boundWorkflow: string;
}

export interface SupervisorSource {  // NEW — entire interface
  id: string;
  type: 'supervisor';
  name: string;
  deviceId: string;
  username: string;
  visibleStagingAreas: string[];
  inventoryAreas: string[];          // Processing areas whose inventory to show
}

export interface DispatcherSource {
  id: string;
  type: 'dispatcher';
  name: string;
  deviceId: string;
  username: string;
  boundStations: string[];           // Remove boundTriggerSources — not in PRD
}

export type ExecutionSource = RequesterSource | MESSource | SupervisorSource | DispatcherSource;

// ─── Mapping Tables ───────────────────────────────────────────────────────────
export interface MaterialMappingEntry {
  skuType: string;        // Material Class (Sub-SKU Type)
  pickupStation: string;
  dropStation: string;
}

export interface ContainerMappingEntry {
  containerSubType: string;
  pickupStation: string;
  dropStation: string;
}

export interface MaterialMapping {
  id: string;             // e.g. MAP-001
  entries: MaterialMappingEntry[];
}

export interface ContainerMapping {
  id: string;             // e.g. CMAP-001
  entries: ContainerMappingEntry[];
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export interface ServiceConnection {
  id: string;
  name: string;
  abbreviation: string;
  description: string;
  status: ConnectionStatus;
  host?: string;
  port?: number;
  lastSynced?: string;
  color: string; // avatar bg color
}

export interface GeneralSettings {
  skuBreakdown: { subSku: boolean };
  linkContainer: { containerType: boolean; containerSubtype: boolean };
  linkStation: { stationIdName: boolean };
  containerTypes: { trolley: boolean; pallet: boolean; bin: boolean };
  containerSettings: { containerSubtype: boolean };
}

// ─── Processing Area ──────────────────────────────────────────────────────────
export interface ProcessingArea {
  id: string;
  name: string;
  machineName?: string;
  pointType?: 'Consumption Point' | 'Production Point';
}

// ─── WIP Inventory ────────────────────────────────────────────────────────────
export interface InventoryEntry {
  id: string;
  skuId: string;
  skuName: string;
  subSkuType: string;
  produced: number;
  preprocessing: number;
  available: number;
  reserved: number;
  inTransit: number;
  consumed: number;
}

export interface SubSkuConfig {
  subSkuType: string;
  productionEntryMode: boolean;  // MES Event Only
  consumptionMode: boolean;      // reduce on Drop
}
