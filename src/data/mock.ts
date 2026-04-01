import type {
  Sku,
  Container,
  StagingArea,
  Workflow,
  ExecutionSource,
  ServiceConnection,
  GeneralSettings,
  ProcessingArea,
  MaterialMapping,
  ContainerMapping,
  InventoryEntry,
  SubSkuConfig,
  MaterialClass,
  MatMaterial,
} from '../types';

// ─── Material Configuration (3-level: Material Class > SKU > Sub SKU) ─────────
export const mockMatMaterials: MatMaterial[] = [
  {
    id: 'mat-1', materialType: 'SMD', prefix: 'MAT-001', preprocessingTime: 30, maxQty: 50, stagingAreaEnabled: true,
    skus: [
      { id: 'sku-1-1', skuType: 'SMD', skuCode: 'SKU-SMD-001', containerType: 'Trolley', containerSubType: 'Trolley Type 1',
        subSkus: [
          { id: 'ss-1-1-1', name: 'Sub SKU Alpha', code: 'SS-001-A' },
          { id: 'ss-1-1-2', name: 'Sub SKU Beta',  code: 'SS-001-B' },
        ] },
      { id: 'sku-1-2', skuType: 'SMD', skuCode: 'SKU-SMD-002', containerType: 'Pallet', containerSubType: 'Pallet Type 1',
        subSkus: [
          { id: 'ss-1-2-1', name: 'Sub SKU Gamma', code: 'SS-002-A' },
        ] },
    ],
  },
  {
    id: 'mat-2', materialType: 'PBA', prefix: 'MAT-002', preprocessingTime: 45, maxQty: 30, stagingAreaEnabled: true,
    skus: [
      { id: 'sku-2-1', skuType: 'PBA', skuCode: 'SKU-PBA-001', containerType: 'Bin', containerSubType: 'Bin Type 1',
        subSkus: [
          { id: 'ss-2-1-1', name: 'Sub SKU Delta', code: 'SS-PBA-001' },
        ] },
    ],
  },
  {
    id: 'mat-3', materialType: 'Mechanical', prefix: 'MAT-003', preprocessingTime: 15, maxQty: 100, stagingAreaEnabled: false,
    skus: [
      { id: 'sku-3-1', skuType: 'Mechanical', skuCode: 'SKU-MECH-001', containerType: 'Trolley', containerSubType: 'Trolley Type 2',
        subSkus: [
          { id: 'ss-3-1-1', name: 'Sub SKU Epsilon', code: 'SS-MECH-001' },
          { id: 'ss-3-1-2', name: 'Sub SKU Zeta',    code: 'SS-MECH-002' },
        ] },
    ],
  },
];

// ─── Material Classes (legacy) ────────────────────────────────────────────────
export const mockMaterialClasses: MaterialClass[] = [
  {
    id: 'mc-1', className: 'SMD Components', classCode: 'MC-001', skuType: 'SMD', qty: 100, preprocessingTime: 30,
    skus: [
      { id: 'msku-1-1', skuType: 'SMD', skuCode: 'SMD-001', subSkus: [
        { id: 'msub-1-1-1', name: 'Alpha Chip', code: 'SMD-001-A' },
        { id: 'msub-1-1-2', name: 'Beta Chip', code: 'SMD-001-B' },
      ]},
      { id: 'msku-1-2', skuType: 'SMD', skuCode: 'SMD-002', subSkus: [
        { id: 'msub-1-2-1', name: 'Gamma Module', code: 'SMD-002-A' },
      ]},
    ],
  },
  {
    id: 'mc-2', className: 'PBA Assemblies', classCode: 'MC-002', skuType: 'PBA', qty: 50, preprocessingTime: 45,
    skus: [
      { id: 'msku-2-1', skuType: 'PBA', skuCode: 'PBA-001', subSkus: [
        { id: 'msub-2-1-1', name: 'Board Type A', code: 'PBA-001-A' },
        { id: 'msub-2-1-2', name: 'Board Type B', code: 'PBA-001-B' },
      ]},
      { id: 'msku-2-2', skuType: 'PBA', skuCode: 'PBA-002', subSkus: [
        { id: 'msub-2-2-1', name: 'Controller Board', code: 'PBA-002-C' },
      ]},
    ],
  },
  {
    id: 'mc-3', className: 'Mechanical Parts', classCode: 'MC-003', skuType: 'Mechanical', qty: 200, preprocessingTime: 15,
    skus: [
      { id: 'msku-3-1', skuType: 'Mechanical', skuCode: 'MECH-001', subSkus: [
        { id: 'msub-3-1-1', name: 'Bracket Small', code: 'MECH-001-S' },
        { id: 'msub-3-1-2', name: 'Bracket Large', code: 'MECH-001-L' },
      ]},
      { id: 'msku-3-2', skuType: 'Mechanical', skuCode: 'MECH-002', subSkus: [
        { id: 'msub-3-2-1', name: 'Frame Unit', code: 'MECH-002-F' },
      ]},
    ],
  },
  {
    id: 'mc-4', className: 'Electrical Components', classCode: 'MC-004', skuType: 'Electrical', qty: 150, preprocessingTime: 20,
    skus: [
      { id: 'msku-4-1', skuType: 'Electrical', skuCode: 'ELEC-001', subSkus: [
        { id: 'msub-4-1-1', name: 'Capacitor Set', code: 'ELEC-001-C' },
        { id: 'msub-4-1-2', name: 'Resistor Pack', code: 'ELEC-001-R' },
      ]},
    ],
  },
  {
    id: 'mc-5', className: 'DIP Components', classCode: 'MC-005', skuType: 'DIP', qty: 75, preprocessingTime: 25,
    skus: [],
  },
];

// ─── Processing Areas ─────────────────────────────────────────────────────────
export const mockProcessingAreas: ProcessingArea[] = [
  { id: 'rotr', name: 'ROTR' },
];

// ─── Materials ────────────────────────────────────────────────────────────────
export const mockSkus: Sku[] = Array.from({ length: 13 }, (_, i) => ({
  id: `sku-${i + 1}`,
  name: `SKU ${i + 1}`,
  aliases: ['Name 1', 'Name 2', 'Name 3'],
  containerType: 'Trolley',
  containerSubType: `Trolley Type ${(i % 3) + 1}`,
  subSkus: [
    {
      id: `sku-${i + 1}-sub-1`,
      code: `SKU-${String(i + 1).padStart(3, '0')}-A`,
      skuType: 'SMD',
      subSkuType: 'Type A',
      preprocessingTime: 30,
      active: true,
      maxQuantity: 50,
    },
    {
      id: `sku-${i + 1}-sub-2`,
      code: `SKU-${String(i + 1).padStart(3, '0')}-B`,
      skuType: 'SMD',
      subSkuType: 'Type B',
      preprocessingTime: 45,
      active: i % 4 !== 0,
      maxQuantity: 30,
    },
  ],
}));

// ─── Containers ───────────────────────────────────────────────────────────────
const CONTAINER_IDS = [
  'CNT-01-A3F9B', 'CNT-02-7KX2M', 'CNT-03-P1Q8R', 'CNT-04-Z5W4N',
  'CNT-05-H2L6T', 'CNT-06-D9V3C', 'CNT-07-R7Y1S', 'CNT-08-M4K5J',
  'CNT-09-B8G2F', 'CNT-10-E6N9X', 'CNT-11-W3Q7P', 'CNT-12-T1H4V',
  'CNT-13-F5R8K',
];

export const mockContainers: Container[] = Array.from({ length: 13 }, (_, i) => {
  const types = ['Trolley', 'Pallet', 'Bin'];
  const type = types[i % 3];
  return {
    id: `cnt-${i + 1}`,
    serialNo: i + 1,
    type,
    subType: `${type} Type ${(i % 3) + 1}`,
    containerId: CONTAINER_IDS[i],
    dimensions: `${type}: 100(L)*100(W)*100(H)`,
    hitchLength: 100,
    qty: 20,
  };
});

// ─── Staging Areas ────────────────────────────────────────────────────────────
export const mockStagingAreas: StagingArea[] = [
  {
    id: 'sa-1', name: 'SA 001', fleet: 'Fleet 1', rows: 5, cols: 10,
    active: true, updatedMinsAgo: 51, utilisedCells: 14, totalCells: 200,
    cells: [
      { row: 1, col: 1, status: 'filled' },
      { row: 2, col: 1, status: 'blocked' },
    ],
  },
  {
    id: 'sa-2', name: 'SA 002', fleet: 'Fleet 1', rows: 5, cols: 10,
    active: false, updatedMinsAgo: 51, utilisedCells: 14, totalCells: 200,
    cells: [
      { row: 1, col: 3, status: 'reserved' },
    ],
  },
  {
    id: 'sa-3', name: 'SA 003', fleet: 'Fleet 2', rows: 5, cols: 10,
    active: true, updatedMinsAgo: 120, utilisedCells: 30, totalCells: 200,
    cells: [],
  },
  {
    id: 'sa-4', name: 'SA 004', fleet: 'Fleet 2', rows: 5, cols: 10,
    active: false, updatedMinsAgo: 240, utilisedCells: 5, totalCells: 200,
    cells: [],
  },
];

// ─── Workflows ────────────────────────────────────────────────────────────────
export const mockWorkflows: Workflow[] = [
  {
    id: 'wf-1', name: 'SMD 1 Material Request', productionUnit: 'ROTR', tab: 'requester',
    orderCategory: 'material', orderType: 'single', assignmentStrategy: 'request-based',
    materialScope: 'sku',
    pickupConfig: { stationSelectionMode: 'static', stationType: 'point', confirmationMode: 'auto', actionType: 'pick' },
    dropConfig: { stationSelectionMode: 'static', actionType: 'drop' },
    fleet: 'Fleet 1',
  },
  {
    id: 'wf-2', name: 'PBA 1 Material Request', productionUnit: 'TBM', tab: 'requester',
    orderCategory: 'material', orderType: 'single', assignmentStrategy: 'on-route', executionTrigger: 'qr-scan',
    materialScope: 'alias',
    pickupConfig: { stationSelectionMode: 'mapping-based', mappingId: 'MAP-001', stationType: 'staging', confirmationMode: 'manual', actionType: 'auto-hitch' },
    dropConfig: { stationSelectionMode: 'static', actionType: 'auto-unhitch' },
    fleet: 'Fleet 1',
  },
  {
    id: 'wf-3', name: 'SMD 2 Material Request', productionUnit: 'ROTR', tab: 'requester',
    orderCategory: 'material', orderType: 'fulfillment', assignmentStrategy: 'request-based',
    materialScope: 'sku',
    pickupConfig: { stationSelectionMode: 'static', stationType: 'point', confirmationMode: 'auto', actionType: 'pick' },
    dropConfig: { stationSelectionMode: 'static', actionType: 'drop' },
    fleet: 'Fleet 2',
  },
  {
    id: 'wf-4', name: 'PBA 2 Material Request', tab: 'requester',
    orderCategory: 'material', orderType: 'single', assignmentStrategy: 'request-based',
    materialScope: 'sku',
    pickupConfig: { stationSelectionMode: 'static', stationType: 'point', confirmationMode: 'manual', actionType: 'pick' },
    dropConfig: { stationSelectionMode: 'static', actionType: 'drop' },
    fleet: 'Fleet 1',
  },
  {
    id: 'wf-5', name: 'SMD 3 Material Request', tab: 'requester',
    orderCategory: 'material', orderType: 'single', assignmentStrategy: 'on-route', executionTrigger: 'dispatch',
    materialScope: 'sku',
    pickupConfig: { stationSelectionMode: 'static', stationType: 'point', confirmationMode: 'auto', actionType: 'pick' },
    dropConfig: { stationSelectionMode: 'static', actionType: 'drop' },
    fleet: 'Fleet 2',
  },
  {
    id: 'wf-6', name: 'PBA 3 Material Request', tab: 'requester',
    orderCategory: 'material', orderType: 'fulfillment', assignmentStrategy: 'request-based',
    materialScope: 'sku',
    pickupConfig: { stationSelectionMode: 'static', stationType: 'staging', confirmationMode: 'auto', actionType: 'pick' },
    dropConfig: { stationSelectionMode: 'static', actionType: 'drop' },
    fleet: 'Fleet 1',
  },
  {
    id: 'wf-7', name: 'Trolley Return Route A', tab: 'receiver',
    orderCategory: 'container', orderType: 'single', assignmentStrategy: 'on-route', executionTrigger: 'qr-scan',
    trolleyScope: 'from-sku',
    pickupConfig: { stationSelectionMode: 'mapping-based', mappingId: 'MAP-002', stationType: 'point', confirmationMode: 'auto', actionType: 'auto-hitch' },
    dropConfig: { stationSelectionMode: 'mapping-based', mappingId: 'MAP-003', actionType: 'auto-unhitch' },
    fleet: 'Fleet 1',
  },
];

// ─── Execution Sources ────────────────────────────────────────────────────────
export const mockExecutionSources: ExecutionSource[] = [
  {
    id: 'es-1', type: 'requester',
    name: 'Tablet SMD Line 1', deviceId: 'DEV-001', username: 'operator01',
    boundProcessingArea: 'rotr',
    boundWorkflows: ['wf-1', 'wf-3'],
    visibleStagingAreas: ['sa-1', 'sa-2'],
    uiMode: 'structured',
  },
  {
    id: 'es-2', type: 'requester',
    name: 'Tablet PBA Line 1', deviceId: 'DEV-002', username: 'operator02',
    boundProcessingArea: 'tbm',
    boundWorkflows: ['wf-2', 'wf-4'],
    visibleStagingAreas: ['sa-3'],
    uiMode: 'legacy',
  },
  {
    id: 'es-3', type: 'mes',
    name: 'PRODUCTION_COMPLETE',
    keyValuePairs: [{ key: 'plant', value: 'ROTR' }],
    materialCode: 'MAT-001',
    boundWorkflow: 'wf-3',
  },
  {
    id: 'es-4', type: 'mes',
    name: 'BATCH_START',
    keyValuePairs: [],
    materialCode: 'MAT-002',
    boundWorkflow: 'wf-1',
  },
  {
    id: 'es-5', type: 'supervisor',
    name: 'Supervisor Station A', deviceId: 'SUP-001', username: 'supervisor01',
    visibleStagingAreas: ['sa-1', 'sa-2'],
    inventoryAreas: ['rotr'],
  },
  {
    id: 'es-6', type: 'supervisor',
    name: 'Supervisor Station B', deviceId: 'SUP-002', username: 'supervisor02',
    visibleStagingAreas: ['sa-3', 'sa-4'],
    inventoryAreas: ['tbm'],
  },
  {
    id: 'es-7', type: 'dispatcher',
    name: 'Dispatcher Station A', deviceId: 'DISP-001', username: 'dispatcher01',
    boundStations: ['ST-001', 'ST-002'],
  },
];

// ─── Service Connections ──────────────────────────────────────────────────────
export const mockConnections: ServiceConnection[] = [
  {
    id: 'conn-fm',
    name: 'Fleet Manager',
    abbreviation: 'FM',
    description: 'Robot fleet coordination & vehicle tracking',
    status: 'connected',
    host: 'fm.atimotors.com',
    port: 8443,
    lastSynced: '2 minutes ago',
    color: '#009688',
  },
  {
    id: 'conn-amr',
    name: 'AMR API',
    abbreviation: 'AMR',
    description: 'Autonomous mobile robot API integration',
    status: 'connected',
    host: 'mes.atimotors.com',
    port: 8080,
    lastSynced: '5 minutes ago',
    color: '#5C6BC0',
  },
  {
    id: 'conn-bom',
    name: 'BOM API',
    abbreviation: 'BOM',
    description: 'Bill of materials API integration',
    status: 'disconnected',
    color: '#F4A442',
  },
];

// ─── General Settings ─────────────────────────────────────────────────────────
export const defaultGeneralSettings: GeneralSettings = {
  skuBreakdown: { subSku: true },
  linkContainer: { containerType: true, containerSubtype: true },
  linkStation: { stationIdName: false },
  containerTypes: { trolley: false, pallet: false, bin: false },
  containerSettings: { containerSubtype: true },
};

// ─── Fleets ───────────────────────────────────────────────────────────────────
export const mockFleets = ['Fleet 1', 'Fleet 2', 'Fleet 3'];

// ─── Mapping Tables ───────────────────────────────────────────────────────────
export const STATIONS = [
  { id: 'ST-001', name: 'Store A' },
  { id: 'ST-002', name: 'Store B' },
  { id: 'ST-003', name: 'Store C' },
  { id: 'ST-004', name: 'SMD Line 1' },
  { id: 'ST-005', name: 'SMD Line 2' },
  { id: 'ST-006', name: 'PBA Line 1' },
  { id: 'ST-007', name: 'PBA Line 2' },
  { id: 'ST-008', name: 'DIP Line 1' },
];

export const mockMaterialMappings: MaterialMapping[] = [
  {
    id: 'MAP-001',
    entries: [
      { skuType: 'SMD', pickupStation: 'ST-001', dropStation: 'ST-004' },
      { skuType: 'PBA', pickupStation: 'ST-002', dropStation: 'ST-006' },
    ],
  },
  {
    id: 'MAP-002',
    entries: [
      { skuType: 'DIP', pickupStation: 'ST-001', dropStation: 'ST-008' },
    ],
  },
  {
    id: 'MAP-003',
    entries: [
      { skuType: 'THT', pickupStation: 'ST-003', dropStation: 'ST-007' },
    ],
  },
];

export const mockContainerMappings: ContainerMapping[] = [
  {
    id: 'CMAP-001',
    entries: [
      { containerSubType: 'Trolley Type 1', pickupStation: 'ST-004', dropStation: 'ST-001' },
      { containerSubType: 'Trolley Type 2', pickupStation: 'ST-005', dropStation: 'ST-002' },
    ],
  },
  {
    id: 'CMAP-002',
    entries: [
      { containerSubType: 'Pallet Type 1', pickupStation: 'ST-006', dropStation: 'ST-003' },
    ],
  },
];

// ─── Mapping IDs ──────────────────────────────────────────────────────────────
export const mockMappingIds = mockMaterialMappings.map(m => m.id);

// ─── WIP Inventory ────────────────────────────────────────────────────────────
export const mockInventory: InventoryEntry[] = mockSkus.flatMap((sku, i) =>
  sku.subSkus.map((sub, j) => ({
    id: `inv-${sku.id}-${sub.id}`,
    skuId: sku.id,
    skuName: sku.name,
    subSkuType: sub.subSkuType,
    produced:     4 + ((i * 3 + j * 7) % 12),
    preprocessing: j === 0 ? 2 + (i % 4) : 0,
    available:    2 + ((i + j) % 6),
    reserved:     (i % 3),
    inTransit:    (j % 2),
    consumed:     8 + (i % 10),
  }))
);

export const mockSubSkuConfigs: SubSkuConfig[] = [
  { subSkuType: 'Type A', productionEntryMode: true,  consumptionMode: true  },
  { subSkuType: 'Type B', productionEntryMode: false, consumptionMode: true  },
];
