export const validateBackup = data => {
  if (!data || ![1, 2].includes(data.version) || !Array.isArray(data.soal)) throw new Error('Format backup tidak dikenali')
  if (data.soal.length > 20000) throw new Error('Backup melebihi batas 20.000 soal')
  data.soal.forEach((item, index) => {
    if (!item || typeof item.pertanyaan !== 'string' || !item.pertanyaan.trim()) throw new Error(`Soal ke-${index + 1} tidak valid`)
    if (item.tipe && !['pg', 'essay'].includes(item.tipe)) throw new Error(`Tipe soal ke-${index + 1} tidak valid`)
  })
  return data
}

export const questionFingerprint = item => [item.kelas, item.mapel, String(item.pertanyaan || '').trim().toLowerCase().replace(/\s+/g, ' ')].join('|')
