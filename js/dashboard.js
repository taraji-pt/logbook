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

}
