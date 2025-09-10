# Korea Sigungu Geocoding

대한민국 시군구 지리정보 처리를 위한 npm 패키지입니다.

## 특징

- 🗺️ 대한민국 전체 시군구 행정구역 데이터 포함
- 📍 좌표로부터 시군구 정보 조회 (역지오코딩)
- 🔍 시군구 코드/이름으로 검색
- 📏 두 좌표 간 거리 계산 (하버사인 공식)
- 🌐 브라우저 및 Node.js 환경 모두 지원
- ⚡ 빠른 검색 성능
- 🎯 TypeScript 지원

## 설치

```bash
npm install korea-sigungu-geocoding
```

## 사용법

### Node.js 환경

```typescript
import { geocoding } from 'korea-sigungu-geocoding';

// 좌표로 시군구 찾기 (역지오코딩)
const result = geocoding.geocode(127.0276, 37.4979); // 서울시 중구
console.log(result);
// {
//   sigungu: {
//     sig_cd: "11140",
//     sig_kor_nm: "중구",
//     sido_cd: "11",
//     sido_nm: "서울특별시"
//   },
//   point: { longitude: 127.0276, latitude: 37.4979 }
// }

// 두 좌표 간 거리 계산
const distance = geocoding.calculateDistance(37.5665, 126.9780, 35.1796, 129.0756, 'km');
console.log(distance); // 약 325km
```

### 브라우저 환경

```html
<script type="module">
  import { geocoding } from 'https://unpkg.com/korea-sigungu-geocoding@latest/dist/index.js';
  
  // 역지오코딩
  const result = geocoding.geocode(127.0276, 37.4979);
  console.log(result);
  
  // 거리 계산
  const distance = geocoding.calculateDistance(37.5665, 126.9780, 35.1796, 129.0756, 'km');
  console.log(distance); // 약 325km
</script>
```

### React/Vue/Angular 등 프론트엔드 프레임워크

```typescript
// React 예시
import { geocoding } from 'korea-sigungu-geocoding';

function LocationComponent() {
  const handleGeocode = () => {
    const result = geocoding.geocode(127.0276, 37.4979);
    console.log(result);
  };
  
  const handleDistance = () => {
    const distance = geocoding.calculateDistance(37.5665, 126.9780, 35.1796, 129.0756, 'km');
    console.log(`거리: ${distance}km`);
  };
  
  return (
    <div>
      <button onClick={handleGeocode}>위치 찾기</button>
      <button onClick={handleDistance}>거리 계산</button>
    </div>
  );
}
```

### API 메서드

#### `geocode(longitude: number, latitude: number): GeocodingResult`

좌표로부터 시군구 정보를 찾습니다.

```typescript
const result = geocoding.geocode(127.0276, 37.4979);
if (result.sigungu) {
  console.log(`시군구: ${result.sigungu.sig_kor_nm}`);
  console.log(`시군구코드: ${result.sigungu.sig_cd}`);
} else {
  console.log('해당 좌표에 시군구 정보가 없습니다.');
}
```

#### `findByCode(sigCd: string): SigunguInfo | null`

시군구 코드로 시군구 정보를 찾습니다.

```typescript
const sigungu = geocoding.findByCode("11140");
console.log(sigungu); 
// { sig_cd: "11140", sig_kor_nm: "중구", sido_cd: "11", sido_nm: "서울특별시" }
```

#### `findByName(sigKorNm: string): SigunguInfo | null`

시군구 이름으로 시군구 정보를 찾습니다.

```typescript
const sigungu = geocoding.findByName("중구");
console.log(sigungu); 
// { sig_cd: "11140", sig_kor_nm: "중구", sido_cd: "11", sido_nm: "서울특별시" }
```

#### `getAllSigungu(): SigunguInfo[]`

모든 시군구 목록을 반환합니다.

```typescript
const allSigungu = geocoding.getAllSigungu();
console.log(`총 ${allSigungu.length}개의 시군구가 있습니다.`);
```

#### `calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number, unit?: 'km' | 'm' | 'mile'): number`

두 좌표 간의 거리를 계산합니다 (하버사인 공식 사용).

```typescript
// 서울시청에서 부산시청까지 거리
const distance = geocoding.calculateDistance(
  37.5665, 126.9780,  // 서울시청
  35.1796, 129.0756,  // 부산시청
  'km'                // 단위 (기본값: 'km')
);
console.log(distance); // 약 325km

// 미터 단위로 계산
const distanceInMeters = geocoding.calculateDistance(37.5665, 126.9780, 35.1796, 129.0756, 'm');
console.log(distanceInMeters); // 약 325000m

// 마일 단위로 계산
const distanceInMiles = geocoding.calculateDistance(37.5665, 126.9780, 35.1796, 129.0756, 'mile');
console.log(distanceInMiles); // 약 202마일
```

## 데이터 구조

### SigunguInfo

```typescript
interface SigunguInfo {
  sig_cd: string;     // 시군구 코드
  sig_kor_nm: string; // 시군구 한글명
  sido_cd: string;    // 시도 코드 (11: 서울특별시, 26: 부산광역시, ...)
  sido_nm: string;    // 시도 한글명
}
```

### GeocodingResult

```typescript
interface GeocodingResult {
  sigungu: SigunguInfo | null; // 찾은 시군구 정보 (없으면 null)
  point: Point;                // 검색한 좌표
}
```

## 성능

- 검색 속도: 평균 1-5ms (좌표당)
- 브라우저 및 Node.js 환경 모두 지원

## 라이선스

MIT

## 기여하기

버그 리포트나 기능 제안은 [GitHub Issues](https://github.com/sh5080/korea-sigungu-geocoding/issues)를 이용해 주세요.

- 🐛 **버그 리포트**: [Issues](https://github.com/sh5080/korea-sigungu-geocoding/issues)에서 "Bug report" 라벨로 등록
- 💡 **기능 제안**: [Issues](https://github.com/sh5080/korea-sigungu-geocoding/issues)에서 "Feature request" 라벨로 등록
- 🔧 **기여**: Pull Request를 환영합니다!