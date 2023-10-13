import { Storage as PlasmoStorage } from "@plasmohq/storage";
import ReadingProcessCollection, { type ReadingProcessEntity, t } from "~utils";
import browser from "webextension-polyfill";

import "./style.css"

import { useEffect, useState } from "react"

function IndexSidePanel() {
    const [cards, setCards] = useState<JSX.Element[]>([])
    const storage = new PlasmoStorage();

    storage.watch({
        "changed": () => {
            console.debug("readingProcesses changed")
            getReadingProcesses()
        }
    })

    useEffect(() => {
        getReadingProcesses();
    }, [])

    async function getReadingProcesses() {
        const rpItems = Object.entries(await ReadingProcessCollection.getAll());
        setCards(rpItems.map(([uuid, entity]) => {
            return <ReadingProcessCard key={uuid} uuid={uuid} rpEntity={entity} />
        }));
    }

    return (
        <div className="p-4">
            {cards}
        </div>
    )
}

interface ReadingProcessCardProps {
    uuid: string,
    rpEntity: ReadingProcessEntity
}

function ReadingProcessCard({ uuid, rpEntity } : ReadingProcessCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [urlPrefix, setUrlPrefix] = useState(rpEntity.urlPrefix);
    const [url, setUrl] = useState(rpEntity.url);
    const [title, setTitle] = useState(rpEntity.title);
    const [processTitle, setProcessTitle] = useState(rpEntity.processTitle);

    function navigateToUrl() {
        browser.tabs.create({ url: url });
        window.close()
    }

    async function deleteUrlPrefix() {
        await ReadingProcessCollection.remove(uuid);
    }

    function editCard() {
        setIsEditing(true);
    }

    function confirm() {
        setIsEditing(false);
        ReadingProcessCollection.set(uuid, {
            urlPrefix: urlPrefix,
            url: url,
            title: title,
            processTitle: processTitle
        })
    }

    return (
        <div className="card w-full bg-base-100 shadow-xl mb-4">
            { isEditing ? (
                    <div className="card-body">
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
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text">{t("process_title")}</span>
                            </label>
                            <input type="text" value={processTitle} onChange={(e) => {setProcessTitle(e.target.value)}} className="input input-bordered input-sm w-full max-w-xs" />
                        </div>
                        <div className="card-actions justify-end">
                            <button onClick={ confirm } type="button" className="btn btn-warning">{t('confirm')}</button>
                            <button onClick={() => { setIsEditing(false) }} type="button" className="btn btn-error">{t('cancel')}</button>
                        </div>
                    </div>
                ) : (
                    <div className="card-body">
                        <h2 className="card-title">{title}</h2>
                        <p>{t('process_for_now')}:</p>
                        <p className="text-gray-700 text-base mb-4">
                            {processTitle}
                        </p>
                        <div className="card-actions justify-end">
                            <button onClick={navigateToUrl} type="button" className="btn btn-primary">{t('navigate')}</button>
                            <button onClick={editCard} type="button" className="btn btn-warning">{t('edit')}</button>
                            <button onClick={deleteUrlPrefix} type="button" className="btn btn-error">{t('delete')}</button>
                        </div>
                    </div>
                )}
        </div>
    );
}

export default IndexSidePanel