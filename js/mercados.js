let currentMarketsPage = 1;

const MARKETS_PER_PAGE = 10;

let currentMarketsSortField =
    'profit';

let currentMarketsSortDirection =
    'desc';

function initializeMercados() {

    const tips =
        window.appData.tips;

    const marketStats =
        buildMarketStats(
            tips
        );

    updateMarketKpis(
        marketStats
    );

    renderMarketProfitChart(
        marketStats
    );

    renderMarketYieldChart(
        marketStats
    );

    renderMarketsTable(
        marketStats
    );

}

function buildMarketStats(tips) {

    const grouped = {};

    tips.forEach(bet => {

        const market =
            bet.market;

        if (!grouped[market]) {

            grouped[market] = [];

        }

        grouped[market].push(bet);

    });

    return Object.entries(grouped)
        .map(([market, bets]) => {

            const profit =
                calculateTotalProfit(
                    bets
                );

const roi =
    calculateROI(
        window.appData.settings.initial_bankroll,
        bets
    );

const yieldValue =
    calculateYield(
        bets
    );

            const winRate =
                calculateWinRate(
                    bets
                );

            const avgOdd =
                bets.reduce(
                    (sum, bet) =>
                        sum +
                        Number(
                            bet.odd
                        ),
                    0
                ) / bets.length;

            return {

                market,

                bets:
                    bets.length,

                profit,

                roi,

                yield:
                    yieldValue,

                winRate,

                avgOdd

            };

        });

}

function updateMarketKpis(
    stats
) {

    if (!stats.length) {
        return;
    }

    const bestProfit =
        [...stats]
            .sort(
                (a, b) =>
                    b.profit -
                    a.profit
            )[0];

    const bestYield =
        [...stats]
            .sort(
                (a, b) =>
                    b.yield -
                    a.yield
            )[0];

    const worstYield =
        [...stats]
            .sort(
                (a, b) =>
                    a.yield -
                    b.yield
            )[0];

    const bestROI =
        [...stats]
            .sort(
                (a, b) =>
                    b.roi -
                    a.roi
            )[0];

    const bestWinRate =
        [...stats]
            .sort(
                (a, b) =>
                    b.winRate -
                    a.winRate
            )[0];

    document.getElementById(
        'marketsTrackedKpi'
    ).textContent =
        stats.length;

    document.getElementById(
        'bestMarketKpi'
    ).textContent =
        bestYield.market;

    document.getElementById(
        'worstMarketKpi'
    ).textContent =
        worstYield.market;

    document.getElementById(
        'highestProfitMarketKpi'
    ).textContent =
        formatCurrency(
            bestProfit.profit
        );

    document.getElementById(
        'highestProfitMarketName'
    ).textContent =
        bestProfit.market;

    document.getElementById(
        'highestRoiMarketKpi'
    ).textContent =
        `${bestROI.roi.toFixed(1)}%`;

    document.getElementById(
        'highestRoiMarketName'
    ).textContent =
        bestROI.market;

    document.getElementById(
        'highestWinRateMarketKpi'
    ).textContent =
        `${bestWinRate.winRate.toFixed(1)}%`;

    document.getElementById(
        'highestWinRateMarketName'
    ).textContent =
        bestWinRate.market;

    document.getElementById(
        'marketsTrackedKpi'
    ).style.color =
        'var(--accent)';

    document.getElementById(
        'bestMarketKpi'
    ).style.color =
        'var(--accent)';

    document.getElementById(
        'worstMarketKpi'
    ).style.color =
        'var(--danger)';

    document.getElementById(
        'highestProfitMarketKpi'
    ).style.color =
        'var(--success)';

    document.getElementById(
        'highestRoiMarketKpi'
    ).style.color =
        'var(--success)';

    document.getElementById(
        'highestWinRateMarketKpi'
    ).style.color =
        'var(--accent)';

}

function renderMarketsTable(
    stats
) {

    const container =
        document.getElementById(
            'marketsTableContainer'
        );

    if (!container) {
        return;
    }

const sortedStats =
    [...stats]
        .sort((a, b) => {

            let valueA;
            let valueB;

            switch (
                currentMarketsSortField
            ) {

                case 'market':

                    valueA =
                        a.market;

                    valueB =
                        b.market;

                    return currentMarketsSortDirection ===
                        'asc'
                        ? valueA.localeCompare(
                            valueB
                        )
                        : valueB.localeCompare(
                            valueA
                        );

                case 'bets':

                    valueA =
                        a.bets;

                    valueB =
                        b.bets;

                    break;

                case 'winRate':

                    valueA =
                        a.winRate;

                    valueB =
                        b.winRate;

                    break;

                case 'profit':

                    valueA =
                        a.profit;

                    valueB =
                        b.profit;

                    break;

                case 'roi':

                    valueA =
                        a.roi;

                    valueB =
                        b.roi;

                    break;

                case 'yield':

                    valueA =
                        a.yield;

                    valueB =
                        b.yield;

                    break;

                case 'avgOdd':

                    valueA =
                        a.avgOdd;

                    valueB =
                        b.avgOdd;

                    break;

            }

            if (
                currentMarketsSortDirection ===
                'asc'
            ) {

                return (
                    valueA - valueB
                );

            }

            return (
                valueB - valueA
            );

        });

    const totalPages =
        Math.ceil(
            sortedStats.length /
            MARKETS_PER_PAGE
        );

    const start =
        (currentMarketsPage - 1) *
        MARKETS_PER_PAGE;

    const pageStats =
        sortedStats.slice(
            start,
            start + MARKETS_PER_PAGE
        );

    container.innerHTML = `

        <table class="bets-table">

            <thead>

                <tr>

<th
    class="sortable"
    onclick="handleMarketsSort('market')"
>
    Market${getMarketsSortIndicator('market')}
</th>

<th
    class="sortable"
    onclick="handleMarketsSort('bets')"
>
    Bets${getMarketsSortIndicator('bets')}
</th>

<th
    class="sortable"
    onclick="handleMarketsSort('winRate')"
>
    Win Rate${getMarketsSortIndicator('winRate')}
</th>

<th
    class="sortable"
    onclick="handleMarketsSort('profit')"
>
    Profit${getMarketsSortIndicator('profit')}
</th>

<th
    class="sortable"
    onclick="handleMarketsSort('roi')"
>
    ROI${getMarketsSortIndicator('roi')}
</th>

<th
    class="sortable"
    onclick="handleMarketsSort('yield')"
>
    Yield${getMarketsSortIndicator('yield')}
</th>

<th
    class="sortable"
    onclick="handleMarketsSort('avgOdd')"
>
    Avg Odd${getMarketsSortIndicator('avgOdd')}
</th>

                </tr>

            </thead>

            <tbody>

                ${pageStats
                    .map(row => `

                        <tr>

                            <td>
                                ${row.market}
                            </td>

                            <td>
                                ${row.bets}
                            </td>

                            <td>
                                ${row.winRate.toFixed(1)}%
                            </td>

                            <td
                                class="
                                    ${
                                        row.profit >= 0
                                            ? 'profit-positive'
                                            : 'profit-negative'
                                    }
                                "
                            >
                                ${formatCurrency(
                                    row.profit
                                )}
                            </td>

                            <td>
                                ${row.roi.toFixed(1)}%
                            </td>

                            <td>
                                ${row.yield.toFixed(1)}%
                            </td>

                            <td>
                                ${row.avgOdd.toFixed(2)}
                            </td>

                        </tr>

                    `)
                    .join('')}

            </tbody>

        </table>

    `;

    renderMarketsPagination(
        totalPages
    );

}

function renderMarketsPagination(
    totalPages
) {

    const container =
        document.getElementById(
            'marketsPaginationContainer'
        );

    if (!container) {
        return;
    }

    if (totalPages <= 1) {

        container.innerHTML = '';

        return;

    }

    let html = '';

    for (
        let page = 1;
        page <= totalPages;
        page++
    ) {

        html += `

            <button
                class="
                    pagination-btn
                    ${
                        page === currentMarketsPage
                            ? 'active'
                            : ''
                    }
                "
                onclick="
                    goToMarketsPage(${page})
                "
            >
                ${page}
            </button>

        `;

    }

    container.innerHTML =
        html;

}

function goToMarketsPage(
    page
) {

    currentMarketsPage =
        page;

    renderMarketsTable(
        buildMarketStats(
            window.appData.tips
        )
    );

}

function handleMarketsSort(
    field
) {

    if (
        currentMarketsSortField ===
        field
    ) {

        currentMarketsSortDirection =
            currentMarketsSortDirection ===
            'asc'
                ? 'desc'
                : 'asc';

    } else {

        currentMarketsSortField =
            field;

        currentMarketsSortDirection =
            'desc';

    }

    renderMarketsTable(
        buildMarketStats(
            window.appData.tips
        )
    );

}

function getMarketsSortIndicator(
    field
) {

    if (
        currentMarketsSortField !==
        field
    ) {
        return ' ▲▼';
    }

    return currentMarketsSortDirection ===
        'asc'
            ? ' ▲'
            : ' ▼';

}

let marketProfitChart;

function renderMarketProfitChart(
    stats
) {

    const canvas =
        document.getElementById(
            'marketProfitChart'
        );

    if (!canvas) {
        return;
    }

    if (
        marketProfitChart
    ) {
        marketProfitChart.destroy();
    }

    const sorted =
        [...stats]
            .sort(
                (a, b) =>
                    b.profit -
                    a.profit
            );

    marketProfitChart =
        new Chart(
            canvas,
            {

                type: 'bar',

                data: {

                    labels:
                        sorted.map(
                            item =>
                                item.market
                        ),

                    datasets: [

                        {

                            label:
                                'Profit',

                            data:
                                sorted.map(
                                    item =>
                                        item.profit
                                )

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    indexAxis:
                        'y',

                    plugins: {

                        legend: {
                            display:
                                false
                        }

                    },

                    scales: {

                        x: {

                            ticks: {

                                color:
                                    '#9ca3af'

                            },

                            grid: {

                                color:
                                    'rgba(255,255,255,0.08)'

                            }

                        },

                        y: {

                            ticks: {

                                color:
                                    '#9ca3af'

                            },

                            grid: {

                                display:
                                    false

                            }

                        }

                    }

                }

            }
        );

}

let marketYieldChart;

function renderMarketYieldChart(
    stats
) {

    const canvas =
        document.getElementById(
            'marketYieldChart'
        );

    if (!canvas) {
        return;
    }

    if (
        marketYieldChart
    ) {
        marketYieldChart.destroy();
    }

    const sorted =
        [...stats]
            .sort(
                (a, b) =>
                    b.yield -
                    a.yield
            );

    marketYieldChart =
        new Chart(
            canvas,
            {

                type: 'bar',

                data: {

                    labels:
                        sorted.map(
                            item =>
                                item.market
                        ),

                    datasets: [

                        {

                            label:
                                'Yield',

                            data:
                                sorted.map(
                                    item =>
                                        item.yield
                                )

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    indexAxis:
                        'y',

                    plugins: {

                        legend: {
                            display:
                                false
                        }

                    },

                    scales: {

                        x: {

                            ticks: {

                                color:
                                    '#9ca3af'

                            },

                            grid: {

                                color:
                                    'rgba(255,255,255,0.08)'

                            }

                        },

                        y: {

                            ticks: {

                                color:
                                    '#9ca3af'

                            },

                            grid: {

                                display:
                                    false

                            }

                        }

                    }

                }

            }
        );

}
