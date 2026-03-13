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

// タイプ別のSVGシンボルパス
const MBTI_SYMBOLS = {
  // NT 分析家 - 幾何学的・知的なシンボル
  INTJ: `<polygon points="24,6 42,38 6,38" fill="none" stroke="CL" stroke-width="2.5"/>
         <polygon points="24,14 36,34 12,34" fill="CL" opacity="0.3"/>
         <circle cx="24" cy="26" r="3" fill="CL"/>`,
  INTP: `<circle cx="24" cy="24" r="14" fill="none" stroke="CL" stroke-width="2"/>
         <ellipse cx="24" cy="24" rx="6" ry="14" fill="none" stroke="CL" stroke-width="1.5" opacity="0.6"/>
         <ellipse cx="24" cy="24" rx="14" ry="6" fill="none" stroke="CL" stroke-width="1.5" opacity="0.6"/>
         <circle cx="24" cy="24" r="3" fill="CL"/>`,
  ENTJ: `<path d="M24,6 L24,42" stroke="CL" stroke-width="3"/>
         <path d="M18,12 L30,12" stroke="CL" stroke-width="2.5"/>
         <path d="M14,6 L34,6" stroke="CL" stroke-width="3"/>
         <path d="M16,42 L32,42" stroke="CL" stroke-width="2.5"/>
         <diamond><rect x="19" y="20" width="10" height="10" fill="CL" opacity="0.3" transform="rotate(45 24 25)"/></diamond>`,
  ENTP: `<circle cx="24" cy="18" r="8" fill="none" stroke="CL" stroke-width="2"/>
         <path d="M20,26 Q24,40 28,26" fill="none" stroke="CL" stroke-width="2"/>
         <line x1="24" y1="10" x2="24" y2="16" stroke="CL" stroke-width="2.5"/>
         <circle cx="24" cy="18" r="2" fill="CL"/>`,

  // NF 外交官 - 有機的・やわらかいシンボル
  INFJ: `<path d="M24,8 Q36,20 24,40 Q12,20 24,8Z" fill="CL" opacity="0.2" stroke="CL" stroke-width="2"/>
         <circle cx="24" cy="22" r="5" fill="none" stroke="CL" stroke-width="1.5"/>
         <circle cx="24" cy="22" r="2" fill="CL"/>`,
  INFP: `<path d="M24,10 L27,18 L36,18 L29,24 L32,33 L24,28 L16,33 L19,24 L12,18 L21,18Z" fill="CL" opacity="0.25" stroke="CL" stroke-width="1.8"/>
         <circle cx="24" cy="22" r="4" fill="CL" opacity="0.5"/>`,
  ENFJ: `<circle cx="24" cy="24" r="14" fill="CL" opacity="0.15"/>
         <path d="M24,10 L24,38 M10,24 L38,24 M14,14 L34,34 M34,14 L14,34" stroke="CL" stroke-width="1.5" opacity="0.6"/>
         <circle cx="24" cy="24" r="6" fill="none" stroke="CL" stroke-width="2"/>
         <circle cx="24" cy="24" r="2.5" fill="CL"/>`,
  ENFP: `<path d="M24,8 C32,8 38,16 34,24 C38,32 32,40 24,36 C16,40 10,32 14,24 C10,16 16,8 24,8Z" fill="CL" opacity="0.2" stroke="CL" stroke-width="2"/>
         <circle cx="24" cy="24" r="4" fill="CL" opacity="0.5"/>`,

  // SJ 番人 - 安定的・構造的なシンボル
  ISTJ: `<rect x="10" y="10" width="28" height="28" rx="2" fill="none" stroke="CL" stroke-width="2"/>
         <line x1="10" y1="18" x2="38" y2="18" stroke="CL" stroke-width="1.5"/>
         <line x1="10" y1="26" x2="38" y2="26" stroke="CL" stroke-width="1.5"/>
         <line x1="10" y1="34" x2="38" y2="34" stroke="CL" stroke-width="1.5"/>
         <rect x="10" y="10" width="28" height="8" fill="CL" opacity="0.2"/>`,
  ISFJ: `<path d="M24,8 L24,14 M24,34 L24,40 M8,24 L14,24 M34,24 L40,24" stroke="CL" stroke-width="2"/>
         <circle cx="24" cy="24" r="12" fill="none" stroke="CL" stroke-width="2.5"/>
         <circle cx="24" cy="24" r="6" fill="CL" opacity="0.25"/>
         <circle cx="24" cy="24" r="2" fill="CL"/>`,
  ESTJ: `<rect x="12" y="14" width="24" height="24" fill="none" stroke="CL" stroke-width="2"/>
         <polygon points="24,6 36,14 12,14" fill="CL" opacity="0.3" stroke="CL" stroke-width="1.5"/>
         <line x1="24" y1="14" x2="24" y2="38" stroke="CL" stroke-width="1.5"/>
         <line x1="12" y1="26" x2="36" y2="26" stroke="CL" stroke-width="1.5"/>`,
  ESFJ: `<circle cx="24" cy="16" r="6" fill="CL" opacity="0.3" stroke="CL" stroke-width="1.5"/>
         <circle cx="16" cy="30" r="6" fill="CL" opacity="0.3" stroke="CL" stroke-width="1.5"/>
         <circle cx="32" cy="30" r="6" fill="CL" opacity="0.3" stroke="CL" stroke-width="1.5"/>
         <line x1="24" y1="22" x2="16" y2="24" stroke="CL" stroke-width="1.5"/>
         <line x1="24" y1="22" x2="32" y2="24" stroke="CL" stroke-width="1.5"/>
         <line x1="16" y1="36" x2="32" y2="36" stroke="CL" stroke-width="1.5" opacity="0.5"/>`,

  // SP 探検家 - ダイナミック・アクティブなシンボル
  ISTP: `<circle cx="24" cy="24" r="14" fill="none" stroke="CL" stroke-width="2"/>
         <circle cx="24" cy="24" r="3" fill="CL"/>
         <path d="M24,10 L26,20 L24,24" stroke="CL" stroke-width="2" fill="none"/>
         <path d="M24,24 L32,28" stroke="CL" stroke-width="1.5"/>`,
  ISFP: `<path d="M12,36 Q16,20 24,12 Q32,20 36,36" fill="none" stroke="CL" stroke-width="2"/>
         <path d="M18,36 Q20,26 24,18 Q28,26 30,36" fill="CL" opacity="0.2"/>
         <circle cx="24" cy="16" r="3" fill="CL" opacity="0.6"/>`,
  ESTP: `<polygon points="24,6 44,36 4,36" fill="none" stroke="CL" stroke-width="2.5"/>
         <polygon points="24,16 34,34 14,34" fill="CL" opacity="0.15"/>
         <line x1="24" y1="6" x2="24" y2="34" stroke="CL" stroke-width="1.5" opacity="0.5"/>
         <circle cx="24" cy="28" r="3" fill="CL" opacity="0.5"/>`,
  ESFP: `<path d="M24,8 L28,20 L40,20 L30,28 L34,40 L24,32 L14,40 L18,28 L8,20 L20,20Z" fill="CL" opacity="0.2" stroke="CL" stroke-width="2"/>
         <path d="M24,14 L26,22 L34,22 L28,27 L30,35 L24,30 L18,35 L20,27 L14,22 L22,22Z" fill="CL" opacity="0.3"/>`
};

// インラインSVGアバターを生成
function createMBTIAvatar(type) {
  const color = MBTI_TYPE_COLORS[type];
  const symbol = MBTI_SYMBOLS[type].replace(/CL/g, color);
  return `<svg class="mbti-avatar-svg" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
    <defs><radialGradient id="bg-${type}" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${color}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${color}" stop-opacity="0.05"/>
    </radialGradient></defs>
    <circle cx="24" cy="24" r="23" fill="url(#bg-${type})" stroke="${color}" stroke-width="1" opacity="0.6"/>
    ${symbol}
  </svg>`
;
}

function getMBTIGroup(type) {
  if (['INTJ','INTP','ENTJ','ENTP'].includes(type)) return 'NT';
  if (['INFJ','INFP','ENFJ','ENFP'].includes(type)) return 'NF';
  if (['ISTJ','ISFJ','ESTJ','ESFJ'].includes(type)) return 'SJ';
  return 'SP';
}

let selectedMBTI = null;
let adminAuthenticated = false;

// 管理者パスワード認証
async function sha256(message) {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

let ADMIN_PASSWORD_HASH = '';
(async () => {
  ADMIN_PASSWORD_HASH = await sha256('mbti2024');
})();

async function checkAdminPassword() {
  if (adminAuthenticated) return true;
  const password = prompt('管理者パスワードを入力してください:');
  if (!password) return false;
  const hash = await sha256(password);
  if (hash === ADMIN_PASSWORD_HASH) {
    adminAuthenticated = true;
    return true;
  }
  alert('パスワードが正しくありません。');
  return false;
}

// URLパラメータで管理モードチェック
function isAdminMode() {
  const params = new URLSearchParams(window.location.search);
  return params.get('admin') === 'mbti2024';
}

// ==========================================
// 初期化
// ==========================================

document.addEventListener('DOMContentLoaded', async () => {
  await initData();
  if (isAdminMode()) initAdminTab();
  initTabs();
  initPrefectureSelects();
  initMBTIGrid();
  initFormSubmit();
  if (isAdminMode()) initDataManagement();
  loadMap('map-container');
  updateResultsTabState();
});

// 管理タブを動的に追加
function initAdminTab() {
  const nav = document.querySelector('.tabs');
  const btn = document.createElement('button');
  btn.className = 'tab';
  btn.dataset.tab = 'manage';
  btn.textContent = '管理';
  nav.appendChild(btn);
}

// ==========================================
// タブ切替
// ==========================================

function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', async () => {
      if (tab.dataset.tab === 'results' && !hasAnswered()) {
        alert('アンケートに回答すると集計結果を見ることができます。');
        return;
      }

      if (tab.dataset.tab === 'manage') {
        const ok = await checkAdminPassword();
        if (!ok) return;
      }

      tabs.forEach(t => t.classList.remove('active'));
      document.querySelectorAll('.tab-content').forEach(c => c.classList.add('hidden'));
      tab.classList.add('active');
      const target = document.getElementById('tab-' + tab.dataset.tab);
      target.classList.remove('hidden');

      if (tab.dataset.tab === 'results') {
        refreshResults();
      } else if (tab.dataset.tab === 'manage') {
        updateDataCount();
      }
    });
  });
}

function updateResultsTabState() {
  const resultsTab = document.querySelector('[data-tab="results"]');
  if (!resultsTab) return;
  if (hasAnswered()) {
    resultsTab.classList.remove('tab-locked');
  } else {
    resultsTab.classList.add('tab-locked');
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

      btn.innerHTML =
        createMBTIAvatar(type) +
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
    updateResultsTabState();

    // リセット
    prefSelect.value = '';
    ageSelect.value = '';
    document.querySelectorAll('input[name="gender"]').forEach(r => r.checked = false);
    selectedMBTI = null;
    document.querySelectorAll('.mbti-btn').forEach(b => b.classList.remove('selected'));
    submitBtn.disabled = true;

    // 成功メッセージ
    const msg = document.getElementById('submit-message');
    msg.textContent = '回答ありがとう！結果を表示します…';
    msg.className = 'message success';

    // 1.5秒後に結果タブへ自動切り替え
    setTimeout(() => {
      msg.className = 'message hidden';
      const resultsTab = document.querySelector('[data-tab="results"]');
      if (resultsTab) resultsTab.click();
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

// ==========================================
// データ管理
// ==========================================

function updateDataCount() {
  const el = document.getElementById('data-count');
  if (!el) return;
  const count = getAllResponses().length;
  el.textContent = `総回答数: ${count}件`;
}

function initDataManagement() {
  const btnSample = document.getElementById('btn-sample');
  if (!btnSample) return;

  btnSample.addEventListener('click', () => {
    generateSampleData(50);
    updateDataCount();
    alert('サンプルデータ50件を追加しました');
  });

  document.getElementById('btn-export').addEventListener('click', () => {
    const data = exportData();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mbti_survey_data.json';
    a.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById('file-import').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        importData(ev.target.result);
        updateDataCount();
        alert('データをインポートしました');
      } catch (err) {
        alert('インポートエラー: ' + err.message);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  document.getElementById('btn-clear').addEventListener('click', () => {
    if (confirm('全てのデータを削除しますか？この操作は取り消せません。')) {
      clearAllData();
      updateDataCount();
      alert('データを削除しました');
    }
  });
}
