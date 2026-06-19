function calculateProfit(bet) {

    const stake = Number(bet.stake_eur);
    const odd = Number(bet.odd);

    switch (bet.result) {

        case 'WIN':
            return stake * (odd - 1);

        case 'LOSS':
            return -stake;

        case 'HALF WIN':
            return (stake / 2) * (odd - 1);

        case 'HALF LOSS':
            return -(stake / 2);

        case 'VOID':
            return 0;

        default:
            return 0;

    }

}


function calculateTotalProfit(tips) {

    return tips.reduce((total, bet) => {

        return total + calculateProfit(bet);

    }, 0);

}


function calculateTotalStake(tips) {

    return tips.reduce((total, bet) => {

        return total + Number(bet.stake_eur);

    }, 0);

}


function calculateROI(tips) {

    const profit =
        calculateTotalProfit(tips);

    const stake =
        calculateTotalStake(tips);

    if (!stake) {
        return 0;
    }

    return (profit / stake) * 100;

}


function calculateWinRate(tips) {

    if (!tips.length) {
        return 0;
    }

    const wins = tips.filter(bet =>
        bet.result === 'WIN'
    ).length;

    return (wins / tips.length) * 100;

}


function calculateCurrentBankroll(
    initialBankroll,
    tips
) {

    return (
        Number(initialBankroll) +
        calculateTotalProfit(tips)
    );

}


function generateBankrollHistory(
    initialBankroll,
    tips
) {

    let bankroll =
        Number(initialBankroll);

    const history = [];

    [...tips]
        .sort((a, b) => a.date - b.date)
        .forEach(bet => {

            bankroll += calculateProfit(bet);

            history.push({
                date: bet.date,
                bankroll
            });

        });

    return history;

}

function calculateYield(tips) {

    const profit =
        calculateTotalProfit(tips);

    const stake =
        calculateTotalStake(tips);

    if (!stake) {
        return 0;
    }

    return (profit / stake) * 100;

}


function calculateWinLossStats(tips) {

    const stats = {
        WIN: 0,
        LOSS: 0,
        VOID: 0,
        'HALF WIN': 0,
        'HALF LOSS': 0
    };

    tips.forEach(bet => {

        if (stats.hasOwnProperty(bet.result)) {
            stats[bet.result]++;
        }

    });

    return stats;

}


function getRecentBets(
    tips,
    limit = 5
) {

    return [...tips]
        .sort(
            (a, b) =>
                Number(b.id) -
                Number(a.id)
        )
        .slice(0, limit);

}


function calculateBankrollPeak(
    initialBankroll,
    tips
) {

    const history =
        generateBankrollHistory(
            initialBankroll,
            tips
        );

    if (!history.length) {
        return initialBankroll;
    }

    return Math.max(
        initialBankroll,
        ...history.map(item => item.bankroll)
    );

}


function calculateMaxDrawdown(
    initialBankroll,
    tips
) {

    const history =
        generateBankrollHistory(
            initialBankroll,
            tips
        );

    let peak =
        initialBankroll;

    let maxDrawdown = 0;

    history.forEach(item => {

        peak = Math.max(
            peak,
            item.bankroll
        );

        const drawdown =
            peak - item.bankroll;

        maxDrawdown =
            Math.max(
                maxDrawdown,
                drawdown
            );

    });

    return maxDrawdown;

}
