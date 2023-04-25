export interface FieldType {
    name: string;
    length: number;
}
export interface FieldData {
    name: string;
    isNull: boolean;
    comment: string;
    type: FieldType;
    autoIncrement: boolean;
}
export interface DbDetail {
    dbName: string;
    tableName: string;
    fields: FieldData[];
    primaryKey: string;
}
export interface DbInfo {
    dbInfo: DbDetail[];
    dbName?: string;
}
export interface RenderInput {
    type: string;
    tableName: string;
    primaryKey?: string;
    primaryKeyType?: string;
}
export declare enum NestJsBizTemplateType {
    ENTITY = "entity",
    CONTROLLER = "controller",
    MODULE = "module",
    SERVICE = "service"
}
export declare enum NestJsDtoTemplateType {
    CREATE = "create",
    FIND = "find",
    REMOVE = "remove",
    UPDATE = "update",
    RETRIEVE = "retrieve"
}
export interface TemplateResolver {
    resolveBizTemplate(templatePath: string, tableName: string): void;
    resolveDtoTemplate?(templatePath: string, tableName: string): void;
}
