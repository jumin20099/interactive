import { preloadImages } from './utils.js';

// 헤더(프레임)를 애니메이션하는 함수
const animateFrame = () => {
  const frame = document.querySelector('.frame');
  const frameTitle = frame.querySelector('.frame_title');
  const frameSublineSpan = frame.querySelector('.frame_subline span'); // WELCOME TO span
  
  gsap.timeline({
    defaults: {
      ease: 'none'
    },
    scrollTrigger: {
      trigger: frame,
      start: 'clamp(top bottom)',
      end: 'bottom top',
      scrub: true
    }
  })
  .to(frame, {
    yPercent: 35,
    scale: 0.95,
    startAt: { filter: 'brightness(100%)' },
    filter: 'brightness(30%)'
  })
  .to(frameTitle, {
    xPercent: -80
  }, 0)
  .to(frameSublineSpan, {  // "WELCOME TO" span 애니메이션
    xPercent: 100,
    yPercent: -1400
  }, 0);
};

// 첫 번째 그리드를 애니메이션하는 함수
const animateFirstGrid = () => {
  const grid = document.querySelector('[data-grid-first]');
  const gridImages = grid.querySelectorAll('.grid_img');

  gsap.timeline({
    defaults: {
      ease: 'sine'
    },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=250%',
      pin: grid.parentNode,
      scrub: 0.5,
    }
  })
  .from(gridImages, {
    stagger: 0.07,
    y: () => gsap.utils.random(window.innerHeight, window.innerHeight * 1.8)
  })
  // 텍스트 콘텐츠
  .from(grid.parentNode.querySelector('.content_title'), {
    duration: 1.2,
    ease: 'power4',
    yPercent: 180,
    autoAlpha: 0
  }, 0.8);
};

// 두 번째 그리드를 애니메이션하는 함수
const animateSecondGrid = () => {
  const grid = document.querySelector('[data-grid-second]');
  const gridImages = grid.querySelectorAll('.grid_img');
  const middleIndex = Math.floor(gridImages.length / 2);

  gsap.timeline({
    defaults: {
      ease: 'power3'
    },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=250%',
      pin: grid.parentNode,
      scrub: 0.5,
    }
  })
  .from(gridImages, {
    stagger: {
      amount: 0.3,
      from: 'center'
    },
    y: window.innerHeight,
    transformOrigin: '50% 0%',
    rotation: pos => {
      const distanceFromCenter = Math.abs(pos - middleIndex);
      return pos < middleIndex ? distanceFromCenter * 3 : distanceFromCenter * -3;
    },
  })
  // 텍스트 콘텐츠
  .from(grid.querySelectorAll('.grid_item'), {
    stagger: {
      amount: 0.3,
      from: 'center'
    },
    yPercent: 100,
    autoAlpha: 0
  }, 0);
};

// 세 번째 그리드를 애니메이션하는 함수
const animateThirdGrid = () => {
  const grid = document.querySelector('[data-grid-third]');
  const gridImages = grid.querySelectorAll('.grid_img');

  gsap.timeline({
    defaults: {
      ease: 'power3'
    },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=200%',
      pin: grid.parentNode,
      scrub: 0.2,
    }
  })
  .from(gridImages, {
    stagger: 0.06,
    y: window.innerHeight,
    rotation: () => gsap.utils.random(-15,15),
    transformOrigin: '50% 0%'
  })
  .fromTo(gridImages, {
    filter: 'brightness(100%)'
  }, {
    ease: 'none',
    stagger: 0.06,
    filter: pos => pos < gridImages.length-1 ? 'brightness(20%)' : 'brightness(100%)'
  }, 0)
  // 텍스트 콘텐츠
  .from(grid.querySelectorAll('.grid_item'), {
    xPercent: pos => pos%2 ? 100 : -100,
    autoAlpha: 0
  }, 0.06*gridImages.length);
};

/**
 * 요소의 초기 변환 및 3D 회전을 계산하여 화면 중앙에서 더 멀리 이동하고 회전시킵니다.
 * 회전과 Z축 변환은 중앙에서의 거리와 비례하며, 중앙에 가까운 요소는 덜 회전하고 덜 이동하고, 먼 요소는 더 많이 회전하고 이동합니다.
 * 
 * @param {Element} element - 변환 및 회전을 계산할 DOM 요소
 * @param {Number} offsetDistance - 요소가 중앙에서 이동할 거리 (기본값: 250px)
 * @param {Number} maxRotation - 가장 먼 요소에 대한 최대 회전 각도 (기본값: 300도)
 * @param {Number} maxZTranslation - 가장 먼 요소에 대한 최대 Z축 변환 (기본값: 2000px)
 * @returns {Object} x, y, z 변환 및 rotateX, rotateY 값을 {x, y, z, rotateX, rotateY} 형태로 반환
 */
const calculateInitialTransform = (element, offsetDistance = 250, maxRotation = 300, maxZTranslation = 2000) => {
  const viewportCenter = { width: window.innerWidth / 2, height: window.innerHeight / 2 };
  const elementCenter = { 
    x: element.offsetLeft + element.offsetWidth / 2, 
    y: element.offsetTop + element.offsetHeight / 2 
  };

  // 요소의 중앙과 뷰포트의 중앙 사이의 각도 계산
  const angle = Math.atan2(Math.abs(viewportCenter.height - elementCenter.y), Math.abs(viewportCenter.width - elementCenter.x));

  // 각도와 거리 기반으로 x 및 y 변환 계산
  const translateX = Math.abs(Math.cos(angle) * offsetDistance);
  const translateY = Math.abs(Math.sin(angle) * offsetDistance);

  // 중앙에서 가능한 최대 거리 계산 (뷰포트의 대각선)
  const maxDistance = Math.sqrt(Math.pow(viewportCenter.width, 2) + Math.pow(viewportCenter.height, 2));

  // 중앙에서의 현재 거리 계산
  const currentDistance = Math.sqrt(Math.pow(viewportCenter.width - elementCenter.x, 2) + Math.pow(viewportCenter.height - elementCenter.y, 2));

  // 중앙에서의 거리 기반으로 회전 및 Z 변환 비율 조정
  const distanceFactor = currentDistance / maxDistance;

  // 중앙에 대한 위치에 따라 회전 값 계산
  const rotationX = ((elementCenter.y < viewportCenter.height ? -1 : 1) * (translateY / offsetDistance) * maxRotation * distanceFactor);
  const rotationY = ((elementCenter.x < viewportCenter.width ? 1 : -1) * (translateX / offsetDistance) * maxRotation * distanceFactor);

  // 중앙에서의 거리 기반으로 Z축 변환(깊이) 계산
  const translateZ = maxZTranslation * distanceFactor;

  // 뷰포트 중앙에 대한 위치에 따라 방향 결정
  return {
    x: elementCenter.x < viewportCenter.width ? -translateX : translateX,
    y: elementCenter.y < viewportCenter.height ? -translateY : translateY,
    z: translateZ,
    rotateX: rotationX,
    rotateY: rotationY
  };
};

// 네 번째 그리드를 애니메이션하는 함수
const animateFourthGrid = () => {
  const grid = document.querySelector('[data-grid-fourth]');
  const gridImages = grid.querySelectorAll('.grid_img');

  gsap.timeline({
    defaults: {
      ease: 'expo'
    },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=200%',
      pin: grid.parentNode,
      scrub: 0.2,
    }
  })
  .set(grid, {perspective: 1000}) // 3D 효과를 위한 원근 효과 추가
  .fromTo(gridImages, {
    // 미리 계산된 변환, 회전 및 Z축 변환 값을 기반으로 시작 위치 정의
    x: (_, el) => calculateInitialTransform(el).x,
    y: (_, el) => calculateInitialTransform(el).y,
    z: (_, el) => calculateInitialTransform(el).z, // Z축 변환
    rotateX: (_, el) => calculateInitialTransform(el).rotateX*.5,
    rotateY: (_, el) => calculateInitialTransform(el).rotateY,
    autoAlpha: 0,
    scale: 0.7,
  }, {
    // 이미지들을 원래 위치로 애니메이션하고 변환 제거
    x: 0,
    y: 0,
    z: 0,
    rotateX: 0,
    rotateY: 0,
    autoAlpha: 1,
    scale: 1,
    stagger: {
      amount: 0.2,
      from: 'center',
      grid: [4, 9]
    }
  });
};

// 네 번째 (v2) 그리드를 애니메이션하는 함수
const animateFourthV2Grid = () => {
  const grid = document.querySelector('[data-grid-fourth-v2]');
  const gridImages = grid.querySelectorAll('.grid_img');

  gsap.timeline({
    defaults: {
      ease: 'power4',
    },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=200%',
      pin: grid.parentNode,
      scrub: 0.2,
    }
  })
  .set(grid, {perspective: 1200}) // 3D 효과를 위한 원근 효과 추가
  .fromTo(gridImages, {
    // 미리 계산된 변환, 회전 및 Z축 변환 값을 기반으로 시작 위치 정의
    x: (_, el) => calculateInitialTransform(el, 900).x,
    y: (_, el) => calculateInitialTransform(el, 600).y,
    z: (_, el) => calculateInitialTransform(el, _, _, -3000).z, // Z축 변환
    rotateX: (_, el) => calculateInitialTransform(el, 250, -160, -3000).rotateX,
    rotateY: (_, el) => calculateInitialTransform(el, 250, -160, -3000).rotateY,
    autoAlpha: 0,
    scale: 0.4,
  }, {
    x: 0,
    y: 0,
    z: 0,
    rotateX: 0,
    rotateY: 0,
    autoAlpha: 1,
    scale: 1,
    stagger: {
      amount: 0.15,
      from: 'center',
      grid: [4, 9]
    }
  })
};

// 다섯 번째 그리드를 애니메이션하는 함수
const animateFifthGrid = () => {
  const grid = document.querySelector('[data-grid-fifth]');
  const gridImages = grid.querySelectorAll('.grid_img');
  
  gsap.timeline({
    defaults: {
      ease: 'sine'
    },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=250%',
      pin: grid.parentNode,
      scrub: 0.3,
    }
  })
  .set(grid, {perspective: 1000})
  .from(gridImages, {
    stagger: {
      amount: 0.4,
      from: 'random',
      grid: [4,9]
    },
    y: window.innerHeight,
    rotationX: -70,
    transformOrigin: '50% 0%',
    z: -900,
    autoAlpha: 0
  });
};

// 여섯 번째 그리드를 애니메이션하는 함수
const animateSixthGrid = () => {
  const grid = document.querySelector('[data-grid-sixth]');
  const gridImages = grid.querySelectorAll('.grid_img');
  
  gsap.timeline({
    defaults: {
      ease: 'none'
    },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=200%',
      pin: grid.parentNode,
      scrub: 0.5,
    }
  })
  .from(gridImages, {
    stagger: {
      amount: 0.03,
      from: 'edges',
      grid: [3,3]
    },
    scale: 0.7,
    autoAlpha: 0
  })
  .from(grid, {
    scale: .7,
    skewY: 5,
  }, 0);
};

// 일곱 번째 그리드를 애니메이션하는 함수
const animateSeventhGrid = () => {
  const grid = document.querySelector('[data-grid-seventh]');
  const gridImages = grid.querySelectorAll('.grid_img');
  
  gsap.timeline({
    defaults: {
      ease: 'power1'
    },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=150%',
      pin: grid.parentNode,
      scrub: 0.5,
    }
  })
  .fromTo(gridImages, {
    yPercent: -102,
    //filter: 'brightness(300%) contrast(480%)'
  }, {
    stagger: 0.08,
    yPercent: 0,
    //filter: 'brightness(100%) contrast(100%)'
  })
  .from([...gridImages].map(img => img.querySelector('.grid_img-inner')), {
    stagger: 0.08,
    yPercent: 102,
  }, 0)
  // 텍스트 콘텐츠
  .from(grid.querySelectorAll('.grid_item'), {
    yPercent: 20,
    stagger: gridImages.length/2*0.08,
    autoAlpha: 0,
  }, 0);
};

// 여덟 번째 그리드를 애니메이션하는 함수
const animateEighthGrid = () => {
  const grid = document.querySelector('[data-grid-eighth]');
  const gridImages = grid.querySelectorAll('.grid_img');
  
  gsap.timeline({
    defaults: {
      ease: 'expo'
    },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=250%',
      pin: grid.parentNode,
      scrub: true,
    }
  })
  .set(grid, {perspective: 2000})
  .from(gridImages, {
    stagger: {
      amount: 0.8,
      from: 'start'
    },
    rotationY: 65,
    transformOrigin: '0% 50%',
    z: -200,
    yPercent: 10 
  })
  .from(gridImages, {
    stagger: {
      amount: 0.8,
      from: 'start'
    },
    duration: 0.2,
    autoAlpha: 0
  }, 0);
};

// 아홉 번째 그리드를 애니메이션하는 함수
const animateNinthGrid = () => {
  const grid = document.querySelector('[data-grid-ninth]');
  const gridImages = grid.querySelectorAll('.grid_img');
  
  gsap.timeline({
    defaults: {
      ease: 'power3'
    },
    scrollTrigger: {
      trigger: grid,
      start: 'center center',
      end: '+=200%',
      pin: grid.parentNode,
      scrub: true,
    }
  })
  .from(gridImages, {
    transformOrigin: '100% -450%',
    stagger: 0.07,
    scaleX: 1.05,
    skewX: 15,
    xPercent: 50,
    rotation: -10,
    autoAlpha: 0
  });
};

// 초기화 함수
const init = () => {
  // 헤더(프레임)를 애니메이션
  animateFrame();

  // 각 그리드의 데이터 속성에 따라 애니메이션 호출
  animateFirstGrid();
  animateSecondGrid();
  animateThirdGrid();
  animateFourthGrid();
  animateFourthV2Grid();
  animateFifthGrid();
  animateSixthGrid();
  animateSeventhGrid();
  animateEighthGrid();
  animateNinthGrid();
};

// 이미지들을 미리 로드하고 애니메이션 초기화
preloadImages('.grid_img').then(() => {
  document.body.classList.remove('loading'); // 로딩 클래스를 바디에서 제거
  init();
  window.scrollTo(0, 0);
});