console.log("Smart Expense Tracker started!");


// =========================
// GET HTML ELEMENTS
// =========================

const personName =
    document.getElementById("personName");

const expenseName =
    document.getElementById("expenseName");

const amount =
    document.getElementById("amount");

const category =
    document.getElementById("category");

const date =
    document.getElementById("date");

const addExpense =
    document.getElementById("addExpense");

const expenseList =
    document.getElementById("expenseList");

const searchExpense =
    document.getElementById("searchExpense");

const searchButton =
    document.getElementById("searchButton");

const individualTotals =
    document.getElementById("individualTotals");

const clearAllButton =
    document.getElementById("clearAll");

const totalAmount =
    document.getElementById("totalAmount");

const dashboardTotal =
    document.getElementById("dashboardTotal");

const totalPeople =
    document.getElementById("totalPeople");

const totalTransactions =
    document.getElementById("totalTransactions");

const totalCategories =
    document.getElementById("totalCategories");

const categoryTotalsList =
    document.getElementById("categoryTotalsList");

const expenseChart =
    document.getElementById("expenseChart");


let expenses = [];

let editingExpenseId = null;

let currentSearch = "";


// =========================
// LOAD EXPENSES
// =========================

function loadExpenses() {

    const savedExpenses =
        localStorage.getItem("smartExpenses");

    if (savedExpenses) {

        expenses = JSON.parse(savedExpenses);

    }

}


// =========================
// SAVE EXPENSES
// =========================

function saveExpenses() {

    localStorage.setItem(
        "smartExpenses",
        JSON.stringify(expenses)
    );

}


// =========================
// CLEAR FORM
// =========================

function clearForm() {

    personName.value = "";

    expenseName.value = "";

    amount.value = "";

    category.value = "";

    date.value = "";

}


// =========================
// ADD / UPDATE EXPENSE
// =========================

addExpense.addEventListener(
    "click",
    function () {

        if (personName.value.trim() === "") {

            alert("Please enter person name.");

            return;

        }


        if (expenseName.value.trim() === "") {

            alert("Please enter expense name.");

            return;

        }


        if (amount.value === "") {

            alert("Please enter amount.");

            return;

        }


        if (Number(amount.value) <= 0) {

            alert("Amount must be greater than 0.");

            return;

        }


        if (category.value === "") {

            alert("Please select category.");

            return;

        }


        if (date.value === "") {

            alert("Please select date.");

            return;

        }


        // =========================
        // UPDATE
        // =========================

        if (editingExpenseId !== null) {

            const expense =
                expenses.find(
                    function (item) {

                        return (
                            item.id ===
                            editingExpenseId
                        );

                    }
                );


            if (expense) {

                expense.person =
                    personName.value.trim();

                expense.name =
                    expenseName.value.trim();

                expense.amount =
                    Number(amount.value);

                expense.category =
                    category.value;

                expense.date =
                    date.value;

            }


            editingExpenseId = null;

            addExpense.textContent =
                "Add Expense";

            saveExpenses();

            clearForm();

            renderExpenses();

            return;

        }


        // =========================
        // CREATE NEW
        // =========================

        const newExpense = {

            id: Date.now(),

            person:
                personName.value.trim(),

            name:
                expenseName.value.trim(),

            amount:
                Number(amount.value),

            category:
                category.value,

            date:
                date.value

        };


        expenses.push(newExpense);

        saveExpenses();

        clearForm();

        renderExpenses();

    }
);


// =========================
// SEARCH
// =========================

function performSearch() {

    currentSearch =
        searchExpense.value
            .trim()
            .toLowerCase();

    renderExpenses();

}


searchButton.addEventListener(
    "click",
    performSearch
);


searchExpense.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Enter") {

            performSearch();

        }

    }
);


// =========================
// DISPLAY EXPENSES
// =========================

function renderExpenses() {

    expenseList.innerHTML = "";

    let displayedExpenses = expenses;


    // =========================
    // FILTER SEARCH
    // =========================

    if (currentSearch !== "") {

        displayedExpenses =
            expenses.filter(
                function (expense) {

                    const person =
                        String(
                            expense.person || ""
                        ).toLowerCase();


                    const name =
                        String(
                            expense.name || ""
                        ).toLowerCase();


                    const expenseCategory =
                        String(
                            expense.category || ""
                        ).toLowerCase();


                    const expenseDate =
                        String(
                            expense.date || ""
                        ).toLowerCase();


                    return (

                        person.includes(
                            currentSearch
                        )

                        ||

                        name.includes(
                            currentSearch
                        )

                        ||

                        expenseCategory.includes(
                            currentSearch
                        )

                        ||

                        expenseDate.includes(
                            currentSearch
                        )

                    );

                }
            );

    }


    // =========================
    // EMPTY STATE
    // =========================

    if (displayedExpenses.length === 0) {

        if (currentSearch !== "") {

            expenseList.innerHTML = `

                <div class="empty-state">

                    <strong>
                        No matching expenses
                    </strong>

                    Try a different search.

                </div>

            `;

        }

        else {

            expenseList.innerHTML = `

                <div class="empty-state">

                    <strong>
                        No expenses yet
                    </strong>

                    Add your first expense
                    to start tracking.

                </div>

            `;

        }

    }


    // =========================
    // DISPLAY CARDS
    // =========================

    displayedExpenses.forEach(
        function (expense) {

            expenseList.innerHTML += `

                <div
                    class="expense-card"
                    data-id="${expense.id}"
                >

                    <div>

                        <strong>
                            Person:
                        </strong>

                        <span>
                            ${expense.person}
                        </span>

                    </div>


                    <div>

                        <strong>
                            Expense:
                        </strong>

                        <span>
                            ${expense.name}
                        </span>

                    </div>


                    <div>

                        <strong>
                            Amount:
                        </strong>

                        <span>
                            &#8377;${expense.amount}
                        </span>

                    </div>


                    <div>

                        <strong>
                            Category & Date:
                        </strong>

                        <span>
                            ${expense.category}
                            |
                            ${expense.date}
                        </span>

                    </div>


                    <button
                        class="edit-button"
                        data-id="${expense.id}"
                    >
                        Edit
                    </button>


                    <button
                        class="delete-button"
                        data-id="${expense.id}"
                    >
                        Delete
                    </button>

                </div>

            `;

        }
    );


    updateOverallTotal();

    updateIndividualTotals();

    updateDashboard();

    updateCategoryTotals();

    updateExpenseChart();

}


// =========================
// OVERALL TOTAL
// =========================

function updateOverallTotal() {

    let total = 0;


    expenses.forEach(
        function (expense) {

            total +=
                Number(expense.amount);

        }
    );


    totalAmount.textContent = total;

}


// =========================
// INDIVIDUAL TOTALS
// =========================

function updateIndividualTotals() {

    const totals = {};


    expenses.forEach(
        function (expense) {

            const person =
                String(
                    expense.person || "Unknown"
                );


            if (totals[person]) {

                totals[person] +=
                    Number(expense.amount);

            }

            else {

                totals[person] =
                    Number(expense.amount);

            }

        }
    );


    individualTotals.innerHTML = "";


    if (Object.keys(totals).length === 0) {

        individualTotals.innerHTML = `

            <div class="empty-state">

                No individual totals available yet.

            </div>

        `;

        return;

    }


    for (const person in totals) {

        individualTotals.innerHTML += `

            <p>

                <strong>
                    ${person}:
                </strong>

                &#8377;${totals[person]}

            </p>

        `;

    }

}


// =========================
// DASHBOARD
// =========================

function updateDashboard() {

    let total = 0;

    const people = new Set();

    const categories = new Set();


    expenses.forEach(
        function (expense) {

            total +=
                Number(expense.amount);


            people.add(
                String(
                    expense.person || "Unknown"
                )
            );


            categories.add(
                String(
                    expense.category || "Other"
                )
            );

        }
    );


    dashboardTotal.textContent =
        total;

    totalPeople.textContent =
        people.size;

    totalTransactions.textContent =
        expenses.length;

    totalCategories.textContent =
        categories.size;

}


// =========================
// CATEGORY TOTALS
// =========================

function updateCategoryTotals() {

    const totals = {};


    expenses.forEach(
        function (expense) {

            const categoryName =
                String(
                    expense.category || "Other"
                );


            if (totals[categoryName]) {

                totals[categoryName] +=
                    Number(expense.amount);

            }

            else {

                totals[categoryName] =
                    Number(expense.amount);

            }

        }
    );


    categoryTotalsList.innerHTML = "";


    if (Object.keys(totals).length === 0) {

        categoryTotalsList.innerHTML = `

            <div class="empty-state">

                No category data available yet.

            </div>

        `;

        return;

    }


    for (const categoryName in totals) {

        categoryTotalsList.innerHTML += `

            <p>

                <strong>
                    ${categoryName}:
                </strong>

                &#8377;${totals[categoryName]}

            </p>

        `;

    }

}


// =========================
// PIE CHART
// =========================

function updateExpenseChart() {

    if (expenses.length === 0) {

        expenseChart.innerHTML = `

            <div class="empty-state">

                No expense data available for the chart.

            </div>

        `;

        return;

    }


    const totals = {};


    expenses.forEach(
        function (expense) {

            const categoryName =
                String(
                    expense.category || "Other"
                );


            if (totals[categoryName]) {

                totals[categoryName] +=
                    Number(expense.amount);

            }

            else {

                totals[categoryName] =
                    Number(expense.amount);

            }

        }
    );


    const categories =
        Object.keys(totals);

    const values =
        Object.values(totals);


    const total =
        values.reduce(
            function (sum, value) {

                return sum + value;

            },
            0
        );


    let currentAngle = 0;

    const sections = [];


    categories.forEach(
        function (categoryName, index) {

            const percentage =
                (values[index] / total) * 100;


            const startAngle =
                currentAngle;


            const endAngle =
                currentAngle + percentage;


            sections.push(
                `${getChartColor(index)}
                ${startAngle}% ${endAngle}%`
            );


            currentAngle =
                endAngle;

        }
    );


    expenseChart.innerHTML = `

        <div
            style="
                display:flex;
                flex-wrap:wrap;
                justify-content:center;
                align-items:center;
                gap:40px;
                width:100%;
            "
        >

            <div
                style="
                    width:250px;
                    height:250px;
                    border-radius:50%;
                    background:conic-gradient(
                        ${sections.join(",")}
                    );
                    box-shadow:
                        0 8px 25px
                        rgba(15,23,42,0.12);
                "
            ></div>


            <div
                style="
                    min-width:240px;
                "
            >

                ${categories.map(
                    function (categoryName, index) {

                        const percentage =
                            (
                                values[index] /
                                total
                            ) * 100;


                        return `

                            <div
                                style="
                                    display:flex;
                                    align-items:center;
                                    margin:14px 0;
                                    color:#475569;
                                "
                            >

                                <span
                                    style="
                                        width:15px;
                                        height:15px;
                                        border-radius:4px;
                                        background:
                                            ${getChartColor(index)};
                                        display:inline-block;
                                        margin-right:10px;
                                    "
                                ></span>


                                <strong>
                                    ${categoryName}
                                </strong>


                                <span
                                    style="
                                        margin-left:8px;
                                    "
                                >
                                    ₹${values[index]}
                                    (${percentage.toFixed(1)}%)
                                </span>

                            </div>

                        `;

                    }
                ).join("")}

            </div>

        </div>

    `;

}


// =========================
// CHART COLORS
// =========================

function getChartColor(index) {

    const colors = [

        "#2563eb",

        "#16a34a",

        "#f59e0b",

        "#dc2626",

        "#9333ea",

        "#0891b2",

        "#db2777",

        "#65a30d"

    ];


    return colors[
        index % colors.length
    ];

}


// =========================
// EDIT & DELETE
// =========================

expenseList.addEventListener(
    "click",
    function (event) {


        // =========================
        // DELETE
        // =========================

        if (
            event.target.classList.contains(
                "delete-button"
            )
        ) {

            const id =
                Number(
                    event.target.dataset.id
                );


            if (
                !confirm(
                    "Delete this expense?"
                )
            ) {

                return;

            }


            expenses =
                expenses.filter(
                    function (expense) {

                        return (
                            expense.id !== id
                        );

                    }
                );


            saveExpenses();

            renderExpenses();

        }


        // =========================
        // EDIT
        // =========================

        if (
            event.target.classList.contains(
                "edit-button"
            )
        ) {

            const id =
                Number(
                    event.target.dataset.id
                );


            const expense =
                expenses.find(
                    function (item) {

                        return (
                            item.id === id
                        );

                    }
                );


            if (!expense) {

                return;

            }


            personName.value =
                expense.person;

            expenseName.value =
                expense.name;

            amount.value =
                expense.amount;

            category.value =
                expense.category;

            date.value =
                expense.date;


            editingExpenseId =
                expense.id;


            addExpense.textContent =
                "Update Expense";


            window.scrollTo(
                0,
                0
            );

        }

    }
);


// =========================
// CLEAR ALL
// =========================

clearAllButton.addEventListener(
    "click",
    function () {

        if (expenses.length === 0) {

            alert(
                "There are no expenses to clear."
            );

            return;

        }


        if (
            !confirm(
                "Are you sure you want to delete all expenses?"
            )
        ) {

            return;

        }


        expenses = [];

        saveExpenses();

        clearForm();

        editingExpenseId = null;

        addExpense.textContent =
            "Add Expense";

        currentSearch = "";

        searchExpense.value = "";

        renderExpenses();

    }
);


// =========================
// START APPLICATION
// =========================

loadExpenses();

renderExpenses();