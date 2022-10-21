import * as browser from 'webextension-polyfill';

export interface ReadingProcess {
    urlPrefix: string;
    url: string;
    title: string;
    processTitle: string;
    imageUrl?: string;
}

export default class Utils {
    static async getReadingProcess(url: string): Promise<ReadingProcess|null> {
        console.debug("matching ", url);
        const reading_process: string[] = await browser.storage.sync.get("reading_process")
            .then(value => value.reading_process);
        const item = reading_process.find((value: string) => {
            return url.startsWith(value);
        });

        if(item === undefined) {
            return null;
        }

        console.debug("find url prefix", item);

        const record = await browser.storage.sync.get(item);
        const res = Object.values(record)[0] as ReadingProcess;

        return res;
    }

    static async getAllReadingProcess(): Promise<ReadingProcess[]> {
        const reading_process: string[] = await browser.storage.sync.get("reading_process").then(value => {
            if(value.reading_process === undefined) {
                return [];
            }
            return value.reading_process;
        });
        console.debug("all_reading_process", reading_process);

        const res = reading_process.map(async (key: string) => {
            let value = await browser.storage.sync.get(key);
            return Object.values(value)[0];
        });

        return await Promise.all(res).then((values: any[]) => {            
            return values;
        });
    }

    static async setReadingProcess(key: string, value: any): Promise<void> {
        const reading_process: string[]|undefined = await browser.storage.sync.get("reading_process").then(value => value.reading_process);
        console.debug("set reading_process", key); 

        if(reading_process === undefined) {
            browser.storage.sync.set({reading_process: [key]});
        }else if(!reading_process.includes(key)) {
            reading_process.push(key);
            browser.storage.sync.set({reading_process: reading_process});
        }

        browser.storage.sync.set({[key]: value});
    }

    static async delReadingProcess(key: string): Promise<void> {
        const reading_process: string[] = await browser.storage.sync.get("reading_process").then(value => value.reading_process);
        const index = reading_process.indexOf(key);
        if(index > -1) {
            reading_process.splice(index, 1);
            browser.storage.sync.set({reading_process: reading_process});
        }

        browser.storage.sync.remove(key);
        console.debug("delete ", key)
    }

    // static async getScreenCapture(): Promise<string> {
    //     return await browser.tabs.captureVisibleTab();
    // }
}