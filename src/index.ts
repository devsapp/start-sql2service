import { readFileSync } from 'fs';
import { join as pathJoin } from 'path';
import { generate } from 'pegjs';
import NestjsResolver from './resolvers/NestjsResolver';
import { DbInfo } from './@types';
import { MysqlSqlFormatInnoDbReg } from './constants';



function main() {
    const newsq = readFileSync(pathJoin(__dirname, '../lastest.sql')).toString();
    const result = newsq.match(MysqlSqlFormatInnoDbReg);

    const formatSQL = result.join('\n');
    // 引入编写的 peg 规则
    const grammar = readFileSync(pathJoin(__dirname, '../mysql_schema.pegjs')).toString();
    // 构造生成器
    const parser = generate(grammar);
    // 解析
    const dbData: DbInfo = parser.parse(formatSQL);
    const nestjsSourceTempatePath = pathJoin(__dirname, '../nestjs-templates');
    const nestjsTargetBuildPath = pathJoin(__dirname, '../build');
    const nestjsResolver = new NestjsResolver(nestjsSourceTempatePath, nestjsTargetBuildPath);
    dbData.dbName = 'rmq-community';
    nestjsResolver.render(dbData);
}


main();



