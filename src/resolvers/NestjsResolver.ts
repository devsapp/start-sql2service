


import { readFileSync, writeFileSync } from 'fs';
import { join as pathJoin } from 'path';
import Resolver from './Resolver';
import { DbInfo, FieldData, DbDetail, NestJsBizTemplateType, NestJsDtoTemplateType } from '../@types';

const CustomerCodePathPrefix = 'src'; // 渲染目标的路径;

interface NestJsEntityInputs {
    tableName: string,
    fields: FieldData[],
    primaryKey: string[]

}

export default class NestjsResolver extends Resolver {


    constructor(sourcePath: string, targetPath: string) {
        super(sourcePath, targetPath);

    }

    private resolveBizEntityTemplate(targetFolder: string, data: NestJsEntityInputs) {
        const { tableName, fields, primaryKey } = data;
        const originTemplate = readFileSync(pathJoin(this.sourcePath, 'entity.template')).toString();
        const tableNameUpper = this.firstChartToUppercase(tableName);
        const fieldDetail = fields.map((data: FieldData) => {
            let { name: fieldName, type, autoIncrement } = data;
            if (primaryKey.includes(fieldName)) {
                const decoratorStr = autoIncrement ? '@PrimaryGeneratedColumn()' : '@PrimaryColumn()';
                return [`\n\t${decoratorStr}`, `${fieldName}: ${type.name}`].join('\n\t');
            } else {
                return ['\n\t@Column()', `${fieldName}: ${type.name}`].join('\n\t');
            }

        }).join('\n\n\t');

        const renderData = {
            fieldDetail,
            tableName,
            tableNameUpper
        }
        const finalContent = this.renderTemplate(originTemplate, renderData);
        const renderedPath = `${tableName}.entity.ts`; // <>/<>.entity
        writeFileSync((pathJoin(targetFolder, renderedPath)), finalContent, { encoding: 'utf-8' });
    }

    public resolveDtoTemplate(targetFolder: string, data: NestJsEntityInputs, dtoType: NestJsDtoTemplateType) {
        const { tableName, fields, primaryKey = [] } = data;
        const originTemplate = readFileSync(pathJoin(this.sourcePath, 'dto', `${dtoType}-dto.template`)).toString();
        const tableNameUpper = this.firstChartToUppercase(tableName);
        let fieldDto;
        let primaryKeyType: string[] = ['number'];
        switch (dtoType) {
            case NestJsDtoTemplateType.CREATE:
            case NestJsDtoTemplateType.UPDATE:
                fieldDto = fields.map((data: FieldData) => {
                    let { name: fieldName, type, autoIncrement, isNull } = data;
                    let apiProperty = isNull ? '{ required: false }' : '{ required: true }';

                    if (primaryKey.includes(fieldName)) {
                        primaryKeyType.push(type.name);
                        if (dtoType === NestJsDtoTemplateType.UPDATE) {
                            return '';
                        }
                        return !autoIncrement ? ['\n\t@ApiProperty()', `${fieldName}: ${type.name}`].join('\n\t') : '';
                    } else {
                        return [`\n\t@ApiProperty(${apiProperty})`, `${fieldName}: ${type.name}`].join('\n\t');
                    }

                }).join('\n\n\t');
                break;
            case NestJsDtoTemplateType.FIND:
                fieldDto = fields.map((data: FieldData) => {
                    let { name: fieldName, type, isNull } = data;
                    let apiProperty = isNull ? '{ required: false }' : '{ required: true }';
                    if (primaryKey.includes(fieldName)) {
                        primaryKeyType.push(type.name);
                        return '';
                    } else {
                        return [`\n\t@ApiProperty(${apiProperty})`, `${fieldName}: ${type.name}`].join('\n\t');
                    }

                }).join('\n\n\t');

                const extendField = [['\n\n\t@ApiProperty()', 'page: number;'].join('\n\t'), ['@ApiProperty()', 'limit: number;'].join('\n\t')].join('\n\n\t');
                fieldDto += extendField;
                break;
            case NestJsDtoTemplateType.REMOVE: // 复数删除
                fields.forEach((data: FieldData) => {
                    let { name: fieldName, type, } = data;
                    if (primaryKey.includes(fieldName)) {
                        primaryKeyType.push(type.name);
                    }
                });
                fieldDto = primaryKey.map(key => [`\t\t\t\n@ApiProperty()`, '@IsArray()', `${key}s:[]`].join('\t\t\t\n')).join('\n\n');
                break;
            case NestJsDtoTemplateType.RETRIEVE: // 提供主键
                fields.forEach((data: FieldData) => {
                    let { name: fieldName, type, } = data;
                    if (primaryKey.includes(fieldName)) {
                        primaryKeyType.push(type.name);
                    }
                });
                fieldDto = primaryKey.map((key, i) => [`\t\t\t\n@ApiProperty()`, `${key}:${primaryKeyType[i]}`].join('\t\t\t\n')).join('\n\n');
                break;
            default:
                break;
        }


        const renderData = {
            fieldDto,
            tableNameUpper,
            primaryKey,
            primaryKeyType
        }
        const finalContent = this.renderTemplate(originTemplate, renderData);
        const domainDtoPath = this.getCorrectPath(pathJoin(targetFolder, 'dto')); //build/src/<>/dto/<create>-<>.dto.ts
        const domainCreateDtoPath = pathJoin(domainDtoPath, `${dtoType}-${tableName}.dto.ts`); // <>/<>.entity
        writeFileSync(domainCreateDtoPath, finalContent, { encoding: 'utf-8' });
    }



    private renderDomain({ tableName, fields, primaryKey }) {
        let domainPath = pathJoin(this.targetPath, CustomerCodePathPrefix, tableName); //业务代码存放到 build/src/<tableName>
        domainPath = this.getCorrectPath(domainPath); //不存在则创建
        const entityData = {
            tableName,
            fields,
            primaryKey
        };

        let primaryKeyType: string[] = ['number'];
        fields.forEach((field: FieldData) => {
            if (primaryKey.includes(field.name)) {
                primaryKeyType.push(field.type.name);
            }
        })

        this.resolveBizEntityTemplate(domainPath, entityData);

        const bizTemplateRenderedList = [NestJsBizTemplateType.CONTROLLER, NestJsBizTemplateType.MODULE, NestJsBizTemplateType.SERVICE];
        const dtoTemplateRenderedList = [NestJsDtoTemplateType.CREATE, NestJsDtoTemplateType.FIND, NestJsDtoTemplateType.REMOVE, NestJsDtoTemplateType.REMOVE, NestJsDtoTemplateType.RETRIEVE, NestJsDtoTemplateType.UPDATE];

        bizTemplateRenderedList.forEach((type: string) => {
            this.reolveCommonTemplate({
                tableName,
                type,
                primaryKey: primaryKey[0],
                primaryKeyType: primaryKeyType[0]
            }, domainPath);
        });
        dtoTemplateRenderedList.forEach((type: NestJsDtoTemplateType) => {
            this.resolveDtoTemplate(domainPath, entityData, type);
        })
    }

    private renderCustomerCode(dbData: DbInfo) {
        const dbDetail = dbData.dbInfo;
        dbDetail.forEach((_dbDetail: DbDetail) => {
            const tableName = _dbDetail.tableName;
            const primaryKey = _dbDetail.primaryKey;
            const fields: FieldData[] = _dbDetail.fields;
            this.renderDomain({
                tableName,
                fields,
                primaryKey
            })
        })

    }

    private renderMainAndModuleCode(data: DbInfo) {
        const dbDetail = data.dbInfo;
        let customerModulesImport = [];
        let customerModulesDefine = [];
        let dbName = '';
        dbDetail.forEach((_dbDetail: DbDetail) => {
            const tableName = _dbDetail.tableName;
            dbName = _dbDetail.dbName || data.dbName;
            const tableNameUpper = this.firstChartToUppercase(tableName);
            customerModulesImport.push(`import { ${tableNameUpper}Module } from './${tableName}/${tableName}.module';`);
            customerModulesDefine.push(`${tableNameUpper}Module,`);
        });
        const renderData = {
            customerModulesImport: customerModulesImport.join('\n'),
            customerModulesDefine: customerModulesDefine.join('\n\t\t'),
            dbName
        };
        const templateList = ['app.controller', 'app.module', 'app.service', 'main'];
        templateList.forEach((templateName) => {
            const templateContent = readFileSync(pathJoin(this.sourcePath, `${templateName}.template`)).toString();
            const transformedContent = this.renderTemplate(templateContent, renderData);
            const targetPath = pathJoin(this.targetPath, CustomerCodePathPrefix, `${templateName}.ts`);
            writeFileSync(targetPath, transformedContent, { encoding: 'utf-8' });
        });

    }

    private renderSConfig(dbName) {
        const sTemplate = readFileSync(pathJoin(this.sourcePath, 's.yaml.template')).toString();
        const finalContent = this.renderTemplate(sTemplate, { dbName });
        const targetSPath = pathJoin(this.targetPath, 's.yaml')
        writeFileSync(targetSPath, finalContent, { encoding: 'utf-8' });
    }

    public render(data: DbInfo) {
        
        this.directCopyBizDir(); //复制不需要修改的代码结构
        this.renderSConfig(data.dbInfo[0].dbName || data.dbName); //渲染s配置文件
        this.renderCustomerCode(data); //渲染自定义业务代码
        this.renderMainAndModuleCode(data); //渲染主控制逻辑代码
    }
}