
import fs, { mkdirSync, statSync, readdirSync } from 'fs';
import { join as pathJoin } from 'path';
import { TemplateReg } from '../constants';


export const firstChartToUppercase = (str: string) => {
    const firstChart = str.substring(0, 1);
    const otherChart = str.substr(1);
    return firstChart.toUpperCase() + otherChart;

}
export const renderTemplate = (template, data) => {
    return template.replace(TemplateReg, (match, key) => {
        return data[key];
    });
}

export const getCorrectPath = (pathName: string) => {
    try {
        statSync(pathName)
    } catch (e) {
        mkdirSync(pathName);
    }

    return pathName;
}


export const copyFolders = (copiedPath, resultPath) => {
    getCorrectPath(resultPath);
    const files = readdirSync(copiedPath, { withFileTypes: true });
    for (let i = 0; i < files.length; i++) {
        const cf = files[i];
        const source = pathJoin(copiedPath, cf.name);
        const target = pathJoin(resultPath, cf.name);
        if (cf.isFile()) {
            const readStream = fs.createReadStream(source);
            const writeStream = fs.createWriteStream(target);
            readStream.pipe(writeStream);
        } else {
            try {
                fs.accessSync(pathJoin(source, '..'), fs.constants.W_OK);
                copyFolders(source, target);
            } catch (error) {
                console.log('folder write error:', error)
            }
        }
    }
}