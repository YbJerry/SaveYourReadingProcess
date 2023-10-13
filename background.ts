import ReadingProcessCollection from "./utils";
import browser from "webextension-polyfill";

browser.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    console.debug("tab updated", tabId, changeInfo, tab);
    let url: string | undefined;
    let processTitle: string | undefined;
    if(changeInfo.url !== undefined && changeInfo.title !== undefined) {
        url = changeInfo.url;
        processTitle = changeInfo.title;
    }else if(changeInfo.url !== undefined) {
        url = changeInfo.url;
        processTitle = undefined;
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
    const queryItems = await ReadingProcessCollection.query({url});
    console.debug("queryItems: ", queryItems);
    for (const [uuid, entity] of Object.entries(queryItems)) {
        entity.url = url!;
        if(processTitle !== undefined)
            entity.processTitle = processTitle!;
        await ReadingProcessCollection.set(uuid, entity);
    }
});