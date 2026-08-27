import test from 'node:test'
import assert from 'node:assert/strict'
import { questionFingerprint, validateBackup } from '../utils/backup.mjs'
test('backup valid diterima', () => assert.equal(validateBackup({ version: 1, soal: [{ pertanyaan: 'Soal valid' }] }).soal.length, 1))
test('backup rusak ditolak', () => assert.throws(() => validateBackup({ version: 1, soal: [{}] })))
test('fingerprint menormalkan spasi dan huruf', () => assert.equal(questionFingerprint({ kelas: 4, mapel: 'IPA', pertanyaan: '  Siklus   AIR ' }), '4|IPA|siklus air'))

