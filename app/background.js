


function clickMenuCallback(info, tab){
    imageClassifier.analyze(info.srcUrl, tab.id);
}

chrome.runtime.onInstalled.addListener(()=>{

});

chrome.contextMenus.create({
    title : 'Classify image',
    contextx : ['image'],
    onclick : clickMenuCallback
})

const imageClassifier = new ImageClassifier();
