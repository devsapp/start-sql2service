
import { readFileSync, writeFileSync } from 'fs';
import { join as pathJoin } from 'path';
import { firstChartToUppercase, renderTemplate, getCorrectPath, copyFolders } from '../utils';
import { RenderInput, DbInfo } from '../@types';

export default abstract class Resolver {

    protected sourcePath: string;
    protected targetPath: string;
    protected pathCache;

    constructor(sourcePath: string, targetPath: string) {
        this.sourcePath = sourcePath;
        this.targetPath = targetPath;
    }

    protected renderTemplate(str: string, renderData: any) {
        try {
            return renderTemplate(str, renderData);
        } catch (e) {
            return str;
        }
    }

    protected firstChartToUppercase(str: string) {
        return firstChartToUppercase(str);
    }

    protected getCorrectPath(path) {

        return getCorrectPath(path);
    }

    protected reolveCommonTemplate(data: RenderInput, targetFolder?: string) {
        const { type, tableName, primaryKey, primaryKeyType } = data;
        const originTemplate = readFileSync(pathJoin(this.sourcePath, `${type}.template`)).toString();
        const tableNameUpper = this.firstChartToUppercase(tableName);
        const renderData = {
            tableName,
            tableNameUpper
        }
        if (primaryKey && primaryKeyType) {
            renderData['primaryKeyType'] = primaryKeyType;
            renderData['primaryKey'] = primaryKey;
        }
        const finalContent = this.renderTemplate(originTemplate, renderData);
        const targetPath = targetFolder ? pathJoin(targetFolder, `${tableName}.${type}.ts`) : pathJoin(this.targetPath, `${tableName}.${type}.ts`);
        writeFileSync(targetPath, finalContent, { encoding: 'utf-8' });
    }

    protected directCopyBizDir() {
        const copySourceDir = pathJoin(this.sourcePath, 'direct-copy-folders');
        copyFolders(copySourceDir, this.targetPath);
    }

    public abstract render(data: DbInfo);




}