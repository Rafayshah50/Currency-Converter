document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('form');
    const amountInput = document.querySelector('.amount input');
    const fromSelect = document.querySelector('.From select');
    const toSelect = document.querySelector('.To select');
    const msgDiv = document.querySelector('.msg');
    const fromFlag = document.querySelector('.From img');
    const toFlag = document.querySelector('.To img');

    // Generate the options for both selects based on the countryList
    function populateCurrencyOptions() {
        for (const currencyCode in countryList) {
            const option = document.createElement('option');
            option.value = currencyCode;
            option.textContent = currencyCode;
            
            // cloneNode will copy the option's attribute and id so it is identical meaning it can thousands of copies of the orignal option with same CSS
            fromSelect.appendChild(option.cloneNode(true));
            toSelect.appendChild(option);
        }
    }

    populateCurrencyOptions();

    // Function to update the flag when a currency is selected dynamically
    function updateFlag(selectElement, flagElement) {
        const currencyCode = selectElement.value;
        const countryCode = countryList[currencyCode];
        flagElement.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
    }

    // Update flags initially it means it will shows the pre selected flags
    updateFlag(fromSelect, fromFlag);
    updateFlag(toSelect, toFlag);

    // Add event listeners to update flags when the selected currency changes
    fromSelect.addEventListener('change', function () {
        updateFlag(fromSelect, fromFlag);
    });

    toSelect.addEventListener('change', function () {
        updateFlag(toSelect, toFlag);
    });

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        const amount = parseFloat(amountInput.value);
        const fromCurrency = fromSelect.value;
        const toCurrency = toSelect.value;


        //NaN checks the number typed by the user is number or not
        if (isNaN(amount) || amount <= 0) {
            msgDiv.textContent = 'Please enter a valid amount.';
            return;
        }

        // Fetch the exchange rate from a currency converter API
        fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`)// This API will fetch us the data of the currency selected by the user as his first currency and the second currency is his desired currency to be change

            //Here in first promise I am retrieving the response and converting in javscript objects then in second I am using the objects by the Data parameter.
            .then(response => response.json())
            .then(data => {
                //Getting the rate of the currency user wants to change
                const rate = data.rates[toCurrency];
                if (!rate) {
                    msgDiv.textContent = 'Currency not found.';
                    return;
                }
                //Final converted amount after multiplying the rate of the currency selected by the user and multiplying it to the amount typed by the user
                const convertedAmount = (amount * rate).toFixed(2);
                msgDiv.textContent = `${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}`;
            })
            //Catching the error if it arises from the API
            .catch(error => {
                console.error('Error fetching the exchange rate:', error);
                msgDiv.textContent = 'Error fetching the exchange rate.';
            });
    });
});
