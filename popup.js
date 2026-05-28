const categories = {
  email: {
    checkboxes: [
    { id: "email_option1", weight: 10, reason: "Legitimate senders always sign with the name that appears in their email address. A mismatch is a common tactic used to impersonate trusted contacts." },
    { id: "email_option2", weight: 10, reason: "Phishing emails create a false sense of urgency to pressure you into acting before you think critically. Legitimate organisations rarely demand immediate action." },
    { id: "email_option3", weight: 15, reason: "If the domain in the sender's email doesn't match the organisation's official website, the email is almost certainly fraudulent." },
    { id: "email_option4", weight: 10, reason: "Generic or strange greetings (e.g. 'Dear Customer' or 'Hello Friend') suggest the sender does not actually know who you are - a hallmark of mass phishing attempts." },
    { id: "email_option5", weight: 10, reason: "Poor grammar, typos, and awkward phrasing are common in phishing emails, often because they are written hastily or translated from another language." },
    { id: "email_option6", weight: 20, reason: "The visible link text can say anything - the real destination URL is what matters. Hovering reveals where you would actually be sent, which in phishing emails is often a fake or malicious site." },
    ],
    textInput: { id: "email_checker", weight: 10, reason: "Contains mixed script characters!" },
    resultId: "email_result",
    reasonListId: "email_reasonList",
  },
  text: {
    checkboxes: [
    { id: "text_option1", weight: 10, reason: "If the SMS appears to come from an organisation you have never interacted with, there is no legitimate reason for them to contact you." },
    { id: "text_option2", weight: 10, reason: "Legitimate messages from a company typically appear in the same thread as previous messages. A separate, standalone message is a common sign of spoofing." },
    { id: "text_option3", weight: 10, reason: "Poor grammar and typos suggest the message was written hastily or by an automated tool - a common trait of phishing SMS campaigns." },
    { id: "text_option4", weight: 15, reason: "Unsolicited links in SMS messages are one of the most common phishing vectors. Legitimate organisations rarely ask you to act via a link in a text." },
    { id: "text_option5", weight: 15, reason: "Extra characters or misspellings in a link (e.g. 'paypa1.com' instead of 'paypal.com') are used to trick you into visiting a fake site that looks legitimate." },
    { id: "text_option6", weight: 20, reason: "If the domain or extension in the SMS link does not match the organisation's real website, the link is fraudulent regardless of how legitimate the message looks." },
    { id: "text_option7", weight: 20, reason: "Spam and phishing detection tools can flag suspicious content in the message text. An error or warning is a strong indicator the message is not safe." },
    { id: "text_option8", weight: 15, reason: "Scammers sometimes compromise or impersonate known contacts. An unusual writing style from a familiar number may mean someone else is sending the message." },
    ],
    textInput: { id: "text_checker", weight: 10, reason: "Contains foreign-script characters!" }, 
    resultId: "text_result",
    reasonListId: "text_reasonList",
  },
  call: {
    checkboxes: [
      { id: "call_option1", weight: 10, reason: "Unknown caller number." },
      { id: "call_option2", weight: 10, reason: "Unknown caller number." },
      { id: "call_option3", weight: 10, reason: "Unknown caller number." },
      
    ],
    textInput: null, // no text input
    resultId: "call_result",
    reasonListId: "call_reasonList",
  }
};



document.addEventListener("DOMContentLoaded", () => {

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

    //checks if the text contains mixed letters/symbols
    function checkText(value) {
        const scripts = ["Latin", "Cyrillic", "Greek", "Arabic", "Hebrew"];
        const found = scripts.filter(script => 
            new RegExp(`\\p{Script=${script}}`, "u").test(value)
        );
        return found.length > 1;
        }

    //recalculates the numeric result
    function calcScore(config) {
        let score = 0;
        for (const checkbox of config.checkboxes) {
            if (document.getElementById(checkbox.id).checked) score += checkbox.weight;
        }
        if (config.textInput) {
            if (checkText(document.getElementById(config.textInput.id).value)) {
                score += config.textInput.weight;
            }
        }
        return score;
    }

    function getReasons(config) {
        const reasons = [];
        for (const cb of config.checkboxes) {
            if (document.getElementById(cb.id).checked) reasons.push(cb.reason);
        }
        if (config.textInput) {
            if (checkText(document.getElementById(config.textInput.id).value)) {
            reasons.push(config.textInput.reason);
            }
        }
        return reasons;
    }

    function updateResult(config) {
        const score = calcScore(config);
        const reasons = getReasons(config);
        let max_score = 0;
        for (let cb of config.checkboxes){
            max_score += cb.weight;
        }
        if (config.textInput) { max_score += config.textInput.weight; }

        const resultEl = document.getElementById(config.resultId);
        if (score > max_score*(2/3)) resultEl.textContent = "High risk - there are many serious signs of phishing. It is better to report and block, not engage.";
        else if (score > max_score*(1/3)) resultEl.textContent = "Medium risk - there are multiple signs of phishing! It is better to not engage.";
        else if (score > 0) resultEl.textContent = "Small risk - there are a few signs of phishing. Procede with caution.";
        else resultEl.textContent = "There are no signs of phishing!";

        const list = document.getElementById(config.reasonListId);
        list.innerHTML = "";
        reasons.forEach(r => {
            const li = document.createElement("li");
            li.textContent = r;
            list.appendChild(li);
        });
    }

    function setupTab(config) {
        for (const cb of config.checkboxes) {
            document.getElementById(cb.id).addEventListener("change", () => updateResult(config));
        }
        if (config.textInput) {
            document.getElementById(config.textInput.id).addEventListener("input", () => updateResult(config));
        }
    }

    Object.values(categories).forEach(setupTab);
})