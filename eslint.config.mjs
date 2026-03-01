import nextConfig from 'eslint-config-next'
import prettierConfig from 'eslint-config-prettier'

const eslintConfig = [
  ...nextConfig,
  prettierConfig,
  {
    ignores: ['.next/**', 'node_modules/**'],
  },
  {
    rules: {
      // useLocalStorage and similar hooks legitimately call setState inside
      // useEffect for hydration from external storage — disable this strict rule.
      'react-hooks/set-state-in-effect': 'off',
    },
  },
]

export default eslintConfig
