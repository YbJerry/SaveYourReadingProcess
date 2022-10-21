import Utils from "../utils";

async function init() {
    console.debug("init update")

    const url = document.location.href;

    console.debug("url", url);
    const readingProcess = await Utils.getReadingProcess(url)

    if (readingProcess === null) {
        return;
    }

    readingProcess.url = url;
    await Utils.setReadingProcess(readingProcess.urlPrefix, readingProcess);
}