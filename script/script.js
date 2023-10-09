const customerDetailContainer = document.getElementsByClassName("customer-detail-container")[0];
const khataBookContainer = document.querySelector(".khata-book-container");
const customerName = document.getElementById("customer-name");
const customerLoanAmount = document.getElementById("customer-loan-amount");
const addCustomerButton = document.querySelector(".add-customer-button");

const balancePageContainer = document.querySelector(".balance-page-container");
const totalBalance = document.getElementById("total-balance");
const userName = document.querySelector(".customer-name");
const amountDebitButton = document.getElementById("loan-debit-button");
const amountCreditButton = document.getElementById("loan-credit-button");
const debitInputBox = document.querySelector(".debit-input-box");
const creditInputBox = document.querySelector(".credit-input-box");
const balanceDetailContainer = document.querySelector(".balance-section");
const backButton = document.querySelector(".back-button");
const transactionHistory = [];

let currentBalance = 0;
let index = 0;
let flag = "";
let currIndex = 0;

// ---------------------  DB --------------------
    function storeDataToDb(data) {
        localStorage.setItem('kathaBookDb', JSON.stringify(data));
    }

    function getDataToDb() {
        const dbData = localStorage.getItem('kathaBookDb');
        if(dbData) {
            showCustomerDetails(JSON.parse(dbData));
            return JSON.parse(dbData);
        }
        return [];
    }
// ---------------------  DB --------------------

const numbersOfCustomer = getDataToDb();

// ------------ Helper --------------------------

function addToDb(name, amount) {
    const customerDetail = {
            name: name.trim().toUpperCase(),
            amount: amount.trim(),
            id:new Date().getTime(),
    };
    numbersOfCustomer.push(customerDetail);
    storeDataToDb(numbersOfCustomer);
}

function updateDb(index, amount, isCredit) {
    const currentDue = Number(numbersOfCustomer[index].amount);
    numbersOfCustomer[index].amount = isCredit ? currentDue + amount : currentDue - amount;
    storeDataToDb(numbersOfCustomer); 
    getDataToDb();
}

// ------------ Helper --------------------------

// ------------------------- Khatabook Home Section --------------------------------
 
function showCustomerDetails(userData) {
    customerDetailContainer.innerHTML = `<div class="d-flex flex-row justify-content-between title">
                                            <span class="fs-4 fw-bolder text-start">S.No</span>
                                            <span class="fs-4 fw-bolder">Customer</span>
                                            <span class="fs-4 fw-bolder">Amount</span>
                                        </div>`
    for (let i = 0; i < userData.length; i++) {
    customerDetailContainer.innerHTML += `<div class="d-flex flex-column flex-md-row  justify-content-between align-items-center user-box rounded-3 mb-2" id="${userData[i].id}">
                                            <div class=" d-flex justify-content-between align-items-center display-box py-2 px-3 rounded-3">
                                                <span class="text-white fs-4 pe-2 fw-bolder ms-md-5">${i + 1}.</span>
                                                <h3 class="text-white text-start">${userData[i].name}</h3>
                                                <p class="text-white fs-3 fw-bolder mt-2 amount-diplay me-1"><i class="fa-solid fa-indian-rupee-sign fs-4 pe-2"></i>${userData[i].amount}</p>
                                            </div>
                                            <div class="d-flex justify-content-center align-items-center">
                                                <a href="#" class="update-amount-button" onclick="showBalancePage(${userData[i].id}, ${i})"><i class="fa-solid fa-pen-to-square text-white fs-2 pe-3"></i></a>
                                            </div>
                                        </div>`;
    }
    customerName.value = "";
    customerLoanAmount.value = ""
}

function customerData() {
    if(customerName.value.trim() !== "" && customerLoanAmount.value !== "" && customerLoanAmount.value !== "0") {
        addToDb(customerName.value, customerLoanAmount.value);
        showCustomerDetails(numbersOfCustomer); 
        return;
    }
    alert("Empty task");
}

function showBalancePage(id, i) {
    currIndex = i;
    const userInfo = numbersOfCustomer.find(data => data.id === id);
    balancePageContainer.setAttribute('data-userInfo', id);
    totalBalance.innerHTML = userInfo.amount;
    userName.innerHTML = userInfo.name;
    currentBalance = totalBalance.innerHTML;
    khataBookContainer.classList.add("hidden");
    balancePageContainer.classList.remove("hidden");    
}

customerLoanAmount.addEventListener('keyup', (e) => {
    if(e.key === "Enter" ) {
        customerData();
    }
})

addCustomerButton.addEventListener('click', () => {
    if (customerName.value === "") {
        alert("Please enter a name");
        return;
    } else if (customerLoanAmount.value === "") {
        alert("Please enter a valid amount");
        return;
    }
    customerData();
});
// ------------------------- Khatabook Home Section --------------------------------

//------------------------- Transaction History Section ----------------------------

function showBalanceHistory(flag) {
        if (flag === true) {
            balanceDetailContainer.innerHTML += `<div class="customer-details bg-white rounded-3 ps-2 pt-3 mt-3">
                                                    <div class="d-flex justify-content-between align-items-center">
                                                        <p class="fs-5 fw-semibold">Balance:<i class="fa-solid fa-indian-rupee-sign ps-2 pe-1"></i>${debitAmountAdd(index)}</p>
                                                        <p class=" fs-5 fw-semibold pe-2 you-gave">You gave:<i class="fa-solid fa-indian-rupee-sign ps-2 pe-1"></i>${transactionHistory[index].debitAmount}</p> 
                                                    </div>  
                                                </div>`;

            totalBalance.innerHTML = currentBalance;
            index++;
        } else if (flag === false) {
            balanceDetailContainer.innerHTML += `<div class="customer-details bg-white rounded-3 ps-2 pt-3 mt-3">
                                                    <div class=" d-flex justify-content-between align-items-center">
                                                        <p class="fs-5 fw-semibold">Balance:<i class="fa-solid fa-indian-rupee-sign ps-2 pe-1"></i>${creditAmountSubtract(index)}</p>
                                                        <p class="fs-5 fw-semibold pe-2 you-got">You got:<i class="fa-solid fa-indian-rupee-sign ps-2 pe-1"></i>${transactionHistory[index].creditAmount}</p> 
                                                    </div>
                                                </div>`;
            totalBalance.innerHTML = currentBalance;
            index++;
        }
}

function debitAmountAdd(index) {
    currentBalance = Number(currentBalance) + Number(transactionHistory[index].debitAmount);
    return currentBalance;
}

function creditAmountSubtract(index) {
    currentBalance = Number(currentBalance) - Number(transactionHistory[index].creditAmount);
    return currentBalance;
}

backButton.addEventListener('click', () => {
    khataBookContainer.classList.remove("hidden");
    balancePageContainer.classList.add("hidden");
});

amountDebitButton.addEventListener('click', () => {
    debitInputBox.classList.toggle("hidden");
});

amountCreditButton.addEventListener('click', () => {
    creditInputBox.classList.toggle("hidden");
});

debitInputBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        const balanceDetails = {
            debitAmount: debitInputBox.value
        }
        transactionHistory.push(balanceDetails);
        flag = true;
        updateDb(currIndex, Number(balanceDetails.debitAmount), true);
        showBalanceHistory(flag);
        debitInputBox.value = "";
        debitInputBox.classList.add("hidden");
    }
});

creditInputBox.addEventListener("keyup", (e) => {
    if (e.key === "Enter") {
        const balanceDetails = {
            creditAmount: creditInputBox.value
        }
        transactionHistory.push(balanceDetails);
        flag = false;
        updateDb(currIndex, Number(balanceDetails.creditAmount), false);
        showBalanceHistory(flag);
        creditInputBox.value = "";
        creditInputBox.classList.add("hidden");
    }
});

//------------------------- Transaction History Section ----------------------------





