
console.log("🌀🐬🌊🌀🐬🌊🌀🐬🌊🌀🐬🌊🌀🐬🌊🌀🐬🌊");

function sleep(ms){
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}
//sleep(2000);

const findaw = {
    flag : { FILTERED : '1', RETRY: '2', SUCCESS: '9' },
    attr : { FLAG : 'data-flag', BLURIFY : 'data-src'},
    nodes : [...document.images],
    imgArr : new Array(),
    model : new ImageClassifier(),
    addLListener : async function  (){
        if (this.model.MODEL === null) await this.model.load();
        console.log(this.nodes);
        this.imgArr = new Array();

        async function listener(node){
            if(this.model.MODEL === null) await this.model.load();
            let image = this.getImgObjByElm(node);
            image.addEventListener('load', async e=>this.filter(e, node));
            // node.setAttribute('crossOrigin', 'Anonymous');
            if(node.getAttribute('src')){
                try{
                    node.setAttribute(this.attr.BLURIFY, node.getAttribute('src'));
                    image.setAttribute(this.attr.BLURIFY, node.getAttribute('src'));
                    image.src = node.src;
                }catch(err){
                    console.error('CORS ERROR');
                }
            }
        }
        for(let i=0; i < this.nodes.length ; i++){
            if(this.nodes[i].complete){
                listener.bind(findaw)(this.nodes[i]);
            }else if(this.nodes[i].src){
                this.nodes[i].addEventListener('load', async e=>{
                    listener.bind(findaw)(this.nodes[i]);
                });
            }
        }
    },
    filter : async function (e, node){   // e.target : new Image Object
        console.log('filter');
        if(!node) return findaw.refresh.bind(findaw);
        if(node.getAttribute(this.attr.FLAG) === this.flag.FILTERED ) return;
        if(this.model.MODEL === null) await this.model.load();

        try{
            // convert logic here
            const imgObj = e.target;
            const [c, ctx] = this.imgToCanvas(e.target);
            ctx.getImageData(0, 0, c.width, c.height);

            const prediction = await this.model.predict(c);
            let sortPred = Object.assign([], prediction);
            sortPred.sort((a,b)=>{return b.probability - a.probability});
            
            const textContent = this.contentFromPrediction(sortPred);
            
            if(this.addTextElementToImageNode(node, textContent) === this.flag.SUCCESS){
                console.log('DONE');
                // e.target.setAttribute('data-flag', this.flag.FILTERED);
                node.setAttribute(this.attr.FLAG, this.flag.FILTERED);
                // this.imgArr[i].setAttribute('data-flag', this.flag.FILTERED);
                // this.nodes[i].setAttribute('src', e.target.getAttribute('src'));
                if (!imgObj.src.includes('base64')) {
                    imgObj.setAttribute('src', c.toDataURL());
                    node.parentNode.replaceChild(imgObj, node);
                    this.imgArr.push(e.target);
                }else{
                    this.imgArr.push(node);
                }
                if(this.model.FILTER_TARGET.includes(sortPred[0].className)) blurImage(this.imgArr[this.imgArr.length-1]);  //fix
            }
        }catch(err){
            console.log(err);
            sleep(100);
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
    contentFromPrediction : function (predictions) {
        if (!predictions || predictions.length < 1) {
          return `No prediction 🙁`;
        }
        // Confident.
        if (predictions[0].probability >= this.model.HIGH_CONFIDENCE_THRESHOLD) {
          return `😄 ${predictions[0].className}! \n (${predictions[0].probability.toFixed(2)})`;
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
        const originalParent = imgNode.parentNode;
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
        text.style.fontSize = `${(imgNode.width*0.08).toFixed(2)}px`;
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

        return this.flag.SUCCESS;
    },
    refresh : async function(){
        console.log('refresh');
        if (this.model === null) this.model = new ImageClassifier();
        await this.model.load();
        this.nodes = [...document.images];
        this.addLListener.bind(this)();

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