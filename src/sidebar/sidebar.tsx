import * as React from "react";
import { createRoot } from "react-dom/client";
import { Card, Button } from "antd"
import Utils from "../utils";
import 'antd/dist/antd.css';
import { tabs, storage } from "webextension-polyfill";

init();

storage.sync.onChanged.addListener((changes) => {
    init();
});

async function init() {
    const readingProcesses = await Utils.getAllReadingProcess();
    // console.debug("readingProcesses", readingProcesses)

    const root = createRoot(document.getElementById("root")!);
    root.render(<DisplayReadingProcess style="display: flex; flex-direction: column;" readProcesses={readingProcesses} />);
}

function DisplayReadingProcess(props: any) {
    const readingProcesses = props.readProcesses.map((process: any) => {
        // console.debug(process)
        return <ReadingProcessCard key={process.urlPrefix} processTitle={process.processTitle} urlPrefix={process.urlPrefix} title={process.title} url={process.url} />
    });

    return readingProcesses;
}

function ReadingProcessCard(props: any) {
    function navigateToUrl() {
        tabs.create({ url: props.url });
    }

    async function deleteUrlPrefix() {
        await Utils.delReadingProcess(props.urlPrefix);
    }

    return (
        <Card
            hoverable
            cover={
                <div onClick={navigateToUrl}>
                    {props.title}
                </div>
            } 
            bordered={true} 
            style={{ width: 300 }}
            // onClick={navigateToUrl}
            actions={[
                <Button onClick={deleteUrlPrefix}>Delete</Button>
            ]}
        >
            <p>Process for now:</p>
            <p>{props.processTitle}</p>
        </Card>
    );
}