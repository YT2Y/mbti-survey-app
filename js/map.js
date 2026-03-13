// ==========================================
// 日本地図 SVG 読込・ヒートマップ・ツールチップ
// ==========================================

async function loadMap(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  try {
    const response = await fetch('./assets/japan-map.svg');
    const svgText = await response.text();
    container.innerHTML = svgText;
  } catch (e) {
    container.innerHTML = '<p style="color:#999;text-align:center;padding:2rem;">地図の読み込みに失敗しました。HTTPサーバー経由でアクセスしてください。</p>';
    return;
  }

  // イベントリスナー登録
  container.querySelectorAll('.prefecture').forEach(el => {
    el.addEventListener('mouseenter', onPrefMouseEnter);
    el.addEventListener('mousemove', onPrefMouseMove);
    el.addEventListener('mouseleave', onPrefMouseLeave);
    el.addEventListener('click', onPrefClick);
  });

  // 凡例を生成
  renderMapLegend();
}

// ==========================================
// ヒートマップ着色
// ==========================================

function updateMapColors() {
  const container = document.getElementById('map-container');
  if (!container) return;

  const prefs = container.querySelectorAll('.prefecture');
  if (prefs.length === 0) return;

  // 最大回答数を取得（濃淡計算用）
  let maxCount = 1;
  PREFECTURES.forEach(p => {
    const count = getResponsesByPrefecture(p.code).length;
    if (count > maxCount) maxCount = count;
  });

  prefs.forEach(el => {
    const code = el.getAttribute('data-code');
    if (!code) return;

    const dominant = getDominantType(code);
    const count = getResponsesByPrefecture(code).length;

    const paths = el.querySelectorAll('path, polygon, rect, circle');
    if (count === 0 || !dominant) {
      paths.forEach(p => {
        p.setAttribute('fill', '#e5e7eb');
        p.removeAttribute('fill-opacity');
      });
    } else {
      const color = MBTI_COLORS[dominant] || '#e5e7eb';
      const opacity = Math.min(0.35 + (count / maxCount) * 0.65, 1.0);
      paths.forEach(p => {
        p.setAttribute('fill', color);
        p.setAttribute('fill-opacity', opacity);
      });
    }
  });
}

// ==========================================
// ツールチップ
// ==========================================

function onPrefMouseEnter(e) {
  const code = this.getAttribute('data-code');
  if (!code) return;

  const tooltip = document.getElementById('map-tooltip');
  const prefName = getPrefectureName(code);
  const responses = getResponsesByPrefecture(code);
  const dist = getMBTIDistribution(code);

  // 上位3タイプ
  const sorted = Object.entries(dist)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  let html = `<div class="tooltip-title">${prefName}（${responses.length}件）</div>`;
  if (sorted.length > 0) {
    sorted.forEach(([type, count]) => {
      html += `<div class="tooltip-row"><span>${type}</span><span>${count}件</span></div>`;
    });
  } else {
    html += '<div style="color:#999">データなし</div>';
  }

  tooltip.innerHTML = html;
  tooltip.style.display = 'block';
}

function onPrefMouseMove(e) {
  const tooltip = document.getElementById('map-tooltip');
  tooltip.style.left = (e.clientX + 12) + 'px';
  tooltip.style.top = (e.clientY + 12) + 'px';
}

function onPrefMouseLeave() {
  document.getElementById('map-tooltip').style.display = 'none';
}

function onPrefClick() {
  const code = this.getAttribute('data-code');
  if (!code) return;

  // 都道府県チャートセレクトと連動
  const select = document.getElementById('pref-chart-select');
  if (select) {
    select.value = code;
    renderPrefectureChart(code);
  }
}

// ==========================================
// 凡例
// ==========================================

function renderMapLegend() {
  const legend = document.getElementById('map-legend');
  if (!legend) return;

  legend.innerHTML = '';
  Object.entries(MBTI_GROUP_COLORS).forEach(([group, color]) => {
    const item = document.createElement('span');
    item.className = 'legend-item';
    item.innerHTML = `<span class="legend-color" style="background:${color}"></span>${group}`;
    legend.appendChild(item);
  });

  // データなし
  const noData = document.createElement('span');
  noData.className = 'legend-item';
  noData.innerHTML = '<span class="legend-color" style="background:#e5e7eb"></span>データなし';
  legend.appendChild(noData);
}
