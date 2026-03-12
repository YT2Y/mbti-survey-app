// ==========================================
// Chart.js グラフ描画
// ==========================================

let overallChart = null;
let groupsChart = null;
let prefectureChart = null;

// ==========================================
// 全体MBTI分布（棒グラフ）
// ==========================================

function renderOverallChart() {
  const ctx = document.getElementById('chart-overall');
  if (!ctx) return;

  if (overallChart) overallChart.destroy();

  const dist = getMBTIDistribution(null);

  overallChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: MBTI_TYPES,
      datasets: [{
        label: '回答数',
        data: MBTI_TYPES.map(t => dist[t]),
        backgroundColor: MBTI_TYPES.map(t => MBTI_COLORS[t]),
        borderRadius: 4
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: false },
        title: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: { precision: 0 }
        }
      }
    }
  });
}

// ==========================================
// 気質グループ分布（ドーナツグラフ）
// ==========================================

function renderGroupsChart() {
  const ctx = document.getElementById('chart-groups');
  if (!ctx) return;

  if (groupsChart) groupsChart.destroy();

  const dist = getMBTIDistribution(null);
  const groupLabels = Object.keys(MBTI_GROUPS);
  const groupData = groupLabels.map(g =>
    MBTI_GROUPS[g].reduce((sum, t) => sum + dist[t], 0)
  );
  const groupColors = groupLabels.map(g => MBTI_GROUP_COLORS[g]);

  groupsChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: groupLabels,
      datasets: [{
        data: groupData,
        backgroundColor: groupColors,
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 11 } }
        }
      }
    }
  });
}

// ==========================================
// 都道府県別MBTI分布（ドーナツグラフ）
// ==========================================

function renderPrefectureChart(prefCode) {
  const ctx = document.getElementById('chart-prefecture');
  if (!ctx) return;

  if (prefectureChart) prefectureChart.destroy();

  if (!prefCode) {
    prefectureChart = null;
    return;
  }

  const dist = getMBTIDistribution(prefCode);
  const nonZeroTypes = MBTI_TYPES.filter(t => dist[t] > 0);

  if (nonZeroTypes.length === 0) {
    prefectureChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['データなし'],
        datasets: [{
          data: [1],
          backgroundColor: ['#e5e7eb'],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          title: {
            display: true,
            text: getPrefectureName(prefCode) + ' — データなし',
            font: { size: 13 }
          }
        }
      }
    });
    return;
  }

  prefectureChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: nonZeroTypes,
      datasets: [{
        data: nonZeroTypes.map(t => dist[t]),
        backgroundColor: nonZeroTypes.map(t => MBTI_COLORS[t]),
        borderWidth: 2,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font: { size: 10 } }
        },
        title: {
          display: true,
          text: getPrefectureName(prefCode),
          font: { size: 13 }
        }
      }
    }
  });
}
