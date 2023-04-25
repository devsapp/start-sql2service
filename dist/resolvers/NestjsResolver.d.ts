import Resolver from './Resolver';
import { DbInfo, FieldData, NestJsDtoTemplateType } from '../@types';
interface NestJsEntityInputs {
    tableName: string;
    fields: FieldData[];
    primaryKey: string[];
}
export default class NestjsResolver extends Resolver {
    constructor(sourcePath: string, targetPath: string);
    private resolveBizEntityTemplate;
    resolveDtoTemplate(targetFolder: string, data: NestJsEntityInputs, dtoType: NestJsDtoTemplateType): void;
    private renderDomain;
    private renderCustomerCode;
    private renderMainAndModuleCode;
    private renderSConfig;
    render(data: DbInfo): void;
}
export {};
