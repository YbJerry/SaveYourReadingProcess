import { Storage as PlasmoStorage } from "@plasmohq/storage"
import browser from "webextension-polyfill"

export interface ReadingProcessEntity {
    urlPrefix: string;
    url: string;
    title: string;
    processTitle: string;
    imageUrl?: string;
}

export interface QueryOption {
    urlPrefix?: string;
    url?: string;
}

export function t(messageName: string, substitutions?: string | string[]){
    return browser.i18n.getMessage(messageName, substitutions)
}

type Key = string;
type UUID = string;

export default class ReadingProcessCollection {
    static storage = new PlasmoStorage()

    

    private static uuid2key(uuid: string): string {
        return `entity:${uuid}`;
    }

    private static key2uuid(key: string): string {
        return key.replace("entity:", "");
    }

    private static setChanged() {
        this.storage.set("changed", true);
    }

    static async query(option: QueryOption): Promise<Record<string, ReadingProcessEntity>> {
        let entities = Object.entries(await this.getAll());

        if (option.urlPrefix !== undefined) {
            entities =  entities.filter(([uuid, entity]) => { return entity.urlPrefix.startsWith(option.urlPrefix); });
        }

        if (option.url !== undefined) {
            entities =  entities.filter(([uuid, entity]) => { return option.url.startsWith(entity.urlPrefix); });
        }

        return Object.fromEntries(entities);
    }

    static async get(uuid: string): Promise<ReadingProcessEntity|undefined> {
        console.debug("get ", uuid);
        const entity: ReadingProcessEntity = await this.storage.get(this.uuid2key(uuid));

        return entity;
    }

    static async getAll(): Promise<Record<string, ReadingProcessEntity>> {
        const storageItems = await this.storage.getAll();

        console.debug("total storage", storageItems)

        const entities = Object.entries(storageItems)
            .filter(([key, value]) => { return key.startsWith("entity:"); })
            .map(([key, value]) => { return [this.key2uuid(key), JSON.parse(value)]; });

        return Object.fromEntries(entities);
    }

    static async set(uuid: string, value: any): Promise<void> {
        await this.storage.set(this.uuid2key(uuid), value);
        this.setChanged();
    }

    /**
     * Insert a entity and return this UUID
     * @param value 
     */
    static async insert(value: any): Promise<string> {
        const uuid = crypto.randomUUID();
        await ReadingProcessCollection.storage.set(this.uuid2key(uuid), value);
        console.debug("insert ", uuid)
        this.setChanged();
        return uuid;
    }

    static async remove(uuid: string): Promise<void> {
        await this.storage.remove(this.uuid2key(uuid));
        console.debug("delete ", uuid)
        this.setChanged();
    }

    // static async getScreenCapture(): Promise<string> {
    //     return await browser.tabs.captureVisibleTab();
    // }
}