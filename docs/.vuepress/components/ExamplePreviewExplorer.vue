<template>
  <div v-html="content" class="code" :class="'language-' + language"></div>
</template>

<script>
// pretty much copied from vuepress sourcecode
const prism = require('prismjs')
// const loadLanguages = require('prismjs/components/index')
const escapeHtml = require('escape-html')

// required to make embedded highlighting work...
// loadLanguages(['markup', 'css', 'javascript'])

function wrap (code, lang) {
  if (lang === 'text') {
    code = escapeHtml(code)
  }
  return `<pre class="language-${lang}" style="margin: 0"><code>${code}</code></pre>`
}

function highlightCode (str, lang) {
  if (!lang) {
    return wrap(str, 'text')
  }
  lang = lang.toLowerCase()
  const rawLang = lang
  if (lang === 'vue' || lang === 'html') {
    lang = 'markup'
  }
  if (lang === 'md') {
    lang = 'markdown'
  }
  if (lang === 'ts') {
    lang = 'typescript'
  }
  if (lang === 'py') {
    lang = 'python'
  }
  if (prism.languages[lang]) {
    const code = prism.highlight(str, prism.languages[lang], lang)
    return wrap(code, rawLang)
  } else {
      console.warn(`[vuepress] Syntax highlight for language "${lang}" is not supported.`)
  }
  return wrap(str, 'text')
}

export default {
  props: {
    file: Object
  },

  computed: {
    language: ({ file: { name }}) => name.substring(name.lastIndexOf('.') + 1, name.length),
    content: ({ file, language}) => highlightCode(file.content, language)
  }
}
</script>

<style scoped>
.code {
  border-radius: 0 0 4px 4px;
}

.code pre {
  margin: 0;
}

@media (max-width: 419px) {
  .code.code.code {
    margin: 0;
  }
}
</style>
