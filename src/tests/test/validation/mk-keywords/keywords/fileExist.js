const fileTools = require('../../../file-tools');
module.exports = function defFunc(ajv) {
  defFunc.definition = {
    type: 'string',
    compile: function (schema, parentSchema) {
      return function (data)
      {
          return (fileTools.fileExist(data) === schema);
        };
    },

    errors: 'true',
    metaSchema: {
      type: 'boolean',
    },
  };

  ajv.addKeyword('fileExist', defFunc.definition);
  return ajv;

};
