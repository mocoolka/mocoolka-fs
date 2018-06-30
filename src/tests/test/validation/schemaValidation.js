let Ajv = require('ajv');
let ajv = new Ajv({ useDefaults: true, verbose: true, allErrors: true });
let schemaM = require('./schema/mocoolka.json');
require('ajv-keywords')(ajv, ['formatMinimum', 'formatMaximum', 'range', 'patternRequired', 'prohibited', 'if']);
require('./mk-keywords/index')(ajv);

ajv.addMetaSchema(schemaM);
const schemaMap = new Map();
const validate = (msg, callback)=> {
  let schema = msg.schema;
  let data = msg.data;

  schema.$schema = 'mocoolka';
  let validateF = null;
  if (schemaMap.has(schema)) {
    validateF = schemaMap.get(schema);
  } else {
    validateF = ajv.compile(schema);
    schemaMap.set(schema, validateF);
  }

  let valid = validateF(data);
  if (!valid) {
    callback(validateF.errors);
  } else {
    callback(null);
  }

};

const addKeyword = (name, schema, func)=> {
  let obj = true;
  if (schema.type !== 'object' && schema.type != 'array') {
    obj = false;
  }

  ajv.addKeyword(name, {

    compile: function (metaSchema, parentSchema) {
      return function (data)
      {
        console.log(data)
        if(obj){
          return func({ data, metaSchema });
        }
        else
          return func( data) ===metaSchema;
      };
    },

    errors: false,
    metaSchema: obj ? schema.properties.metaSchema : {type:'boolean'},
  });
};

module.exports.__proto__ = {
  validate,
  addKeyword,
};

