/**
 * Script to fix duplicate key errors in AssetDNA collection
 * - Removes old indexes on 'property' field (if exists)
 * - Removes documents with null propertyId
 * - Ensures proper indexes exist
 */

import mongoose from 'mongoose';
import AssetDNA from '../src/models/AssetDNA';
import dotenv from 'dotenv';

dotenv.config({ path: '.env' });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/myground';

async function fixAssetDNA() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const db = mongoose.connection.db;
    const collection = db.collection('assetdnas');

    // Step 1: List all indexes
    console.log('\n📋 Current indexes:');
    const indexes = await collection.indexes();
    indexes.forEach((index: any) => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // Step 2: Drop old 'property' index if it exists
    try {
      const propertyIndex = indexes.find((idx: any) => 
        idx.name === 'property_1' || 
        (idx.key && idx.key.property !== undefined)
      );
      
      if (propertyIndex) {
        console.log(`\n🗑️  Dropping old 'property' index: ${propertyIndex.name}`);
        await collection.dropIndex(propertyIndex.name);
        console.log('✅ Old index dropped');
      } else {
        console.log('\n✅ No old "property" index found');
      }
    } catch (error: any) {
      if (error.code === 27) {
        console.log('✅ Index does not exist (already removed)');
      } else {
        console.error('⚠️  Error dropping index:', error.message);
      }
    }

    // Step 3: Remove documents with null propertyId
    console.log('\n🧹 Cleaning up documents with null propertyId...');
    const deleteResult = await collection.deleteMany({ 
      $or: [
        { propertyId: null },
        { propertyId: { $exists: false } },
        { property: null }, // Also remove old 'property' field documents
        { property: { $exists: true } } // Remove any document with old 'property' field
      ]
    });
    console.log(`✅ Removed ${deleteResult.deletedCount} invalid documents`);

    // Step 4: Ensure proper indexes exist
    console.log('\n📊 Ensuring proper indexes...');
    
    // Drop and recreate propertyId index to ensure it's unique and sparse
    try {
      await collection.dropIndex('propertyId_1');
    } catch (error: any) {
      if (error.code !== 27) {
        console.log('⚠️  Could not drop propertyId index:', error.message);
      }
    }

    // Create unique index on propertyId (one AssetDNA per property)
    await collection.createIndex(
      { propertyId: 1 },
      { 
        unique: true,
        name: 'propertyId_1',
        background: true
      }
    );
    console.log('✅ Created unique index on propertyId');

    // Ensure assetId index exists
    try {
      await collection.createIndex(
        { assetId: 1 },
        { 
          unique: true,
          name: 'assetId_1',
          background: true
        }
      );
      console.log('✅ Created unique index on assetId');
    } catch (error: any) {
      if (error.code === 85) {
        console.log('✅ assetId index already exists');
      } else {
        console.log('⚠️  Could not create assetId index:', error.message);
      }
    }

    // Step 5: Verify no duplicates
    console.log('\n🔍 Checking for duplicates...');
    const duplicates = await collection.aggregate([
      {
        $group: {
          _id: '$propertyId',
          count: { $sum: 1 },
          ids: { $push: '$_id' }
        }
      },
      {
        $match: {
          count: { $gt: 1 },
          _id: { $ne: null }
        }
      }
    ]).toArray();

    if (duplicates.length > 0) {
      console.log(`⚠️  Found ${duplicates.length} properties with multiple AssetDNA records:`);
      for (const dup of duplicates) {
        console.log(`  - propertyId: ${dup._id}, count: ${dup.count}`);
        // Keep the first one, delete the rest
        const idsToDelete = dup.ids.slice(1);
        await collection.deleteMany({ _id: { $in: idsToDelete } });
        console.log(`    ✅ Removed ${idsToDelete.length} duplicate(s)`);
      }
    } else {
      console.log('✅ No duplicates found');
    }

    // Final index list
    console.log('\n📋 Final indexes:');
    const finalIndexes = await collection.indexes();
    finalIndexes.forEach((index: any) => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    console.log('\n✅ AssetDNA collection fixed successfully!');
  } catch (error: any) {
    console.error('❌ Error fixing AssetDNA:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Disconnected from MongoDB');
  }
}

// Run the fix
fixAssetDNA()
  .then(() => {
    console.log('\n✨ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Script failed:', error);
    process.exit(1);
  });



