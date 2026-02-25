export interface SubSKUType {
  id: string;
  name: string;        // e.g. "Sub-SKU Type 1"
  code: string;        // e.g. "SST-001"
  available: number;
  reserved: number;
  maxQty: number;
  active: boolean;
  inPreProcessing: boolean; // true = manufacture complete but pre-processing not yet done
}

export interface MaterialSKU {
  id: string;
  name: string;        // Parent SKU name
  code: string;
  subSkuTypes: SubSKUType[];
}

export type ContainerType = 'trolley' | 'pallet' | 'bin';

export interface ContainerSubtype {
  id: string;
  name: string;
  available: number;
}

export interface Container {
  id: string;
  type: ContainerType;
  subtypes: ContainerSubtype[];
}

export interface CartItem {
  subSkuTypeId: string;
  subSkuTypeName: string;
  skuName: string;
  quantity: number;
  maxQty: number;
}

export interface ContainerCartItem {
  containerId: string;
  containerType: ContainerType;
  subtypeId: string;
  subtypeName: string;
  quantity: number;
}

export interface StagingCell {
  id: string;
  row: number;
  col: number;
  status: 'empty' | 'occupied' | 'reserved';
  material?: string;
  trolleyId?: string;
}

export interface StagingArea {
  id: string;
  name: string;
  rows: number;
  cols: number;
  cells: StagingCell[];
}

export interface Request {
  id: string;
  type: 'material' | 'container' | 'return_trolley';
  status: 'pending' | 'awaiting_confirmation' | 'in_progress' | 'completed' | 'failed' | 'breakdown';
  createdAt: string;
  items: string;
  workflow: string;
  workflowId: string; // for filtering by active workflow
}

export interface ApprovalRequest {
  id: string;
  fromStation: string;
  items: string;
  quantity: number;
  requestType: string;
  requestTime: string;
  inventoryCount: number;
  inventoryStatus: 'available' | 'out_of_stock' | 'finishing_soon';
  workflow: string;
  requestedAt: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface InventoryRow {
  sku: string;
  subSkuType: string;
  produced: number;
  preProcessing: number;
  available: number;
  reserved: number;
  inTransit: number;
  consumed: number;
  total: number;
}

export interface Workflow {
  id: string;
  name: string;
  assignmentStrategy: 'request-based' | 'on-route';
  confirmationMode: 'auto' | 'manual';
}

export interface DeviceUser {
  id: string;
  username: string;
  stationId: string;   // e.g. "Station 001" — shown in breadcrumbs
  stationCode: string; // e.g. "PR 001" — shown in sidebar dropdown
  stationName: string;
  deviceName: string;
  role: 'requester' | 'dispatcher' | 'approver';
  workflows: Workflow[];
  stagingAreaIds: string[];
}
