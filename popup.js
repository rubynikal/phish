const categories = {
  email: {
    checkboxes: [
    { id: "email_option1", weight: 40, reason: "Legitimate senders always sign with the name that appears in their email address. A mismatch is a common tactic used to impersonate trusted contacts.", priority: false },
  { id: "email_option2", weight: 40, reason: "Phishing emails create a false sense of urgency to pressure you into acting before you think critically. Legitimate organisations rarely demand immediate action.", priority: false },
  { id: "email_option3", weight: 60, reason: "Threats such as 'your account will be deleted' or 'legal action will be taken' are pressure tactics designed to make you act out of fear rather than reason.", priority: true },
  { id: "email_option4", weight: 80, reason: "Promises of unexpected prizes, winnings, or easy money are a classic phishing lure. Legitimate organisations do not offer rewards out of nowhere.", priority: false },
  { id: "email_option5", weight: 50, reason: "A missing or empty 'To' field means the email was sent to a mass list rather than to you personally - a common sign of bulk phishing campaigns.", priority: false },
  { id: "email_option6", weight: 60, reason: "If the domain in the sender's email doesn't match the organisation's official website, the email is almost certainly fraudulent.", priority: false },
  { id: "email_option7", weight: 40, reason: "Generic or strange greetings (e.g. 'Dear Customer' or 'Hello Friend') suggest the sender does not actually know who you are - a hallmark of mass phishing attempts.", priority: false },
  { id: "email_option8", weight: 30, reason: "Poor grammar, typos, and awkward phrasing are common in phishing emails, often because they are written hastily or translated from another language.", priority: false },
  { id: "email_option9", weight: 70, reason: "The visible link text can say anything - the real destination URL is what matters. Hovering reveals where you would actually be sent, which in phishing emails is often a fake or malicious site.", priority: true },
    ],
    textInput: { id: "email_checker", reason: "Contains mixed script characters!" },
    resultId: "email_result",
    reasonListId: "email_reasonList",
  },
  text: {
    checkboxes: [
    { id: "text_option1", weight: 10, reason: "If the SMS appears to come from an organisation you have never interacted with, there is no legitimate reason for them to contact you.",  priority: false },
    { id: "text_option2", weight: 30, reason: "Legitimate messages from a company typically appear in the same thread as previous messages. A separate, standalone message is a common sign of spoofing.",  priority: false },
    { id: "text_option3", weight: 30, reason: "Poor grammar and typos suggest the message was written hastily or by an automated tool - a common trait of phishing SMS campaigns.",  priority: false },
    { id: "text_option4", weight: 20, reason: "Unsolicited links in SMS messages are one of the most common phishing vectors. Legitimate organisations rarely ask you to act via a link in a text.",  priority: false },
    { id: "text_option5", weight: 60, reason: "Extra characters or misspellings in a link (e.g. 'paypa1.com' instead of 'paypal.com') are used to trick you into visiting a fake site that looks legitimate.", priority: true },
    { id: "text_option6", weight: 70, reason: "If the domain or extension in the SMS link does not match the organisation's real website, the link is fraudulent regardless of how legitimate the message looks.",  priority: false }, 
    { id: "text_option7", weight: 40, reason: "Scammers sometimes compromise or impersonate known contacts. An unusual writing style from a familiar number may mean someone else is sending the message.", priority: false },
    ],
    textInput: { id: "text_checker", reason: "Contains foreign-script characters!" }, 
    resultId: "text_result",
    reasonListId: "text_reasonList",
  },
  call: {
    checkboxes: [
    { id: "call_option1", weight: 60, reason: "Legitimate government institutions always communicate in the official state language. A mismatch suggests the caller is not who they claim to be.",  priority: true },
    { id: "call_option2", weight: 80, reason: "Any real institution contacting you personally would have your basic details on file. Not knowing your name is a strong sign of a mass scam call.",  priority: true },
    { id: "call_option3", weight: 30, reason: "Scripted or incoherent language is common in automated or poorly prepared scam calls.",  priority: false },
    { id: "call_option4", weight: 10, reason: "Unexpected calls from foreign country codes you have no connection to are a common indicator of international scam operations.",  priority: false },
    { id: "call_option5", weight: 90, reason: "No legitimate institution will ever ask for your banking credentials, ID codes, card details, or SMS confirmation codes over the phone. This is almost certainly fraud.",  priority: true },
    { id: "call_option6", weight: 60, reason: "Scammers often pose as officials but only have publicly available information about you. A real institution would know specific details relevant to your case.",  priority: false },
    { id: "call_option7", weight: 80, reason: "Creating urgency is a manipulation tactic designed to stop you from thinking critically or consulting someone you trust before acting.",  priority: true },
    { id: "call_option8", weight: 90, reason: "The wangiri scam tricks you into calling back a premium-rate number. If a missed call seems suspicious, do not call back - look up the number first.",  priority: true },
    { id: "call_option9", weight: 80, reason: "Scammers sometimes record your voice to capture a 'yes' or other responses, which can then be used to authorise fraudulent transactions or impersonate you. If a caller stays silent, hang up immediately.",  priority: true },
    { id: "call_option10", weight: 90, reason: "Remote access software gives the caller full control of your device. No legitimate organisation will ever ask you to install such software or share your screen.",  priority: true },
    ],
    textInput: null, // no text input
    resultId: "call_result",
    reasonListId: "call_reasonList",
  }
};



document.addEventListener("DOMContentLoaded", () => {
    const bgColor = document.body;
    const green = "#84dcc6";
    const yellow = "#fdffb6";
    const orange = "#feab7a";
    const red = "#ff5c5c";

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

            const configMap = { Email: categories.email, Text: categories.text, Call: categories.call };
            if (configMap[tabName]) updateResult(configMap[tabName]);
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
        let priority_flag = false;
        for (const checkbox of config.checkboxes) {
            if (document.getElementById(checkbox.id).checked && checkbox.priority == true){
                priority_flag = true;
                break;
            }
            if (document.getElementById(checkbox.id).checked) score += checkbox.weight;
        }
        if (config.textInput) {
            const textField = document.getElementById(config.textInput.id);
            if (checkText(document.getElementById(config.textInput.id).value)) {
                textField.style.border = "2px solid #ff5c5c";
                priority_flag = true;
            } else {
                textField.style.border = "0.5px solid #e0ddd6";
            }
        }
        return [score,priority_flag];
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
        const [score, priority_flag] = calcScore(config);
        const reasons = getReasons(config);
        let max_score = 0;
        if (!priority_flag) {
            for (let cb of config.checkboxes){
                max_score += cb.weight;
            }
        }

        const resultEl = document.getElementById(config.resultId);
        if (priority_flag || score > max_score*(2/3)) {
            resultEl.textContent = "High risk - there are serious signs of phishing. It is better to report and block, not engage.";
            bgColor.style.background = red;
        }
        else if (score > max_score*(1/3)){
            resultEl.textContent = "Medium risk - there are multiple signs of phishing! It is better to not engage.";  
            bgColor.style.background = orange;
        } 
        else if (score > 0){
            resultEl.textContent = "Small risk - there are a few signs of phishing. Procede with caution.";
            bgColor.style.background = yellow;
        } 
        else {
            resultEl.textContent = "There are no signs of phishing!";
            bgColor.style.background = green;
        }

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