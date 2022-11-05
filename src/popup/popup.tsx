import { tabs } from "webextension-polyfill";
// import * as React from "react";
// import { createRoot } from "react-dom/client";
// import { Button, Form, Input } from "antd"
import Utils, { ReadingProcess } from "../utils";
// import 'antd/dist/antd.css';
import { render } from "solid-js/web";
import "./popup.css";

let urlPrefix: string;
let url: string;
let title: string;

init();

async function init() {
    const tab = await tabs.query({ currentWindow: true, active: true }).then((tabs) => tabs[0]);
    url = tab.url!;
    urlPrefix = url.substring(0, url.lastIndexOf("/") + 1);
    title = tab.title!;

    render(() => <AddReadingProcess />, document.getElementById("root")!);
}

function AddReadingProcess() {
    const onFinish = async () => {
        console.log("popup onfinish")
        const readingProcess: ReadingProcess = {
            urlPrefix: urlPrefix,
            title: title,
            url: url,
            processTitle: title
        };
        await Utils.setReadingProcess(urlPrefix, readingProcess);
        window.close();
    };

    return (
        <div class="w-96">
            <form class="flex-col">
                <div class="mb-4">
                    <label for="urlPrefix">URL Prefix</label>
                    <input class="flex-row" type="text" id="urlPrefix" value={urlPrefix} required/>
                </div>

                <div class="mb-4">
                    <label for="url">URL</label>
                    <input type="text" id="url" name="url" value={url} required/>
                </div>

                <div class="mb-4">
                    <label for="title">Title</label>
                    <input type="text" id="title" name="title" value={title} required/>
                </div>

                <button class="btn" type="submit" onClick={onFinish}>Submit</button>
            </form>

            {/* <Form
                name="Add Reading Process"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                initialValues={{ urlPrefix: urlPrefix, url: url, title: title }}
                onFinish={onFinish}
                autoComplete="off"
            >
                <Form.Item
                    label="URL Prefix"
                    name="urlPrefix"
                    rules={[{ required: true, message: "Please input your URL prefix!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="URL"
                    name="url"
                    rules={[{ required: true, message: "Please input your URL!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    label="Title"
                    name="title"
                    rules={[{ required: true, message: "Please input your title!" }]}
                >
                    <Input />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">Add</Button>
                </Form.Item>
            </Form> */}
        </div>
    );
}