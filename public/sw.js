// 최소 Service Worker - PWA 설치 프롬프트 활성화용
self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', () => {
  // 네트워크 요청 그대로 통과 (캐싱 없음)
});
