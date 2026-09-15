const BASE_URL = process.env.BASE_URL;
const imageResolver = (imageUrl, source) => {
    if(source === 'external' || /^https?:\/\//.test(imageUrl || '')){
        return imageUrl
    }
    if(!imageUrl){
        return null
    }
    return `${BASE_URL}/${imageUrl}`;
}
module.exports = {imageResolver}