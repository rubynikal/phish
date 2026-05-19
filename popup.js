document.addEventListener("DOMContentLoaded", () => {
    let result = 0;
    let reasons = [];
    const email_resultText = document.getElementById("email_result");
    const email_checkbox1 = document.getElementById("email_option1");
    const email_checkbox2 = document.getElementById("email_option2");
    const email_checkbox3 = document.getElementById("email_option3");
    const email_inputText = document.getElementById("email_checker");

    //tab handling
    document.querySelectorAll(".tablinks").forEach(button => {
        button.addEventListener("click", (evt) => {
            //remove all the tab content containers
            document.querySelectorAll(".tabcontent").forEach(tab => {
                tab.style.display = "none";
            });
            //make tab links appear inactive
            document.querySelectorAll(".tablinks").forEach(btn => {
                btn.classList.remove("active");
            });

            //show the current tab content and link as active
            const tabName = button.getAttribute("data-tab");
            document.getElementById(tabName).style.display = "block";
            evt.currentTarget.classList.add("active");
        });
    });

    //Email Tab Management
    //checks if the text contains any foreign letters/symbols
    function checkText(value) {
        const scripts = ["Cyrillic", "Greek", "Arabic", "Hebrew"];
        for (const script of scripts) {
            const regex = new RegExp(`\\p{Script=${script}}`, "u");
            if (regex.test(value)) return true; // also fix: value not str
        }
        return false;
    }

    //updates and displays final results
    function updateResult() {
        if (result > 20) {
            email_resultText.textContent = "VERY VERY fishy";
        } else if (result > 10) {
            email_resultText.textContent = "Medium fishy";
        } else if (result > 0){
            email_resultText.textContent = "a lil fishy";
        } else {
            email_resultText.textContent = "";
        }

        const list = document.getElementById("reasonList");
        list.innerHTML = ""; 
        reasons.forEach((item) => {
            if (item) { 
                let li = document.createElement("li");
                li.innerText = item;
                list.appendChild(li);
            }
        });
    }

    //recalculates the numeric result
    function recalcResult() {
        result = 0;
        if (email_checkbox1.checked) result += 10;
        if (email_checkbox2.checked) result += 10;
        if (email_checkbox3.checked) result += 10;
        if (checkText(email_inputText.value)) result += 10;
        updateResult();
    }
    //checkboxes
    email_checkbox1.addEventListener("change", () => {
        reasons[0] = email_checkbox1.checked ? "If the sender is sus then might be phishing." : "";
        recalcResult();
    });

    email_checkbox2.addEventListener("change", () => {
        reasons[1] = email_checkbox2.checked ? "Free cheese only in the mouse catcher." : "";
        recalcResult();
    });

    email_checkbox3.addEventListener("change", () => {
        reasons[2] = email_checkbox3.checked ? "PRESSING BUTTONS OR LINKS IS DANGEROUS!!" : "";
        recalcResult();
    });

    //sender/domain checker
    email_inputText.addEventListener("input", () => {
        const hasForeign = checkText(email_inputText.value);
        reasons[3] = hasForeign ? "Text contains foreign letters! Beware!!!" : "";
        recalcResult();
    });

    //

})