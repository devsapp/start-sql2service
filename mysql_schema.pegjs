Block = 
    _ dbInfo:ModelBlock*
    {
    return {
        dbInfo
    }
} 
ModelBlock =
    _ 'CREATE TABLE'
    _ 'IF NOT EXISTS'?
    _ '`'
    _ firstName:Identifier
    _ '`'
    _ '.'?
    _ '`'?
    _ secondName:Identifier?
    _ '`'?
    _ '(' 
    _ fields: CommonField*
    _ primary: PrimaryKey?
    _ comma: ','?
    _ uniqueKey: UNIQUE_KEY?
    _ ')'
    _ 'ENGINE'
    _ {
        return {
            dbName :secondName ? firstName: '',
            tableName: secondName ? secondName : firstName,
            fields,
            primaryKey: primary?primary:''
        }
    }




CommonField = 
    _ name: Variant_Idenfifier
    _ type: Type
    _ not: NOT?
    _ isNull: NULL?
    _ defaultValue: DEFAULT_TAG ?
    _ autoIncrement: AUTO_INCREMENT?
    _ comment: COMMENTIdentifier?
    _ comma: ','?
    {

        return {
            name: name?name:'',
            type: type.content,
            isNull: not? false: true,
            comment: comment?comment:'' ,
            autoIncrement: autoIncrement? true: false
        }
    }
Type = 
    _ stringType: String?
    _ intType: Int?
    {
        return {
            content: intType ? intType : (stringType ? stringType: {name: 'unknow',length:0 })
        }
    }
Int = int:IntMysqlType value:LengthValue?{
    return {
        name: 'number',
        length: value? value.join(''): 0,
    }
}

String = stringType:StringMysqlType value:LengthValue?{
    return {
        length: value? value.join(''): 0,
        name: 'string'
    }
}
NULL_OR_NOT = ''
DEFAULT_TAG = 
    _ 'DEFAULT'i
    _ '\''?
    _ value: StrAndInteger? 
    _ '\''? {
        return value
    }
CURRENT_TIMESTAMP_TAG = 'CURRENT_TIMESTAMP'i
LengthValue = '('value:Integer')' {
    return value
}

IntMysqlType = 'INT'i/'TINYINT'i/'FLOAT'i/'SMALLINT'i/'MEDIUMINT'i/'DOUBLE'i/'DECIMAL'i
StringMysqlType = 'CHAR'i/'VARCHAR'i/'LONGTEXT'i/'TEXT'i/'MEDIUMTEXT'i/'DATETIME'i


DB_ENGINE = 'InnoDB'/'Other'

COMMENTIdentifier = 
    _ 'COMMENT'
    _ '\''_value:Identifier'\'' {
    return _value
} 
AUTO_INCREMENT = 'AUTO_INCREMENT'
NOT = 'NOT'i{
    return true
}
NULL = 'NULL'i;
PrimaryKey = 
    _ 'PRIMARY'
    _ 'KEY'
    _ '('
    _ value:PrimaryKeyType+
    _ ')'
    {
        return value
    }
UNIQUE_KEY =
    _ 'UNIQUE'
    _ 'KEY'
    _ '`'
    _ str: Identifier
    _ '`'
    _ '('
    _ value:PrimaryKeyType+
    _ ')'
PrimaryKeyType = 
    _ '`'
    _ keyName: Identifier
    _ '`'
    _ ','? {
        return keyName
    }
Variant_Idenfifier = '`'name:Identifier'`'{
    return name
}

AnyChart = 
    Ident_part2
Ident_part2 = _ Ident_part

Identifier = $([a-zA-Z_\-\u4e00-\u9fa5])+
Integer = [0-9]*
StrAndInteger = $([0-9a-zA-Z_])*
Ident_part
= $[A-Za-z0-9\-\:\.\@\_\=\,\;\'\`\(\)\t\n\r]+

// Text
//  = text:TextUntilTerminator { return text.join(""); }

// TextUntilTerminator
//  = x:(&HaveTerminatorAhead .)* { return x.map(y => y[1]) }

// HaveTerminatorAhead
//  = . (!"-" .)* "-"

_ "whitespace"
= [ \t\n\r]*