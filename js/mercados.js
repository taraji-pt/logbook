const API_URL =
"https://script.google.com/macros/s/AKfycbxsfosGPvNCUmTeJRTbfvhxWG8YuNXiJd7VLIrALGSpJ8sIeVVcZAxsRG1X0-rjVG6T/exec";

let marketsChart = null;

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

async function loadMarkets(){

    try{

        const response =
            await fetch(API_URL);

        const data =
            await response.json();

        const tips =
            data.tips || [];

        const markets = {};

        tips.forEach(tip => {

            const market =
                tip.market;

            const stake =
                Number(tip.stake_eur || 0);

            const odd =
                Number(tip.odd || 0);

            const result =
                tip.result || "";

            const profit =
                calculateProfit(
                    stake,
                    odd,
                    result
                );

            if(!markets[market]){

                markets[market] = {

                    market,
                    bets:0,
                    wins:0,
                    settled:0,
                    stake:0,
                    profit:0

                };

            }

            markets[market].bets++;

            markets[market].profit += profit;

            if(
                result.toUpperCase()
                !== "VOID"
            ){

                markets[market].stake += stake;

                markets[market].settled++;

            }

            if(
                result.toUpperCase()
                === "WIN"
            ){

                markets[market].wins++;

            }

        });

        const rows =
            Object.values(markets)
            .map(m => {

                m.winRate =
                    m.settled > 0
                    ? (m.wins / m.settled) * 100
                    : 0;

                m.roi =
                    m.stake > 0
                    ? (m.profit / m.stake) * 100
                    : 0;

                return m;

            });

        rows.sort(
            (a,b) =>
            b.profit - a.profit
        );

        renderKPIs(rows);

        renderTable(rows);

        renderChart(rows);

    }

    catch(error){

        console.error(error);

        alert(
            "Erro ao carregar mercados."
        );

    }

}

function renderKPIs(rows){

    if(!rows.length)
        return;

    const bestMarket =
        rows[0];

    const bestROI =
        [...rows]
        .sort(
            (a,b) =>
            b.roi - a.roi
        )[0];

    document.getElementById(
        "bestMarket"
    ).innerText =
        bestMarket.market;

    document.getElementById(
        "bestMarketProfit"
    ).innerText =
        bestMarket.profit.toFixed(2)
        + " €";

    document.getElementById(
        "bestROI"
    ).innerText =
        bestROI.roi.toFixed(2)
        + "%";

    document.getElementById(
        "marketCount"
    ).innerText =
        rows.length;

}

function renderTable(rows){

    const container =
        document.getElementById(
            "marketsTable"
        );

    container.innerHTML = `

        <table
            style="
                width:100%;
                border-collapse:collapse;
            "
        >

            <thead>

                <tr>

                    <th align="left">
                        Mercado
                    </th>

                    <th align="center">
                        Bets
                    </th>

                    <th align="center">
                        Win %
                    </th>

                    <th align="center">
                        ROI
                    </th>

                    <th align="right">
                        Profit
                    </th>

                </tr>

            </thead>

            <tbody>

                ${rows.map(row => `

                    <tr>

                        <td>
                            ${row.market}
                        </td>

                        <td align="center">
                            ${row.bets}
                        </td>

                        <td align="center">
                            ${row.winRate.toFixed(1)}%
                        </td>

                        <td align="center">
                            ${row.roi.toFixed(1)}%
                        </td>

                        <td
                            align="right"
                            class="${
                                row.profit >= 0
                                ? "positive"
                                : "negative"
                            }"
                        >

                            ${row.profit.toFixed(2)} €

                        </td>

                    </tr>

                `).join("")}

            </tbody>

        </table>

    `;

}

function renderChart(rows){

    const canvas =
        document.getElementById(
            "marketsChart"
        );

    if(marketsChart){

        marketsChart.destroy();

    }

    marketsChart =
        new Chart(canvas,{

            type:"bar",

            data:{

                labels:
                    rows.map(
                        r => r.market
                    ),

                datasets:[{

                    label:
                        "Profit",

                    data:
                        rows.map(
                            r => r.profit
                        )

                }]

            },

            options:{

                responsive:true,

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