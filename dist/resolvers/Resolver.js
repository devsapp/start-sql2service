"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var utils_1 = require("../utils");
var Resolver = /** @class */ (function () {
    function Resolver(sourcePath, targetPath) {
        this.sourcePath = sourcePath;
        this.targetPath = targetPath;
    }
    Resolver.prototype.renderTemplate = function (str, renderData) {
        try {
            return (0, utils_1.renderTemplate)(str, renderData);
        }
        catch (e) {
            return str;
        }
    };
    Resolver.prototype.firstChartToUppercase = function (str) {
        return (0, utils_1.firstChartToUppercase)(str);
    };
    Resolver.prototype.getCorrectPath = function (path) {
        return (0, utils_1.getCorrectPath)(path);
    };
    Resolver.prototype.reolveCommonTemplate = function (data, targetFolder) {
        var type = data.type, tableName = data.tableName, primaryKey = data.primaryKey, primaryKeyType = data.primaryKeyType;
        var originTemplate = (0, fs_1.readFileSync)((0, path_1.join)(this.sourcePath, "".concat(type, ".template"))).toString();
        var tableNameUpper = this.firstChartToUppercase(tableName);
        var renderData = {
            tableName: tableName,
            tableNameUpper: tableNameUpper
        };
        if (primaryKey && primaryKeyType) {
            renderData['primaryKeyType'] = primaryKeyType;
            renderData['primaryKey'] = primaryKey;
        }
        var finalContent = this.renderTemplate(originTemplate, renderData);
        var targetPath = targetFolder ? (0, path_1.join)(targetFolder, "".concat(tableName, ".").concat(type, ".ts")) : (0, path_1.join)(this.targetPath, "".concat(tableName, ".").concat(type, ".ts"));
        (0, fs_1.writeFileSync)(targetPath, finalContent, { encoding: 'utf-8' });
    };
    Resolver.prototype.directCopyBizDir = function () {
        var copySourceDir = (0, path_1.join)(this.sourcePath, 'direct-copy-folders');
        (0, utils_1.copyFolders)(copySourceDir, this.targetPath);
    };
    return Resolver;
}());
exports.default = Resolver;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiUmVzb2x2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvcmVzb2x2ZXJzL1Jlc29sdmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQ0EseUJBQWlEO0FBQ2pELDZCQUF3QztBQUN4QyxrQ0FBOEY7QUFHOUY7SUFNSSxrQkFBWSxVQUFrQixFQUFFLFVBQWtCO1FBQzlDLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO1FBQzdCLElBQUksQ0FBQyxVQUFVLEdBQUcsVUFBVSxDQUFDO0lBQ2pDLENBQUM7SUFFUyxpQ0FBYyxHQUF4QixVQUF5QixHQUFXLEVBQUUsVUFBZTtRQUNqRCxJQUFJO1lBQ0EsT0FBTyxJQUFBLHNCQUFjLEVBQUMsR0FBRyxFQUFFLFVBQVUsQ0FBQyxDQUFDO1NBQzFDO1FBQUMsT0FBTyxDQUFDLEVBQUU7WUFDUixPQUFPLEdBQUcsQ0FBQztTQUNkO0lBQ0wsQ0FBQztJQUVTLHdDQUFxQixHQUEvQixVQUFnQyxHQUFXO1FBQ3ZDLE9BQU8sSUFBQSw2QkFBcUIsRUFBQyxHQUFHLENBQUMsQ0FBQztJQUN0QyxDQUFDO0lBRVMsaUNBQWMsR0FBeEIsVUFBeUIsSUFBSTtRQUV6QixPQUFPLElBQUEsc0JBQWMsRUFBQyxJQUFJLENBQUMsQ0FBQztJQUNoQyxDQUFDO0lBRVMsdUNBQW9CLEdBQTlCLFVBQStCLElBQWlCLEVBQUUsWUFBcUI7UUFDM0QsSUFBQSxJQUFJLEdBQTRDLElBQUksS0FBaEQsRUFBRSxTQUFTLEdBQWlDLElBQUksVUFBckMsRUFBRSxVQUFVLEdBQXFCLElBQUksV0FBekIsRUFBRSxjQUFjLEdBQUssSUFBSSxlQUFULENBQVU7UUFDN0QsSUFBTSxjQUFjLEdBQUcsSUFBQSxpQkFBWSxFQUFDLElBQUEsV0FBUSxFQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUsVUFBRyxJQUFJLGNBQVcsQ0FBQyxDQUFDLENBQUMsUUFBUSxFQUFFLENBQUM7UUFDOUYsSUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQzdELElBQU0sVUFBVSxHQUFHO1lBQ2YsU0FBUyxXQUFBO1lBQ1QsY0FBYyxnQkFBQTtTQUNqQixDQUFBO1FBQ0QsSUFBSSxVQUFVLElBQUksY0FBYyxFQUFFO1lBQzlCLFVBQVUsQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLGNBQWMsQ0FBQztZQUM5QyxVQUFVLENBQUMsWUFBWSxDQUFDLEdBQUcsVUFBVSxDQUFDO1NBQ3pDO1FBQ0QsSUFBTSxZQUFZLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxjQUFjLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDckUsSUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLENBQUMsQ0FBQyxJQUFBLFdBQVEsRUFBQyxZQUFZLEVBQUUsVUFBRyxTQUFTLGNBQUksSUFBSSxRQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBQSxXQUFRLEVBQUMsSUFBSSxDQUFDLFVBQVUsRUFBRSxVQUFHLFNBQVMsY0FBSSxJQUFJLFFBQUssQ0FBQyxDQUFDO1FBQzNJLElBQUEsa0JBQWEsRUFBQyxVQUFVLEVBQUUsWUFBWSxFQUFFLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxDQUFDLENBQUM7SUFDbkUsQ0FBQztJQUVTLG1DQUFnQixHQUExQjtRQUNJLElBQU0sYUFBYSxHQUFHLElBQUEsV0FBUSxFQUFDLElBQUksQ0FBQyxVQUFVLEVBQUUscUJBQXFCLENBQUMsQ0FBQztRQUN2RSxJQUFBLG1CQUFXLEVBQUMsYUFBYSxFQUFFLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztJQUNoRCxDQUFDO0lBT0wsZUFBQztBQUFELENBQUMsQUF2REQsSUF1REMifQ==