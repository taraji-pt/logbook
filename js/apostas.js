function initializeApostas() {

    const tips =
        window.appData.tips;

populateFilters(tips);

initializeDateFilters();

initializeFilterEvents();

updateKpis(tips);

}


function populateFilters(tips) {

    populateMarketFilter(tips);

    populateResultFilter(tips);

    populateCompetitionFilter(tips);

}


function populateMarketFilter(tips) {

    const select =
        document.getElementById(
            'marketFilter'
        );

    const values =
        [...new Set(
            tips.map(
                bet => bet.market
            )
        )]
        .sort();

    values.forEach(value => {

        select.insertAdjacentHTML(
            'beforeend',
            `
                <option value="${value}">
                    ${value}
                </option>
            `
        );

    });

}


function populateResultFilter(tips) {

    const select =
        document.getElementById(
            'resultFilter'
        );

    const values =
        [...new Set(
            tips.map(
                bet => bet.result
            )
        )]
        .sort();

    values.forEach(value => {

        select.insertAdjacentHTML(
            'beforeend',
            `
                <option value="${value}">
                    ${value}
                </option>
            `
        );

    });

}


function populateCompetitionFilter(tips) {

    const select =
        document.getElementById(
            'competitionFilter'
        );

    const values =
        [...new Set(
            tips.map(
                bet => bet.competition
            )
        )]
        .sort();

    values.forEach(value => {

        select.insertAdjacentHTML(
            'beforeend',
            `
                <option value="${value}">
                    ${value}
                </option>
            `
        );

    });

}


function updateKpis(tips) {

    const totalBets =
        tips.length;

    const profit =
        calculateTotalProfit(tips);

    const roi =
        calculateROI(tips);

    const winRate =
        calculateWinRate(tips);

    const avgOdd =
        tips.length
            ? tips.reduce(
                (sum, bet) =>
                    sum + Number(bet.odd),
                0
            ) / tips.length
            : 0;

    const highestOdd =
        tips.length
            ? Math.max(
                ...tips.map(
                    bet => Number(bet.odd)
                )
            )
            : 0;

    document.getElementById(
        'betsKpi'
    ).textContent =
        totalBets;

    document.getElementById(
        'winRateKpi'
    ).textContent =
        `${winRate.toFixed(1)}%`;

    document.getElementById(
        'profitKpi'
    ).textContent =
        formatCurrency(profit);

    document.getElementById(
        'roiKpi'
    ).textContent =
        `${roi.toFixed(2)}%`;

    document.getElementById(
        'avgOddKpi'
    ).textContent =
        avgOdd.toFixed(2);

    document.getElementById(
        'highestOddKpi'
    ).textContent =
        highestOdd.toFixed(2);

document.getElementById(
    'betsKpi'
).style.color =
    'var(--accent)';

document.getElementById(
    'winRateKpi'
).style.color =
    'var(--accent)';

document.getElementById(
    'avgOddKpi'
).style.color =
    'var(--accent)';

document.getElementById(
    'highestOddKpi'
).style.color =
    'var(--accent)';

document.getElementById(
    'profitKpi'
).style.color =
    profit >= 0
        ? 'var(--success)'
        : 'var(--danger)';

document.getElementById(
    'roiKpi'
).style.color =
    roi >= 0
        ? 'var(--success)'
        : 'var(--danger)';   

    renderTable(tips);

}


function getFilters() {

    return {

        search:
            document
                .getElementById(
                    'searchFilter'
                )
                .value
                .trim()
                .toLowerCase(),

        market:
            document
                .getElementById(
                    'marketFilter'
                )
                .value,

        result:
            document
                .getElementById(
                    'resultFilter'
                )
                .value,

        competition:
            document
                .getElementById(
                    'competitionFilter'
                )
                .value,

        period:
            document
                .getElementById(
                    'periodFilter'
                )
                .value,

        startDate:
            document
                .getElementById(
                    'startDateFilter'
                )
                .value,

        endDate:
            document
                .getElementById(
                    'endDateFilter'
                )
                .value

    };

}


function initializeDateFilters() {

    const periodFilter =
        document.getElementById(
            'periodFilter'
        );

    const startDateFilter =
        document.getElementById(
            'startDateFilter'
        );

    const endDateFilter =
        document.getElementById(
            'endDateFilter'
        );

    if (
        !periodFilter ||
        !startDateFilter ||
        !endDateFilter
    ) {
        return;
    }

    periodFilter.addEventListener(
        'change',
        () => {

            const today =
                new Date();

            let startDate =
                new Date(today);

            switch (
                periodFilter.value
            ) {

                case '7':

                    startDate.setDate(
                        today.getDate() - 7
                    );

                    break;

                case '30':

                    startDate.setDate(
                        today.getDate() - 30
                    );

                    break;

                case '90':

                    startDate.setDate(
                        today.getDate() - 90
                    );

                    break;

                case 'month':

                    startDate =
                        new Date(
                            today.getFullYear(),
                            today.getMonth(),
                            1
                        );

                    break;

                case 'year':

                    startDate =
                        new Date(
                            today.getFullYear(),
                            0,
                            1
                        );

                    break;

                default:

                    startDateFilter.value =
                        '';

                    endDateFilter.value =
                        '';

                    return;

            }

            startDateFilter.value =
                startDate.toLocaleDateString('en-CA');

            endDateFilter.value =
                today.toLocaleDateString('en-CA');

        }
    );

}

function applyFilters() {

    const filters =
        getFilters();

    let filteredTips =
        [...window.appData.tips];

    if (filters.search) {

        filteredTips =
            filteredTips.filter(bet => {

                const match =
                    `${bet.home} ${bet.away}`
                        .toLowerCase();

                return match.includes(
                    filters.search
                );

            });

    }

    if (filters.market) {

        filteredTips =
            filteredTips.filter(
                bet =>
                    bet.market ===
                    filters.market
            );

    }

    if (filters.result) {

        filteredTips =
            filteredTips.filter(
                bet =>
                    bet.result ===
                    filters.result
            );

    }

    if (filters.competition) {

        filteredTips =
            filteredTips.filter(
                bet =>
                    bet.competition ===
                    filters.competition
            );

    }

    if (filters.startDate) {

        const startDate =
            new Date(
                filters.startDate
            );

        filteredTips =
            filteredTips.filter(
                bet =>
                    new Date(
                        bet.date
                    ) >= startDate
            );

    }

    if (filters.endDate) {

        const endDate =
            new Date(
                filters.endDate
            );

        filteredTips =
            filteredTips.filter(
                bet =>
                    new Date(
                        bet.date
                    ) <= endDate
            );

    }

    updateKpis(
        filteredTips
    );

}

function initializeFilterEvents() {

    const ids = [

        'searchFilter',
        'marketFilter',
        'resultFilter',
        'competitionFilter',
        'periodFilter',
        'startDateFilter',
        'endDateFilter'

    ];

    ids.forEach(id => {

        const element =
            document.getElementById(
                id
            );

        if (!element) {
            return;
        }

        element.addEventListener(
            'input',
            applyFilters
        );

        element.addEventListener(
            'change',
            applyFilters
        );

    });

}

function renderTable(tips) {

    const container =
        document.getElementById(
            'betsTableContainer'
        );

    if (!container) {
        return;
    }

    const sortedTips =
        [...tips]
            .sort(
                (a, b) =>
                    Number(b.id) -
                    Number(a.id)
            );

    container.innerHTML = `

        <table class="bets-table">

            <thead>

                <tr>

                    <th>Date</th>
                    <th>Match</th>
                    <th>Score</th>
                    <th>Competition</th>
                    <th>Market</th>
                    <th>Odd</th>
                    <th>Stake</th>
                    <th>Result</th>
                    <th>Profit</th>

                </tr>

            </thead>

            <tbody>

                ${sortedTips
                    .map(bet => {

                        const profit =
                            calculateProfit(
                                bet
                            );

                        const badgeClass =
                            bet.result
                                .toLowerCase()
                                .replaceAll(
                                    ' ',
                                    '-'
                                );

                        const competitionInfo =
                            bet.stage
                                ? `
                                    <div>
                                        ${bet.competition}
                                    </div>

                                    <div class="table-subtitle">
                                        ${bet.stage}
                                    </div>
                                `
                                : `
                                    <div>
                                        ${bet.competition}
                                    </div>
                                `;

                        return `

                            <tr>

                                <td>
                                    ${formatDate(
                                        bet.date
                                    )}
                                </td>

<td>
    ${formatMatchName(
        bet
    )}
</td>

<td>
    ${bet.score || '—'}
</td>

<td>
    ${competitionInfo}
</td>

                                <td>
                                    ${bet.market}
                                </td>

                                <td>
                                    ${Number(
                                        bet.odd
                                    ).toFixed(2)}
                                </td>

                                <td>
                                    ${formatCurrency(
                                        bet.stake_eur
                                    )}
                                </td>

                                <td>

                                    <span
                                        class="
                                            result-badge
                                            result-${badgeClass}
                                        "
                                    >
                                        ${bet.result}
                                    </span>

                                </td>

                                <td>

                                    <span
                                        class="
                                            table-profit
                                            ${
                                                profit > 0
                                                    ? 'profit-positive'
                                                    : profit < 0
                                                        ? 'profit-negative'
                                                        : 'profit-neutral'
                                            }
                                        "
                                    >
                                        ${
                                            profit > 0
                                                ? '+'
                                                : ''
                                        }
                                        ${formatCurrency(
                                            profit
                                        )}
                                    </span>

                                </td>

                            </tr>

                        `;

                    })
                    .join('')}

            </tbody>

        </table>

    `;

}

function initializeClearFiltersButton() {

    const button =
        document.getElementById(
            'clearFiltersBtn'
        );

    if (!button) {
        return;
    }

    button.addEventListener(
        'click',
        () => {

            document.getElementById(
                'searchFilter'
            ).value = '';

            document.getElementById(
                'marketFilter'
            ).value = '';

            document.getElementById(
                'resultFilter'
            ).value = '';

            document.getElementById(
                'competitionFilter'
            ).value = '';

            document.getElementById(
                'periodFilter'
            ).value = 'all';

            document.getElementById(
                'startDateFilter'
            ).value = '';

            document.getElementById(
                'endDateFilter'
            ).value = '';

            applyFilters();

        }
    );

}
