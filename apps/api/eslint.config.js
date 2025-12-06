import sharedConfig from '@craftedtales/config/eslint';

export default [
  ...sharedConfig,
  {
    files: [
      'src/docs/openapi.ts',
      'src/routes/v1/**/*.ts',
    ],
    rules: {
      // OpenAPI schemas legitimately use numeric status codes and content-type keys
      '@typescript-eslint/naming-convention': 'off',
    },
  },
];
