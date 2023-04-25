"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var pegjs_1 = require("pegjs");
var NestjsResolver_1 = __importDefault(require("./resolvers/NestjsResolver"));
var constants_1 = require("./constants");
function main() {
    var newsq = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../lastest.sql')).toString();
    var result = newsq.match(constants_1.MysqlSqlFormatInnoDbReg);
    var formatSQL = result.join('\n');
    // 引入编写的 peg 规则
    var grammar = (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../mysql_schema.pegjs')).toString();
    // 构造生成器
    var parser = (0, pegjs_1.generate)(grammar);
    // 解析
    var dbData = parser.parse(formatSQL);
    var nestjsSourceTempatePath = (0, path_1.join)(__dirname, '../nestjs-templates');
    var nestjsTargetBuildPath = (0, path_1.join)(__dirname, '../build');
    var nestjsResolver = new NestjsResolver_1.default(nestjsSourceTempatePath, nestjsTargetBuildPath);
    dbData.dbName = 'rmq-community';
    nestjsResolver.render(dbData);
}
main();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSx5QkFBa0M7QUFDbEMsNkJBQXdDO0FBQ3hDLCtCQUFpQztBQUNqQyw4RUFBd0Q7QUFFeEQseUNBQXNEO0FBSXRELFNBQVMsSUFBSTtJQUNULElBQU0sS0FBSyxHQUFHLElBQUEsaUJBQVksRUFBQyxJQUFBLFdBQVEsRUFBQyxTQUFTLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDO0lBQzdFLElBQU0sTUFBTSxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsbUNBQXVCLENBQUMsQ0FBQztJQUVwRCxJQUFNLFNBQVMsR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQ3BDLGVBQWU7SUFDZixJQUFNLE9BQU8sR0FBRyxJQUFBLGlCQUFZLEVBQUMsSUFBQSxXQUFRLEVBQUMsU0FBUyxFQUFFLHVCQUF1QixDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQztJQUN0RixRQUFRO0lBQ1IsSUFBTSxNQUFNLEdBQUcsSUFBQSxnQkFBUSxFQUFDLE9BQU8sQ0FBQyxDQUFDO0lBQ2pDLEtBQUs7SUFDTCxJQUFNLE1BQU0sR0FBVyxNQUFNLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0lBQy9DLElBQU0sdUJBQXVCLEdBQUcsSUFBQSxXQUFRLEVBQUMsU0FBUyxFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDM0UsSUFBTSxxQkFBcUIsR0FBRyxJQUFBLFdBQVEsRUFBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDOUQsSUFBTSxjQUFjLEdBQUcsSUFBSSx3QkFBYyxDQUFDLHVCQUF1QixFQUFFLHFCQUFxQixDQUFDLENBQUM7SUFDMUYsTUFBTSxDQUFDLE1BQU0sR0FBRyxlQUFlLENBQUM7SUFDaEMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBR0QsSUFBSSxFQUFFLENBQUMifQ==