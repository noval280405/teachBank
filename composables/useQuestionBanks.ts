import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore'

const safePart = (value: unknown) => String(value || 'unknown')
  .trim()
  .toLowerCase()
  .replace(/[^a-z0-9_-]+/g, '-')
  .replace(/^-+|-+$/g, '')
  .slice(0, 60) || 'unknown'

export const useQuestionBanks = () => {
  const { db } = useFirebase()

  const bankIdFor = ({ teacherId, assignmentId, classLevel, subject }: any) =>
    `${String(teacherId || 'teacher').replace(/[^a-zA-Z0-9_-]+/g, '-')}__${safePart(assignmentId)}__class-${safePart(classLevel)}__${safePart(subject)}`

  const bankRefFor = (context: any) => doc(db, 'questionBanks', bankIdFor(context))
  const questionsRefFor = (context: any) => collection(bankRefFor(context), 'questions')
  const questionRefFor = (context: any, questionId: string) => doc(bankRefFor(context), 'questions', questionId)

  const ensureBank = async (context: any) => {
    const reference = bankRefFor(context)
    const existing = await getDoc(reference)
    const schoolId = context.schoolId || `${String(context.teacherId).replace(/[^a-zA-Z0-9_-]+/g, '-')}__${safePart(context.schoolName)}`
    const teachingAssignmentId = `${String(context.teacherId).replace(/[^a-zA-Z0-9_-]+/g, '-')}__${safePart(context.assignmentId)}`
    await Promise.all([
      setDoc(doc(db, 'teachers', context.teacherId), { userId: context.teacherId, updatedAt: new Date() }, { merge: true }),
      setDoc(doc(db, 'schools', schoolId), { ownerId: context.teacherId, name: context.schoolName || 'Sekolah Saya', educationLevel: context.educationLevel || '', updatedAt: new Date() }, { merge: true }),
      setDoc(doc(db, 'teachingAssignments', teachingAssignmentId), { ownerId: context.teacherId, teacherId: context.teacherId, schoolId, assignmentId: context.assignmentId, updatedAt: new Date() }, { merge: true }),
    ])
    await setDoc(reference, {
      ownerId: context.teacherId,
      schoolId,
      teachingAssignmentId,
      schoolName: context.schoolName || 'Sekolah Saya',
      assignmentId: context.assignmentId,
      subjectId: safePart(context.subject),
      subjectName: context.subject,
      classLevel: Number(context.classLevel),
      educationLevel: context.educationLevel || '',
      updatedAt: new Date(),
      ...(!existing.exists() ? { createdAt: new Date(), schemaVersion: 2 } : {}),
    }, { merge: true })
    return reference
  }

  // Migrasi salinan aman: dokumen lama dipertahankan sampai pengguna memutuskan menghapusnya.
  const migrateLegacyQuestions = async (context: any) => {
    const bankReference = await ensureBank(context)
    const bankSnapshot = await getDoc(bankReference)
    if (bankSnapshot.data()?.legacyMigrationComplete) return

    const legacySnapshot = await getDocs(query(
      collection(db, 'soal'),
      where('userId', '==', context.teacherId),
      where('kelas', '==', Number(context.classLevel)),
      where('mapel', '==', context.subject),
    ))
    const matching = legacySnapshot.docs.filter((item) => {
      const legacyAssignment = item.data().assignmentId
      return context.assignmentId === 'legacy'
        ? !legacyAssignment || legacyAssignment === 'legacy'
        : legacyAssignment === context.assignmentId
    })
    for (let offset = 0; offset < matching.length; offset += 400) {
      const batch = writeBatch(db)
      matching.slice(offset, offset + 400).forEach((item) => {
        batch.set(doc(bankReference, 'questions', item.id), {
          ...item.data(),
          status: item.data().status || 'aktif',
          createdBy: context.teacherId,
          bankId: bankReference.id,
          migratedFrom: `soal/${item.id}`,
          migratedAt: new Date(),
        }, { merge: true })
      })
      await batch.commit()
    }
    await setDoc(bankReference, {
      legacyMigrationComplete: true,
      legacyMigratedCount: matching.length,
      legacyMigratedAt: new Date(),
    }, { merge: true })
  }

  return { bankIdFor, bankRefFor, questionsRefFor, questionRefFor, ensureBank, migrateLegacyQuestions }
}
