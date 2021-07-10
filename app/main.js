import { getImageNodes, getNodes } from "./src/getImageSrc.js";



export function main(){
    console.log("hello");
    console.log("hello")

    const nodes = getImageNodes();

    for(const node of nodes){
        console.log(node)
    }

}



