function initializeDashboard() {

    const tips = window.appData.tips;

    const totalBets =
        tips.length;

    const profit =
        calculateTotalProfit(tips);

    const roi =
        calculateROI(tips);

    const totalBetsElement =
        document.getElementById('totalBetsValue');

    const profitElement =
        document.getElementById('profitValue');

    const roiElement =
        document.getElementById('roiValue');

    if (!totalBetsElement ||
        !profitElement ||
        !roiElement) {
        return;
    }

    totalBetsElement.textContent =
        totalBets;

    profitElement.textContent =
        `${profit >= 0 ? '+' : ''}${profit.toFixed(2)}€`;

    roiElement.textContent =
        `${roi >= 0 ? '+' : ''}${roi.toFixed(2)}%`;

    totalBetsElement.style.color =
        'var(--accent)';

    profitElement.style.color =
        profit >= 0
            ? 'var(--success)'
            : 'var(--danger)';

    roiElement.style.color =
        roi >= 0
            ? 'var(--success)'
            : 'var(--danger)';

}
