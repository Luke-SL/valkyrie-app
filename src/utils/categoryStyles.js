// Mapeamento central de categorias de sala -> cor e ícone.
// Usado por RoomCard, RoomsPage, RoomDetailsPage e os diálogos de sala,
// para que a mesma categoria sempre apareça com a mesma identidade visual.

export const ROOM_CATEGORY_META = {
  administração: { color: 'var(--vk-cat-administracao)', icon: 'domain' },
  'sala de aula': { color: 'var(--vk-cat-sala-de-aula)', icon: 'school' },
  laboratório: { color: 'var(--vk-cat-laboratorio)', icon: 'science' },
  auditório: { color: 'var(--vk-cat-auditorio)', icon: 'theaters' },
  'sala de estudos': {
    color: 'var(--vk-cat-sala-de-estudos)',
    icon: 'menu_book'
  },
  depósito: { color: 'var(--vk-cat-deposito)', icon: 'inventory' },
  corredor: { color: 'var(--vk-cat-corredor)', icon: 'signpost' }
}

export function roomCategoryColor(category) {
  return ROOM_CATEGORY_META[category]?.color || 'var(--vk-text-dim)'
}

export function roomCategoryIcon(category) {
  return ROOM_CATEGORY_META[category]?.icon || 'place'
}

// Ícone por categoria de patrimônio — usado na tabela de equipamentos.
const ASSET_ICONS = {
  'access point': 'wifi_tethering',
  armário: 'inventory_2',
  cadeira: 'chair',
  'câmera de segurança': 'videocam',
  computador: 'computer',
  'condicionador de ar': 'ac_unit',
  'criado mudo': 'nightstand',
  'extintor de incêndio': 'local_fire_department',
  'filtro de água': 'water_drop',
  impressora: 'print',
  mesa: 'table_bar',
  monitor: 'desktop_windows',
  notebook: 'laptop_mac',
  'projetor multimídia': 'videocam',
  'quadro branco': 'wysiwyg',
  'quadro de vidro': 'wysiwyg',
  'quadro interativo': 'draw',
  'tela de projeção': 'screenshot_monitor'
}

export function assetCategoryIcon(category) {
  return ASSET_ICONS[category] || 'category'
}
