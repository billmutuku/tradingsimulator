 document.getElementById("startGame").addEventListener("click", function() {
        let balance = parseFloat(document.getElementById("startingBalance").value);
        if (balance < 5 || balance > 10000) {
            alert("Balance must be between $5 and $10,000");
            return;
        }
        document.getElementById("balance").textContent = balance.toFixed(2);
        document.getElementById("trading-area").classList.remove("hidden");
    });
    
    const ctx = document.getElementById('candlestickChart').getContext('2d');
    let dataPoints = [1800];
    let entryPrice = 0;
    let positionOpen = false;
    let tradeType = "";
    let balance = 100;

    function generateRandomPriceChange() {
        return (Math.random() - 0.5) * 2;
    }

    function updateChart() {
        if (dataPoints.length > 20) dataPoints.shift();
        let newPrice = dataPoints[dataPoints.length - 1] + generateRandomPriceChange();
        dataPoints.push(newPrice);
        chart.update();

        if (positionOpen) {
            let profitLoss = (tradeType === "buy" ? (newPrice - entryPrice) : (entryPrice - newPrice)) * parseFloat(document.getElementById("lotSize").value) * 10;
            document.getElementById("profitLoss").textContent = profitLoss.toFixed(2);
        }
    }

    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(20).fill(''),
            datasets: [{
                label: 'XAUUSD Price',
                data: dataPoints,
                borderColor: '#28a745',
                backgroundColor: 'rgba(40,167,69,0.2)',
                fill: true
            }]
        },
        options: { responsive: true, animation: false }
    });
    setInterval(updateChart, 1000);

    document.getElementById("buyButton").addEventListener("click", function() {
        if (positionOpen) return;
        entryPrice = dataPoints[dataPoints.length - 1];
        positionOpen = true;
        tradeType = "buy";
        document.getElementById("entryPrice").textContent = entryPrice.toFixed(2);
        document.getElementById("closeTrade").classList.remove("hidden");
    });

    document.getElementById("sellButton").addEventListener("click", function() {
        if (positionOpen) return;
        entryPrice = dataPoints[dataPoints.length - 1];
        positionOpen = true;
        tradeType = "sell";
        document.getElementById("entryPrice").textContent = entryPrice.toFixed(2);
        document.getElementById("closeTrade").classList.remove("hidden");
    });

    document.getElementById("closeTrade").addEventListener("click", function() {
        if (!positionOpen) return;
        let closingPrice = dataPoints[dataPoints.length - 1];
        let profitLoss = (tradeType === "buy" ? (closingPrice - entryPrice) : (entryPrice - closingPrice)) * parseFloat(document.getElementById("lotSize").value) * 10;
        balance += profitLoss;
        document.getElementById("balance").textContent = balance.toFixed(2);
        positionOpen = false;
        document.getElementById("profitLoss").textContent = "0.00";
        document.getElementById("entryPrice").textContent = "0.00";
        document.getElementById("closeTrade").classList.add("hidden");

        let message = profitLoss >= 0 ? `🎉 Congratulations! You made a profit of $${profitLoss.toFixed(2)}!` : `😢 Oops! You lost $${Math.abs(profitLoss).toFixed(2)}. Try again!`;
        alert(message);
    });
	
	
	