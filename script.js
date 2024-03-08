// popup.js

document.addEventListener('DOMContentLoaded', function() {

    const startFollow = document.getElementById('start-follow');
    const stopFollow = document.getElementById('stop-follow');

    stopFollow.addEventListener('click', () => {
        console.log('Button clicked');
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "stopFollow"});
        })
    })

    startFollow.addEventListener('click', () => {
        console.log('Button clicked');
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {action: "startFollow"});
        });
    });

});
