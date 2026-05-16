document.addEventListener("DOMContentLoaded", () => {
    let result = 0;
    let reasons = [];
    const resultText = document.getElementById("result");
    const checkbox1 = document.getElementById("option1");
    const checkbox2 = document.getElementById("option2");
    const checkbox3 = document.getElementById("option3");
    const inputText = document.getElementById("checker");

    function checkText(value) {
        const scripts = ["Cyrillic", "Greek", "Arabic", "Hebrew"];
        for (const script of scripts) {
            const regex = new RegExp(`\\p{Script=${script}}`, "u");
            if (regex.test(value)) return true; // also fix: value not str
        }
        return false;
    }


    function updateResult() {
        if (result > 20) {
            resultText.textContent = "VERY VERY fishy";
        } else if (result > 10) {
            resultText.textContent = "Medium fishy";
        } else if (result > 0){
            resultText.textContent = "a lil fishy";
        } else {
            resultText.textContent = "";
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

    inputText.addEventListener("input", () => {
        const hasForeign = checkText(inputText.value);
        
        if (hasForeign){
            result += 10;
            reasons[9] = "Text contains foreign letters! Beware!!!";
        } else {
            reasons[9] = "";
        }

        result = 0;
        if (checkbox1.checked) result += 10;
        if (checkbox2.checked) result += 10;
        if (checkbox3.checked) result += 10;
        if (hasForeign) result += 10;

        updateResult();
        
    })

    checkbox1.addEventListener("change", () =>{
        if (checkbox1.checked) {
            result += 10;
            reasons[0] = "If the sender is sus then might be phishing.";
        } else {
            result -= 10;
            reasons[0] = "";
        }
        updateResult();
    })


    checkbox2.addEventListener("change", () =>{
        if (checkbox2.checked) {
            result += 10;
            reasons[1] = "Free cheese only in the mouse catcher.";
        } else {
            result -= 10;
            reasons[1] = "";
        }
        updateResult();
    })


    checkbox3.addEventListener("change", () =>{
        if (checkbox3.checked) {
            result += 10;
            reasons[2] = "PRESSING BUTTONS OR LINKS IS DANGEROUS!!";
        } else {
            result -= 10;
            reasons[2] = "";
        }
        updateResult();
    })

})