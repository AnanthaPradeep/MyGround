/// <reference types="node" />
import { connectDatabase } from '../src/config/database';
import EAuctionProperty from '../src/models/EAuctionProperty';
import User from '../src/models/User';

const seedData = [
  {
    title: '3 BHK Apartment in Andheri East',
    description: 'Institutional auction for residential apartment under bank recovery proceedings.',
    propertyCategory: 'RESIDENTIAL',
    propertySubType: 'Apartment',
    authorityType: 'BANK',
    authorityName: 'State Bank of India',
    institution: {
      type: 'BANK',
      name: 'State Bank of India',
      verified: true,
    },
    reservePrice: 7200000,
    bidIncrement: 50000,
    emdRequired: true,
    emdAmount: 250000,
    startAt: new Date('2026-01-20T10:00:00.000Z'),
    endAt: new Date('2026-01-20T15:00:00.000Z'),
    status: 'UPCOMING',
    location: {
      country: 'India',
      state: 'Maharashtra',
      city: 'Mumbai',
      area: 'Andheri East',
      address: 'Andheri East, Mumbai',
    },
    media: {
      images: ['/ads/ad-square.svg'],
    },
  },
  {
    title: 'Industrial Plot near MIDC',
    description: 'Government institutional auction for industrial land parcel.',
    propertyCategory: 'INDUSTRIAL',
    propertySubType: 'Industrial Plot',
    authorityType: 'GOVT',
    authorityName: 'Government of Maharashtra',
    institution: {
      type: 'GOVT',
      name: 'Government of Maharashtra',
      verified: true,
    },
    reservePrice: 18500000,
    bidIncrement: 100000,
    emdRequired: true,
    emdAmount: 500000,
    startAt: new Date('2026-01-18T08:30:00.000Z'),
    endAt: new Date('2026-01-18T12:30:00.000Z'),
    status: 'LIVE',
    location: {
      country: 'India',
      state: 'Maharashtra',
      city: 'Pune',
      area: 'Chakan',
      address: 'Chakan Industrial Area, Pune',
    },
    media: {
      images: ['/ads/ad-square.svg'],
    },
  },
  {
    title: 'Commercial Office Space in Connaught Place',
    description: 'NBFC auction for premium office space.',
    propertyCategory: 'COMMERCIAL',
    propertySubType: 'Office',
    authorityType: 'NBFC',
    authorityName: 'HDFC Limited',
    institution: {
      type: 'NBFC',
      name: 'HDFC Limited',
      verified: true,
    },
    reservePrice: 32500000,
    bidIncrement: 200000,
    emdRequired: true,
    emdAmount: 750000,
    startAt: new Date('2026-01-15T09:00:00.000Z'),
    endAt: new Date('2026-01-15T13:00:00.000Z'),
    status: 'CLOSED',
    location: {
      country: 'India',
      state: 'Delhi',
      city: 'New Delhi',
      area: 'Connaught Place',
      address: 'Connaught Place, New Delhi',
    },
    media: {
      images: ['/ads/ad-square.svg'],
    },
  },
];

const seedEAuctions = async () => {
  await connectDatabase();

  const existingCount = await EAuctionProperty.countDocuments();
  if (existingCount > 0) {
    console.log('EAuction data already exists. Skipping seed.');
    process.exit(0);
  }

  const adminEmail = 'eauction-admin@myground.in';
  const adminMobile = '9999999999';

  let adminUser = await User.findOne({ email: adminEmail });
  if (!adminUser) {
    adminUser = await User.create({
      email: adminEmail,
      mobile: adminMobile,
      firstName: 'EAuction',
      lastName: 'Admin',
      role: 'ADMIN',
      isVerified: true,
      isEmailVerified: true,
      isMobileVerified: true,
      kycStatus: 'VERIFIED',
    });
  }

  const seedWithOwner = seedData.map((auction) => ({
    ...auction,
    createdBy: adminUser!._id,
  }));

  await EAuctionProperty.insertMany(seedWithOwner);
  console.log('EAuction sample data seeded.');
  process.exit(0);
};

seedEAuctions().catch((error) => {
  console.error('Failed to seed eAuctions:', error);
  process.exit(1);
});
