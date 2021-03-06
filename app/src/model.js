

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
        this.FILTER_TARGET = ["cockroach"];   // to fix
        this.modelURL = null;
        this.metadataURL = null;
        this.MODEL = null;
        this.metadata = null;

    }
    async load(){
        this.modelURL = this.MODEL_URL + "model.json";
        this.metadataURL = this.MODEL_URL + "metadata.json";

        // techarble machine model load
        this.MODEL = await tmImage.load(this.modelURL, this.metadataURL);
        this.MAX_PREDICTION = this.MODEL.getTotalClasses();
        console.log('Load Model');
        console.log(this.MODEL);

        // tensorflow js model load
        // this.model = await tf.loadLayersModel(this.modelURL);
        // this.metadata = await JSON.parse(this.metadataURL);
        // this.MAX_PREDICTION = this.metadata.labels.length;
        return 1;
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
        if(this.MODEL != undefined){ console.log('model not loaded');  return; }
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
            console.log(this.MODEL);
            if(!this.MODEL) {
                console.log('model not loaded');
                reject('model not loaded');
            }
            // predict can take in an image, video or canvas html element
            // const img = tf.browser.fromPixels(input).toFloat();
            // const normalized = img.div(tf.scalar(256.0));
            // const batched = normalized.reshape([3, input.width, input.height]);

            const prediction = await this.MODEL.predict(input);
            console.log(prediction);

            resolve(prediction);
        });
    }
}