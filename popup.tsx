import ReadingProcessCollection, { type ReadingProcessEntity, t } from "~utils";
import browser from "webextension-polyfill";

import "./style.css"
import { useEffect, useState } from "react";

function IndexPopup() {
    const [urlPrefix, setUrlPrefix] = useState("");
    const [url, setUrl] = useState("");
    const [title, setTitle] = useState("");

    async function init() {
        const tabs = await browser.tabs.query({ currentWindow: true, active: true });
        const tab = tabs[0];
        console.debug(tabs)
        console.debug(tab)

        setUrl(tab.url!);
        setUrlPrefix(tab.url!.substring(0, tab.url!.lastIndexOf("/") + 1));
        setTitle(tab.title!);
    }

    useEffect(() => {
        init();
    }, [])

    const onFinish = async () => {
        console.log("popup onfinish")
        const readingProcess: ReadingProcessEntity = {
            urlPrefix: urlPrefix,
            title: title,
            url: url,
            processTitle: title
        };
        await ReadingProcessCollection.set(urlPrefix, readingProcess);
        window.close();
    };

    return (
        <div className="p-4 w-72">
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text">{t("urlPrefix")}</span>
                </label>
                <input type="text" value={urlPrefix} onChange={(e) => {setUrlPrefix(e.target.value)}} className="input input-bordered input-sm w-full max-w-xs" />
            </div>
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text">{t("url")}</span>
                </label>
                <input type="text" value={url} onChange={(e) => {setUrl(e.target.value)}} className="input input-bordered input-sm w-full max-w-xs" />
            </div>
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text">{t("title")}</span>
                </label>
                <input type="text" value={title} onChange={(e) => {setTitle(e.target.value)}} className="input input-bordered input-sm w-full max-w-xs" />
            </div>
            <button className="btn btn-primary btn-sm mt-2" type="submit" onClick={onFinish}>{t('submit')}</button>
        </div>
    );
}

export default IndexPopup
