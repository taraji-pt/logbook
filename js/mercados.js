const API_URL =
"https://script.google.com/macros/s/AKfycbxsfosGPvNCUmTeJRTbfvhxWG8YuNXiJd7VLIrALGSpJ8sIeVVcZAxsRG1X0-rjVG6T/exec";

let marketsChart = null;

function calculateProfit(stake, odd, result){

    switch(
        (result || "")
        .toUpperCase()
    ){

        case "WIN":
            return stake * (odd - 1);

        case "LOSS":
            return -stake;

        case "HALF WIN":
            return (stake / 2) *
                   (odd - 1);

        case "HALF LOSS":
            return -(stake / 2);

        case "VOID":
            return 0;

        default:
            return 0;
    }

}

async function loadMarkets(){

    try{

        const response =
            await fetch(API_URL);

        const data =
            await response.json();

        const tips =
            data.tips || [];

        renderMarkets(
            tips
        );

    }
    catch(error){

        console.error(error);

        alert(
            "Erro ao carregar mercados."
        );

    }

}

function renderMarkets(tips){

    const markets = {};

    tips.forEach(tip => {

        const market =
            tip.market;

        const stake =
            Number(
                tip.stake_eur || 0
            );

        const odd =
            Number(
                tip.odd || 0
            );

        const result =
            tip.result;

        const profit =
            calculateProfit(
                stake,
                odd,
                result
            );

        if(!markets[market]){

            markets[market] = {

                bets:0,
                wins:0,
                stake:0,
                profit:0

            };

        }

        markets[market].bets++;

        markets[market].stake +=
            stake;

        markets[market].profit +=
            profit;

        if(
            String(result)
            .toUpperCase() ===
            "WIN"
        ){

            markets[market].wins++;

        }

    });

    const rows =
        Object.entries(
            markets
        ).map(
            ([market,data]) => {

                const roi =
                    data.stake > 0
                    ? (data.profit /
                       data.stake) * 100
                    : 0;

                const winRate =
                    data.bets > 0
                    ? (data.wins /
                       data.bets) * 100
                    : 0;

                return {

                    market,

                    bets:
                        data.bets,

                    profit:
                        data.profit,

                    roi,

                    winRate

                };

            }
        );

    renderKPIs(rows);

    renderTable(rows);

    renderChart(rows);

}

function renderKPIs(rows){

    const bestProfit =
        [...rows]
        .sort(
            (a,b) =>
            b.profit - a.profit
        )[0];

    const bestROI =
        [...rows]
        .sort(
            (a,b) =>
            b.roi - a.roi
        )[0];

    document.getElementById(
        "bestMarketProfitValue"
    ).innerText =

        bestProfit
        ? bestProfit.profit
            .toFixed(2) + " €"
        : "--";

    document.getElementById(
        "bestMarketProfitName"
    ).innerText =

        bestProfit
        ? bestProfit.market
        : "--";

    document.getElementById(
        "bestMarketROIValue"
    ).innerText =

        bestROI
        ? bestROI.roi
            .toFixed(2) + "%"
        : "--";

    document.getElementById(
        "bestMarketROIName"
    ).innerText =

        bestROI
        ? bestROI.market
        : "--";

    document.getElementById(
        "marketsCount"
    ).innerText =

        rows.length;

}

function renderTable(rows){

    const tbody =
        document.querySelector(
            "#marketsTable tbody"
        );

    tbody.innerHTML =

        rows
        .sort(
            (a,b) =>
            b.profit - a.profit
        )
        .map(row => {

            return `

                <tr>

                    <td>
                        ${row.market}
                    </td>

                    <td>
                        ${row.bets}
                    </td>

                    <td>
                        ${row.winRate.toFixed(1)}%
                    </td>

                    <td class="${
                        row.profit >= 0
                        ? "market-positive"
                        : "market-negative"
                    }">

                        ${row.profit.toFixed(2)} €

                    </td>

                    <td class="${
                        row.roi >= 0
                        ? "market-positive"
                        : "market-negative"
                    }">

                        ${row.roi.toFixed(1)}%

                    </td>

                </tr>

            `;

        })
        .join("");

}

function renderChart(rows){

    const ctx =
        document.getElementById(
            "marketsChart"
        );

    if(marketsChart){

        marketsChart.destroy();

    }

    marketsChart =
        new Chart(ctx,{

            type:"bar",

            data:{

                labels:
                    rows.map(
                        r => r.market
                    ),

                datasets:[{

                    label:
                        "Profit (€)",

                    data:
                        rows.map(
                            r => r.profit
                        ),

                    borderWidth:1

                }]

            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{

                    legend:{
                        display:false
                    }

                }

            }

        });

}

document.addEventListener(
    "DOMContentLoaded",
    loadMarkets
);
