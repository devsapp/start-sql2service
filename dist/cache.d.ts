export default class Cache {
    pathCache: {
        [key: string]: string;
    };
    constructor();
    getPath: () => void;
    setPath: () => void;
    clear: () => void;
}
