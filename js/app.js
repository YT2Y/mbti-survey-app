// ==========================================
// メインアプリケーション制御
// ==========================================

const MBTI_LABELS = {
  INTJ: '建築家', INTP: '論理学者', ENTJ: '指揮官', ENTP: '討論者',
  INFJ: '提唱者', INFP: '仲介者', ENFJ: '主人公', ENFP: '広報運動家',
  ISTJ: '管理者', ISFJ: '擁護者', ESTJ: '幹部',   ESFJ: '領事官',
  ISTP: '巨匠',   ISFP: '冒険家', ESTP: '起業家', ESFP: 'エンターテイナー'
};

let selectedMBTI = null;

// ==========================================
// 初期化
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initPrefectureSelects();
  initMBTIGrid();
  initFormSubmit();
  initDataManagement();
  loadMap('map-container');
  updateResultsTabState();
});

// ==========================================
// タブ切替
// ==========================================

function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      if (tab.dataset.tab === 'results' && !hasAnswered()) {
        alert('アンケートに回答すると集計結果を見ることができます。');
        return;
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
// MBTIグリッド
// ==========================================

function initMBTIGrid() {
  const grid = document.getElementById('mbti-grid');

  MBTI_TYPES.forEach(type => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'mbti-btn';
    btn.dataset.type = type;
    btn.style.setProperty('--mbti-color', MBTI_COLORS[type]);
    btn.style.setProperty('--mbti-bg', MBTI_COLORS[type] + '18');
    btn.innerHTML = `${type}<span class="mbti-label">${MBTI_LABELS[type]}</span>`;

    btn.addEventListener('click', () => {
      document.querySelectorAll('.mbti-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedMBTI = type;
      updateSubmitButton();
    });

    grid.appendChild(btn);
  });
}

// ==========================================
// フォーム送信
// ==========================================

function updateSubmitButton() {
  const prefSelect = document.getElementById('prefecture-select');
  const submitBtn = document.getElementById('submit-btn');
  submitBtn.disabled = !(prefSelect.value && selectedMBTI);
}

function initFormSubmit() {
  const prefSelect = document.getElementById('prefecture-select');
  prefSelect.addEventListener('change', updateSubmitButton);

  const submitBtn = document.getElementById('submit-btn');
  submitBtn.addEventListener('click', () => {
    const prefCode = prefSelect.value;
    if (!prefCode || !selectedMBTI) return;

    addResponse(prefCode, selectedMBTI);
    markAsAnswered();
    updateResultsTabState();

    // リセット
    prefSelect.value = '';
    selectedMBTI = null;
    document.querySelectorAll('.mbti-btn').forEach(b => b.classList.remove('selected'));
    submitBtn.disabled = true;

    // 成功メッセージ
    const msg = document.getElementById('submit-message');
    msg.textContent = '回答ありがとうございます！';
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

  // ヘッダー
  thead.innerHTML = '<tr><th>都道府県</th>'
    + MBTI_TYPES.map(t => `<th>${t}</th>`).join('')
    + '<th>合計</th></tr>';

  // ボディ
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

  // 合計行
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

// チェックボックスイベント
document.addEventListener('DOMContentLoaded', () => {
  const cb = document.getElementById('show-zero-rows');
  if (cb) cb.addEventListener('change', renderResultsTable);
});

// ==========================================
// データ管理
// ==========================================

function updateDataCount() {
  const count = getAllResponses().length;
  document.getElementById('data-count').textContent = `総回答数: ${count}件`;
}

function initDataManagement() {
  document.getElementById('btn-sample').addEventListener('click', () => {
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
