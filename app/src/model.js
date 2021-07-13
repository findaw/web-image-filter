

console.log('model.js loaded');

class ImageClassifier{
    constructor(){
        this.URL = "model/";
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
        this.modelURL = this.URL + "model.json";
        this.metadataURL = this.URL + "metadata.json";
        this.model = await tf.loadLayersModel(this.modelURL);
        this.metadata = JSON.parse(this.metadataURL);
        this.MAX_PREDICTION = this.metadata.labels.length;
    }
    async analyze(nodes, transfer){
        // if(!tabId){ console.error('No Tab.'); return; }
        if(!this.model){ console.log('model not loaded');  return; }
        console.log('analyze()');
        for(const imgNode of nodes){
            // predict = this.predict(imgNode);
            // transfer.filter();
        }
    }
    async predict(input) {   
        if(!this.model) {
            console.log('model not loaded');
            return;
        }

        // predict can take in an image, video or canvas html element
        const img = tf.browser.fromPixels(input).toFloat();
        const normalized = img.div(tf.scalar(256.0));
        const batched = normalized.reshape([1, this.IMAGE_SIZE, this.IMAGE_SIZE]);

        const prediction = this.model.predict(batched);
        console.log(prediction);

        return prediction;
    }
        
    
}