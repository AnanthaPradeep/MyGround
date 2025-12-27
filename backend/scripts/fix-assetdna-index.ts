import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myground';

async function fixAssetDNAIndex() {
  console.log('🔌 Connecting to MongoDB...');
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('assetdnas');

    console.log('\n📋 Current indexes:');
    const indexes = await collection.indexes();
    indexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // Drop old dnaId index if it exists
    console.log('\n🗑️  Dropping old dnaId index if it exists...');
    try {
      await collection.dropIndex('dnaId_1');
      console.log('✅ Index dnaId_1 dropped successfully');
    } catch (error: any) {
      if (error.codeName === 'IndexNotFound') {
        console.log('ℹ️  Index dnaId_1 not found, skipping drop.');
      } else {
        console.error('❌ Error dropping index dnaId_1:', error.message);
      }
    }

    // Also try dropping any index with dnaId in the key
    try {
      const dnaIdIndexes = indexes.filter(idx => 
        idx.key && (idx.key.dnaId !== undefined || idx.name?.includes('dnaId'))
      );
      for (const idx of dnaIdIndexes) {
        if (idx.name && idx.name !== 'dnaId_1') {
          await collection.dropIndex(idx.name);
          console.log(`✅ Index ${idx.name} dropped successfully`);
        }
      }
    } catch (error: any) {
      console.log('ℹ️  No additional dnaId indexes found.');
    }

    // Remove any documents with null assetId (they shouldn't exist)
    console.log('\n🧹 Cleaning up documents with null assetId...');
    const deleteResult = await collection.deleteMany({ assetId: null });
    console.log(`✅ Removed ${deleteResult.deletedCount} documents with null assetId`);

    // Remove any documents with null dnaId (old field name)
    const deleteDnaIdResult = await collection.deleteMany({ dnaId: null });
    console.log(`✅ Removed ${deleteDnaIdResult.deletedCount} documents with null dnaId`);

    console.log('\n✅ Verification:');
    const newIndexes = await collection.indexes();
    console.log('Current indexes:');
    newIndexes.forEach(index => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n🎉 Index fix completed successfully!');
    console.log('You can now create properties without duplicate key errors.');

  } catch (error) {
    console.error('❌ Database operation failed:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

fixAssetDNAIndex();

