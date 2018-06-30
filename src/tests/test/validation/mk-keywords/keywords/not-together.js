
export default function defFunc(ajv) {
  defFunc.definition = {
    type: 'object',

    macro: function (schema, parentSchema) {
      return {
        if: { required: [schema.name] },
        then: { prohibited: schema.value },
      };
    },

    errors: 'false',
    metaSchema: {
      type: 'object',
      properties: {
        name: { type: 'string' },
        value: {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      },
    },
  };

  ajv.addKeyword('notTogether', defFunc.definition);
  return ajv;

};
