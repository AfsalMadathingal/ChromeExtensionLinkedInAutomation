
// Variable to track if the "startFollow" logic should be executed
var startFollowEnabled = true;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var count = 0;
    var maxAttemptsReached = false; // Flag to track if maximum attempts reached
    
    // Check if extension has already been executed and when
    chrome.storage.local.get(['extensionExecuted', 'lastExecutionDate'], function(data) {
        var today = new Date().toLocaleDateString();
        var lastExecutionDate = data.lastExecutionDate;

        if (data.extensionExecuted && lastExecutionDate === today) {
            console.log("Extension has already been executed today. Skipping...");
            return; // Exit the content script if extension has already been executed today
        }

        if (message.action === "startFollow" && startFollowEnabled && !maxAttemptsReached) {

            alert('You have reached the maximum number of attempts for today. Please try again tomorrow.');

            // Function to scroll inside the modal
            function scrollInsideModal() {
                const modal = document.querySelector('.artdeco-modal__content');
                if (modal && !maxAttemptsReached) {
                    modal.scrollTop += 100; // Adjust the value as needed for the scroll distance
                }
            }

            // Function to simulate a click on each button inside the modal after a delay
            function clickButtons() {
                const modal = document.querySelector('.artdeco-modal__content');
                if (modal) {
                    const buttons = modal.querySelectorAll('.artdeco-button.artdeco-button--2.artdeco-button--full.artdeco-button--secondary.ember-view.full-width.mt2');
                    buttons.forEach(function(button, index) {
                        setTimeout(function() {
                            if (!maxAttemptsReached && startFollowEnabled) { // Check if maximum attempts reached and if startFollow is enabled
                                count++;
                                if (count === 40) {
                                    maxAttemptsReached = true; // Set flag to true when maximum attempts reached
                                    alert('You have reached the maximum number of attempts. Please try again later.');
                                    return; // Exit the function when maximum attempts reached
                                }
                                button.click();
                            }
                        }, index * 3000); 
                    });
                }
            }

            // Start scroll interval
            setInterval(scrollInsideModal, 27000);

            // Start click timeout
            setTimeout(function() {
                clickButtons();
            }, 3000);

            // Set flag in storage to indicate extension has been executed and update last execution date
            chrome.storage.local.set({ 'extensionExecuted': true, 'lastExecutionDate': today });
        }
    });
});

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action === "stopFollow") {
        console.log('Button clicked');
        // Disable startFollow logic when stopFollow action is triggered
        startFollowEnabled = false;
        alert('Follow  has been stopped.');
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "stopFollow"});
        })
    }
});
