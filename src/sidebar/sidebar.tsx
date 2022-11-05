// import * as React from "react";
// import { createRoot } from "react-dom/client";
// import { Card, Button } from "antd"
import Utils, { ReadingProcess } from "../utils";
// import 'antd/dist/antd.css';
import { tabs, storage } from "webextension-polyfill";
import { For, hydrate, render } from "solid-js/web";
import "./sidebar.css";
import { Accessor, createSignal } from "solid-js";

const [readingProcesses, setReadingProcesses] = createSignal(Array<ReadingProcess>());

init();

storage.sync.onChanged.addListener(async (changes) => {
    setReadingProcesses(await Utils.getAllReadingProcess());

    hydrate(() => <DisplayReadingProcess class="flex flex-col" readingProcesses={readingProcesses()} />, document.getElementById("root")!);
});

async function init() {
    setReadingProcesses(await Utils.getAllReadingProcess());

    render(() => <DisplayReadingProcess class="flex flex-col" readingProcesses={readingProcesses()} />, document.getElementById("root")!);
}

function DisplayReadingProcess(props: any) {
    // const readingProcesses = props.readingProcesses.map((process: any) => {
    //     // console.debug(process)
    //     return <ReadingProcessCard key={process.urlPrefix} processTitle={process.processTitle} urlPrefix={process.urlPrefix} title={process.title} url={process.url} />
    // });

    return (
        <For each={props.readingProcesses}>
            {
                (process: any, index: Accessor<number>) => <ReadingProcessCard key={process.urlPrefix} processTitle={process.processTitle} urlPrefix={process.urlPrefix} title={process.title} url={process.url} />
            }
        </For>
    );
}

function ReadingProcessCard(props: any) {
    function navigateToUrl() {
        tabs.create({ url: props.url });
        window.close()
    }

    async function deleteUrlPrefix() {
        await Utils.delReadingProcess(props.urlPrefix);
    }

    return (
        // <Card
        //     hoverable
        //     cover={
        //         <div onClick={navigateToUrl}>
        //             {props.title}
        //         </div>
        //     } 
        //     bordered={true} 
        //     style={{ width: 300 }}
        //     // onClick={navigateToUrl}
        //     actions={[
        //         <Button onClick={deleteUrlPrefix}>Delete</Button>
        //     ]}
        // >
        //     <p>Process for now:</p>
        //     <p>{props.processTitle}</p>
        // </Card>

        <div class="flex flex-col justify-center mb-2">
            <div class="block p-6 rounded-lg shadow-lg bg-white max-w-sm">
                <h5 class="text-gray-900 text-xl leading-tight font-medium mb-2">{props.title}</h5>
                <p class="text-gray-700 text-base">
                    Process for now:
                </p>
                <p class="text-gray-700 text-base mb-4">
                    {props.processTitle}
                </p>

                <button onClick={navigateToUrl} type="button" class=" inline-block px-6 py-2.5 mr-2 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Navigate</button>
                <button onClick={deleteUrlPrefix} type="button" class=" inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out">Delete</button>
            </div>
        </div>
    );
}