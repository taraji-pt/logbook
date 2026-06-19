function getCssVariable(name) {

    return getComputedStyle(
        document.documentElement
    ).getPropertyValue(name).trim();

}


function getFlagIcon(countryCode) {

    if (!countryCode) {
        return '';
    }

    const flagMap = {

        SCO: 'gb-sct',
        ENG: 'gb-eng',
        WAL: 'gb-wls',
        NIR: 'gb-nir'

    };

    const code =
        flagMap[countryCode.toUpperCase()]
        ||
        countryCode.toLowerCase();

    return `
        <span
            class="fi fi-${code}"
        ></span>
    `;

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
