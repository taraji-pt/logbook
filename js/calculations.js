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
