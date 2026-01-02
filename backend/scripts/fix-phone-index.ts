import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Script to fix the phone/mobile index issue
 * This will drop any old 'phone' indexes and ensure 'mobile' index is sparse
 */
async function fixPhoneIndex() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/myground';
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('users');

    // List all indexes
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes);

    // Drop old 'phone' index if it exists
    try {
      await collection.dropIndex('phone_1');
      console.log('✅ Dropped old phone_1 index');
    } catch (error: any) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️  phone_1 index does not exist, skipping...');
      } else {
        console.error('Error dropping phone_1 index:', error.message);
      }
    }

    // Drop existing mobile index if it exists (to recreate with sparse)
    try {
      await collection.dropIndex('mobile_1');
      console.log('✅ Dropped existing mobile_1 index');
    } catch (error: any) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️  mobile_1 index does not exist');
      } else {
        console.error('Error dropping mobile_1 index:', error.message);
      }
    }

    // Create sparse unique index on mobile
    await collection.createIndex(
      { mobile: 1 },
      { unique: true, sparse: true, name: 'mobile_1' }
    );
    console.log('✅ Created sparse unique index on mobile field');

    // Verify indexes
    const newIndexes = await collection.indexes();
    console.log('\nUpdated indexes:');
    newIndexes.forEach((idx: any) => {
      console.log(`  - ${idx.name}: ${JSON.stringify(idx.key)} (unique: ${idx.unique}, sparse: ${idx.sparse})`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Index fix completed successfully');
  } catch (error) {
    console.error('❌ Error fixing index:', error);
    process.exit(1);
  }
}

fixPhoneIndex();



