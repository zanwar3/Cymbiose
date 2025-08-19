import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const mockDiagnoses = [
  {
    clientId: '550e8400-e29b-41d4-a716-446655440001',
    diagnosisName: 'Major Depressive Disorder',
    justification: 'Client presents with persistent depressed mood, loss of interest in activities, sleep disturbances, and feelings of worthlessness for the past 6 weeks. PHQ-9 score of 18 indicates moderate to severe depression.',
    challengedDiagnosis: null,
    challengedJustification: null
  },
  {
    clientId: '550e8400-e29b-41d4-a716-446655440002',
    diagnosisName: 'Generalized Anxiety Disorder',
    justification: 'Excessive worry about multiple areas of life, difficulty controlling worry, restlessness, fatigue, difficulty concentrating, and sleep problems present for over 6 months. GAD-7 score of 15 indicates moderate anxiety.',
    challengedDiagnosis: 'Adjustment Disorder with Anxiety',
    challengedJustification: 'Client\'s symptoms appear to be more situational and related to recent job loss rather than chronic anxiety. Symptoms may resolve with time and support.'
  },
  {
    clientId: '550e8400-e29b-41d4-a716-446655440003',
    diagnosisName: 'Post-Traumatic Stress Disorder',
    justification: 'Client reports intrusive memories of car accident, avoidance of driving, hypervigilance, and sleep disturbances. PCL-5 score of 45 indicates probable PTSD. Symptoms began after traumatic event 3 months ago.',
    challengedDiagnosis: null,
    challengedJustification: null
  },
  {
    clientId: '550e8400-e29b-41d4-a716-446655440004',
    diagnosisName: 'Bipolar II Disorder',
    justification: 'History of hypomanic episodes lasting 4-7 days with elevated mood, increased energy, and decreased need for sleep, alternating with depressive episodes. Family history of bipolar disorder.',
    challengedDiagnosis: 'Cyclothymic Disorder',
    challengedJustification: 'While client does experience mood fluctuations, the episodes may not meet full criteria for hypomania. Symptoms appear to be more chronic and less severe than typical bipolar II.'
  },
  {
    clientId: '550e8400-e29b-41d4-a716-446655440005',
    diagnosisName: 'Social Anxiety Disorder',
    justification: 'Marked fear of social situations, avoidance of social interactions, fear of negative evaluation, and physical symptoms in social settings. LSAS score of 72 indicates severe social anxiety.',
    challengedDiagnosis: null,
    challengedJustification: null
  }
];

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.diagnosis.deleteMany();
  console.log('✅ Cleared existing diagnoses data');

  // Insert mock data
  for (const diagnosis of mockDiagnoses) {
    await prisma.diagnosis.create({
      data: {
        ...diagnosis,
        predictedDate: new Date(),
      }
    });
  }

  console.log(`✅ Successfully seeded ${mockDiagnoses.length} diagnoses`);
  console.log('📊 Mock data includes various diagnosis scenarios with challenges');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log('🔌 Database connection closed');
    console.log('🎉 Database seeding completed successfully!');
  });
