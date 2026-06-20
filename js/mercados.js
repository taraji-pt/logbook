let currentMarketsPage = 1;

const MARKETS_PER_PAGE = 10;

function initializeMercados() {

    const tips =
        window.appData.tips;

    const marketStats =
        buildMarketStats(tips);

    updateMarketKpis(
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
        `${bestProfit.market} (${formatCurrency(bestProfit.profit)})`;

    document.getElementById(
        'highestRoiMarketKpi'
    ).textContent =
        `${bestROI.market} (${bestROI.roi.toFixed(1)}%)`;

    document.getElementById(
        'highestWinRateMarketKpi'
    ).textContent =
        `${bestWinRate.market} (${bestWinRate.winRate.toFixed(1)}%)`;

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
            .sort(
                (a, b) =>
                    b.profit -
                    a.profit
            );

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

                    <th>Market</th>
                    <th>Bets</th>
                    <th>Win Rate</th>
                    <th>Profit</th>
                    <th>ROI</th>
                    <th>Yield</th>
                    <th>Avg Odd</th>

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
