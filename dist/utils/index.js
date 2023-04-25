"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyFolders = exports.getCorrectPath = exports.renderTemplate = exports.firstChartToUppercase = void 0;
var fs_1 = __importStar(require("fs"));
var path_1 = require("path");
var constants_1 = require("../constants");
var firstChartToUppercase = function (str) {
    var firstChart = str.substring(0, 1);
    var otherChart = str.substr(1);
    return firstChart.toUpperCase() + otherChart;
};
exports.firstChartToUppercase = firstChartToUppercase;
var renderTemplate = function (template, data) {
    return template.replace(constants_1.TemplateReg, function (match, key) {
        return data[key];
    });
};
exports.renderTemplate = renderTemplate;
var getCorrectPath = function (pathName) {
    try {
        (0, fs_1.statSync)(pathName);
    }
    catch (e) {
        (0, fs_1.mkdirSync)(pathName);
    }
    return pathName;
};
exports.getCorrectPath = getCorrectPath;
var copyFolders = function (copiedPath, resultPath) {
    (0, exports.getCorrectPath)(resultPath);
    var files = (0, fs_1.readdirSync)(copiedPath, { withFileTypes: true });
    for (var i = 0; i < files.length; i++) {
        var cf = files[i];
        var source = (0, path_1.join)(copiedPath, cf.name);
        var target = (0, path_1.join)(resultPath, cf.name);
        if (cf.isFile()) {
            var readStream = fs_1.default.createReadStream(source);
            var writeStream = fs_1.default.createWriteStream(target);
            readStream.pipe(writeStream);
        }
        else {
            try {
                fs_1.default.accessSync((0, path_1.join)(source, '..'), fs_1.default.constants.W_OK);
                (0, exports.copyFolders)(source, target);
            }
            catch (error) {
                console.log('folder write error:', error);
            }
        }
    }
};
exports.copyFolders = copyFolders;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi9zcmMvdXRpbHMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFDQSx1Q0FBMEQ7QUFDMUQsNkJBQXdDO0FBQ3hDLDBDQUEyQztBQUdwQyxJQUFNLHFCQUFxQixHQUFHLFVBQUMsR0FBVztJQUM3QyxJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQztJQUN2QyxJQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ2pDLE9BQU8sVUFBVSxDQUFDLFdBQVcsRUFBRSxHQUFHLFVBQVUsQ0FBQztBQUVqRCxDQUFDLENBQUE7QUFMWSxRQUFBLHFCQUFxQix5QkFLakM7QUFDTSxJQUFNLGNBQWMsR0FBRyxVQUFDLFFBQVEsRUFBRSxJQUFJO0lBQ3pDLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyx1QkFBVyxFQUFFLFVBQUMsS0FBSyxFQUFFLEdBQUc7UUFDNUMsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDckIsQ0FBQyxDQUFDLENBQUM7QUFDUCxDQUFDLENBQUE7QUFKWSxRQUFBLGNBQWMsa0JBSTFCO0FBRU0sSUFBTSxjQUFjLEdBQUcsVUFBQyxRQUFnQjtJQUMzQyxJQUFJO1FBQ0EsSUFBQSxhQUFRLEVBQUMsUUFBUSxDQUFDLENBQUE7S0FDckI7SUFBQyxPQUFPLENBQUMsRUFBRTtRQUNSLElBQUEsY0FBUyxFQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQ3ZCO0lBRUQsT0FBTyxRQUFRLENBQUM7QUFDcEIsQ0FBQyxDQUFBO0FBUlksUUFBQSxjQUFjLGtCQVExQjtBQUdNLElBQU0sV0FBVyxHQUFHLFVBQUMsVUFBVSxFQUFFLFVBQVU7SUFDOUMsSUFBQSxzQkFBYyxFQUFDLFVBQVUsQ0FBQyxDQUFDO0lBQzNCLElBQU0sS0FBSyxHQUFHLElBQUEsZ0JBQVcsRUFBQyxVQUFVLEVBQUUsRUFBRSxhQUFhLEVBQUUsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUMvRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNuQyxJQUFNLEVBQUUsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEIsSUFBTSxNQUFNLEdBQUcsSUFBQSxXQUFRLEVBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUM3QyxJQUFNLE1BQU0sR0FBRyxJQUFBLFdBQVEsRUFBQyxVQUFVLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdDLElBQUksRUFBRSxDQUFDLE1BQU0sRUFBRSxFQUFFO1lBQ2IsSUFBTSxVQUFVLEdBQUcsWUFBRSxDQUFDLGdCQUFnQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1lBQy9DLElBQU0sV0FBVyxHQUFHLFlBQUUsQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUNqRCxVQUFVLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO1NBQ2hDO2FBQU07WUFDSCxJQUFJO2dCQUNBLFlBQUUsQ0FBQyxVQUFVLENBQUMsSUFBQSxXQUFRLEVBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxFQUFFLFlBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7Z0JBQ3pELElBQUEsbUJBQVcsRUFBQyxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQUM7YUFDL0I7WUFBQyxPQUFPLEtBQUssRUFBRTtnQkFDWixPQUFPLENBQUMsR0FBRyxDQUFDLHFCQUFxQixFQUFFLEtBQUssQ0FBQyxDQUFBO2FBQzVDO1NBQ0o7S0FDSjtBQUNMLENBQUMsQ0FBQTtBQXBCWSxRQUFBLFdBQVcsZUFvQnZCIn0=