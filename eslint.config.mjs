import next from "eslint-config-next";

const eslintConfig = [
  ...next,
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "public/qlosophy/**",
      "qlosophy/**",
      "atqm_docs/**",
      "screenshots/**",
      "uploads/**",
    ],
  },
];

export default eslintConfig;
