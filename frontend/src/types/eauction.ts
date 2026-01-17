export type AuctionAuthorityType = 'BANK' | 'NBFC' | 'GOVT' | 'COURT' | 'INSTITUTION';
export type AuctionStatus = 'UPCOMING' | 'LIVE' | 'CLOSED' | 'CANCELLED' | 'PAUSED';

export interface EAuctionLocation {
  country?: string;
  state?: string;
  city?: string;
  area?: string;
  locality?: string;
  pincode?: string;
  address?: string;
  coordinates?: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface EAuctionProperty {
  _id: string;
  title: string;
  description: string;
  transactionType: 'E_AUCTION';
  propertyCategory: 'RESIDENTIAL' | 'COMMERCIAL' | 'INDUSTRIAL' | 'LAND' | 'SPECIAL' | 'ISLAND';
  propertySubType?: string;
  authorityType: AuctionAuthorityType;
  authorityName: string;
  authorityReference?: string;
  institution?: {
    type: AuctionAuthorityType;
    name: string;
    logoUrl?: string;
    verified?: boolean;
  };
  reservePrice: number;
  bidIncrement: number;
  emdRequired: boolean;
  emdAmount?: number;
  startAt: string;
  endAt: string;
  status: AuctionStatus;
  location: EAuctionLocation;
  media: { images: string[] };
  legalDisclaimer: string;
  documents?: { _id: string; name: string; type: string; url: string }[];
  islandComplianceRequired?: boolean;
  islandCompliance?: {
    environmentalClearance?: boolean;
    coastalRegulationApproval?: boolean;
    localAuthorityApproval?: boolean;
  };
}

export interface EAuctionBid {
  id: string;
  amount: number;
  createdAt: string;
  bidder: string;
}
