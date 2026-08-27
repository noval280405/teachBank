const clean = value => String(value || '').trim().toLowerCase().replace(/\s+/g, ' ')

export const validateQuestion = question => {
  const issues = []
  const text = clean(question.pertanyaan)
  if (!text) issues.push('Pertanyaan belum diisi')
  else if (text.length < 12) issues.push('Pertanyaan terlalu pendek')
  if (!question.materi) issues.push('Materi belum ditentukan')
  if (!question.tujuanPembelajaran) issues.push('Tujuan pembelajaran belum ditentukan')
  if (!question.levelKognitif) issues.push('Level kognitif belum ditentukan')
  if ((question.tipe || 'pg') !== 'essay') {
    const answers = Object.entries(question.opsi || {}).filter(([, value]) => clean(value))
    if (answers.length < 2) issues.push('Minimal dua opsi jawaban diperlukan')
    if (!question.kunciJawaban || !clean(question.opsi?.[question.kunciJawaban])) issues.push('Kunci jawaban tidak valid')
    const values = answers.map(([, value]) => clean(value))
    if (new Set(values).size !== values.length) issues.push('Ada opsi jawaban yang sama')
  } else if (!clean(question.pembahasan || question.kunciJawaban)) {
    issues.push('Pedoman jawaban belum diisi')
  }
  return issues
}

export const similarity = (left, right) => {
  const a = new Set(clean(left).split(' ').filter(Boolean))
  const b = new Set(clean(right).split(' ').filter(Boolean))
  if (!a.size || !b.size) return 0
  const intersection = [...a].filter(word => b.has(word)).length
  return intersection / new Set([...a, ...b]).size
}

export const findPossibleDuplicate = (question, questions, ignoredId) =>
  questions.find(item => item.id !== ignoredId && similarity(question, item.pertanyaan) >= 0.82)

