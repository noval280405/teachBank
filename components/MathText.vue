<template><component :is="tag" class="math-text" v-html="rendered" /></template>

<script setup>
import katex from 'katex'
import 'katex/dist/katex.min.css'

const props = defineProps({ text: { type: String, default: '' }, tag: { type: String, default: 'span' } })
const escapeHtml = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[char]))
const rendered = computed(() => {
  const source = props.text || ''
  const pattern = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g
  let last = 0
  let result = ''
  for (const match of source.matchAll(pattern)) {
    result += escapeHtml(source.slice(last, match.index)).replace(/\n/g, '<br>')
    const displayMode = match[0].startsWith('$$')
    const formula = displayMode ? match[0].slice(2, -2) : match[0].slice(1, -1)
    try { result += katex.renderToString(formula, { displayMode, throwOnError: false, strict: false, trust: false }) }
    catch { result += escapeHtml(match[0]) }
    last = match.index + match[0].length
  }
  return result + escapeHtml(source.slice(last)).replace(/\n/g, '<br>')
})
</script>
