var startFollowEnabled = true;

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    var count = 0;
    var maxAttemptsReached = false;
    
    // Check if extension has already been executed and when
    chrome.storage.local.get(['extensionExecuted', 'lastExecutionDate'], function(data) {
      

        if (message.action === "startFollow" && startFollowEnabled && !maxAttemptsReached) {

            
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
                                    maxAttemptsReached = true; 
                                    alert('You have reached the maximum number of attempts.Better to stop Now.');
                                    return;
                                }
                                button.click();
                            }
                        }, index * 3000); 
                    });
                }
            }

       
            setInterval(scrollInsideModal, 27000);

       
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
