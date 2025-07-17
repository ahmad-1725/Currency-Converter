(() => {
  const API_KEY = 'fca_live_SCxDs21hm80tnuAFRxBBUhLpDZTu7OiHKlxlz8Ck';
  const API_BASE_URL = 'https://api.freecurrencyapi.com/v1/latest';

  const fromCurrency = document.getElementById('fromCurrency');
  const toCurrency = document.getElementById('toCurrency');
  const amountInput = document.getElementById('amount');
  const resultDiv = document.getElementById('result');
  const errorDiv = document.getElementById('error');
  const loadingDiv = document.getElementById('loading');
  const convertBtn = document.getElementById('convertBtn');
  const swapIcon = document.querySelector('.convert-icon');

  document.getElementById('converterForm').addEventListener('submit', function(e) {
    e.preventDefault();
    convertCurrency();
  });

  function convertCurrency() {
  const from = fromCurrency.value.trim().toUpperCase();
  const to = toCurrency.value.trim().toUpperCase();
  const amount = parseFloat(amountInput.value);

  hideFeedback();

  if (!from || !to || isNaN(amount) || amount <= 0) {
    return showError('Please fill all fields with valid values.');
  }

  if (from === to) {
    return showError('Please select different currencies.');
  }

  showLoading(true);

  const url = `${API_BASE_URL}?apikey=${API_KEY}&base_currency=${from}&currencies=${to}`;
  
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true);
  xhr.onload = function () {
    showLoading(false);

    if (xhr.status === 200) {
      try {
        const data = JSON.parse(xhr.responseText);
        const rate = data && data.data && data.data[to];

        if (!rate) {
          return showError('Currency not supported or invalid.');
        }

        const converted = amount * rate;
        const formatted = converted.toFixed(2);

        resultDiv.innerHTML = `
          <div style="font-size: 1.3rem; margin-bottom: 0.5rem;">
            ${amount} ${from} = ${formatted} ${to}
          </div>
          <div style="font-size: 0.9rem; color: #555;">
            1 ${from} = ${rate.toFixed(4)} ${to}
          </div>
        `;
        resultDiv.classList.add('show');
      } catch (e) {
        showError('Failed to parse API response.');
      }
    } else {
      showError('API error: ' + xhr.status);
    }
  };
  xhr.onerror = function () {
    showLoading(false);
    showError('Network error. Try again.');
  };
  xhr.send();
}

  function showError(message) {
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
    setTimeout(function () {
      errorDiv.style.display = 'none';
    }, 4000);
  }

  function hideFeedback() {
    resultDiv.classList.remove('show');
    resultDiv.innerHTML = '';
    errorDiv.style.display = 'none';
  }

  function showLoading(show) {
    loadingDiv.style.display = show ? 'block' : 'none';
    convertBtn.disabled = show;
  }

  swapIcon.addEventListener('click', function () {
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;

    swapIcon.style.transition = 'transform 0.3s ease';
    swapIcon.style.transform = 'rotate(180deg)';
    setTimeout(function () {
      swapIcon.style.transform = 'rotate(0)';
    }, 300);

    if (parseFloat(amountInput.value) > 0) {
      convertCurrency();
    }
  });

  let debounceTimer;
  amountInput.addEventListener('input', function () {
    if (fromCurrency.value && toCurrency.value && parseFloat(amountInput.value) > 0) {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(convertCurrency, 500);
    }
  });
})();

