const DAYS_S = [
    'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'
];
const transformNumber=(nubmer)=>{
    let string=nubmer+""
    if(string.length<2){
        return "0"+string
    }else{
        return string
    }

}
export const getDate=(time)=>{
  
    let date = new Date(time)
    let res = Date.now()-date
    let dayRes=res/ (24*60*60*1000)
    if(dayRes<1){
        return transformNumber(date.getHours())+":"+transformNumber(date.getMinutes())
    }
    if(dayRes<7){
        return DAYS_S[date.getDay()]
    }
    if(dayRes<12){
        let day=date.getDay()+1;
        let month=date.getMonth()+1;
        let year=date.getFullYear()+"";
        year=year.substring(2,4);
        return transformNumber(day)+"."+transformNumber(month)+"."+year;
    }
}
export const getFullDate=(time)=>{
    const months = [
    "January", "February", "March", "April", "May", "June", "July", 
    "August", "September", "October", "November", "December"
    ];

    const date = new Date(time);
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    const formattedDate = `${day} ${month} ${year}`;
    return formattedDate;
}
export function getTimeOfDay(time) {
    const date = new Date(time);
    let hours = date.getHours();
    let minutes = date.getMinutes();
  
    hours = (hours < 10) ? `0${hours}` : hours;
    minutes = (minutes < 10) ? `0${minutes}` : minutes;
  
    const timeOfDay = `${hours}:${minutes}`;
    return timeOfDay;
  }
export function  formatMilliseconds(milliseconds) {
    // Преобразование миллисекунд в секунды
    var seconds = Math.floor(milliseconds / 1000);
    
    // Вычисление минут и оставшихся секунд
    var minutes = Math.floor(seconds / 60);
    seconds = seconds % 60;
    
    // Добавление ведущих нулей, если необходимо
    var formattedMinutes = minutes < 10 ? "0" + minutes : minutes;
    var formattedSeconds = seconds < 10 ? "0" + seconds : seconds;
    
    // Возвращение форматированной строки
    return formattedMinutes + ":" + formattedSeconds;
}
export async function getBlobDuration (blob){
    const tempVideoEl = document.createElement('audio')
    
   
   
    const durationP = new Promise((resolve, reject) => {
        let loadedMetaData = () => {
            if(tempVideoEl.duration === Infinity) {
                tempVideoEl.currentTime = Number.MAX_SAFE_INTEGER
                tempVideoEl.ontimeupdate = () => {
                    tempVideoEl.ontimeupdate = null
                    resolve(tempVideoEl.duration)
                    clearData();
                }
            }
            else{
                resolve(tempVideoEl.duration);
                clearData();
            }
        }
        function clearData() {
            tempVideoEl.removeEventListener('loadedmetadata', loadedMetaData)
            tempVideoEl.remove()
        }
        tempVideoEl.addEventListener('loadedmetadata', loadedMetaData)
        tempVideoEl.onerror = (event) => reject(event.target.error)
    })
    tempVideoEl.src = typeof blob === 'string' || blob instanceof String
        ? blob
        : window.URL.createObjectURL(blob)
    return durationP
}
export const convertURIToBinary = (dataURI) => {
    let BASE64_MARKER = ';base64,';
    let base64Index = dataURI.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
    let base64 = dataURI.substring(base64Index);
    let raw = window.atob(base64);
    let rawLength = raw.length;
    let arr = new Uint8Array(new ArrayBuffer(rawLength));

    for (let i = 0; i < rawLength; i++) {
        arr[i] = raw.charCodeAt(i);
    }
    return arr;
}