

console.log('model.js loaded');

class ImageClassifier{
    constructor(){
        // this.ORIGIN_URL = "http://findaw.dothome.co.kr/";
        // this.MODEL_URL = "http://findaw.dothome.co.kr/model/";
        this.ORIGIN_URL = "https://teachablemachine.withgoogle.com/";
        this.MODEL_URL = "https://teachablemachine.withgoogle.com/models/aQfUbFmN6-/";
        this.IMAGE_SIZE = 150;
        this.TOPK_PREDICTINS = 2;
        this.MIN_IMG_SIZE = 100;
        this.FIVE_SECONDS_IN_MS = 5000;
        this.HIGH_CONFIDENCE_THRESHOLD = 0.5;
        this.LOW_CONFIDENCE_THRESHOLD = 0.1;
        this.modelURL = null;
        this.metadataURL = null;
        this.model = null;
        this.metadata = null;
        this.init();
    }
    async init(){
        this.modelURL = this.MODEL_URL + "model.json";
        this.metadataURL = this.MODEL_URL + "metadata.json";
        this.model = await tmImage.load(this.modelURL, this.metadataURL);
        console.log('init');
        console.log(this.model);
        this.MAX_PREDICTION = this.model.getTotalClasses();

        // this.model = await tf.loadLayersModel(this.modelURL);
        // this.metadata = await JSON.parse(this.metadataURL);
        // this.MAX_PREDICTION = this.metadata.labels.length;
    }
    // async getModelData(modelURL=this.modelURL){
    //     console.log(modelURL);
    //     console.log(this.ORIGIN_URL);
    //     const response = await fetch(modelURL, {
    //         method :'GET',
    //         mode: 'cors',           // no-cors, cors, *same-origin
    //         headers:{
    //             'Origin' : this.ORIGIN_URL,
    //             'Access-Control-Allow-Origin' : this.ORIGIN_URL,
    //             'Content-Type': 'application/json',
    //         }
    //     });
    //     return response;
    // }
    // async getMetaData(metadataURL=this.metadataURL){
    //     let link = document.createElement('link');
    //     link.crossOrigin = 'Anonymous';
    //     link.type = 'application/json';
    //     link.rel = this.metadataURL;
    //     link.addEventListener('load', e=>{
    //         console.log(e.target.innerText);
    //     });
        
    //     const response = await fetch(metadataURL, {
    //         method: 'GET',
    //         headers:{
    //             'Origin' : this.ORIGIN_URL,
    //             'Access-Control-Allow-Origin' : this.ORIGIN_URL,
    //             'Content-Type': 'application/json',
    //         }
    //     });
    //     return response;
    // }
    async analyze(nodes, transfer){
        // if(!tabId){ console.error('No Tab.'); return; }
        if(this.model != undefined){ console.log('model not loaded');  return; }
        console.log('analyze()');
        for(const imgNode of nodes){
            // predict = this.predict(imgNode);
            // transfer.filter();
        }
    }
    async predict(input) {   
        return new Promise(async (resolve, reject)=>{
            console.log('predict');
            console.log(this);
            if(!this.model) {
                console.log('model not loaded');
                reject('model not loaded');
            }
            // predict can take in an image, video or canvas html element
            // const img = tf.browser.fromPixels(input).toFloat();
            // const normalized = img.div(tf.scalar(256.0));
            // const batched = normalized.reshape([3, input.width, input.height]);

            const prediction = await this.model.predict(input);
            console.log(prediction);

            resolve(prediction);
        });
    }
}