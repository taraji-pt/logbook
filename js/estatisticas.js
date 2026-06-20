
let monthlyPerformanceChart;
let drawdownChart;

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

    let peak =
        window.appData.settings.initial_bankroll;

    const drawdowns =
        history.map(
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
                        history.map(
                            (
                                _,
                                index
                            ) =>
                                index + 1
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
