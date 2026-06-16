const API_URL = "https://script.google.com/macros/s/AKfycbxsfosGPvNCUmTeJRTbfvhxWG8YuNXiJd7VLIrALGSpJ8sIeVVcZAxsRG1X0-rjVG6T/exec";

let allTips = [];

function calculateProfit(stake, odd, result){

switch((result || "").toUpperCase()){

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

function matchWithFlags(homeCode, home, awayCode, away){

return `
    <span class="fi fi-${homeCode}"></span>
    ${home}

    vs

    ${away}
    <span class="fi fi-${awayCode}"></span>
`;

}

async function loadData(){

try{

    const response =
        await fetch(API_URL);

    const data =
        await response.json();

    allTips =
        data.tips || [];

    populateMarketFilter();

    renderBets(allTips);

}
catch(error){

    console.error(error);

    alert(
        "Erro ao carregar apostas."
    );

}

}

function populateMarketFilter(){

const select =
    document.getElementById(
        "marketFilter"
    );

const markets =
    [...new Set(
        allTips.map(
            t => t.market
        )
    )]
    .sort();

markets.forEach(market => {

    const option =
        document.createElement(
            "option"
        );

    option.value =
        market;

    option.textContent =
        market;

    select.appendChild(
        option
    );

});

}

function renderBets(tips){

const container =
    document.getElementById(
        "betsContainer"
    );

container.innerHTML =
    tips.map(tip => {

        const profit =
            calculateProfit(
                Number(tip.stake_eur),
                Number(tip.odd),
                tip.result
            );

        const profitClass =
            profit >= 0
            ? "positive"
            : "negative";

        return `

            <div class="bet-card">

                <div class="bet-card-header">

                    ${matchWithFlags(
                        tip.home_code,
                        tip.home,
                        tip.away_code,
                        tip.away
                    )}

                </div>

                <div class="bet-market">

                    ${tip.market}

                </div>

                <div class="bet-card-footer">

                    <span>
                        ${formatDate(
                            tip.date
                        )}
                    </span>

                    <span>
                        Odd:
                        ${tip.odd}
                    </span>

                    <span>
                        Stake:
                        ${tip.stake_eur}€
                    </span>

                    <span class="${profitClass}">
                        ${profit.toFixed(2)}€
                    </span>

                    <span>
                        ${tip.result}
                    </span>

                </div>

            </div>

        `;

    }).join("");

}

function formatDate(dateString){

const date =
    new Date(dateString);

return date.toLocaleDateString(
    "pt-PT"
);

}

function applyFilters(){

const market =
    document.getElementById(
        "marketFilter"
    ).value;

const result =
    document.getElementById(
        "resultFilter"
    ).value;

const search =
    document.getElementById(
        "searchTeam"
    )
    .value
    .toLowerCase();

const filtered =
    allTips.filter(tip => {

        const marketMatch =
            !market ||
            tip.market === market;

        const resultMatch =
            !result ||
            tip.result === result;

        const teamMatch =

            !search ||

            tip.home
            .toLowerCase()
            .includes(search)

            ||

            tip.away
            .toLowerCase()
            .includes(search);

        return (

            marketMatch &&
            resultMatch &&
            teamMatch

        );

    });

renderBets(filtered);

}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadData();

        document
        .getElementById("marketFilter")
        .addEventListener(
            "change",
            applyFilters
        );

        document
        .getElementById("resultFilter")
        .addEventListener(
            "change",
            applyFilters
        );

        document
        .getElementById("searchTeam")
        .addEventListener(
            "input",
            applyFilters
        );

    }
);
