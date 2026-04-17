// ==========================================
// メインアプリケーション制御
// ==========================================

const MBTI_LABELS = {
  INTJ: '建築家', INTP: '論理学者', ENTJ: '指揮官', ENTP: '討論者',
  INFJ: '提唱者', INFP: '仲介者', ENFJ: '主人公', ENFP: '広報運動家',
  ISTJ: '管理者', ISFJ: '擁護者', ESTJ: '幹部',   ESFJ: '領事官',
  ISTP: '巨匠',   ISFP: '冒険家', ESTP: '起業家', ESFP: 'エンターテイナー'
};

// 気質グループ別のネオンカラー
const MBTI_GROUP_NEON = {
  NT: '#c084fc', // パープルネオン
  NF: '#34d399', // グリーンネオン
  SJ: '#60a5fa', // ブルーネオン
  SP: '#fbbf24'  // イエローネオン
};

// タイプ別の個別カラー（グループ内でバリエーション）
const MBTI_TYPE_COLORS = {
  INTJ: '#a78bfa', INTP: '#c4b5fd', ENTJ: '#8b5cf6', ENTP: '#d8b4fe',
  INFJ: '#6ee7b7', INFP: '#86efac', ENFJ: '#34d399', ENFP: '#a7f3d0',
  ISTJ: '#93c5fd', ISFJ: '#7dd3fc', ESTJ: '#60a5fa', ESFJ: '#a5b4fc',
  ISTP: '#fcd34d', ISFP: '#fdba74', ESTP: '#fbbf24', ESFP: '#fb923c'
};

// 16personalities風キャラクターSVGを生成
// 各タイプにジオメトリック人物 + タイプ固有の小道具
function createMBTIAvatar(type) {
  const c = MBTI_TYPE_COLORS[type];
  const group = getMBTIGroupForAvatar(type);
  // グループカラー（背景用）
  const gc = MBTI_GROUP_NEON[group];
  // ダークカラー（影用）
  const dc = { NT: '#7c3aed', NF: '#059669', SJ: '#2563eb', SP: '#d97706' }[group];

  // 共通の体パーツ
  const head = `<circle cx="40" cy="22" r="12" fill="${c}"/>
    <circle cx="40" cy="22" r="11" fill="${c}" stroke="${dc}" stroke-width="0.5"/>`;
  const eyes = `<circle cx="36" cy="20" r="1.5" fill="#1e1b4b"/>
    <circle cx="44" cy="20" r="1.5" fill="#1e1b4b"/>
    <circle cx="36.5" cy="19.5" r="0.5" fill="white"/>
    <circle cx="44.5" cy="19.5" r="0.5" fill="white"/>`;
  const mouth = `<path d="M37,25 Q40,28 43,25" fill="none" stroke="#1e1b4b" stroke-width="0.8" stroke-linecap="round"/>`;
  const body = `<path d="M28,34 Q40,30 52,34 L54,60 Q40,56 26,60Z" fill="${c}"/>
    <path d="M28,34 Q40,30 52,34 L54,60 Q40,56 26,60Z" fill="${dc}" opacity="0.15"/>`;

  // タイプ別の小道具・ヘアスタイル
  const props = {
    // NT 分析家（紫系）
    INTJ: `<path d="M28,14 Q32,6 40,10 Q48,6 52,14 L52,22 Q48,16 40,18 Q32,16 28,22Z" fill="${dc}"/>
      ${head}${eyes}<path d="M38,25 L42,25" stroke="#1e1b4b" stroke-width="0.8" stroke-linecap="round"/>
      ${body}
      <rect x="20" y="38" width="12" height="16" rx="1" fill="#312e81" opacity="0.7"/>
      <rect x="22" y="40" width="8" height="3" rx="0.5" fill="${c}" opacity="0.5"/>
      <rect x="22" y="45" width="8" height="3" rx="0.5" fill="${c}" opacity="0.3"/>`,

    INTP: `<path d="M30,16 Q34,8 40,12 Q46,8 50,16 Q50,20 48,22 L32,22 Q30,20 30,16Z" fill="${dc}" opacity="0.8"/>
      <path d="M46,12 Q52,8 54,14" fill="none" stroke="${dc}" stroke-width="1.5"/>
      ${head}${eyes}${mouth}${body}
      <circle cx="22" cy="42" r="8" fill="none" stroke="${dc}" stroke-width="1.5"/>
      <circle cx="22" cy="42" r="3" fill="${dc}" opacity="0.3"/>
      <line x1="22" y1="34" x2="22" y2="38" stroke="${dc}" stroke-width="1"/>`,

    ENTJ: `<path d="M28,18 Q32,8 40,10 Q48,8 52,18 L50,22 L30,22Z" fill="${dc}"/>
      ${head}${eyes}<path d="M36,25 Q40,27 44,25" fill="none" stroke="#1e1b4b" stroke-width="1" stroke-linecap="round"/>
      ${body}
      <path d="M32,32 L22,28 L18,18 L24,20 L22,14" fill="none" stroke="${dc}" stroke-width="2" stroke-linecap="round"/>
      <polygon points="20,10 24,14 22,14" fill="${gc}"/>`,

    ENTP: `<path d="M30,16 Q34,6 42,10 Q50,6 52,16 L50,22 L30,22Z" fill="${dc}"/>
      <path d="M50,14 Q54,10 56,14" fill="none" stroke="${dc}" stroke-width="1.5"/>
      ${head}${eyes}<path d="M36,25 Q40,29 44,25" fill="none" stroke="#1e1b4b" stroke-width="0.8"/>
      ${body}
      <circle cx="24" cy="36" r="4" fill="${gc}" opacity="0.8"/>
      <path d="M24,32 L24,28" stroke="${gc}" stroke-width="1.5"/>
      <path d="M22,34 L20,32 M26,34 L28,32 M22,38 L20,40 M26,38 L28,40" stroke="${gc}" stroke-width="1" opacity="0.6"/>`,

    // NF 外交官（緑系）
    INFJ: `<path d="M30,18 Q34,10 40,14 Q46,10 50,18 L50,24 Q46,20 40,22 Q34,20 30,24Z" fill="${dc}"/>
      <path d="M30,18 L28,24" stroke="${dc}" stroke-width="1.5"/>
      ${head}${eyes}${mouth}${body}
      <path d="M18,36 Q16,32 20,30" fill="none" stroke="${gc}" stroke-width="1.5" opacity="0.6"/>
      <path d="M16,40 Q14,36 18,34" fill="none" stroke="${gc}" stroke-width="1" opacity="0.4"/>
      <circle cx="22" cy="44" r="5" fill="${gc}" opacity="0.2" stroke="${gc}" stroke-width="0.8"/>`,

    INFP: `<path d="M30,16 Q36,8 40,14 Q44,8 50,16 L48,24 L32,24Z" fill="${dc}" opacity="0.7"/>
      <path d="M48,16 Q52,12 54,18 Q56,24 52,26" fill="none" stroke="${dc}" stroke-width="1.2"/>
      ${head}${eyes}${mouth}${body}
      <path d="M20,38 Q18,34 22,36 Q18,32 24,34" fill="${gc}" opacity="0.5"/>
      <circle cx="20" cy="42" r="2" fill="${gc}" opacity="0.6"/>
      <path d="M16,46 Q14,44 18,42" fill="none" stroke="${gc}" stroke-width="1" opacity="0.4"/>`,

    ENFJ: `<path d="M28,16 Q34,6 40,12 Q46,6 52,16 L50,22 L30,22Z" fill="${dc}"/>
      ${head}${eyes}<path d="M35,24 Q40,29 45,24" fill="none" stroke="#1e1b4b" stroke-width="1" stroke-linecap="round"/>
      ${body}
      <circle cx="24" cy="40" r="6" fill="${gc}" opacity="0.15" stroke="${gc}" stroke-width="1"/>
      <path d="M24,34 L24,46 M18,40 L30,40" stroke="${gc}" stroke-width="1.2"/>`,

    ENFP: `<path d="M28,16 Q34,4 42,12 Q48,4 54,16 L52,24 L30,24Z" fill="${dc}"/>
      <path d="M54,12 Q58,8 58,16" fill="none" stroke="${dc}" stroke-width="1.2"/>
      <path d="M28,14 Q24,10 26,16" fill="none" stroke="${dc}" stroke-width="1.2"/>
      ${head}${eyes}<path d="M35,24 Q40,29 45,24" fill="none" stroke="#1e1b4b" stroke-width="1"/>
      ${body}
      <path d="M18,38 L14,34 M22,36 L20,32" stroke="${gc}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
      <circle cx="16" cy="32" r="2" fill="${gc}" opacity="0.5"/>
      <circle cx="22" cy="30" r="1.5" fill="${gc}" opacity="0.4"/>`,

    // SJ 番人（青系）
    ISTJ: `<path d="M30,18 Q34,12 40,14 Q46,12 50,18 L50,22 L30,22Z" fill="${dc}"/>
      ${head}${eyes}<path d="M38,25 L42,25" stroke="#1e1b4b" stroke-width="0.8" stroke-linecap="round"/>
      ${body}
      <rect x="18" y="36" width="14" height="18" rx="1" fill="#1e3a5f" opacity="0.6"/>
      <line x1="20" y1="40" x2="30" y2="40" stroke="${c}" stroke-width="0.8" opacity="0.5"/>
      <line x1="20" y1="44" x2="30" y2="44" stroke="${c}" stroke-width="0.8" opacity="0.5"/>
      <line x1="20" y1="48" x2="30" y2="48" stroke="${c}" stroke-width="0.8" opacity="0.5"/>`,

    ISFJ: `<path d="M30,16 Q36,8 40,14 Q44,8 50,16 L48,22 L32,22Z" fill="${dc}" opacity="0.8"/>
      ${head}${eyes}${mouth}${body}
      <path d="M20,34 L16,30 Q14,26 18,28 L22,32" fill="none" stroke="${gc}" stroke-width="1.5"/>
      <path d="M16,30 Q12,32 14,36 Q16,40 20,38" fill="${gc}" opacity="0.2" stroke="${gc}" stroke-width="0.8"/>`,

    ESTJ: `<path d="M28,16 Q34,8 40,12 Q46,8 52,16 L50,22 L30,22Z" fill="${dc}"/>
      ${head}${eyes}<path d="M36,25 Q40,27 44,25" fill="none" stroke="#1e1b4b" stroke-width="0.8"/>
      ${body}
      <rect x="16" y="32" width="16" height="20" rx="1" fill="${dc}" opacity="0.3"/>
      <path d="M24,32 L24,52" stroke="${gc}" stroke-width="1"/>
      <path d="M18,36 L30,36" stroke="${gc}" stroke-width="0.8" opacity="0.6"/>`,

    ESFJ: `<path d="M28,16 Q34,6 40,12 Q46,6 52,16 L50,24 L30,24Z" fill="${dc}"/>
      <path d="M28,14 Q24,10 26,18" fill="none" stroke="${dc}" stroke-width="1.2"/>
      ${head}${eyes}<path d="M35,24 Q40,29 45,24" fill="none" stroke="#1e1b4b" stroke-width="0.8"/>
      ${body}
      <circle cx="20" cy="38" r="4" fill="${gc}" opacity="0.2" stroke="${gc}" stroke-width="0.8"/>
      <circle cx="28" cy="44" r="3" fill="${gc}" opacity="0.15" stroke="${gc}" stroke-width="0.8"/>
      <path d="M22,36 L26,42" stroke="${gc}" stroke-width="0.8" opacity="0.5"/>`,

    // SP 探検家（黄系）
    ISTP: `<path d="M30,18 Q34,12 40,14 Q46,12 50,18 L50,22 L30,22Z" fill="${dc}"/>
      ${head}${eyes}<path d="M38,25 L42,25" stroke="#1e1b4b" stroke-width="0.8"/>
      ${body}
      <path d="M18,36 L14,42 L20,42 L16,48" fill="none" stroke="${gc}" stroke-width="2" stroke-linecap="round"/>
      <circle cx="18" cy="40" r="6" fill="${gc}" opacity="0.1"/>`,

    ISFP: `<path d="M30,16 Q36,6 42,12 Q48,6 52,16 L50,24 L30,24Z" fill="${dc}" opacity="0.7"/>
      <path d="M52,14 Q56,10 56,18" fill="none" stroke="${dc}" stroke-width="1"/>
      ${head}${eyes}${mouth}${body}
      <circle cx="20" cy="40" r="3" fill="${gc}" opacity="0.5"/>
      <circle cx="26" cy="38" r="2" fill="${gc}" opacity="0.4"/>
      <circle cx="18" cy="46" r="2.5" fill="${gc}" opacity="0.3"/>
      <path d="M22,44 Q20,42 22,40" fill="none" stroke="${dc}" stroke-width="0.8"/>`,

    ESTP: `<path d="M28,16 Q34,6 40,12 Q46,6 52,16 L50,22 L30,22Z" fill="${dc}"/>
      ${head}${eyes}<path d="M35,24 Q40,28 45,24" fill="none" stroke="#1e1b4b" stroke-width="1"/>
      ${body}
      <path d="M16,34 L12,28 L16,22" fill="none" stroke="${gc}" stroke-width="2" stroke-linecap="round"/>
      <polygon points="16,20 18,24 14,24" fill="${gc}"/>`,

    ESFP: `<path d="M26,16 Q34,2 42,12 Q50,2 56,16 L52,24 L28,24Z" fill="${dc}"/>
      <path d="M56,12 Q60,6 58,16" fill="none" stroke="${dc}" stroke-width="1.2"/>
      <path d="M26,14 Q22,8 24,16" fill="none" stroke="${dc}" stroke-width="1.2"/>
      ${head}${eyes}<path d="M34,24 Q40,30 46,24" fill="none" stroke="#1e1b4b" stroke-width="1"/>
      ${body}
      <circle cx="18" cy="36" r="3" fill="${gc}" opacity="0.5"/>
      <circle cx="14" cy="42" r="2" fill="${gc}" opacity="0.4"/>
      <circle cx="22" cy="44" r="2.5" fill="${gc}" opacity="0.3"/>
      <path d="M16,38 L18,42 M20,40 L18,44" stroke="${gc}" stroke-width="0.8" opacity="0.5"/>`
  };

  return `<svg class="mbti-avatar-svg" viewBox="10 4 56 58" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="bg-${type}" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stop-color="${gc}" stop-opacity="0.12"/>
        <stop offset="100%" stop-color="${gc}" stop-opacity="0.02"/>
      </radialGradient>
    </defs>
    <rect x="10" y="4" width="56" height="58" rx="12" fill="url(#bg-${type})"/>
    ${props[type]}
  </svg>`;
}

// getMBTIGroupの前方参照用（アバター生成で使用）
function getMBTIGroupForAvatar(type) {
  if (['INTJ','INTP','ENTJ','ENTP'].includes(type)) return 'NT';
  if (['INFJ','INFP','ENFJ','ENFP'].includes(type)) return 'NF';
  if (['ISTJ','ISFJ','ESTJ','ESFJ'].includes(type)) return 'SJ';
  return 'SP';
}

function getMBTIGroup(type) {
  if (['INTJ','INTP','ENTJ','ENTP'].includes(type)) return 'NT';
  if (['INFJ','INFP','ENFJ','ENFP'].includes(type)) return 'NF';
  if (['ISTJ','ISFJ','ESTJ','ESFJ'].includes(type)) return 'SJ';
  return 'SP';
}

let selectedMBTI = null;

// ==========================================
// 初期化
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  await initData();
  initPrefectureSelects();
  initMBTIGrid();
  initFormSubmit();
  loadMap('map-container');
  updatePageState();
});

// ==========================================
// ページ状態管理（回答済みなら結果を表示）
// ==========================================

function updatePageState() {
  const surveySection = document.getElementById('section-survey');
  const resultsSection = document.getElementById('section-results');
  if (hasAnswered()) {
    surveySection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    refreshResults();
  } else {
    surveySection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
  }
}

// ==========================================
// 都道府県セレクト初期化
// ==========================================

function initPrefectureSelects() {
  const selects = [
    document.getElementById('prefecture-select'),
    document.getElementById('pref-chart-select')
  ];

  selects.forEach(select => {
    if (!select) return;
    REGIONS.forEach(region => {
      const group = document.createElement('optgroup');
      group.label = region;
      PREFECTURES.filter(p => p.region === region).forEach(pref => {
        const opt = document.createElement('option');
        opt.value = pref.code;
        opt.textContent = pref.name;
        group.appendChild(opt);
      });
      select.appendChild(group);
    });
  });

  const chartSelect = document.getElementById('pref-chart-select');
  if (chartSelect) {
    chartSelect.addEventListener('change', () => {
      renderPrefectureChart(chartSelect.value || null);
    });
  }
}

// ==========================================
// MBTIグリッド（画像 + 気質グループ色分け付き）
// ==========================================

function initMBTIGrid() {
  const grid = document.getElementById('mbti-grid');

  const groupLabels = {
    NT: '分析家', NF: '外交官', SJ: '番人', SP: '探検家'
  };
  const groupOrder = ['NT', 'NF', 'SJ', 'SP'];

  groupOrder.forEach(group => {
    // グループヘッダー
    const header = document.createElement('div');
    header.className = 'mbti-group-header';
    header.style.setProperty('--group-color', MBTI_GROUP_NEON[group]);
    header.textContent = groupLabels[group];
    grid.appendChild(header);

    // 4タイプ
    const types = MBTI_TYPES.filter(t => getMBTIGroup(t) === group);
    types.forEach(type => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'mbti-btn';
      btn.dataset.type = type;
      btn.dataset.group = group;
      const typeColor = MBTI_TYPE_COLORS[type];
      btn.style.setProperty('--mbti-color', typeColor);
      btn.style.setProperty('--mbti-bg', typeColor + '20');
      btn.style.setProperty('--mbti-glow', typeColor);

      // 公式16personalities画像を直接参照、ロード失敗時はSVGキャラクターにフォールバック
      const en = { INTJ:'architect',INTP:'logician',ENTJ:'commander',ENTP:'debater',
        INFJ:'advocate',INFP:'mediator',ENFJ:'protagonist',ENFP:'campaigner',
        ISTJ:'logistician',ISFJ:'defender',ESTJ:'executive',ESFJ:'consul',
        ISTP:'virtuoso',ISFP:'adventurer',ESTP:'entrepreneur',ESFP:'entertainer' }[type];
      const officialBase = 'https://www.16personalities.com/static/images/personality-types/avatars';
      const slug = `${type.toLowerCase()}-${en}`;
      // 公式URL → ローカル → SVGフォールバック の3段階
      btn.innerHTML =
        `<div class="mbti-avatar-wrap">` +
          `<img src="${officialBase}/${slug}-male.svg?v=3" alt="${type}" class="mbti-avatar-img" loading="lazy" ` +
            `onerror="this.onerror=function(){this.onerror=function(){this.style.display='none';this.nextElementSibling.style.display='block';};this.src='images/avatars/${slug}.svg';};this.src='${officialBase}/${slug}-female.svg?v=3'"/>` +
          `<div class="mbti-avatar-fallback" style="display:none">${createMBTIAvatar(type)}</div>` +
        `</div>` +
        `<span class="mbti-type-name">${type}</span>` +
        `<span class="mbti-label">${MBTI_LABELS[type]}</span>`;

      btn.addEventListener('click', () => {
        document.querySelectorAll('.mbti-btn').forEach(b => b.classList.remove('selected'));
        btn.classList.add('selected');
        selectedMBTI = type;
        updateSubmitButton();
      });

      grid.appendChild(btn);
    });
  });
}

// ==========================================
// フォーム送信
// ==========================================

function getSelectedGender() {
  const checked = document.querySelector('input[name="gender"]:checked');
  return checked ? checked.value : null;
}

function updateSubmitButton() {
  const prefSelect = document.getElementById('prefecture-select');
  const ageSelect = document.getElementById('age-select');
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = !(prefSelect.value && ageSelect.value && getSelectedGender() && selectedMBTI);
}

function initFormSubmit() {
  const prefSelect = document.getElementById('prefecture-select');
  const ageSelect = document.getElementById('age-select');
  prefSelect.addEventListener('change', updateSubmitButton);
  ageSelect.addEventListener('change', updateSubmitButton);
  document.querySelectorAll('input[name="gender"]').forEach(r => {
    r.addEventListener('change', updateSubmitButton);
  });

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.addEventListener('click', () => {
    const prefCode = prefSelect.value;
    const age = ageSelect.value;
    const gender = getSelectedGender();
    if (!prefCode || !age || !gender || !selectedMBTI) return;

    addResponse(prefCode, selectedMBTI, age, gender);
    markAsAnswered();

    const msg = document.getElementById('submit-message');
    msg.textContent = '回答ありがとう！結果を表示します…';
    msg.className = 'message success';

    setTimeout(() => {
      msg.className = 'message hidden';
      updatePageState();
      document.getElementById('section-results').scrollIntoView({ behavior: 'smooth' });
    }, 1500);
  });
}

// ==========================================
// 結果ページ更新
// ==========================================

function refreshResults() {
  updateMapColors();
  renderOverallChart();
  renderGroupsChart();
  renderResultsTable();
  const chartSelect = document.getElementById('pref-chart-select');
  renderPrefectureChart(chartSelect.value || null);
}

// ==========================================
// 集計テーブル
// ==========================================

function renderResultsTable() {
  const table = document.getElementById('results-table');
  const thead = table.querySelector('thead');
  const tbody = table.querySelector('tbody');
  const showZero = document.getElementById('show-zero-rows').checked;

  thead.innerHTML = '<tr><th>都道府県</th>'
    + MBTI_TYPES.map(t => `<th>${t}</th>`).join('')
    + '<th>合計</th></tr>';

  tbody.innerHTML = '';
  PREFECTURES.forEach(pref => {
    const dist = getMBTIDistribution(pref.code);
    const total = Object.values(dist).reduce((a, b) => a + b, 0);
    if (!showZero && total === 0) return;

    const maxType = getDominantType(pref.code);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${pref.name}</td>`
      + MBTI_TYPES.map(t =>
        `<td class="${dist[t] > 0 && t === maxType ? 'highlight' : ''}">${dist[t] || ''}</td>`
      ).join('')
      + `<td><strong>${total}</strong></td>`;
    tbody.appendChild(tr);
  });

  const totalDist = getMBTIDistribution(null);
  const grandTotal = Object.values(totalDist).reduce((a, b) => a + b, 0);
  if (grandTotal > 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><strong>全国合計</strong></td>`
      + MBTI_TYPES.map(t => `<td><strong>${totalDist[t]}</strong></td>`).join('')
      + `<td><strong>${grandTotal}</strong></td>`;
    tbody.appendChild(tr);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const cb = document.getElementById('show-zero-rows');
  if (cb) cb.addEventListener('change', renderResultsTable);
});

