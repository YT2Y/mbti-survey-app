// ==========================================
// メインアプリケーション制御
// ==========================================

const MBTI_LABELS = {
  INTJ: '建築家', INTP: '論理学者', ENTJ: '指揮官', ENTP: '討論者',
  INFJ: '提唱者', INFP: '仲介者', ENFJ: '主人公', ENFP: '広報運動家',
  ISTJ: '管理者', ISFJ: '擁護者', ESTJ: '幹部',   ESFJ: '領事官',
  ISTP: '巨匠',   ISFP: '冒険家', ESTP: '起業家', ESFP: 'エンターテイナー'
};

// 16personalities 英語名（画像URL用）
const MBTI_EN_LABELS = {
  INTJ: 'architect', INTP: 'logician', ENTJ: 'commander', ENTP: 'debater',
  INFJ: 'advocate', INFP: 'mediator', ENFJ: 'protagonist', ENFP: 'campaigner',
  ISTJ: 'logistician', ISFJ: 'defender', ESTJ: 'executive', ESFJ: 'consul',
  ISTP: 'virtuoso', ISFP: 'adventurer', ESTP: 'entrepreneur', ESFP: 'entertainer'
};

// 気質グループ別のネオンカラー
const MBTI_GROUP_NEON = {
  NT: '#c084fc', // パープルネオン
  NF: '#34d399', // グリーンネオン
  SJ: '#60a5fa', // ブルーネオン
  SP: '#fbbf24'  // イエローネオン
};

function getMBTIGroup(type) {
  if (['INTJ','INTP','ENTJ','ENTP'].includes(type)) return 'NT';
  if (['INFJ','INFP','ENFJ','ENFP'].includes(type)) return 'NF';
  if (['ISTJ','ISFJ','ESTJ','ESFJ'].includes(type)) return 'SJ';
  return 'SP';
}

function getMBTIAvatarUrl(type) {
  const en = MBTI_EN_LABELS[type];
  return `https://static.neris-assets.com/images/personality-types/avatars/faces/${type.toLowerCase()}-${en}-s3-v5-male.svg?v=1`;
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
      const groupColor = MBTI_GROUP_NEON[group];
      btn.style.setProperty('--mbti-color', groupColor);
      btn.style.setProperty('--mbti-bg', groupColor + '20');
      btn.style.setProperty('--mbti-glow', groupColor);

      const img = document.createElement('img');
      img.src = getMBTIAvatarUrl(type);
      img.alt = type;
      img.className = 'mbti-avatar';
      img.loading = 'lazy';
      img.onerror = function() { this.style.display = 'none'; };

      btn.appendChild(img);
      btn.insertAdjacentHTML('beforeend',
        `<span class="mbti-type-name">${type}</span>` +
        `<span class="mbti-label">${MBTI_LABELS[type]}</span>`
      );

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
    msg.textContent = '回答ありがとう！結果タブで みんなのデータをチェックしてね';
    msg.className = 'message success';
    setTimeout(() => { msg.className = 'message hidden'; }, 3000);
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
