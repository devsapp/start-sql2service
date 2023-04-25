"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var Resolver_1 = __importDefault(require("./Resolver"));
var _types_1 = require("../@types");
var CustomerCodePathPrefix = 'src'; // 渲染目标的路径;
var NestjsResolver = /** @class */ (function (_super) {
    __extends(NestjsResolver, _super);
    function NestjsResolver(sourcePath, targetPath) {
        return _super.call(this, sourcePath, targetPath) || this;
    }
    NestjsResolver.prototype.resolveBizEntityTemplate = function (targetFolder, data) {
        var tableName = data.tableName, fields = data.fields, primaryKey = data.primaryKey;
        var originTemplate = (0, fs_1.readFileSync)((0, path_1.join)(this.sourcePath, 'entity.template')).toString();
        var tableNameUpper = this.firstChartToUppercase(tableName);
        var fieldDetail = fields.map(function (data) {
            var fieldName = data.name, type = data.type, autoIncrement = data.autoIncrement;
            if (primaryKey.includes(fieldName)) {
                var decoratorStr = autoIncrement ? '@PrimaryGeneratedColumn()' : '@PrimaryColumn()';
                return ["\n\t".concat(decoratorStr), "".concat(fieldName, ": ").concat(type.name)].join('\n\t');
            }
            else {
                return ['\n\t@Column()', "".concat(fieldName, ": ").concat(type.name)].join('\n\t');
            }
        }).join('\n\n\t');
        var renderData = {
            fieldDetail: fieldDetail,
            tableName: tableName,
            tableNameUpper: tableNameUpper
        };
        var finalContent = this.renderTemplate(originTemplate, renderData);
        var renderedPath = "".concat(tableName, ".entity.ts"); // <>/<>.entity
        (0, fs_1.writeFileSync)(((0, path_1.join)(targetFolder, renderedPath)), finalContent, { encoding: 'utf-8' });
    };
    NestjsResolver.prototype.resolveDtoTemplate = function (targetFolder, data, dtoType) {
        var tableName = data.tableName, fields = data.fields, _a = data.primaryKey, primaryKey = _a === void 0 ? [] : _a;
        var originTemplate = (0, fs_1.readFileSync)((0, path_1.join)(this.sourcePath, 'dto', "".concat(dtoType, "-dto.template"))).toString();
        var tableNameUpper = this.firstChartToUppercase(tableName);
        var fieldDto;
        var primaryKeyType = ['number'];
        switch (dtoType) {
            case _types_1.NestJsDtoTemplateType.CREATE:
            case _types_1.NestJsDtoTemplateType.UPDATE:
                fieldDto = fields.map(function (data) {
                    var fieldName = data.name, type = data.type, autoIncrement = data.autoIncrement, isNull = data.isNull;
                    var apiProperty = isNull ? '{ required: false }' : '{ required: true }';
                    if (primaryKey.includes(fieldName)) {
                        primaryKeyType.push(type.name);
                        if (dtoType === _types_1.NestJsDtoTemplateType.UPDATE) {
                            return '';
                        }
                        return !autoIncrement ? ['\n\t@ApiProperty()', "".concat(fieldName, ": ").concat(type.name)].join('\n\t') : '';
                    }
                    else {
                        return ["\n\t@ApiProperty(".concat(apiProperty, ")"), "".concat(fieldName, ": ").concat(type.name)].join('\n\t');
                    }
                }).join('\n\n\t');
                break;
            case _types_1.NestJsDtoTemplateType.FIND:
                fieldDto = fields.map(function (data) {
                    var fieldName = data.name, type = data.type, isNull = data.isNull;
                    var apiProperty = isNull ? '{ required: false }' : '{ required: true }';
                    if (primaryKey.includes(fieldName)) {
                        primaryKeyType.push(type.name);
                        return '';
                    }
                    else {
                        return ["\n\t@ApiProperty(".concat(apiProperty, ")"), "".concat(fieldName, ": ").concat(type.name)].join('\n\t');
                    }
                }).join('\n\n\t');
                var extendField = [['\n\n\t@ApiProperty()', 'page: number;'].join('\n\t'), ['@ApiProperty()', 'limit: number;'].join('\n\t')].join('\n\n\t');
                fieldDto += extendField;
                break;
            case _types_1.NestJsDtoTemplateType.REMOVE: // 复数删除
                fields.forEach(function (data) {
                    var fieldName = data.name, type = data.type;
                    if (primaryKey.includes(fieldName)) {
                        primaryKeyType.push(type.name);
                    }
                });
                fieldDto = primaryKey.map(function (key) { return ["\t\t\t\n@ApiProperty()", '@IsArray()', "".concat(key, "s:[]")].join('\t\t\t\n'); }).join('\n\n');
                break;
            case _types_1.NestJsDtoTemplateType.RETRIEVE: // 提供主键
                fields.forEach(function (data) {
                    var fieldName = data.name, type = data.type;
                    if (primaryKey.includes(fieldName)) {
                        primaryKeyType.push(type.name);
                    }
                });
                fieldDto = primaryKey.map(function (key, i) { return ["\t\t\t\n@ApiProperty()", "".concat(key, ":").concat(primaryKeyType[i])].join('\t\t\t\n'); }).join('\n\n');
                break;
            default:
                break;
        }
        var renderData = {
            fieldDto: fieldDto,
            tableNameUpper: tableNameUpper,
            primaryKey: primaryKey,
            primaryKeyType: primaryKeyType
        };
        var finalContent = this.renderTemplate(originTemplate, renderData);
        var domainDtoPath = this.getCorrectPath((0, path_1.join)(targetFolder, 'dto')); //build/src/<>/dto/<create>-<>.dto.ts
        var domainCreateDtoPath = (0, path_1.join)(domainDtoPath, "".concat(dtoType, "-").concat(tableName, ".dto.ts")); // <>/<>.entity
        (0, fs_1.writeFileSync)(domainCreateDtoPath, finalContent, { encoding: 'utf-8' });
    };
    NestjsResolver.prototype.renderDomain = function (_a) {
        var _this = this;
        var tableName = _a.tableName, fields = _a.fields, primaryKey = _a.primaryKey;
        var domainPath = (0, path_1.join)(this.targetPath, CustomerCodePathPrefix, tableName); //业务代码存放到 build/src/<tableName>
        domainPath = this.getCorrectPath(domainPath); //不存在则创建
        var entityData = {
            tableName: tableName,
            fields: fields,
            primaryKey: primaryKey
        };
        var primaryKeyType = ['number'];
        fields.forEach(function (field) {
            if (primaryKey.includes(field.name)) {
                primaryKeyType.push(field.type.name);
            }
        });
        this.resolveBizEntityTemplate(domainPath, entityData);
        var bizTemplateRenderedList = [_types_1.NestJsBizTemplateType.CONTROLLER, _types_1.NestJsBizTemplateType.MODULE, _types_1.NestJsBizTemplateType.SERVICE];
        var dtoTemplateRenderedList = [_types_1.NestJsDtoTemplateType.CREATE, _types_1.NestJsDtoTemplateType.FIND, _types_1.NestJsDtoTemplateType.REMOVE, _types_1.NestJsDtoTemplateType.REMOVE, _types_1.NestJsDtoTemplateType.RETRIEVE, _types_1.NestJsDtoTemplateType.UPDATE];
        bizTemplateRenderedList.forEach(function (type) {
            _this.reolveCommonTemplate({
                tableName: tableName,
                type: type,
                primaryKey: primaryKey[0],
                primaryKeyType: primaryKeyType[0]
            }, domainPath);
        });
        dtoTemplateRenderedList.forEach(function (type) {
            _this.resolveDtoTemplate(domainPath, entityData, type);
        });
    };
    NestjsResolver.prototype.renderCustomerCode = function (dbData) {
        var _this = this;
        var dbDetail = dbData.dbInfo;
        dbDetail.forEach(function (_dbDetail) {
            var tableName = _dbDetail.tableName;
            var primaryKey = _dbDetail.primaryKey;
            var fields = _dbDetail.fields;
            _this.renderDomain({
                tableName: tableName,
                fields: fields,
                primaryKey: primaryKey
            });
        });
    };
    NestjsResolver.prototype.renderMainAndModuleCode = function (data) {
        var _this = this;
        var dbDetail = data.dbInfo;
        var customerModulesImport = [];
        var customerModulesDefine = [];
        var dbName = '';
        dbDetail.forEach(function (_dbDetail) {
            var tableName = _dbDetail.tableName;
            dbName = _dbDetail.dbName || data.dbName;
            var tableNameUpper = _this.firstChartToUppercase(tableName);
            customerModulesImport.push("import { ".concat(tableNameUpper, "Module } from './").concat(tableName, "/").concat(tableName, ".module';"));
            customerModulesDefine.push("".concat(tableNameUpper, "Module,"));
        });
        var renderData = {
            customerModulesImport: customerModulesImport.join('\n'),
            customerModulesDefine: customerModulesDefine.join('\n\t\t'),
            dbName: dbName
        };
        var templateList = ['app.controller', 'app.module', 'app.service', 'main'];
        templateList.forEach(function (templateName) {
            var templateContent = (0, fs_1.readFileSync)((0, path_1.join)(_this.sourcePath, "".concat(templateName, ".template"))).toString();
            var transformedContent = _this.renderTemplate(templateContent, renderData);
            var targetPath = (0, path_1.join)(_this.targetPath, CustomerCodePathPrefix, "".concat(templateName, ".ts"));
            (0, fs_1.writeFileSync)(targetPath, transformedContent, { encoding: 'utf-8' });
        });
    };
    NestjsResolver.prototype.renderSConfig = function (dbName) {
        var sTemplate = (0, fs_1.readFileSync)((0, path_1.join)(this.sourcePath, 's.yaml.template')).toString();
        var finalContent = this.renderTemplate(sTemplate, { dbName: dbName });
        var targetSPath = (0, path_1.join)(this.targetPath, 's.yaml');
        (0, fs_1.writeFileSync)(targetSPath, finalContent, { encoding: 'utf-8' });
    };
    NestjsResolver.prototype.render = function (data) {
        this.directCopyBizDir(); //复制不需要修改的代码结构
        this.renderSConfig(data.dbInfo[0].dbName || data.dbName); //渲染s配置文件
        this.renderCustomerCode(data); //渲染自定义业务代码
        this.renderMainAndModuleCode(data); //渲染主控制逻辑代码
    };
    return NestjsResolver;
}(Resolver_1.default));
exports.default = NestjsResolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTmVzdGpzUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVzb2x2ZXJzL05lc3Rqc1Jlc29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBR0EseUJBQWlEO0FBQ2pELDZCQUF3QztBQUN4Qyx3REFBa0M7QUFDbEMsb0NBQXNHO0FBRXRHLElBQU0sc0JBQXNCLEdBQUcsS0FBSyxDQUFDLENBQUMsV0FBVztBQVNqRDtJQUE0QyxrQ0FBUTtJQUdoRCx3QkFBWSxVQUFrQixFQUFFLFVBQWtCO2VBQzlDLGtCQUFNLFVBQVUsRUFBRSxVQUFVLENBQUM7SUFFakMsQ0FBQztJQUVPLGlEQUF3QixHQUFoQyxVQUFpQyxZQUFvQixFQUFFLElBQXdCO1FBQ25FLElBQUEsU0FBUyxHQUF5QixJQUFJLFVBQTdCLEVBQUUsTUFBTSxHQUFpQixJQUFJLE9BQXJCLEVBQUUsVUFBVSxHQUFLLElBQUksV0FBVCxDQUFVO1FBQy9DLElBQU0sY0FBYyxHQUFHLElBQUEsaUJBQVksRUFBQyxJQUFBLFdBQVEsRUFBQyxJQUFJLENBQUMsVUFBVSxFQUFFLGlCQUFpQixDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUM3RixJQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMscUJBQXFCLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDN0QsSUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLEdBQUcsQ0FBQyxVQUFDLElBQWU7WUFDckMsSUFBTSxTQUFTLEdBQTBCLElBQUksS0FBOUIsRUFBRSxJQUFJLEdBQW9CLElBQUksS0FBeEIsRUFBRSxhQUFhLEdBQUssSUFBSSxjQUFULENBQVU7WUFDcEQsSUFBSSxVQUFVLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxFQUFFO2dCQUNoQyxJQUFNLFlBQVksR0FBRyxhQUFhLENBQUMsQ0FBQyxDQUFDLDJCQUEyQixDQUFDLENBQUMsQ0FBQyxrQkFBa0IsQ0FBQztnQkFD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