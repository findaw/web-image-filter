
console.log("🌀🐬🌊🌀🐬🌊🌀🐬🌊🌀🐬🌊🌀🐬🌊🌀🐬🌊");

function sleep(ms){
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}
//sleep(2000);

const findaw = {
    nodes : [...getImageNodes()],
    filter : function (){
        const imgArr = new Array();
        for(let i=0; i < this.nodes.length ; i++){
            try{
                let c= document.createElement('canvas');
                let ctx = c.getContext('2d');
                
                this.nodes[i].onload  = ()=>{
                    this.nodes[i].setAttribute('data-src', this.nodes[i].src);
                    imgArr[i] = getImgObjByElm(this.nodes[i]);
                    ctx.drawImage(imgArr[i], 0, 0, imgArr[i].width, imgArr[i].height);
                    //body.appendChild(c);
                    // c.toDataURL('image/png');
                    console.log(i + "번째 이미지 객체");
                    console.log(imgArr[i].src);
                }
                c.toBlob(blob=>blob.arrayBuffer().then(buff=>{
                    buffToUint8Array(buff, this.nodes[i], i);
                    //ctx.clearRect(0,0,c.width, c.height);
                    //ctx.beginPath();
                    blurImage(this.nodes[i]);
                }));
            }catch(err){
                console.error(err);
            }       
        }
    },
    refresh : function(){
        this.nodes = [...getImageNodes()];
        console.log(this.nodes);
        this.filter.bind(this)();
    },
}

const [body] = document.getElementsByTagName('body');
body.onload=findaw.filter.bind(findaw);
body.addEventListener('click', e=>{ 
    console.log('body click');
    findaw.refresh.bind(findaw)();
});
window.onscroll = e=>{
    if((window.innerHeight + window.scrollY) >= body.offsetHeight){
        console.log('scolling');
        findaw.refresh.bind(findaw)();
    }
}
function getImgObjByElm(element){
    const image = new Image();
    image.naturalWidth = element.naturalWidth;
    image.naturalHeight = element.naturalHeight;
    image.width = element.width;
    image.height = element.height;
    image.crossOrigin = "Anonymous";
    image.src = element.src;
    return image;
}
function buffToUint8Array(buff, node, n){
    console.log(n + "번째 이미지");
    console.log('buffer size : ' + buff.byteLength);
    let view = new Uint8Array(buff);
    //console.log(view);
    if (view !== undefined){
        filterView = view.map(value=>value+200<255 ? value+200 : value+100 ? value+100:value);
    //    console.log(filterView);
        let imgsrc = "data:image/jpeg;base64," + btoa(String.fromCharCode(... filterView));
        console.log("이미지 src" + imgsrc);
        console.log(this);

        // 1
        // const url = URL.createObjectURL(this);
        // node.src = url;
        // node.onload=()=>{URL.revokeObjectURL(this.src);}

        // 2
        // const reader = new FileReader();
        // reader.onload=e=>{
        //     node.src = reader.result;
        // }
        // reader.readAsDataURL();

        // 3
        //node.src = imgsrc;
    }
}
function blurImage(imgElm){
    blurify({ images : imgElm, blur:7, mode: 'auto', });
}
findaw.filter.bind(findaw)();