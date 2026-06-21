
let monthlyPerformanceChart;
let drawdownChart;
let geographyMap;

function initializeEstatisticas() {

    const tips =
        [...window.appData.tips]
            .sort(
                (a, b) =>
                    Number(a.id) -
                    Number(b.id)
            );

    updateStatisticsKpis(
        tips
    );

    renderMonthlyPerformanceChart(
        tips
    );

    renderDrawdownChart(
        tips
    );

    renderBettingGeographyMap(
    tips
);

}

function updateStatisticsKpis(
    tips
) {

    const longestWinStreak =
        calculateLongestWinStreak(
            tips
        );

    const longestLossStreak =
        calculateLongestLossStreak(
            tips
        );

    const currentStreak =
        calculateCurrentStreak(
            tips
        );

    const maxDrawdown =
        calculateMaxDrawdown(
            window.appData.settings.initial_bankroll,
            tips
        );

    const currentDrawdown =
        calculateCurrentDrawdown(
            window.appData.settings.initial_bankroll,
            tips
        );

    const totalProfit =
        calculateTotalProfit(
            tips
        );

    const recoveryFactor =
        maxDrawdown > 0
            ? totalProfit /
                maxDrawdown
            : 0;

    document.getElementById(
        'longestWinStreakKpi'
    ).textContent =
        longestWinStreak;

    document.getElementById(
        'longestLossStreakKpi'
    ).textContent =
        longestLossStreak;

document.getElementById(
    'currentStreakKpi'
).innerHTML =
    currentStreak
        .map(result => {

            let className =
                'streak-neutral';

            if (
                result === 'W'
            ) {

                className =
                    'streak-win';

            } else if (
                result === 'L'
            ) {

                className =
                    'streak-loss';

            }

            return `
                <span
                    class="${className}"
                >
                    ${result}
                </span>
            `;

        })
        .join('');

    document.getElementById(
    'recoveryFactorKpi'
).textContent =
    `${recoveryFactor.toFixed(2)}x`;
    
    document.getElementById(
        'currentDrawdownKpi'
    ).textContent =
        formatCurrency(
            currentDrawdown
        );

    document.getElementById(
        'maxDrawdownKpi'
    ).textContent =
        formatCurrency(
            maxDrawdown
        );

    document.getElementById(
        'longestWinStreakKpi'
    ).style.color =
        'var(--success)';

    document.getElementById(
        'longestLossStreakKpi'
    ).style.color =
        'var(--danger)';

   

    document.getElementById(
        'recoveryFactorKpi'
    ).style.color =
        recoveryFactor >= 2
            ? 'var(--success)'
            : recoveryFactor >= 1
                ? 'var(--accent)'
                : 'var(--danger)';

    document.getElementById(
        'currentDrawdownKpi'
    ).style.color =
        'var(--warning)';

    document.getElementById(
        'maxDrawdownKpi'
    ).style.color =
        'var(--danger)';

}

function calculateLongestWinStreak(
    tips
) {

    let current = 0;
    let longest = 0;

    tips.forEach(bet => {

        if (
            bet.result === 'WIN' ||
            bet.result === 'HALF WIN'
        ) {

            current++;

            longest =
                Math.max(
                    longest,
                    current
                );

        } else {

            current = 0;

        }

    });

    return longest;

}

function calculateLongestLossStreak(
    tips
) {

    let current = 0;
    let longest = 0;

    tips.forEach(bet => {

        if (
            bet.result === 'LOSS' ||
            bet.result === 'HALF LOSS'
        ) {

            current++;

            longest =
                Math.max(
                    longest,
                    current
                );

        } else {

            current = 0;

        }

    });

    return longest;

}

function calculateCurrentStreak(
    tips
) {

    const resolved =
        [...tips]
            .filter(
                bet =>
                    bet.result !==
                    'AWAITING SCORE'
            )
            .sort(
                (a, b) =>
                    Number(a.id) -
                    Number(b.id)
            )
            .slice(-5);

    return resolved
        .map(bet => {

            switch (
                bet.result
            ) {

                case 'WIN':
                case 'HALF WIN':
                    return 'W';

                case 'LOSS':
                case 'HALF LOSS':
                    return 'L';

                case 'VOID':
                    return 'V';

                default:
                    return '';

            }

        });

}

function calculateCurrentDrawdown(
    initialBankroll,
    tips
) {

    const history =
        generateBankrollHistory(
            initialBankroll,
            tips
        );

    if (
        !history.length
    ) {
        return 0;
    }

    const current =
        history[
            history.length - 1
        ].bankroll;

    const peak =
        Math.max(
            ...history.map(
                item =>
                    item.bankroll
            )
        );

    return peak - current;

}

function renderMonthlyPerformanceChart(
    tips
) {

    const canvas =
        document.getElementById(
            'monthlyPerformanceChart'
        );

    if (!canvas) {
        return;
    }

    const monthlyData = {};

    tips.forEach(bet => {

        const date =
            new Date(
                bet.date
            );

        const month =
            `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(
                2,
                '0'
            )}`;

        if (
            !monthlyData[
                month
            ]
        ) {

            monthlyData[
                month
            ] = 0;

        }

        monthlyData[
            month
        ] += calculateProfit(
            bet
        );

    });

    const entries =
    Object.entries(
        monthlyData
    )
    .sort(
        ([a], [b]) =>
            a.localeCompare(b)
    )
    .slice(-12);

const labels =
    entries.map(
        ([month]) => {

            const [
                year,
                monthNumber
            ] = month.split(
                '-'
            );

            return new Date(
                Number(year),
                Number(monthNumber) - 1
            ).toLocaleDateString(
                'en-US',
                {
                    month: 'short',
                    year: 'numeric'
                }
            );

        }
    );

const values =
    entries.map(
        ([, value]) =>
            value
    );

    if (
        monthlyPerformanceChart
    ) {

        monthlyPerformanceChart.destroy();

    }

    monthlyPerformanceChart =
        new Chart(
            canvas,
            {

                type: 'bar',

                data: {

                    labels,

                    datasets: [

                        {

                            data: values,

                            backgroundColor:
                                values.map(
                                    value =>
                                        value >= 0
                                            ? 'rgba(34,197,94,0.8)'
                                            : 'rgba(239,68,68,0.8)'
                                )

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    plugins: {

                        legend: {
                            display:
                                false
                        }

                    }

                }

            }
        );

}

function renderDrawdownChart(
    tips
) {

    const canvas =
        document.getElementById(
            'drawdownChart'
        );

    if (!canvas) {
        return;
    }

    const history =
        generateBankrollHistory(
            window.appData.settings.initial_bankroll,
            tips
        );

    const limitedHistory =
    history.slice(-100);

const limitedTips =
    tips.slice(-100);

    let peak =
        window.appData.settings.initial_bankroll;

const drawdowns =
    limitedHistory.map(
            item => {

                peak =
                    Math.max(
                        peak,
                        item.bankroll
                    );

                return (
                    peak -
                    item.bankroll
                );

            }
        );

    if (
        drawdownChart
    ) {

        drawdownChart.destroy();

    }

    drawdownChart =
        new Chart(
            canvas,
            {

                type: 'line',

                data: {

         labels:
    limitedTips.map(
        (
            bet,
            index,
            array
        ) => {

            const current =
                formatDate(
                    bet.date
                );

            const previous =
                index > 0
                    ? formatDate(
                        array[
                            index - 1
                        ].date
                    )
                    : null;

            return current === previous
                ? ''
                : current;

        }
    ),

                    datasets: [

                        {

                            data:
                                drawdowns,

                            borderColor:
                                'rgba(239,68,68,1)',

                            backgroundColor:
                                'rgba(239,68,68,0.2)',

                            fill:
                                true

                        }

                    ]

                },

                options: {

                    responsive:
                        true,

                    plugins: {

                        legend: {
                            display:
                                false
                        }

                    }

                }

            }
        );

}

function renderBettingGeographyMap(
    tips
) {

    const container =
        document.getElementById(
            'bettingGeographyMap'
        );

    if (!container) {
        return;
    }

    const countryStats = {};

    tips.forEach(bet => {

        const home =
            (
                bet.home_code ||
                ''
            )
            .toUpperCase();

        const away =
            (
                bet.away_code ||
                ''
            )
            .toUpperCase();

        const profit =
            calculateProfit(
                bet
            );

        if (
            !home ||
            !away
        ) {
            return;
        }

        if (
            home === away
        ) {

            if (
                !countryStats[
                    home
                ]
            ) {

                countryStats[
                    home
                ] = {

                    bets: 0,

                    profit: 0

                };

            }

            countryStats[
                home
            ].bets++;

            countryStats[
                home
            ].profit +=
                profit;

        } else {

            const splitProfit =
                profit / 2;

            [home, away]
                .forEach(
                    country => {

                        if (
                            !countryStats[
                                country
                            ]
                        ) {

                            countryStats[
                                country
                            ] = {

                                bets: 0,

                                profit: 0

                            };

                        }

                        countryStats[
                            country
                        ].bets++;

                        countryStats[
                            country
                        ].profit +=
                            splitProfit;

                    }
                );

        }

    });

    const values = {};

    const profits =
        Object.values(
            countryStats
        ).map(
            item =>
                item.profit
        );

    const highestProfit =
        Math.max(
            ...profits
        );

    const lowestProfit =
        Math.min(
            ...profits
        );

    Object.entries(
        countryStats
    ).forEach(
        ([country, data]) => {

            if (
                data.profit ===
                highestProfit
            ) {

                values[
                    country
                ] = 2;

            } else if (
                data.profit ===
                lowestProfit
            ) {

                values[
                    country
                ] = -2;

            } else if (
                data.profit > 0
            ) {

                values[
                    country
                ] = 1;

            } else if (
                data.profit < 0
            ) {

                values[
                    country
                ] = -1;

            } else {

                values[
                    country
                ] = 0;

            }

        }
    );

    if (
        geographyMap
    ) {

        geographyMap.destroy();

    }

    geographyMap =
        new jsVectorMap({

            selector:
                '#bettingGeographyMap',

            map:
                'world',

            zoomButtons:
                false,

            regionStyle: {

                initial: {

                    fill:
                        '#2a2f3a',

                    stroke:
                        '#161b22'

                }

            },

            series: {

                regions: [

                    {

                        values,

                        scale: {

                             '-2':
        '#ef4444',

    '-1':
        '#fca5a5',

    '0':
        '#2a2f3a',

    '1':
        '#86efac',

    '2':
        '#22c55e'

                        }

                    }

                ]

            },

onRegionTooltipShow:
    (
        event,
        tooltip,
        code
    ) => {

        const stats =
            countryStats[
                code.toUpperCase()
            ];

        const flag =
            `<span class="fi fi-${code.toLowerCase()}"></span>`;

        if (
            !stats
        ) {

            tooltip._tooltip.innerHTML =
                `
                ${flag}
                &nbsp;
                <strong>
                    ${tooltip.text()}
                </strong>

                <br><br>

                No bets
                `;

            return;

        }

        tooltip._tooltip.innerHTML =
            `
            ${flag}

            &nbsp;

            <strong>
                ${tooltip.text()}
            </strong>

            <br><br>

            Bets:
            ${stats.bets}

            <br>

            Profit:
            ${formatCurrency(
                stats.profit
            )}
            `;

    }



        });

}
