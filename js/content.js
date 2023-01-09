// 10_pg4LHHgGHf0kKxlTR0SF8xrSFRrEOl2i4glnqYfmc

const getDateTime = () => {
    var currentdate = new Date();
    var datetime = currentdate.getDate() + "_"
        + (currentdate.getMonth() + 1) + "_"
        + currentdate.getFullYear() + "__"
        + currentdate.getHours() + "_"
        + currentdate.getMinutes() + "_"
        + currentdate.getSeconds();

    return datetime
}

const createBlob = (data) => {
    let jsonString = JSON.stringify(data);
    let blob = new Blob([jsonString], { type: "application/json" });
    return blob;
}

function addDownloadButton(blob) {
    let button = document.createElement("a");

    button.href = URL.createObjectURL(blob);

    let dateTime = getDateTime();
    button.download = `${dateTime}.json`;

    button.style.display = 'block'
    button.style.margin = '12px 0';

    button.innerHTML = "Download";

    let mainContainer = document.querySelector(".AllInvestments__investment-summary__1oT6D");

    // Append the button to the DOM
    if (false) {
        mainContainer.appendChild(button);
    } else {
        document.body.insertBefore(button, document.body.firstChild);
    }

    return button
}

const downloadJson = (data) => {
    let blob = createBlob(data)
    let button = addDownloadButton(blob)
}

function gotMessage(message, sender, sendResponse) {
    if (message?.type == 'SYNC_NOW') {
        let data = getData();
        console.log('sync done')

        downloadJson(data)
    }
}

chrome.runtime.onMessage.addListener(gotMessage)

const getData = () => {
    const getFormattedAmount = (amtStr = "") => {
        let amtStrArr = amtStr.split(" ")
        let amt = amtStrArr.length > 1 ? amtStrArr[1] : '';

        if (!amt) return 0;

        let amtVal = 0;
        if (amt.includes('k') || amt.includes('K')) {
            let floatVal = parseFloat(amt.substring(0, amt.length - 1)) + 0.005
            amtVal = floatVal * 1000;
        } else if (amt.includes('l') || amt.includes('L')) {
            let floatVal = parseFloat(amt.substring(0, amt.length - 1)) + 0.005
            amtVal = floatVal * 100000;
        }

        return parseInt(amtVal)
    }

    const getFormattedPer = (amtStr = "") => {
        return parseFloat(amtStr.substring(0, amtStr.length - 1))
    }

    const getFormattedName = (name = '') => {
        return name.substring(0, 25);
    }

    let selector_scCard = '.smallcase-card-lg';

    let selector_scCard_name = '.InvestedSmallcaseCard__sc-name__3vxaD'

    let selector_scCard_currVal_elem = 'div[data-testid="_statbox-index-stats-0"]'
    let selector_scCard_currVal_val = 'div.StatBox__value__2FWUJ';

    let selector_scCard_totalReturn_elem = 'div[data-testid="_statbox-amount-stats-1"]'
    let selector_scCard_totalReturn_val = 'div.StatBox__value__2FWUJ';

    let selector_scCard_returnPer_elem = 'div[data-testid="_statbox-amount-stats-2"]'
    let selector_scCard_returnPer_val = 'div.StatBox__value__2FWUJ';

    let selector_summary_wrap = '.InvestmentSummary__statbox-desktop__5fQBC'

    let selector_summary_currVal_elem = 'div[data-testid="_statbox-index-stats-0"] .StatBox__value__2FWUJ'
    let selector_summary_currVal_val = '.Tooltip__container__3IcYb'

    let selector_summary_totalReturn_elem = 'div[data-testid="_statbox-amount-stats-3"] .StatBox__value__2FWUJ'
    let selector_summary_totalReturn_val = '.Tooltip__container__3IcYb'

    let selector_summary_returnPer_elem = 'div[data-testid="_statbox-amount-stats-3"] .StatBox__title__3yY1q'
    let selector_summary_returnPer_val = 'span'

    let data = [];

    let smallcases = document.querySelectorAll(selector_scCard)
    for (const sc of smallcases) {
        let scData = {};

        // name
        let nameElem = sc.querySelector(selector_scCard_name)
        scData.name = "No_name_" + data.length
        if (nameElem) scData.name = nameElem.innerText;
        scData.name = getFormattedName(scData.name);

        // current val box
        let currVal_elem = sc.querySelector(selector_scCard_currVal_elem)
        if (currVal_elem) {
            scData.currVal = 'No_currVal_val_' + data.length
            let currVal_val = currVal_elem.querySelector(selector_scCard_currVal_val)
            if (currVal_val && currVal_val.childNodes[0]?.nodeValue) {
                scData.currVal = currVal_val.childNodes[0]?.nodeValue
                scData.formattedCurrVal = getFormattedAmount(scData.currVal)
            }
        } else {
            scData.currVal = 'No_currVal_elem_' + data.length
        }

        // total returns box
        let totalReturn_elem = sc.querySelector(selector_scCard_totalReturn_elem)
        if (totalReturn_elem) {
            scData.totalReturn = 'No_totalReturn_val_' + data.length
            let totalReturn_val = totalReturn_elem.querySelector(selector_scCard_totalReturn_val)
            if (totalReturn_val && totalReturn_val.childNodes[0]?.nodeValue) {
                scData.totalReturn = totalReturn_val.childNodes[0]?.nodeValue
                scData.formattedTotalReturn = getFormattedAmount(scData.totalReturn)
            }
        } else {
            scData.totalReturn = 'No_totalReturn_elem_' + data.length
        }

        // return percent box
        let returnPer_elem = sc.querySelector(selector_scCard_returnPer_elem)
        if (returnPer_elem) {
            scData.returnPer = 'No_returnPer_val_' + data.length
            let returnPer_val = returnPer_elem.querySelector(selector_scCard_returnPer_val)
            if (returnPer_val && returnPer_val.childNodes[0]?.nodeValue) {
                scData.returnPer = returnPer_val.childNodes[0]?.nodeValue
                scData.formattedReturnPer = getFormattedPer(scData.returnPer);
            }
        } else {
            scData.returnPer = 'No_returnPer_elem_' + data.length
        }


        data[data.length] = scData;

    }

    // aggregatted
    let scData = {}

    let summaryElem = document.querySelector(selector_summary_wrap)

    if (summaryElem) {
        // name
        scData.name = 'Total'

        // current value
        let currVal_elem = summaryElem.querySelector(selector_summary_currVal_elem)
        if (currVal_elem) {
            scData.currVal = 'No_currVal_val'
            let currVal_val = currVal_elem.querySelector(selector_summary_currVal_val)
            if (currVal_val && currVal_val.childNodes[0]?.nodeValue) {
                scData.currVal = currVal_val.childNodes[0]?.nodeValue
                scData.formattedCurrVal = getFormattedAmount(scData.currVal)
            }
        } else {
            scData.currVal = 'No_currVal_elem'
        }

        // total returns box
        let totalReturn_elem = summaryElem.querySelector(selector_summary_totalReturn_elem)
        if (totalReturn_elem) {
            scData.totalReturn = 'No_totalReturn_val'
            let totalReturn_val = totalReturn_elem.querySelector(selector_summary_totalReturn_val)
            if (totalReturn_val && totalReturn_val.childNodes[0]?.nodeValue) {
                scData.totalReturn = totalReturn_val.childNodes[0]?.nodeValue
                scData.formattedTotalReturn = getFormattedAmount(scData.totalReturn)
            }
        } else {
            scData.totalReturn = 'No_totalReturn_elem'
        }

        // return percent box
        let returnPer_elem = summaryElem.querySelector(selector_summary_returnPer_elem)
        if (returnPer_elem) {
            scData.returnPer = 'No_returnPer_val'
            let returnPer_val = returnPer_elem.querySelector(selector_summary_returnPer_val)
            if (returnPer_val && returnPer_val.innerText) {
                scData.returnPer = returnPer_val.innerText
                scData.formattedReturnPer = getFormattedPer(scData.returnPer);
            }
        } else {
            scData.returnPer = 'No_returnPer_elem'
        }

        data[data.length] = scData
    }


    console.log(data)
    return data;
}