const fs = require('fs')
//const FILENAME = './asd.out'
const FILENAME = './topoData/N42E013.hgt'
const NROWS = 3601
const NCOLS = 3601
const BYTEPERDATA = 2

function readFile(readIndex,endIndex,callback){
  const stream = fs.createReadStream( FILENAME, { encoding:null, start: readIndex, end: endIndex +BYTEPERDATA});
  const dataBufferSize = endIndex - readIndex + BYTEPERDATA

  const dataBuffer = Buffer.alloc(dataBufferSize,0,null)
  let writeIndex = 0
  stream.on("data", function(chunk){
    writeIndex += chunk.copy(dataBuffer,writeIndex)
  })
  stream.on("end", function(){
    const arr = []
    for(let idx = 0; idx <dataBuffer.length; idx+=BYTEPERDATA){
      arr.push( {data:dataBuffer.readInt16BE(idx), point:pointFromIndex(idx+readIndex)} )
    }
    callback(arr)
  })
}
function readFile_2(readIndex,endIndex,callback){
  const stream = fs.createReadStream( FILENAME, { encoding:null, start: readIndex, end: endIndex +BYTEPERDATA});
  const dataBufferSize = endIndex - readIndex + BYTEPERDATA

  const dataBuffer = Buffer.alloc(dataBufferSize,0,null)
  let writeIndex = 0
  stream.on("data", function(chunk){
    writeIndex += chunk.copy(dataBuffer,writeIndex)
  })
  stream.on("end", function(){
    const arr = new Int16Array(dataBuffer.length / BYTEPERDATA);
    //console.log(arr.length)
    //console.log(dataBuffer.length)
    for(let idx = 0; idx <dataBuffer.length; idx+=BYTEPERDATA){
      arr[idx/BYTEPERDATA] = dataBuffer.readInt16BE(idx)
    }

    callback(arr)
  })
}

function indexFromPoint(point){
  return (point.x*BYTEPERDATA) + (point.y*NCOLS*BYTEPERDATA)
}
function pointFromIndex(index){
  const yValue = Math.floor(index / (NCOLS*BYTEPERDATA))
  const xValue = (index % (NCOLS*BYTEPERDATA) ) / BYTEPERDATA

  const point = {x: xValue ,y: yValue}
  return point
}
function getRectangle(topLeft,bottomRight,callback){
  const indexStart = indexFromPoint(topLeft)
  const indexEnd = indexFromPoint(bottomRight)
  readFile(indexStart,indexEnd,function(arr){
    const filtered = arr.filter(elem => (elem.point.x >= topLeft.x) && (elem.point.x <= bottomRight.x) && (elem.point.y >= topLeft.y) && (elem.point.y <= bottomRight.y))
    //console.log(filtered)
    //console.log(filtered[2000])
    callback(filtered)
  })
}
function getRectangle_2(topLeft,bottomRight,callback){
  const indexStart = indexFromPoint(topLeft)
  const indexEnd = indexFromPoint(bottomRight)
  readFile_2(indexStart,indexEnd,function(arr){
    //const filtered = arr.filter(elem => )
    //console.log(filtered)
    //console.log(filtered[2000])
    const filtered = []
    for(let idx=0; idx< arr.length; idx++){
      const thisPoint = pointFromIndex((idx*BYTEPERDATA)+indexStart)
      if ( (thisPoint.x >= topLeft.x) && (thisPoint.x <= bottomRight.x) && (thisPoint.y >= topLeft.y) && (thisPoint.y <= bottomRight.y)) {
        filtered.push(arr[idx])
      }
    }
    callback(new Int16Array(filtered))

  })
}

exports.getRectangle = getRectangle
exports.getRectangle_2 = getRectangle_2
