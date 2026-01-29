
import { Department, ToolMetadata, MenuItem } from './types';

export const DEPT_COLORS = {
  [Department.ADMIN]: {
    primary: 'bg-slate-700',
    text: 'text-slate-700',
    border: 'border-slate-700',
    light: 'bg-slate-50',
    hover: 'hover:bg-slate-100',
    accent: '#334155'
  },
  [Department.ACADEMIC]: {
    primary: 'bg-emerald-600',
    text: 'text-emerald-600',
    border: 'border-emerald-600',
    light: 'bg-emerald-50',
    hover: 'hover:bg-emerald-100',
    accent: '#059669'
  },
  [Department.STUDENT_AFFAIRS]: {
    primary: 'bg-orange-500',
    text: 'text-orange-500',
    border: 'border-orange-500',
    light: 'bg-orange-50',
    hover: 'hover:bg-orange-100',
    accent: '#f97316'
  },
  [Department.IT]: {
    primary: 'bg-indigo-600',
    text: 'text-indigo-600',
    border: 'border-indigo-600',
    light: 'bg-indigo-50',
    hover: 'hover:bg-indigo-100',
    accent: '#4f46e5'
  },
  [Department.DASHBOARD]: {
    primary: 'bg-blue-600',
    text: 'text-blue-600',
    border: 'border-blue-600',
    light: 'bg-blue-50',
    hover: 'hover:bg-blue-100',
    accent: '#2563eb'
  },
  [Department.SYSTEM_ADMIN]: {
    primary: 'bg-slate-900',
    text: 'text-slate-900',
    border: 'border-slate-900',
    light: 'bg-slate-100',
    hover: 'hover:bg-slate-200',
    accent: '#0f172a'
  }
};

export const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard', label: '我的儀表板', icon: '📊', department: Department.DASHBOARD },
  {
    id: 'academic',
    label: '教務組',
    icon: '📚',
    children: [
      { id: 'academic-chinese', label: '中文科', icon: '✍️', department: Department.ACADEMIC },
      { id: 'academic-english', label: '英文科', icon: '🔤', department: Department.ACADEMIC },
      { id: 'academic-stem', label: '理科/電腦科', icon: '🔬', department: Department.ACADEMIC },
    ]
  },
  { id: 'affairs', label: '訓育組', icon: '👨‍🏫', department: Department.STUDENT_AFFAIRS },
  { id: 'admin', label: '行政組', icon: '🏢', department: Department.ADMIN },
  { id: 'it', label: '資訊組', icon: '💻', department: Department.IT },
  { id: 'sysadmin', label: '管理後台', icon: '🛡️', department: Department.SYSTEM_ADMIN },
];

export const TOOLS: ToolMetadata[] = [
  {
    id: 'comment-writer',
    name: '學生評語生成器',
    description: '根據學生成績、性格關鍵字及特殊表現，快速生成專業期末評語。',
    icon: '📝',
    department: Department.STUDENT_AFFAIRS,
    tags: ['批次處理', '訓育組'],
    isBatchSupported: true,
    inputs: [
      { key: 'name', label: '學生姓名', type: 'text', placeholder: '例如：王小明' },
      { key: 'score', label: '學業成績', type: 'number', placeholder: '0-100' },
      { key: 'traits', label: '性格特質', type: 'text', placeholder: '例如：活潑、認真、內向' },
      { key: 'special', label: '特殊事項', type: 'text', placeholder: '例如：班長、校隊成員' },
      { key: 'tone', label: '語氣選擇', type: 'select', options: ['正式', '親切', '激勵'] }
    ],
    promptTemplate: `請為學生 {{name}} 撰寫一份大約 150-200 字的專業期末評語。\n學業成績為 {{score}} 分，性格特質為 {{traits}}，特殊表現包括 {{special}}。\n請使用「{{tone}}」的語氣，包含正面鼓勵，並具體提出一項未來可改進的建議。`
  },
  {
    id: 'essay-grader',
    name: '作文批改助手',
    description: '自動分析學生作文，提供分項評分、優點分析及改進建議。',
    icon: '✍️',
    department: Department.ACADEMIC,
    tags: ['中文科', '批次處理'],
    isBatchSupported: true,
    inputs: [
      { key: 'essay', label: '作文全文', type: 'textarea', placeholder: '請粘貼學生的作文內容...' },
      { key: 'grade', label: '年級', type: 'select', options: ['小一', '小二', '小三', '小四', '小五', '小六', '中一', '中二', '中三'] },
      { key: 'criteria', label: '評分重點', type: 'text', placeholder: '例如：修辭、結構、創意' }
    ],
    promptTemplate: `請批改這篇 {{grade}} 年級學生的作文。\n重點評分項目為：{{criteria}}。\n作文內容：\n{{essay}}\n\n請輸出以下格式：\n1. 分項評分 (100滿分)\n2. 3-5項具體優點\n3. 3-5項改進建議\n4. 推薦佳句範例`
  },
  {
    id: 'tone-checker',
    name: '公文語氣檢查器',
    description: '確保對外公文及通知符合行政規範，修正常見口語錯誤。',
    icon: '📄',
    department: Department.ADMIN,
    tags: ['行政組', '正式'],
    isBatchSupported: false,
    inputs: [
      { key: 'content', label: '草擬內容', type: 'textarea', placeholder: '請輸入通知或公文內容...' },
      { key: 'audience', label: '目標對眾', type: 'select', options: ['全體家長', '全校教師', '全體學生', '校外單位'] }
    ],
    promptTemplate: `這是一份發送給 {{audience}} 的學校公文草稿。\n請檢查並修正內容，使其符合正式行政規範。\n草稿內容：\n{{content}}\n\n請提供：\n1. 語氣專業度評分 (1-10)\n2. 標記過於口語或不當的詞句\n3. 修正後的完整版本`
  },
  {
    id: 'qr-generator-tool',
    name: 'QR Code 生成器',
    description: '快速將網址或文字轉換為 QR Code，支援下載功能。',
    icon: '📱',
    department: Department.IT,
    tags: ['資訊組', '實用工具'],
    isBatchSupported: false,
    inputs: [],
    promptTemplate: ''
  },
  {
    id: 'class-timer-tool',
    name: '計時器',
    description: '專業教學用計時器，支援全螢幕顯示與補時功能記錄。',
    icon: '⏱️',
    department: Department.IT,
    tags: ['資訊組', '教學工具'],
    isBatchSupported: false,
    inputs: [],
    promptTemplate: ''
  }
];
