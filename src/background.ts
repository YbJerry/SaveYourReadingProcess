import Utils from "./utils";
import {tabs} from "webextension-polyfill";

tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.log("tab updated", tabId, changeInfo, tab);
    let url;
    let processTitle;
    if(changeInfo.url !== undefined && changeInfo.title !== undefined) {
        url = changeInfo.url;
        processTitle = changeInfo.title;
    }else if(changeInfo.url !== undefined) {
        url = changeInfo.url;
    }else if (changeInfo.title !== undefined){
        url = tab.url;
        processTitle = changeInfo.title;
    }else if(changeInfo.status !== undefined && changeInfo.status === "complete"){
        url = tab.url;
        processTitle = tab.title;
    }else{
        return;
    }
    console.debug("url changed: ", url)
    console.debug("title changed: ", processTitle)
    const readingProcess = await Utils.getReadingProcess(url);
    if(readingProcess !== null) {
        readingProcess.url = url;
        readingProcess.processTitle = processTitle;
        await Utils.setReadingProcess(readingProcess.urlPrefix, readingProcess);
    }
});

tabs.onCreated.addListener((tab) => {
    console.log("tab created", tab);
});