import type {
  MaterialSKU,
  Container,
  StagingArea,
  Request,
  InventoryRow,
  Workflow,
  DeviceUser,
} from '../types';

export const mockWorkflows: Workflow[] = [
  { id: 'wf-01', name: 'Assembly Line A', assignmentStrategy: 'request-based', confirmationMode: 'auto' },
  { id: 'wf-02', name: 'QC Station B',    assignmentStrategy: 'on-route',       confirmationMode: 'manual' },
  { id: 'wf-03', name: 'Production C',    assignmentStrategy: 'request-based', confirmationMode: 'auto' },
];

export const mockDeviceUser: DeviceUser = {
  id: 'dev-001',
  username: 'Arjun',
  stationId: 'Station 001',
  stationCode: 'PR 001',
  stationName: 'Assembly Line A – Requester',
  deviceName: 'YOHT-123',
  role: 'requester',
  workflows: mockWorkflows,
  stagingAreaIds: ['sa-01', 'sa-02'],
};

export const mockMaterials: MaterialSKU[] = [
  {
    id: 'sku-01',
    name: 'Widget A',
    code: 'WGT-A',
    subSkuTypes: [
      { id: 'sst-01', name: 'Sub-SKU Type 1', code: 'WGT-A-T1', available: 12, reserved: 3, maxQty: 5, active: true, inPreProcessing: false },
      { id: 'sst-02', name: 'Sub-SKU Type 2', code: 'WGT-A-T2', available: 0,  reserved: 0, maxQty: 5, active: true, inPreProcessing: false },
      { id: 'sst-03', name: 'Sub-SKU Type 3', code: 'WGT-A-T3', available: 0,  reserved: 0, maxQty: 3, active: true, inPreProcessing: true  },
    ],
  },
  {
    id: 'sku-02',
    name: 'Bracket B',
    code: 'BKT-B',
    subSkuTypes: [
      { id: 'sst-04', name: 'Sub-SKU Type 1', code: 'BKT-B-T1', available: 20, reserved: 5, maxQty: 10, active: true, inPreProcessing: false },
      { id: 'sst-05', name: 'Sub-SKU Type 2', code: 'BKT-B-T2', available: 4,  reserved: 0, maxQty: 4,  active: true, inPreProcessing: true  },
    ],
  },
  {
    id: 'sku-03',
    name: 'Panel C',
    code: 'PNL-C',
    subSkuTypes: [
      { id: 'sst-06', name: 'Sub-SKU Type 1', code: 'PNL-C-T1', available: 0,  reserved: 2, maxQty: 6, active: true, inPreProcessing: false },
      { id: 'sst-07', name: 'Sub-SKU Type 2', code: 'PNL-C-T2', available: 6,  reserved: 0, maxQty: 6, active: true, inPreProcessing: false },
      { id: 'sst-08', name: 'Sub-SKU Type 3', code: 'PNL-C-T3', available: 3,  reserved: 1, maxQty: 3, active: true, inPreProcessing: false },
    ],
  },
  {
    id: 'sku-04',
    name: 'Axle D',
    code: 'AXL-D',
    subSkuTypes: [
      { id: 'sst-09', name: 'Sub-SKU Type 1', code: 'AXL-D-T1', available: 7, reserved: 0, maxQty: 5, active: true, inPreProcessing: false },
    ],
  },
];

export const mockContainers: Container[] = [
  {
    id: 'con-01',
    type: 'trolley',
    subtypes: [
      { id: 'cst-01', name: 'Heavy Trolley',    available: 8 },
      { id: 'cst-02', name: 'Light Trolley',    available: 15 },
      { id: 'cst-03', name: 'Flat Trolley',     available: 3 },
    ],
  },
  {
    id: 'con-02',
    type: 'pallet',
    subtypes: [
      { id: 'cst-04', name: 'Standard Pallet',  available: 20 },
      { id: 'cst-05', name: 'Euro Pallet',      available: 10 },
    ],
  },
  {
    id: 'con-03',
    type: 'bin',
    subtypes: [
      { id: 'cst-06', name: 'Small Bin',        available: 30 },
      { id: 'cst-07', name: 'Large Bin',        available: 12 },
    ],
  },
];

const buildCells = (rows: number, cols: number) =>
  Array.from({ length: rows * cols }, (_, i) => ({
    id: `cell-${i}`,
    row: Math.floor(i / cols),
    col: i % cols,
    status: (i % 7 === 0 ? 'occupied' : i % 5 === 0 ? 'reserved' : 'empty') as 'occupied' | 'reserved' | 'empty',
    material: i % 7 === 0 ? 'Widget A – T1' : undefined,
    trolleyId: i % 7 === 0 ? `TR-${100 + i}` : undefined,
  }));

export const mockStagingAreas: StagingArea[] = [
  { id: 'sa-01', name: 'SA 001', rows: 40, cols: 5, cells: buildCells(40, 5) },
  { id: 'sa-02', name: 'SA 002', rows: 40, cols: 5, cells: buildCells(40, 5) },
];

export const mockRequests: Request[] = [
  { id: 'Req-001', type: 'material',  status: 'in_progress',          createdAt: 'Today, 3:00 pm', items: 'SKU 7765',       workflow: 'Assembly Line A', workflowId: 'wf-01' },
  { id: 'Req-002', type: 'container', status: 'failed',               createdAt: 'Today, 3:00 pm', items: 'Leaf Container', workflow: 'Assembly Line A', workflowId: 'wf-01' },
  { id: 'Req-003', type: 'material',  status: 'completed',            createdAt: 'Today, 2:30 pm', items: 'Widget A – T1',  workflow: 'Assembly Line A', workflowId: 'wf-01' },
  { id: 'Req-004', type: 'material',  status: 'pending',              createdAt: 'Today, 2:00 pm', items: 'Bracket B – T1', workflow: 'Assembly Line A', workflowId: 'wf-01' },
  { id: 'Req-005', type: 'container', status: 'awaiting_confirmation', createdAt: 'Today, 1:45 pm', items: 'Heavy Trolley',  workflow: 'Assembly Line A', workflowId: 'wf-01' },
  { id: 'Req-006', type: 'material',  status: 'completed',            createdAt: 'Today, 1:00 pm', items: 'Panel C – T2',   workflow: 'Assembly Line A', workflowId: 'wf-01' },
  { id: 'Req-007', type: 'material',  status: 'failed',               createdAt: 'Today, 12:30 pm', items: 'Axle D – T1',  workflow: 'QC Station B',    workflowId: 'wf-02' },
];

export const mockInventory: InventoryRow[] = [
  { sku: 'Widget A',  subSkuType: 'Type 1', produced: 50, preProcessing: 5, available: 12, reserved: 3, inTransit: 2, consumed: 28, total: 50 },
  { sku: 'Widget A',  subSkuType: 'Type 2', produced: 30, preProcessing: 0, available: 0,  reserved: 0, inTransit: 0, consumed: 30, total: 30 },
  { sku: 'Widget A',  subSkuType: 'Type 3', produced: 40, preProcessing: 2, available: 8,  reserved: 1, inTransit: 0, consumed: 29, total: 40 },
  { sku: 'Bracket B', subSkuType: 'Type 1', produced: 80, preProcessing: 0, available: 20, reserved: 5, inTransit: 3, consumed: 52, total: 80 },
  { sku: 'Bracket B', subSkuType: 'Type 2', produced: 25, preProcessing: 1, available: 4,  reserved: 0, inTransit: 0, consumed: 20, total: 25 },
  { sku: 'Panel C',   subSkuType: 'Type 1', produced: 60, preProcessing: 3, available: 0,  reserved: 2, inTransit: 1, consumed: 54, total: 60 },
  { sku: 'Panel C',   subSkuType: 'Type 2', produced: 45, preProcessing: 0, available: 6,  reserved: 0, inTransit: 0, consumed: 39, total: 45 },
  { sku: 'Axle D',    subSkuType: 'Type 1', produced: 35, preProcessing: 0, available: 7,  reserved: 0, inTransit: 0, consumed: 28, total: 35 },
];
