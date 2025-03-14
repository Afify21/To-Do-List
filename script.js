const inputbox = document.getElementById("input-box");
const listcontainer = document.getElementById("list-container");
const record = document.querySelector(".bxs-microphone"); // Microphone button

record.addEventListener("click", function () {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
        alert("Your browser does not support Speech Recognition.");
        return;
    }

    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = "en-US"; // English language
    recognition.interimResults = false; // Only final results

    recognition.start();

    recognition.onstart = function () {
        console.log("Voice recording started...");
    };

    recognition.onspeechend = function () {
        console.log("Voice recording stopped.");
        recognition.stop();
    };

    recognition.onresult = function (event) {
        const transcript = event.results[0][0].transcript.trim();
        if (transcript !== "") {
            AddTask(transcript); // Automatically add the task
        }
    };

    recognition.onerror = function (event) {
        console.error("Error in speech recognition: ", event.error);
    };
});

function AddTask(taskText = inputbox.value) {
    if (!taskText || taskText.trim() === '') {
        alert("You must write or say something!");
        return;
    }

    let li = document.createElement("li");
    li.textContent = taskText;

    li.addEventListener("click", function () {
        li.classList.toggle("checked");
        saveData();
    });

    let span = document.createElement("span");
    span.innerHTML = "\u00d7";
    span.addEventListener("click", function () {
        li.remove();
        saveData();
    });

    li.appendChild(span);
    listcontainer.appendChild(li);
    
    inputbox.value = ""; // Clear input after adding task
    saveData();
}

function saveData() {
    localStorage.setItem("data", listcontainer.innerHTML);
}

function showTask() {
    listcontainer.innerHTML = localStorage.getItem("data") || "";

    document.querySelectorAll("#list-container li").forEach(li => {
        li.addEventListener("click", function () {
            li.classList.toggle("checked");
            saveData();
        });
    });

    document.querySelectorAll("#list-container span").forEach(span => {
        span.addEventListener("click", function () {
            span.parentElement.remove();
            saveData();
        });
    });
}

showTask();
