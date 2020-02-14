const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');
const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');

const rateEl = document.getElementById('rate');
const swap = document.getElementById('swap');

// Fetch exchange rates and update the DOM
function calculate() {
  const currency_one = currencyEl_one.value;
  const currency_two = currencyEl_two.value;

  fetch(`https://api.exchangerate-api.com/v4/latest/${currency_one}`)
    .then(res => res.json())
    .then(data => {
      // console.log(data);      
      const rate = Math.round((data.rates[currency_two] + Number.EPSILON) * 100) / 100;
      rateEl.innerText = `Курс: 1 ${currency_one} = ${rate} ${currency_two}`;
      amountEl_two.value = (amountEl_one.value * rate).toFixed(2);
    });
}

async function getCBRate () {
    let responce = await fetch('https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?json');
    if (responce.status == 200) {
        let cbStat = await responce.json();
        let out = "";
        for (let i = 0; i < cbStat.length; i++)
            if(cbStat[i].cc === 'EUR' || cbStat[i].cc === 'USD' || cbStat[i].cc === 'RUB' || cbStat[i].cc === 'PLN') 
                out += '<img src="../img/flags/' + cbStat[i].cc.slice(0, 2) + '.png" alt="' + cbStat[i].cc.slice(0, 2) + '-flag" class="flags" /> 1 ' + cbStat[i].cc + ' - ' + parseFloat(cbStat[i].rate).toFixed(2) + ' грн ;<br>';
            document.getElementById("fromCentBank").innerHTML = out;
    }
}

getCBRate();

async function getPrivatRate () {
    let responce = await fetch('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5');
    if (responce.status == 200) {
        let prStat = await responce.json();
        let out = "";
        for (let i = 0; i < prStat.length; i++) {
                // if () prStat[i].ccy = ''
                out += '<img src="../img/flags/' + prStat[i].ccy.slice(0, 2) + '.png" alt="' + prStat[i].ccy.slice(0, 2) + '-flag" class="flags" /> 1 ' + prStat[i].ccy + ' - ' + parseFloat(prStat[i].sale).toFixed(2) + ' грн ;<br>';
            document.getElementById("fromPrivatBank").innerHTML = out;
        }
    }
}

getPrivatRate();

// Event listeners
currencyEl_one.addEventListener('change', calculate);
amountEl_one.addEventListener('input', calculate);
currencyEl_two.addEventListener('change', calculate);
amountEl_two.addEventListener('input', calculate);

swap.addEventListener('click', () => {
  const temp = currencyEl_one.value;
  currencyEl_one.value = currencyEl_two.value;
  currencyEl_two.value = temp;
  calculate();
});

calculate();