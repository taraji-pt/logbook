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

<div class="bet-score">

    Score:
    ${tip.score || "-"}

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

<span class="result-badge result-${
    String(tip.result)
    .toLowerCase()
    .replace(" ","")
}">
    ${tip.result}
</span>

<span class="${profitClass}">
    ${profit.toFixed(2)}€
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

const sort =
    document.getElementById(
        "sortFilter"
    ).value;

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

filtered.sort((a,b) => {

    if(sort === "date_desc")
        return new Date(b.date) - new Date(a.date);

    if(sort === "date_asc")
        return new Date(a.date) - new Date(b.date);

    if(sort === "odd_desc")
        return Number(b.odd) - Number(a.odd);

    if(sort === "odd_asc")
        return Number(a.odd) - Number(b.odd);

    if(sort === "profit_desc"){

        const pa =
            calculateProfit(
                Number(a.stake_eur),
                Number(a.odd),
                a.result
            );

        const pb =
            calculateProfit(
                Number(b.stake_eur),
                Number(b.odd),
                b.result
            );

        return pb - pa;

    }

    if(sort === "profit_asc"){

        const pa =
            calculateProfit(
                Number(a.stake_eur),
                Number(a.odd),
                a.result
            );

        const pb =
            calculateProfit(
                Number(b.stake_eur),
                Number(b.odd),
                b.result
            );

        return pa - pb;

    }

    return 0;

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

        document
.getElementById(
    "sortFilter"
)
.addEventListener(
    "change",
    applyFilters
);

    }
);
