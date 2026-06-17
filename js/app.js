const API_URL = "https://script.google.com/macros/s/AKfycbxsfosGPvNCUmTeJRTbfvhxWG8YuNXiJd7VLIrALGSpJ8sIeVVcZAxsRG1X0-rjVG6T/exec";

let bankrollChart = null;

function getFlag(code){

    if(code === "np"){
        return "🏳️";
    }

    return `<span class="fi fi-${code}"></span>`;
}

function matchWithFlags(homeCode, home, awayCode, away){

    return `
        ${getFlag(homeCode)}
        ${home}

        vs

        ${away}
        ${getFlag(awayCode)}
    `;
}

function calculateProfit(stake, odd, result) {

switch ((result || "").toUpperCase()) {

    case "WIN":
        return stake * (odd - 1);

    case "LOSS":
        return -stake;

    case "HALF WIN":
        return (stake / 2) * (odd - 1);

    case "HALF LOSS":
        return -(stake / 2);

    case "VOID":
        return 0;

    default:
        return 0;
}

}

async function loadData() {

try {

    const response = await fetch(API_URL);
    const data = await response.json();

    const tips = data.tips || [];
    const settings = data.settings || {};
    const analysisDate =
    new Date(
        settings.analysis_start_date
    );

document.getElementById(
    "page-subtitle"
).innerText =
    "Apostas desde " +
    analysisDate.toLocaleDateString(
        "pt-PT"
    );

    const initialBankroll =
        Number(settings.initial_bankroll || 10);

    let totalProfit = 0;
    let totalStake = 0;
    let wins = 0;
    let settled = 0;

    const bankrollHistory = [initialBankroll];

    tips.forEach(tip => {

        const stake =
            Number(tip.stake_eur || 0);

        const odd =
            Number(tip.odd || 0);

        const result =
            String(tip.result || "");

        const profit =
            calculateProfit(
                stake,
                odd,
                result
            );

        totalProfit += profit;

        if (result.toUpperCase() !== "VOID") {

            totalStake += stake;
            settled++;

        }

        if (result.toUpperCase() === "WIN") {
            wins++;
        }

        bankrollHistory.push(
            bankrollHistory[
                bankrollHistory.length - 1
            ] + profit
        );

    });

    const currentBankroll =
        initialBankroll +
        totalProfit;

    const roi =
        totalStake > 0
            ? (totalProfit / initialBankroll) * 100
            : 0;

    const yieldPct =
        totalStake > 0
            ? (totalProfit / totalStake) * 100
            : 0;

    const winRate =
        settled > 0
            ? (wins / settled) * 100
            : 0;

    document.getElementById("currencyBadge").innerText =
        settings.currency || "EUR";

    document.getElementById("bankrollCurrent").innerText =
        currentBankroll.toFixed(2) + " €";

    document.getElementById("netProfit").innerText =
        totalProfit.toFixed(2) + " €";

    document.getElementById("roi").innerText =
        roi.toFixed(2) + "%";

    document.getElementById("yield").innerText =
        yieldPct.toFixed(2) + "%";

    document.getElementById("winRate").innerText =
        winRate.toFixed(2) + "%";

    document.getElementById("betCount").innerText =
        tips.length;

document.getElementById("winRate")
.classList.add("neutral");

document.getElementById("betCount")
.classList.add("neutral");

const bankrollElement =
    document.getElementById("bankrollCurrent");

const profitElement =
    document.getElementById("netProfit");

if(currentBankroll >= initialBankroll){
    bankrollElement.classList.add("positive");
}else{
    bankrollElement.classList.add("negative");
}

if(totalProfit >= 0){
    profitElement.classList.add("positive");
}else{
    profitElement.classList.add("negative");
}

const roiElement =
    document.getElementById("roi");

const yieldElement =
    document.getElementById("yield");

if(roi >= 0){
    roiElement.classList.add("positive");
}else{
    roiElement.classList.add("negative");
}

if(yieldPct >= 0){
    yieldElement.classList.add("positive");
}else{
    yieldElement.classList.add("negative");
}

    renderLatestBets(tips);

    renderTopTeams(tips);

    renderChart(bankrollHistory);

}
catch (error) {

    console.error(error);

    alert(
        "Erro ao carregar dados: " +
        error.message
    );

}

}

function renderLatestBets(tips) {

const container =
    document.getElementById(
        "latestBets"
    );

const latest =
    [...tips]
    .reverse()
    .slice(0, 5);

container.innerHTML = latest.map(tip => {

    return `
        <div class="bet-row">

<div class="bet-match">
    ${matchWithFlags(
        tip.home_code,
        tip.home,
        tip.away_code,
        tip.away
    )}
</div>

<div class="bet-market">

    ${tip.market}

    <span class="result-badge result-${
        String(tip.result)
        .toLowerCase()
        .replace(" ","")
    }">

        ${tip.result}

    </span>

</div>

        </div>
    `;

}).join("");

}

function renderTopTeams(tips) {

    const container =
        document.getElementById(
            "topTeams"
        );

    const markets = {};

    tips.forEach(tip => {

        const market =
            tip.market;

        const profit =
            calculateProfit(
                Number(tip.stake_eur),
                Number(tip.odd),
                tip.result
            );

        if (!markets[market]) {
            markets[market] = 0;
        }

        markets[market] += profit;

    });

    const ranking =
        Object.entries(markets)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    container.innerHTML =
        ranking.map(market => {

            return `
                <div class="team-row">

                    <span class="market-name">
                        ${market[0]}
                    </span>

                    <span class="${
                        market[1] >= 0
                        ? 'positive'
                        : 'negative'
                    }">
                        ${market[1].toFixed(2)} €
                    </span>

                </div>
            `;

        }).join("");

}

function renderChart(history) {

const canvas =
    document.getElementById(
        "bankrollChart"
    );

if (bankrollChart) {
    bankrollChart.destroy();
}

bankrollChart =
    new Chart(canvas, {

        type: "line",

        data: {

labels:
    history.map(
        (_, i) => `#${i}`
    ),

            datasets: [{

        
                data: history,

                borderWidth: 3,

                tension: 0.25

            }]

        },

options: {

    responsive: true,

    maintainAspectRatio: false,

    plugins: {

        legend: {
            display: false
        }

    },

scales: {

    x: {

        ticks: {
            display: true
        }

    },

    y: {

        beginAtZero: false,

        grace: '5%'

    }

}

}

    });

}

document.addEventListener(
"DOMContentLoaded",
loadData
)
;

document
.getElementById(
    "toggleSidebar"
)
.addEventListener(
    "click",
    () => {

        document
        .querySelector(".sidebar")
        .classList
        .toggle("collapsed");

    }
);
