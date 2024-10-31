// Lenis를 사용하여 부드러운 스크롤을 초기화하고 GSAP의 ScrollTrigger와 통합합니다.
// 부드러운 스크롤을 설정하는 함수
const initSmoothScrolling = () => {
  // 부드러운 스크롤 효과를 위한 Lenis 초기화. Lerp 값은 부드러움을 조절합니다.
  const lenis = new Lenis({ lerp: 0.15 });
  
  // Lenis의 스크롤 업데이트와 ScrollTrigger를 동기화합니다.
  lenis.on('scroll', ScrollTrigger.update);
  
  // GSAP 애니메이션이 Lenis의 스크롤 프레임 업데이트와 동기화되도록 합니다.
  gsap.ticker.add(time => {
      lenis.raf(time * 1000); // GSAP의 시간을 밀리초로 변환하여 Lenis에 전달합니다.
  });
  
  // Lenis와의 충돌을 피하기 위해 GSAP의 기본 지연 부드럽게 설정을 끕니다.
  gsap.ticker.lagSmoothing(0);
};

// 부드러운 스크롤 기능 활성화
initSmoothScrolling();
