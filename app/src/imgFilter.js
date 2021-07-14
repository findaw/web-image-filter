
console.log("🌀🐬🌊🌀🐬🌊🌀🐬🌊🌀🐬🌊🌀🐬🌊🌀🐬🌊");

function sleep(ms){
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}
//sleep(2000);

const findaw = {
    flag : {'REPLACE' : 0, 'RETRY':1},
    nodes : [...document.images],
    imgArr : new Array(),
    model : new ImageClassifier(),
    filter : async function  (){
        console.log(this.nodes);
        this.imgArr = new Array()
        const [body] = document.getElementsByTagName('body');
        for(let i=0; i < this.nodes.length ; i++){
            this.nodes[i].addEventListener('load', e=>{
                if(e.target.getAttribute('data-flag') == this.flag.REPLACE || this.nodes[i] == null || this.nodes[i] == undefined) return;
                let image = this.getImgObjByElm(e.target);
                image.addEventListener('load', async e=>{

                    if(e.target.getAttribute('data-flag') || e.target.getAttribute('data-flag') == this.flag.REPLACE || this.nodes[i] == null || this.nodes[i] == undefined) return;
                    try{
                        // convert logic here
                        const [c, ctx] = this.imgToCanvas(e.target);
                        // const copy  = JSON.parse(JSON.stringify({c, ctx}));
                        // const copy_c = copy.c,  copy_ctx =  copy.ctx;
                        // e.target.src = this.filterCanvas(c, ctx);
                        e.target.setAttribute('data-flag', this.flag.REPLACE);
                        this.nodes[i].setAttribute('data-flag', this.flag.REPLACE);
                        this.nodes[i].setAttribute('src', e.target.getAttribute('src'));
                        
                        console.log(e.target);
                        console.log(this.imgArr[i]);
                        this.imgArr[i].setAttribute('data-flag', this.flag.REPLACE);
                        this.nodes[i].parentNode.replaceChild(e.target, this.nodes[i]);
                        this.imgArr.push(e.target);

                        const prediction = await this.model.predict(c);
                        console.log('filter');
                        console.log(prediction);
                        const textContent = this.textContentFromPrediction(prediction);
                        console.log(e.target);
                        console.log(this.imgArr[i]);
                        this.addTextElementToImageNode(this.imgArr[i], textContent);

                        this.nodes[i].parentNode.replaceChild(this.imgArr[i], e.target);
                        
                        
                        // blurImage(this.nodes[i]);
                    }catch(err){
                        console.log(err);
                        // e.target.setAttribute('data-flag', this.flag.RETRY);
                        // this.nodes[i].setAttribute('data-flag', this.flag.RETRY);
                        // this.imgArr[i].setAttribute('data-flag',this.flag.RETRY);
                        sleep(100);
                    }
                        
                });
                image.setAttribute('src', e.target.getAttribute('src'));
            });
       
        }
    },
    getImgObjByElm: function (element){
        const image = new Image();
        image.naturalWidth = element.naturalWidth;
        image.naturalHeight = element.naturalHeight;
        image.width = element.width;
        image.height = element.height;
        image.crossOrigin = "Anonymous";
        return image;
    },
    imgToCanvas: function(elmObj){
        let c= document.createElement('canvas');
        let ctx = c.getContext('2d');
        elmObj.setAttribute('data-src', elmObj.src);
        c.width = elmObj.width;
        c.height = elmObj.height;
        ctx.drawImage(elmObj, 0, 0, c.width, c.height);
        return [c, ctx];
    },
    filterCanvas : function (c, ctx){
        const ORIGIN = ctx.getImageData(0, (c.height / 2),c.width, c.height);;
        let data = ORIGIN.data;
        // filter logic
        for (var i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i];     // red
            data[i + 1] = 255 - data[i + 1]; // green
            data[i + 2] = 255 - data[i + 2]; // blue
        }
        ctx.putImageData(ORIGIN, 0, (c.height / 2));
        return c.toDataURL();
    },
    // Source : https://github.com/tensorflow/tfjs-examples/blob/0f77c36cd849ee1acfbe3a743f77bda1bc82d134/chrome-extension/src/content.js#L32
    textContentFromPrediction : function (predictions) {
        predictions.sort((a,b)=>{return b.probability - a.probability});
       
        if (!predictions || predictions.length < 1) {
          return `No prediction 🙁`;
        }
        // Confident.
        if (predictions[0].probability >= this.model.HIGH_CONFIDENCE_THRESHOLD) {
          return `😄 ${predictions[0].className}! \n (${predictions[0].probability})`;
        }
        // Not Confident.
        if (predictions[0].probability >= this.model.LOW_CONFIDENCE_THRESHOLD &&
            predictions[0].probability < this.model.HIGH_CONFIDENCE_THRESHOLD) {
          return `${predictions[0].className}?...\n Maybe ${
              predictions[1].className}?`;
        }
        // Very not confident.
        if (predictions[0].probability < this.model.LOW_CONFIDENCE_THRESHOLD) {
          return `😕  ${predictions[0].className}????...\n Maybe ${
              predictions[1].className}????`;
        }
    },
    // Source : https://github.com/tensorflow/tfjs-examples/blob/0f77c36cd849ee1acfbe3a743f77bda1bc82d134/chrome-extension/src/content.js#L32
    addTextElementToImageNode : function(imgNode, textContent) {
        console.log('addTextElementToImageNode');
        console.log(imgNode);
        const originalParent = imgNode.parentNode;
        console.log(imgNode.parentNode);
        const container = document.createElement('div');
        container.style.position = 'relative';
        container.style.textAlign = 'center';
        container.style.color = 'white';
        const text = document.createElement('div');
        text.className = 'tfjs_mobilenet_extension_text';
        text.style.position = 'absolute';
        text.style.top = '50%';
        text.style.left = '50%';
        text.style.transform = 'translate(-50%, -50%)';
        text.style.fontSize = `${parseInt(imgNode.width*0.13)}px`;
        text.style.fontFamily = 'Google Sans,sans-serif';
        text.style.fontWeight = '800';
        text.style.color = 'white';
        text.style.lineHeight = '1em';
        text.style['-webkit-text-fill-color'] = 'white';
        text.style['-webkit-text-stroke-width'] = '1px';
        text.style['-webkit-text-stroke-color'] = 'gray';
        // Add the containerNode as a peer to the image, right next to the image.
        originalParent.insertBefore(container, imgNode);
        // Move the imageNode to inside the containerNode;
        container.appendChild(imgNode);
        // Add the text node right after the image node;
        container.appendChild(text);
        text.textContent = textContent;
    },
    refresh : function(){
        console.log('refresh');
        this.nodes = [...document.images];
        console.log(this.nodes);
        this.filter.bind(this)();

    },
}

const [body] = document.getElementsByTagName('body');
body.addEventListener('load', findaw.refresh.bind(findaw));
body.addEventListener('click', e=>{ 
    if(e.target.nodeName === 'img'){
        console.log('img click');
    }
    console.log('body click');
    findaw.refresh.bind(findaw)();
});
window.addEventListener('scroll', e=>{
    if((window.innerHeight + window.scrollY) >= body.offsetHeight){
        console.log('scolling');
        findaw.refresh.bind(findaw)();
    }
}) 
function blurImage(imgElm){
    blurify({ images : imgElm, blur:7, mode: 'auto', });
}
findaw.refresh.bind(findaw)();