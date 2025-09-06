export interface SigunguInfo {
  sig_cd: string;
  sig_kor_nm: string;
  sido_cd: string;
  sido_nm: string;
}

export interface Point {
  longitude: number;
  latitude: number;
}

export interface GeocodingResult {
  sigungu: SigunguInfo | null;
  point: Point;
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
  properties: SigunguInfo;
}

export interface GeoJSONData {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}
