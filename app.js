let btnsRight = document.querySelectorAll('.right .btn');
let btnsLeft = document.querySelectorAll('.left .btn');
let input1 = document.querySelector('.input-left');
let input2 = document.querySelector('.input-right');
let rateLeft = document.querySelector('.rate-left');
let rateRight = document.querySelector('.rate-right');
document.querySelector('.left .btn:first-child').style.backgroundColor = '#833AE0';
document.querySelector('.left .btn:first-child').style.color = '#fff';
document.querySelector('.right .btn:nth-child(2)').style.backgroundColor = '#833AE0';
document.querySelector('.right .btn:nth-child(2)').style.color = '#fff';
let selectedLeftCurrency = 'RUB';
let selectedRightCurrency = 'USD';
let side1 = false;
let side2 = false;
class Currency {
    constructor() {
        this.url = "https://v6.exchangerate-api.com/v6/47eb3e300d61e356ae04b6f3/latest/";
    }

    async exchange(amount, firstCurrency, secondCurrency) {
        const response = await fetch(`${this.url}${firstCurrency}`);
        const result = await response.json();
        return amount * result.conversion_rates[secondCurrency];
    }
}

const currency = new Currency();
btnsRight.forEach(btn => {
    btn.addEventListener('click', (e) => {
        btnsRight.forEach(b => {

            b.style.backgroundColor = '';
            b.style.color = ''
        })
        e.target.style.backgroundColor = '#833AE0';
        e.target.style.color = '#fff'
        selectedRightCurrency = e.target.textContent.trim();
        
        if (side1 && input1.value.trim() !== '') {
            exchange();
        } else if (input2.value.trim() !== '') {

            exchanged();
        }
        else {
            updateRates();
        }
        

    })
});
btnsLeft.forEach(btn => {
    btn.addEventListener('click', (e) => {
        btnsLeft.forEach(b => {

            b.style.backgroundColor = '';
            b.style.color = ''

        });
        e.target.style.backgroundColor = '#833AE0';
        e.target.style.color = '#fff';
        selectedLeftCurrency = e.target.textContent.trim();
        

        if (side2 && input2.value.trim() !== '') {
            exchanged();
        } else if (input1.value.trim() !== '') {

            exchange();
        }
        else {
            updateRates();
        }
       

    })
});
runEventListeners();
function runEventListeners() {
    let allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.', ',', 'Backspace', 'Delete'];
    [input1, input2].forEach(input => {
        input.addEventListener('keydown', (e) => {
            if (!allowedKeys.includes(e.key)) {
                e.preventDefault();
            }
        })
    })
    input1.addEventListener('input', () => {

        setTimeout(() => {
            input1.value = input1.value.replace(',', '.');
            side1 = true;
            side2 = false;
            exchange();
        }, 450);

    });
    input2.addEventListener('input', () => {

        setTimeout(() => {
            input2.value = input2.value.replace(',', '.');
            side2 = true;
            side1 = false;
            exchanged();
        }, 450)

    });
}

function exchange() {
    let value = input1.value.trim();

    if (value === '') {
        input2.value = '';
        return;
    } 
    let amount1 = Number(value);
    if (isNaN(amount1)) return;
    if (selectedLeftCurrency === selectedRightCurrency) {
        input2.value = amount1;
        rateLeft.textContent = `1 ${selectedLeftCurrency} = 1 ${selectedRightCurrency}`;
        rateRight.textContent = `1 ${selectedRightCurrency} = 1 ${selectedLeftCurrency}`;
        return;
    }
    ratesLeft(amount1);


}
function ratesLeft(amount1){
    currency.exchange(amount1, selectedLeftCurrency, selectedRightCurrency)
    .then(result => {
        input2.value = result.toFixed(5);
    });
currency.exchange(1, selectedLeftCurrency, selectedRightCurrency)
    .then(rate => {
        rateLeft.textContent = `1 ${selectedLeftCurrency} = ${rate.toFixed(5)} ${selectedRightCurrency}`;
        rateRight.textContent = `1 ${selectedRightCurrency} = ${(1 / rate).toFixed(5)} ${selectedLeftCurrency}`;
    });
}
function ratesRight(amount2){
    currency.exchange(amount2, selectedRightCurrency, selectedLeftCurrency)
    .then(result => {
        input1.value = result.toFixed(5);
    })
currency.exchange(1, selectedRightCurrency, selectedLeftCurrency)
    .then(rate => {
        rateRight.textContent = `1 ${selectedRightCurrency} = ${rate.toFixed(5)} ${selectedLeftCurrency}`;
        rateLeft.textContent = `1 ${selectedLeftCurrency} = ${(1 / rate).toFixed(5)} ${selectedRightCurrency}`;
    })
}
function updateRates(){
    
    currency.exchange(1, selectedLeftCurrency, selectedRightCurrency)
    .then(rate => {
        rateLeft.textContent = `1 ${selectedLeftCurrency} = ${rate.toFixed(5)} ${selectedRightCurrency}`;
        rateRight.textContent = `1 ${selectedRightCurrency} = ${(1 / rate).toFixed(5)} ${selectedLeftCurrency}`;
    });
}
function exchanged() {
    let value = input2.value.trim();
    if (value === '') {
        input1.value = '';
        return;
    }
    let amount2 = Number(value);
    

    if (isNaN(amount2)) return;
    if (selectedLeftCurrency === selectedRightCurrency) {
        input1.value = amount2;
        rateRight.textContent = `1 ${selectedRightCurrency} = 1 ${selectedLeftCurrency}`;
        rateLeft.textContent = `1 ${selectedLeftCurrency} = 1 ${selectedRightCurrency}`;
        return;
    }
    ratesRight(amount2);
  

}
function checkNetworkStatus() {
    const statusBar = document.querySelector(".network-status");

    function updateStatus() {
        if (!navigator.onLine) {
            statusBar.style.display = "block";
        } else {
            statusBar.style.display = "none";
            if (side1 && input1.value.trim() !== '') {
                exchange();
            } else if (side2 && input2.value.trim() !== '') {
                exchanged();
            } else {
                updateRates();
            }
        }
    }

    window.addEventListener('online', updateStatus);
    window.addEventListener('offline', updateStatus);
    updateStatus();
}


checkNetworkStatus();
// ratesRight(1);
// ratesLeft(1);
updateRates();