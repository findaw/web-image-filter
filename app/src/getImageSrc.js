// Source : https://github.com/PactInteractive/image-downloader
function getImageNodes(){
  return document.images;
}
function toArray(values) {
  return [...values];
}
function extractURLFromStyle(style) {
  return style.replace(/^.*url\(["']?/, '').replace(/["']?\).*$/, '');
}

// Source: https://support.google.com/webmasters/answer/2598805?hl=en
const imageUrlRegex = /(?:([^:\/?#]+):)?(?:\/\/([^\/?#]*))?([^?#]*\.(?:bmp|gif|ico|jfif|jpe?g|png|svg|tiff?|webp))(?:\?([^#]*))?(?:#(.*))?/i;

function isImageURL(url) {
  return url.indexOf('data:image') === 0 || imageUrlRegex.test(url);
}

function getNodes(selector='img, image, a, [class], [style]'){
  return toArray(document.querySelectorAll(selector))
          .map(checkImage)
          .filter(item=>item!==undefined && item.src.length > 1)

}
function checkImage (element){
    
  if (element.tagName.toLowerCase() === 'img') {
    const src = element.src;
    const hashIndex = src.indexOf('#');
    return hashIndex >= 0 ? src.substr(0, hashIndex) : src
  }

  if (element.tagName.toLowerCase() === 'image') {
    const src = element.getAttribute('xlink:href');
    const hashIndex = src.indexOf('#');
    return hashIndex >= 0 ? src.substr(0, hashIndex) : src;
  }
  if (element.tagName.toLowerCase() === 'a') {
    const href = element.href;
    if (isImageURL(href)) {
      return href;
    }
  }
  const backgroundImage = window.getComputedStyle(element).backgroundImage;
  if (backgroundImage) {
    const parsedURL = extractURLFromStyle(backgroundImage);
    if (isImageURL(parsedURL)) {
      return parsedURL;
    }
  }
}

getImageNodes();

// export {getImageNodes, getNodes, checkImage};
