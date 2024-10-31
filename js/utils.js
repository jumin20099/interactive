/**
 * CSS 선택자로 지정된 이미지를 미리 로드합니다.
 * @function
 * @param {string} [selector='img'] - 대상 이미지에 대한 CSS 선택자.
 * @returns {Promise} - 지정된 모든 이미지가 로드되면 해결됩니다.
 */
const preloadImages = (selector = 'img') => {
  return new Promise((resolve) => {
      // imagesLoaded 라이브러리를 사용하여 모든 이미지(배경 포함)가 완전히 로드되었는지 확인합니다.
      imagesLoaded(document.querySelectorAll(selector), {background: true}, resolve);
  });
};

// 다른 모듈에서 사용할 수 있도록 유틸리티 함수를 내보냅니다.
export {
  preloadImages
};
