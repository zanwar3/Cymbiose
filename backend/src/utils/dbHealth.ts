import prisma from '../lib/prisma';

export interface DatabaseHealth {
  status: 'healthy' | 'unhealthy';
  message: string;
  timestamp: Date;
  details?: {
    connection: boolean;
    tablesExist: boolean;
    recordCount?: number;
  };
}

export async function checkDatabaseHealth(): Promise<DatabaseHealth> {
  const timestamp = new Date();
  
  try {
    // Test database connection
    await prisma.$connect();
    
    // Test if we can query the diagnoses table
    const count = await prisma.diagnosis.count();
    
    await prisma.$disconnect();
    
    return {
      status: 'healthy',
      message: 'Database connection successful',
      timestamp,
      details: {
        connection: true,
        tablesExist: true,
        recordCount: count
      }
    };
  } catch (error) {
    console.error('Database health check failed:', error);
    
    return {
      status: 'unhealthy',
      message: error instanceof Error ? error.message : 'Unknown database error',
      timestamp,
      details: {
        connection: false,
        tablesExist: false
      }
    };
  }
}

// CLI utility for checking database health
if (require.main === module) {
  checkDatabaseHealth()
    .then((health) => {
      console.log('🏥 Database Health Check');
      console.log('========================');
      console.log(`Status: ${health.status === 'healthy' ? '✅ Healthy' : '❌ Unhealthy'}`);
      console.log(`Message: ${health.message}`);
      console.log(`Timestamp: ${health.timestamp.toISOString()}`);
      
      if (health.details) {
        console.log('\nDetails:');
        console.log(`  Connection: ${health.details.connection ? '✅' : '❌'}`);
        console.log(`  Tables Exist: ${health.details.tablesExist ? '✅' : '❌'}`);
        if (health.details.recordCount !== undefined) {
          console.log(`  Record Count: ${health.details.recordCount}`);
        }
      }
      
      process.exit(health.status === 'healthy' ? 0 : 1);
    })
    .catch((error) => {
      console.error('❌ Health check failed:', error);
      process.exit(1);
    });
}
