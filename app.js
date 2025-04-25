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
        this.url = "https://api.freecurrencyapi.com/v1/latest?apikey=fca_live_Nln7gxLTgFfzNS35H1lU3XlhnhS2t5UxkXnFMTfs&base_currency=";
    }
    async exchange(amount, firstCurrency, secondCurrency) {
        const response = await fetch(`${this.url}${firstCurrency}`);
        const result = await response.json();
        return amount * result.data[secondCurrency]
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


    })
});
runEventListeners();
function runEventListeners() {
    let allowedKeys = ['0','1','2','3','4','5','6','7','8','9','.',',','Backspace','Delete'];
    [input1, input2].forEach(input=>{
        input.addEventListener('keydown',(e)=>{
            if(!allowedKeys.includes(e.key)){
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
        },450)

    });
}

function exchange() {


    let amount1 = Number(input1.value.trim());
    if (isNaN(amount1)) return;
    if (selectedLeftCurrency === selectedRightCurrency) {
        input2.value = amount1;
        rateLeft.textContent = `1 ${selectedLeftCurrency} = 1 ${selectedRightCurrency}`;
        rateRight.textContent = `1 ${selectedRightCurrency} = 1 ${selectedLeftCurrency}`;
        return;
    }
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
function exchanged() {


    let amount2 = Number(input2.value.trim());
    if (isNaN(amount2)) return;
    if (selectedLeftCurrency === selectedRightCurrency) {
        input1.value = amount2;
        rateRight.textContent = `1 ${selectedRightCurrency} = 1 ${selectedLeftCurrency}`;
        rateLeft.textContent = `1 ${selectedLeftCurrency} = 1 ${selectedRightCurrency}`;
        return;
    }

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