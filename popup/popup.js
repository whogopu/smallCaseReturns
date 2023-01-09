console.log("hello world")

let url = "https://smallcase.zerodha.com/investments";
let syncBtnId = '#syncNowBtn';


let syncBtn = document.querySelector(syncBtnId);



chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log('tabs', tabs)
    if (!tabs[0].url.includes(url)) {
        if(syncBtn) syncBtn.disabled = true
        alert(`please go to ${url}`)
        return
    }
    
    function handleBtnClick() {
        const payload = {
            type:"SYNC_NOW",
            data: 'dummy'
        }
        chrome.tabs.sendMessage(tabs[0].id, payload);
    }

    if(syncBtn) {
        syncBtn.addEventListener('click', handleBtnClick)
    }
});

