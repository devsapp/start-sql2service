import { RenderInput, DbInfo } from '../@types';
export default abstract class Resolver {
    protected sourcePath: string;
    protected targetPath: string;
    protected pathCache: any;
    constructor(sourcePath: string, targetPath: string);
    protected renderTemplate(str: string, renderData: any): any;
    protected firstChartToUppercase(str: string): string;
    protected getCorrectPath(path: any): string;
    protected reolveCommonTemplate(data: RenderInput, targetFolder?: string): void;
    protected directCopyBizDir(): void;
    abstract render(data: DbInfo): any;
}
