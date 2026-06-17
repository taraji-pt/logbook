function initializeDashboard() {

    const tips =
        window.appData.tips;

    const settings =
        window.appData.settings;

    const totalBets =
        tips.length;

    const bankroll =
        calculateCurrentBankroll(
            settings.initial_bankroll,
            tips
        );

    const profit =
        calculateTotalProfit(tips);

    const roi =
        calculateROI(tips);

    const yieldValue =
        calculateYield(tips);

    const winRate =
        calculateWinRate(tips);

    document.getElementById('totalBetsValue').textContent =
        totalBets;

    document.getElementById('bankrollValue').textContent =
        `${bankroll.toFixed(2)}€`;

    document.getElementById('profitValue').textContent =
        `${profit >= 0 ? '+' : ''}${profit.toFixed(2)}€`;

    document.getElementById('roiValue').textContent =
        `${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%`;

    document.getElementById('yieldValue').textContent =
        `${yieldValue >= 0 ? '+' : ''}${yieldValue.toFixed(2)}%`;

    document.getElementById('winRateValue').textContent =
        `${winRate.toFixed(1)}%`;

    document.getElementById('totalBetsValue').style.color =
        'var(--accent)';

    document.getElementById('winRateValue').style.color =
        'var(--accent)';

    document.getElementById('bankrollValue').style.color =
        bankroll >= settings.initial_bankroll
            ? 'var(--success)'
            : 'var(--danger)';

    document.getElementById('profitValue').style.color =
        profit >= 0
            ? 'var(--success)'
            : 'var(--danger)';

    document.getElementById('roiValue').style.color =
        roi >= 0
            ? 'var(--success)'
            : 'var(--danger)';

    document.getElementById('yieldValue').style.color =
        yieldValue >= 0
            ? 'var(--success)'
            : 'var(--danger)';

renderBankrollChart();
renderResultsChart();
    
}

function renderBankrollChart() {

    const success = getCssVariable('--success');
const danger = getCssVariable('--danger');
const grid = getCssVariable('--chart-grid');
const text = getCssVariable('--chart-text');

    const history =
        generateBankrollHistory(
            window.appData.settings.initial_bankroll,
            window.appData.tips
        );

    const ctx =
        document
            .getElementById('bankrollChart');

    if (!ctx) {
        return;
    }

    new Chart(ctx, {

        type: 'line',

        data: {

            labels: history.map(item =>
                item.date.toLocaleDateString('pt-PT')
            ),

            datasets: [{
                data: history.map(item =>
                    item.bankroll
                ),

borderColor:
    calculateTotalProfit(window.appData.tips) >= 0
        ? success
        : danger,
                backgroundColor: 'transparent',
                tension: 0.3
            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {

                x: {
                    ticks: {
                        color: text
                    },
                    grid: {
                        color: grid
                    }
                },

                y: {
                    ticks: {
                        color: text
                    },
                    grid: {
                        color: grid
                    }
                }

            }

        }

    });

}

function renderResultsChart() {

    const success = getCssVariable('--success');
const danger = getCssVariable('--danger');
const accent = getCssVariable('--accent');
const warning = getCssVariable('--warning');

const neutral = getCssVariable('--chart-neutral');
const text = getCssVariable('--text');

    const stats =
        calculateWinLossStats(
            window.appData.tips
        );

    const ctx =
        document
            .getElementById('resultsChart');

    if (!ctx) {
        return;
    }

    new Chart(ctx, {

        type: 'doughnut',

        data: {

            labels: Object.keys(stats),

            datasets: [{

                data: Object.values(stats),

backgroundColor: [
    success,
    danger,
    neutral,
    accent,
    warning
]

            }]

        },

        options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

                legend: {
                    position: 'bottom',
                    labels: {
                        color: text
                    }
                }

            }

        }

    });

}
