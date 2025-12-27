import Property, { IProperty } from '../models/Property';
import { AuthRequest } from '../middleware/auth';

/**
 * Check for duplicate listings
 */
export const checkDuplicateListing = async (
  propertyData: Partial<IProperty>,
  userId: string
): Promise<{ isDuplicate: boolean; similarProperties: IProperty[] }> => {
  const { location, title } = propertyData;

  if (!location?.coordinates?.coordinates) {
    return { isDuplicate: false, similarProperties: [] };
  }

  const [longitude, latitude] = location.coordinates.coordinates;

  // Find properties within 50 meters
  const similarProperties = await Property.find({
    'location.coordinates': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        $maxDistance: 50, // meters
      },
    },
    status: { $in: ['DRAFT', 'PENDING', 'APPROVED', 'PAUSED'] },
    listedBy: { $ne: userId }, // Exclude own listings
  }).limit(5);

  // Check title similarity
  const titleSimilarity = similarProperties.some((prop) => {
    const similarity = calculateStringSimilarity(
      title?.toLowerCase() || '',
      prop.title.toLowerCase()
    );
    return similarity > 0.8; // 80% similarity threshold
  });

  return {
    isDuplicate: titleSimilarity && similarProperties.length > 0,
    similarProperties,
  };
};

/**
 * Check for suspicious pricing
 */
export const checkPriceAnomaly = async (
  propertyData: Partial<IProperty>
): Promise<{ isAnomaly: boolean; reason?: string }> => {
  const { location, pricing, propertyCategory, commercial, land, residential } = propertyData;

  if (!location?.city || !pricing) {
    return { isAnomaly: false };
  }

  // Get average price for similar properties in the area
  const query: any = {
    'location.city': location.city,
    propertyCategory: propertyCategory,
    status: 'APPROVED',
  };

  let areaField = 'commercial.builtUpArea';
  if (propertyCategory === 'LAND') {
    areaField = 'land.plotArea';
  } else if (propertyCategory === 'RESIDENTIAL') {
    areaField = 'residential.bhk';
  }

  const similarProperties = await Property.find(query)
    .limit(20)
    .sort({ createdAt: -1 });

  if (similarProperties.length < 3) {
    return { isAnomaly: false }; // Not enough data
  }

  // Calculate average price per sqft
  let totalPrice = 0;
  let totalArea = 0;
  let count = 0;

  for (const prop of similarProperties) {
    const price = prop.pricing.expectedPrice || prop.pricing.rentAmount || 0;
    let area = 0;

    if (propertyCategory === 'COMMERCIAL' && prop.commercial?.builtUpArea) {
      area = prop.commercial.builtUpArea;
    } else if (propertyCategory === 'LAND' && prop.land?.plotArea) {
      area = prop.land.plotArea;
    } else if (propertyCategory === 'RESIDENTIAL' && prop.residential?.bhk) {
      area = prop.residential.bhk * 1000; // Approximate sqft per BHK
    }

    if (price > 0 && area > 0) {
      totalPrice += price;
      totalArea += area;
      count++;
    }
  }

  if (count === 0) {
    return { isAnomaly: false };
  }

  const avgPricePerSqft = totalPrice / totalArea;
  const userPrice = pricing.expectedPrice || pricing.rentAmount || 0;
  let userArea = 0;

  if (propertyCategory === 'COMMERCIAL' && commercial?.builtUpArea) {
    userArea = commercial.builtUpArea;
  } else if (propertyCategory === 'LAND' && land?.plotArea) {
    userArea = land.plotArea;
  } else if (propertyCategory === 'RESIDENTIAL' && residential?.bhk) {
    userArea = residential.bhk * 1000;
  }

  if (userArea === 0) {
    return { isAnomaly: false };
  }

  const userPricePerSqft = userPrice / userArea;
  const deviation = Math.abs((userPricePerSqft - avgPricePerSqft) / avgPricePerSqft);

  // Flag if price deviates more than 50% from average
  if (deviation > 0.5) {
    return {
      isAnomaly: true,
      reason: `Price is ${deviation > 1 ? 'more than double' : 'significantly different'} from local average`,
    };
  }

  return { isAnomaly: false };
};

/**
 * Rate limiting check for listings
 */
export const checkListingRateLimit = async (
  userId: string
): Promise<{ allowed: boolean; remaining: number }> => {
  const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

  const recentListings = await Property.countDocuments({
    listedBy: userId,
    createdAt: { $gte: oneDayAgo },
  });

  const maxListingsPerDay = 10; // Configurable
  const remaining = Math.max(0, maxListingsPerDay - recentListings);

  return {
    allowed: recentListings < maxListingsPerDay,
    remaining,
  };
};

/**
 * Calculate string similarity (Levenshtein distance)
 */
const calculateStringSimilarity = (str1: string, str2: string): number => {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) {
    return 1.0;
  }

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
};

const levenshteinDistance = (str1: string, str2: string): number => {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
};

