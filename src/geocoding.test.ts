import { KoreaSigunguGeocoding } from './geocoding';

describe('KoreaSigunguGeocoding', () => {
  let geocoding: KoreaSigunguGeocoding;

  beforeAll(() => {
    geocoding = new KoreaSigunguGeocoding();
  });

  describe('geocode', () => {
    test('서울시 중구 좌표로 시군구 찾기', () => {
      const result = geocoding.geocode(126.975470, 37.554279);

      expect(result.sigungu).toBeTruthy();
      expect(result.sigungu?.sig_kor_nm).toBe('중구');
      expect(result.sigungu?.sido_nm).toBe('서울특별시');
      expect(result.sigungu?.sido_cd).toBe('11');
    });

    test('부산광역시 해운대구 좌표로 시군구 찾기', () => {
      const result = geocoding.geocode(129.1623529, 35.1610318);
      expect(result.sigungu).toBeTruthy();
      expect(result.sigungu?.sig_kor_nm).toBe('해운대구');
      expect(result.sigungu?.sido_nm).toBe('부산광역시');
      expect(result.sigungu?.sido_cd).toBe('26');
    });

    test('경기도 수원시 좌표로 시군구 찾기', () => {
      const result = geocoding.geocode(127.0498022, 37.2690603);
      expect(result.sigungu).toBeTruthy();
      expect(result.sigungu?.sig_kor_nm).toBe('수원시 영통구');
      expect(result.sigungu?.sido_nm).toBe('경기도');
      expect(result.sigungu?.sido_cd).toBe('41');
    });

    test('제주특별자치도 제주시 좌표로 시군구 찾기', () => {
      const result = geocoding.geocode(126.5312, 33.4996);
      expect(result.sigungu).toBeTruthy();
      expect(result.sigungu?.sig_kor_nm).toBe('제주시');
      expect(result.sigungu?.sido_nm).toBe('제주특별자치도');
      expect(result.sigungu?.sido_cd).toBe('50');
    });

    test('해당하지 않는 좌표', () => {
      const result = geocoding.geocode(0, 0);
      expect(result.sigungu).toBeNull();
    });
  });

  describe('findByCode', () => {
    test('시군구 코드로 찾기', () => {
      const sigungu = geocoding.findByCode('11500');
      expect(sigungu).toBeTruthy();
      expect(sigungu?.sig_kor_nm).toBe('강서구');
    });

    test('존재하지 않는 코드', () => {
      const sigungu = geocoding.findByCode('99999');
      expect(sigungu).toBeNull();
    });
  });

  describe('findByName', () => {
    test('시군구 이름으로 찾기', () => {
      const sigungu = geocoding.findByName('강서구');
      expect(sigungu).toBeTruthy();
      expect(sigungu?.sig_cd).toBe('11500');
    });

    test('존재하지 않는 이름', () => {
      const sigungu = geocoding.findByName('존재하지않는구');
      expect(sigungu).toBeNull();
    });
  });

  describe('getAllSigungu', () => {
    test('모든 시군구 목록 반환', () => {
      const allSigungu = geocoding.getAllSigungu();
      expect(allSigungu.length).toBeGreaterThan(0);
      expect(allSigungu[0]).toHaveProperty('sig_cd');
      expect(allSigungu[0]).toHaveProperty('sig_kor_nm');
    });
  });

});
