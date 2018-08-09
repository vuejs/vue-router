import { getParameters } from 'codesandbox/lib/api/define'

export function getCodesandboxParameters(files) {
  const data = {
    files: {
      'package.json': {
        content: {
          main: 'main.js',
          dependencies: {
            vue: 'latest',
            'vue-router': 'latest'
          }
        }
      },
      ...files.reduce(
        (fileMap, file) => ({
          ...fileMap,
          ...file
        }),
        {}
      )
    }
  }

  return getParameters(data)
}

const scriptRE = /\s*<script[^>]*>[\s\S]*<\/script>\s*/m
export function removeScriptSection(content) {
  return content.replace(scriptRE, '')
}
