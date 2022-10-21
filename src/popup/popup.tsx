import {tabs} from "webextension-polyfill";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { Button, Form, Input } from "antd"
import Utils, { ReadingProcess } from "../utils";
import 'antd/dist/antd.css';

let urlPrefix: string;
let url: string;
let title: string;

const root = createRoot(document.getElementById("root")!);

init();

async function init() {
    const tab = await tabs.query({ currentWindow: true, active: true }).then((tabs) => tabs[0]);
    url = tab.url!;
    urlPrefix = url.substring(0, url.lastIndexOf("/")+1);
    title = tab.title!;

    root.render(<AddReadingProcess />);
}

function AddReadingProcess() {
    const onFinish = async (values: ReadingProcess) => {
        console.log("popup onfinish")
        values.processTitle = values.title;
        await Utils.setReadingProcess(urlPrefix, values);
        window.close();
    };

    return (
        <div>
            <Form
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
            </Form>
        </div>
    );
}