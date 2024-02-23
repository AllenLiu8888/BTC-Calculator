document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("cryptoForm").addEventListener("submit", async function(event) {
        event.preventDefault();

        const cryptoType = document.getElementById("cryptoType").value;
        const purchaseDate = document.getElementById("purchaseDate").value;
        const purchaseAmount = parseFloat(document.getElementById("purchaseAmount").value);
        const saleDate = document.getElementById("saleDate").value;
        const saleAmount = parseFloat(document.getElementById("saleAmount").value);

        const purchasePrice = await getCryptoPrice(cryptoType, purchaseDate);
        const salePrice = await getCryptoPrice(cryptoType, saleDate);
        const exchangeRate = await getExchangeRate(purchaseDate);

        const profit = (salePrice * saleAmount - purchasePrice * purchaseAmount) * exchangeRate;

        document.getElementById("result").innerHTML = `
            购入时价格: ${purchasePrice} USD<br>
            卖出时价格: ${salePrice} USD<br>
            人民币兑美元汇率: ${exchangeRate}<br>
            实际获利: ${profit.toFixed(2)} CNY
        `;
    });
});

async function getCryptoPrice(symbol, date) {
    const timestamp = new Date(date).getTime();
    const url = `https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1d&startTime=${timestamp}&endTime=${timestamp + 86400000}`;
    const response = await fetch(url);
    const data = await response.json();
    return parseFloat(data[0][1]);
}

async function getExchangeRate(date) {
    const url = `http://data.fixer.io/api/${date}?access_key=af24cfae7844884f2fc4d87b1fc49b25&symbols=USD,CNY`;
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.success) {
        return data.rates.CNY / data.rates.USD;
    } else {
        console.error("Error fetching exchange rate:", data.error);
        return null;
    }
}