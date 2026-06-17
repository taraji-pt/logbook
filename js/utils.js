function getCssVariable(name) {

    return getComputedStyle(
        document.documentElement
    ).getPropertyValue(name).trim();

}


function getFlagEmoji(countryCode) {

    if (!countryCode) {
        return '';
    }

    return countryCode
        .toUpperCase()
        .replace(/./g, char =>
            String.fromCodePoint(
                127397 + char.charCodeAt()
            )
        );

}


function formatMatchName(bet) {

    return `${getFlagEmoji(bet.home_code)} ${bet.home} vs ${bet.away} ${getFlagEmoji(bet.away_code)}`;

}


function formatCurrency(value) {

    return `${Number(value).toFixed(2)}€`;

}


function formatDate(date) {

    if (!date) {
        return '-';
    }

    return new Date(date)
        .toLocaleDateString('pt-PT');

}
