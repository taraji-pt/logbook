const API_URL =
    'https://script.google.com/macros/s/AKfycbxsfosGPvNCUmTeJRTbfvhxWG8YuNXiJd7VLIrALGSpJ8sIeVVcZAxsRG1X0-rjVG6T/exec';


async function loadData() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(
                `HTTP Error: ${response.status}`
            );
        }

        const data = await response.json();

        window.appData.tips =
            normalizeTips(data.tips || []);

        window.appData.settings =
            normalizeSettings(data.settings || {});

        console.log(
            'Betting Logbook data loaded:',
            window.appData
        );

        return window.appData;

    } catch (error) {

        console.error(
            'Failed to load API data:',
            error
        );

        return {
            tips: [],
            settings: {}
        };

    }

}


function normalizeTips(tips) {

    return tips.map(tip => ({

        id: Number(tip.id) || 0,

        date: tip.date
            ? new Date(tip.date)
            : null,

        competition: tip.competition || '',

        stage: tip.stage || '',

        home: tip.home || '',

        away: tip.away || '',

        home_code: tip.home_code || '',

        away_code: tip.away_code || '',

        market: tip.market || '',

        odd: Number(tip.odd) || 0,

        stake_eur: Number(tip.stake_eur) || 0,

        result: (tip.result || '')
            .toString()
            .trim()
            .toUpperCase(),

        score: tip.score || ''

    }));

}


function normalizeSettings(settings) {

    return {

        initial_bankroll:
            Number(settings.initial_bankroll) || 0,

        analysis_start_date:
            settings.analysis_start_date
                ? new Date(settings.analysis_start_date)
                : null,

        currency:
            settings.currency || 'EUR'

    };

}
