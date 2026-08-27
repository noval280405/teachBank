import test from 'node:test'
import assert from 'node:assert/strict'
import { findPossibleDuplicate, similarity, validateQuestion } from '../utils/question-quality.mjs'

test('validasi fokus pada kelengkapan isi dan kunci soal', () => {
  const issues = validateQuestion({ tipe: 'pg', pertanyaan: 'Berapa hasil 2 + 2?', opsi: { a: '4', b: '5' }, kunciJawaban: 'c' })
  assert.ok(issues.includes('Kunci jawaban tidak valid'))
  assert.ok(!issues.some(issue => issue.includes('Materi') || issue.includes('kognitif')))
})

test('kemiripan menemukan kemungkinan duplikat', () => {
  const text = 'Berapakah hasil penjumlahan dua ditambah dua'
  assert.equal(similarity(text, text), 1)
  assert.ok(findPossibleDuplicate(text, [{ id: '1', pertanyaan: text }]))
})
