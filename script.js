const fromCurrency = document.getElementById("fromCurrency");
const toCurrency = document.getElementById("toCurrency");
const amount = document.getElementById("amount");
const result = document.getElementById("result");
const spinner = document.getElementById("spinner");
const swapBtn = document.getElementById("swapBtn");

// Direct mapping of currency code to flag emoji
const currencyFlags = {
  "AUD": "🇦🇺", "BGN": "🇧🇬", "BRL": "🇧🇷", "CAD": "🇨🇦",
  "CHF": "🇨🇭", "CNY": "🇨🇳", "CZK": "🇨🇿", "DKK": "🇩🇰",
  "EUR": "🇪🇺", "GBP": "🇬🇧", "HKD": "🇭🇰", "HUF": "🇭🇺",
  "IDR": "🇮🇩", "ILS": "🇮🇱", "INR": "🇮🇳", "ISK": "🇮🇸",
  "JPY": "🇯🇵", "KRW": "🇰🇷", "MXN": "🇲🇽", "MYR": "🇲🇾",
  "NOK": "🇳🇴", "NZD": "🇳🇿", "PHP": "🇵🇭", "PLN": "🇵🇱",
  "RON": "🇷🇴", "SEK": "🇸🇪", "SGD": "🇸🇬", "THB": "🇹🇭",
  "TRY": "🇹🇷", "USD": "🇺🇸", "ZAR": "🇿🇦"
};

// Load currency list dynamically
async function loadCurrencyList() {
  try {
    const response = await fetch("https://api.frankfurter.app/currencies");
    const data = await response.json();

    for (let code in data) {
      if (!currencyFlags[code]) continue;

      const flag = currencyFlags[code];
      const label = `${flag} ${code} - ${data[code]}`;

      const option1 = document.createElement("option");
      option1.value = code;
      option1.text = label;
      fromCurrency.appendChild(option1);

      const option2 = document.createElement("option");
      option2.value = code;
      option2.text = label;
      toCurrency.appendChild(option2);
    }

    fromCurrency.value = "USD";
    toCurrency.value = "INR";
  } catch (error) {
    result.innerText = "Failed to load currencies.";
    console.error(error);
  }
}

loadCurrencyList();

// Swap currencies
swapBtn.addEventListener("click", () => {
  const temp = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = temp;
});

// Convert currency
async function convertCurrency() {
  const amt = parseFloat(amount.value);
  if (isNaN(amt) || amt <= 0) {
    result.innerText = "Please enter a valid amount.";
    return;
  }

  const from = fromCurrency.value;
  const to = toCurrency.value;

  if (from === to) {
    result.innerText = `${amt} ${from} = ${amt.toFixed(2)} ${to}`;
    return;
  }

  const url = `https://api.frankfurter.app/latest?amount=${amt}&from=${from}&to=${to}`;

  result.innerText = "";
  spinner.style.display = "block";

  try {
    const res = await fetch(url);
    const data = await res.json();
    const converted = data.rates[to];

    result.innerText = `${amt} ${from} = ${converted.toFixed(2)} ${to}`;
  } catch (err) {
    result.innerText = "Conversion failed. Try again.";
    console.error(err);
  } finally {
    spinner.style.display="none";
}
}