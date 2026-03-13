// ==========================================
// データ定数・localStorage CRUD
// ==========================================

const STORAGE_KEY = 'mbti_survey_responses';
const ANSWERED_KEY = 'mbti_survey_answered';

const PREFECTURES = [
  { code: '01', name: '北海道', region: '北海道' },
  { code: '02', name: '青森県', region: '東北' },
  { code: '03', name: '岩手県', region: '東北' },
  { code: '04', name: '宮城県', region: '東北' },
  { code: '05', name: '秋田県', region: '東北' },
  { code: '06', name: '山形県', region: '東北' },
  { code: '07', name: '福島県', region: '東北' },
  { code: '08', name: '茨城県', region: '関東' },
  { code: '09', name: '栃木県', region: '関東' },
  { code: '10', name: '群馬県', region: '関東' },
  { code: '11', name: '埼玉県', region: '関東' },
  { code: '12', name: '千葉県', region: '関東' },
  { code: '13', name: '東京都', region: '関東' },
  { code: '14', name: '神奈川県', region: '関東' },
  { code: '15', name: '新潟県', region: '中部' },
  { code: '16', name: '富山県', region: '中部' },
  { code: '17', name: '石川県', region: '中部' },
  { code: '18', name: '福井県', region: '中部' },
  { code: '19', name: '山梨県', region: '中部' },
  { code: '20', name: '長野県', region: '中部' },
  { code: '21', name: '岐阜県', region: '中部' },
  { code: '22', name: '静岡県', region: '中部' },
  { code: '23', name: '愛知県', region: '中部' },
  { code: '24', name: '三重県', region: '近畿' },
  { code: '25', name: '滋賀県', region: '近畿' },
  { code: '26', name: '京都府', region: '近畿' },
  { code: '27', name: '大阪府', region: '近畿' },
  { code: '28', name: '兵庫県', region: '近畿' },
  { code: '29', name: '奈良県', region: '近畿' },
  { code: '30', name: '和歌山県', region: '近畿' },
  { code: '31', name: '鳥取県', region: '中国' },
  { code: '32', name: '島根県', region: '中国' },
  { code: '33', name: '岡山県', region: '中国' },
  { code: '34', name: '広島県', region: '中国' },
  { code: '35', name: '山口県', region: '中国' },
  { code: '36', name: '徳島県', region: '四国' },
  { code: '37', name: '香川県', region: '四国' },
  { code: '38', name: '愛媛県', region: '四国' },
  { code: '39', name: '高知県', region: '四国' },
  { code: '40', name: '福岡県', region: '九州・沖縄' },
  { code: '41', name: '佐賀県', region: '九州・沖縄' },
  { code: '42', name: '長崎県', region: '九州・沖縄' },
  { code: '43', name: '熊本県', region: '九州・沖縄' },
  { code: '44', name: '大分県', region: '九州・沖縄' },
  { code: '45', name: '宮崎県', region: '九州・沖縄' },
  { code: '46', name: '鹿児島県', region: '九州・沖縄' },
  { code: '47', name: '沖縄県', region: '九州・沖縄' }
];

const MBTI_TYPES = [
  'INTJ', 'INTP', 'ENTJ', 'ENTP',
  'INFJ', 'INFP', 'ENFJ', 'ENFP',
  'ISTJ', 'ISFJ', 'ESTJ', 'ESFJ',
  'ISTP', 'ISFP', 'ESTP', 'ESFP'
];

// 4気質グループ
const MBTI_GROUPS = {
  '分析家 (NT)': ['INTJ', 'INTP', 'ENTJ', 'ENTP'],
  '外交官 (NF)': ['INFJ', 'INFP', 'ENFJ', 'ENFP'],
  '番人 (SJ)':   ['ISTJ', 'ISFJ', 'ESTJ', 'ESFJ'],
  '探検家 (SP)': ['ISTP', 'ISFP', 'ESTP', 'ESFP']
};

// MBTIタイプ別カラー（気質グループで色系統を分類）
const MBTI_COLORS = {
  // 分析家 (NT) — 紫系
  INTJ: '#6B21A8', INTP: '#7C3AED', ENTJ: '#8B5CF6', ENTP: '#A78BFA',
  // 外交官 (NF) — 緑系
  INFJ: '#166534', INFP: '#16A34A', ENFJ: '#22C55E', ENFP: '#4ADE80',
  // 番人 (SJ) — 青系
  ISTJ: '#1E40AF', ISFJ: '#2563EB', ESTJ: '#3B82F6', ESFJ: '#60A5FA',
  // 探検家 (SP) — 橙系
  ISTP: '#C2410C', ISFP: '#EA580C', ESTP: '#F97316', ESFP: '#FB923C'
};

const MBTI_GROUP_COLORS = {
  '分析家 (NT)': '#7C3AED',
  '外交官 (NF)': '#16A34A',
  '番人 (SJ)':   '#2563EB',
  '探検家 (SP)': '#F97316'
};

const REGIONS = ['北海道', '東北', '関東', '中部', '近畿', '中国', '四国', '九州・沖縄'];

const AGE_GROUPS = ['~19', '20-29', '30-39', '40-49', '50-59', '60~'];
const AGE_LABELS = { '~19': '19歳以下', '20-29': '20代', '30-39': '30代', '40-49': '40代', '50-59': '50代', '60~': '60歳以上' };
const GENDERS = ['male', 'female', 'other', 'no-answer'];
const GENDER_LABELS = { male: '男性', female: '女性', other: 'その他', 'no-answer': '回答しない' };

// ==========================================
// localStorage CRUD
// ==========================================

function getAllResponses() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
}

function saveResponses(responses) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(responses));
}

function addResponse(prefectureCode, mbtiType, age, gender) {
  const responses = getAllResponses();
  responses.push({
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
    prefecture: prefectureCode,
    mbtiType: mbtiType,
    age: age,
    gender: gender,
    timestamp: new Date().toISOString()
  });
  saveResponses(responses);
}

function getResponsesByPrefecture(prefCode) {
  return getAllResponses().filter(r => r.prefecture === prefCode);
}

function getMBTIDistribution(prefCode) {
  const responses = prefCode ? getResponsesByPrefecture(prefCode) : getAllResponses();
  const dist = {};
  MBTI_TYPES.forEach(t => dist[t] = 0);
  responses.forEach(r => {
    if (dist.hasOwnProperty(r.mbtiType)) dist[r.mbtiType]++;
  });
  return dist;
}

function getDominantType(prefCode) {
  const dist = getMBTIDistribution(prefCode);
  let maxCount = 0;
  let dominant = null;
  for (const [type, count] of Object.entries(dist)) {
    if (count > maxCount) {
      maxCount = count;
      dominant = type;
    }
  }
  return dominant;
}

function getPrefectureName(code) {
  const pref = PREFECTURES.find(p => p.code === code);
  return pref ? pref.name : code;
}

function hasAnswered() {
  return localStorage.getItem(ANSWERED_KEY) === 'true';
}

function markAsAnswered() {
  localStorage.setItem(ANSWERED_KEY, 'true');
}

function clearAllData() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(ANSWERED_KEY);
}

function exportData() {
  return JSON.stringify(getAllResponses(), null, 2);
}

function importData(jsonString) {
  const data = JSON.parse(jsonString);
  if (!Array.isArray(data)) throw new Error('データ形式が不正です');
  data.forEach(item => {
    if (!item.prefecture || !item.mbtiType) throw new Error('データ形式が不正です');
  });
  saveResponses(data);
}

function generateSampleData(count) {
  const responses = getAllResponses();
  for (let i = 0; i < count; i++) {
    const pref = PREFECTURES[Math.floor(Math.random() * PREFECTURES.length)];
    const mbti = MBTI_TYPES[Math.floor(Math.random() * MBTI_TYPES.length)];
    const age = AGE_GROUPS[Math.floor(Math.random() * AGE_GROUPS.length)];
    const gender = GENDERS[Math.floor(Math.random() * GENDERS.length)];
    responses.push({
      id: Date.now().toString(36) + Math.random().toString(36).substr(2, 6),
      prefecture: pref.code,
      mbtiType: mbti,
      age: age,
      gender: gender,
      timestamp: new Date().toISOString()
    });
  }
  saveResponses(responses);
}
