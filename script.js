let storedNumber = null;
let currentNumber = null;
let operation = null;
let storedOperation = null;

let afterOperationNumber = false;
let afterOperationOperation = false;
let afterEqual = false;


const noButtons = document.querySelectorAll("button[data-type='number']");
const opButtons = document.querySelectorAll("button[data-type='operation']");
const input = document.querySelector(".calc__input");
const deleteLastButton = document.querySelector(".calc__button--del");
const memory = document.querySelector(".calc__memory");
const equalButton = document.querySelector("button[data-type='equal']");

// -------------------------------
// Click a Number Function
// -------------------------------
const clickNumber = (value) => {
    if (
        (value === "." && input.value.includes(".")) ||
        (value === "0" && input.value === "0")
    ) {
        return;
    } else if (input.value === "0" && value != "." || afterOperationNumber) {
        input.value = value;
        afterOperationNumber = false;
    } else if (afterEqual) {
        input.value = value;
        memory.textContent = "";
        storedNumber = null;
        afterEqual = false;
    } else {
        input.value += value;
    }
    currentNumber = parseFloat(input.value);
};

noButtons.forEach((button) => {
    button.addEventListener("click", () => clickNumber(button.dataset.value));
});

// -------------------------------
// Delete Last Number Function
// -------------------------------

const deleteLastNo = () => {
    if (afterEqual) {
        clearAll();
    } else {
        if (input.value.length > 1) {
            input.value = input.value.slice(0, -1);
        } else {
            input.value = "0";
        }
    }
};

deleteLastButton.addEventListener("click", deleteLastNo);

// -------------------------------

// -------------------------------
// Operation Buttons Click Function
// -------------------------------

const clickOperation = (newOperation) => {
    storedOperation = operation;
    if (!afterOperationNumber) {
        if (afterOperationOperation) {
            operation =
                storedOperation !== newOperation
                    ? storedOperation
                    : newOperation;
            getResult();
        }

        operation = newOperation;
        storedNumber = parseFloat(input.value);

        afterOperationNumber = true;
        afterOperationOperation = true;
        addToMemory(storedNumber, operation);
    } else {
        addToMemory(storedNumber, operation);
    }
};

const addToMemory = (storedNumber, operation, currentNumber) => {
    memory.textContent = `${storedNumber} ${operation} ${
        currentNumber ? `${currentNumber} =` : ""
    }`;
};

opButtons.forEach((button) => {
    button.addEventListener("click", () =>
        clickOperation(button.dataset.value)
    );
});

// -------------------------------

// -------------------------------
// Equal Function
// -------------------------------

const getResult = () => {
    if (storedNumber === null || operation === null) return;
    if (!afterEqual) {
        currentNumber = parseFloat(input.value);
    }

    let result;
    switch (operation) {
        case "+":
            result = storedNumber + currentNumber;
            break;
        case "-":
            result = storedNumber - currentNumber;
            break;
        case "*":
            result = storedNumber * currentNumber;
            break;
        case "%":
            result = storedNumber % currentNumber;
            break;
        case "/":
            if (currentNumber == 0) {
                result = "";
                return;
            }
            result = storedNumber / currentNumber;
            break;
        default:
            return;
    }

    input.value = result;
    addToMemory(storedNumber, operation, currentNumber);
    storedNumber = parseFloat(input.value);
    if (afterOperationOperation) {
        afterOperationOperation = false;
    }
};

equalButton.addEventListener("click", () => {
    getResult();
    afterEqual = true;
});

// -------------------------------

// -------------------------------
// Clear All Function
// -------------------------------

const clearAll = () => {
    storedNumber = null;
    currentNumber = null;
    operation = null;
    input.value = 0;
    memory.textContent = "";
    afterEqual = false;
};

document
    .querySelector("button[data-type='clear']")
    .addEventListener("click", () => clearAll());
// -------------------------------

// -------------------------------
// Clear Entry Function
// -------------------------------
const clear = () => {
    if (afterEqual) {
        clearAll();
    } else {
        input.value = 0;
    }
};

document
    .querySelector("button[data-type='clear-entry']")
    .addEventListener("click", () => clear());
// -------------------------------

// -------------------------------
// Keyboard Accessibility
// -------------------------------

document.addEventListener("keydown", (event) => {
    const key = event.key;
    document.querySelector(`button[data-value="${key}"]`).click();
    document.querySelector(`button[data-value="${key}"]`).focus();
});
