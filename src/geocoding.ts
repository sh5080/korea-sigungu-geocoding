import { GeoJSONData, GeoJSONFeature, Point, GeocodingResult, SigunguInfo } from './types';
import { geoData } from './geoData';

export class KoreaSigunguGeocoding {
  private geoData: GeoJSONData | null = null;
  
  // 시도 코드 매핑
  private readonly sidoMap: Record<string, string> = {
    '11': '서울특별시',
    '26': '부산광역시',
    '27': '대구광역시',
    '28': '인천광역시',
    '29': '광주광역시',
    '30': '대전광역시',
    '31': '울산광역시',
    '36': '세종특별자치시',
    '41': '경기도',
    '42': '강원특별자치도',
    '43': '충청북도',
    '44': '충청남도',
    '45': '전북특별자치도',
    '46': '전라남도',
    '47': '경상북도',
    '48': '경상남도',
    '50': '제주특별자치도'
  };

  /**
   * GeoJSON 데이터를 로드합니다.
   */
  private loadGeoData(): GeoJSONData {
    if (this.geoData) {
      return this.geoData;
    }

    this.geoData = geoData as GeoJSONData;
    return this.geoData;
  }

  /**
   * 점이 다각형 내부에 있는지 확인합니다 (Ray Casting 알고리즘).
   */
  private pointInPolygon(point: Point, polygon: number[][]): boolean {
    const { longitude: x, latitude: y } = point;
    let inside = false;

    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const [xi, yi] = polygon[i];
      const [xj, yj] = polygon[j];

      if (((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) {
        inside = !inside;
      }
    }

    return inside;
  }

  /**
   * 좌표가 Feature의 지오메트리 내부에 있는지 확인합니다.
   */
  private pointInFeature(point: Point, feature: GeoJSONFeature): boolean {
    const { geometry } = feature;

    if (geometry.type === 'Polygon') {
      return this.pointInPolygon(point, geometry.coordinates[0] as number[][]);
    } else if (geometry.type === 'MultiPolygon') {
      return geometry.coordinates.some(polygon => 
        this.pointInPolygon(point, polygon[0] as number[][])
      );
    }

    return false;
  }

  /**
   * 시군구 코드에서 시도 정보를 추출하여 완전한 정보를 반환합니다.
   */
  private enrichSigunguInfo(sig_cd: string, sig_kor_nm: string): SigunguInfo {
    const sido_cd = sig_cd.substring(0, 2);
    const sido_nm = this.sidoMap[sido_cd] || '알 수 없음';
    
    return {
      sig_cd,
      sig_kor_nm,
      sido_cd,
      sido_nm
    };
  }

  /**
   * 좌표로부터 시군구 정보를 찾습니다.
   */
  public geocode(longitude: number, latitude: number): GeocodingResult {
    const point: Point = { longitude, latitude };
    const geoData = this.loadGeoData();
    for (const feature of geoData.features) {
      if (this.pointInFeature(point, feature)) {
        const enrichedSigungu = this.enrichSigunguInfo(
          feature.properties.sig_cd,
          feature.properties.sig_kor_nm
        );
        return {
          sigungu: enrichedSigungu,
          point
        };
      }
    }

    return {
      sigungu: null,
      point
    };
  }

  /**
   * 시군구 코드로 시군구 정보를 찾습니다.
   */
  public findByCode(sigCd: string): SigunguInfo | null {
    const geoData = this.loadGeoData();
    
    const feature = geoData.features.find(f => f.properties.sig_cd === sigCd);
    return feature ? this.enrichSigunguInfo(feature.properties.sig_cd, feature.properties.sig_kor_nm) : null;
  }

  /**
   * 시군구 이름으로 시군구 정보를 찾습니다.
   */
  public findByName(sigKorNm: string): SigunguInfo | null {
    const geoData = this.loadGeoData();
    
    const feature = geoData.features.find(f => f.properties.sig_kor_nm === sigKorNm);
    return feature ? this.enrichSigunguInfo(feature.properties.sig_cd, feature.properties.sig_kor_nm) : null;
  }

  /**
   * 모든 시군구 목록을 반환합니다.
   */
  public getAllSigungu(): SigunguInfo[] {
    const geoData = this.loadGeoData();
    return geoData.features.map(feature => 
      this.enrichSigunguInfo(feature.properties.sig_cd, feature.properties.sig_kor_nm)
    );
  }

}
