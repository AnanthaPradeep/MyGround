import mongoose from 'mongoose';
import Property from '../src/models/Property';

/**
 * Script to drop and recreate the geospatial index with sparse option
 * Run this script once to fix the GeoJSON validation error
 * 
 * Usage: npx tsx scripts/fix-geospatial-index.ts
 */

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/myground';

async function fixGeospatialIndex() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    const collection = mongoose.connection.collection('properties');
    
    // Get all indexes
    const indexes = await collection.indexes();
    console.log('\n📋 Current indexes:');
    indexes.forEach((index: any) => {
      console.log(`  - ${index.name}: ${JSON.stringify(index.key)}`);
    });

    // Drop ALL old geospatial indexes if they exist
    const indexesToDrop = ['location.coordinates_2dsphere', 'location_2dsphere'];
    
    for (const indexName of indexesToDrop) {
      try {
        console.log(`\n🗑️  Dropping old geospatial index: ${indexName}...`);
        await collection.dropIndex(indexName);
        console.log(`✅ Index ${indexName} dropped successfully`);
      } catch (error: any) {
        if (error.code === 27 || error.message?.includes('index not found')) {
          console.log(`ℹ️  Index ${indexName} does not exist (this is okay)`);
        } else {
          console.log(`⚠️  Could not drop ${indexName}: ${error.message}`);
        }
      }
    }

    // Recreate the index with sparse option
    console.log('\n🔨 Creating new sparse geospatial index...');
    await collection.createIndex(
      { 'location.coordinates': '2dsphere' },
      { 
        sparse: true,
        name: 'location.coordinates_2dsphere'
      }
    );
    console.log('✅ New sparse index created successfully');

    // Verify the new index
    const newIndexes = await collection.indexes();
    const geoSpatialIndex = newIndexes.find((idx: any) => 
      idx.name === 'location.coordinates_2dsphere'
    );
    
    if (geoSpatialIndex) {
      console.log('\n✅ Verification:');
      console.log(`  Index name: ${geoSpatialIndex.name}`);
      console.log(`  Index key: ${JSON.stringify(geoSpatialIndex.key)}`);
      console.log(`  Sparse: ${geoSpatialIndex.sparse === true ? 'Yes' : 'No'}`);
    }

    console.log('\n🎉 Index fix completed successfully!');
    console.log('You can now create properties with or without coordinates.');
    
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error fixing index:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run the script
fixGeospatialIndex();

