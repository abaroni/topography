const express = require('express');
const topographyReader = require('./topographyReader')
const app = express()
const port = 3000

app.use('/', express.static('static'))

app.get('/points/:tlx/:tly/:brx/:bry', function (req, res) {

  const topLeftX = req.params.tlx || 0
  const topLeftY = req.params.tly || 0
  const bottomRightX = req.params.brx || 1
  const bottomRightY = req.params.bry || 1
  console.log(topLeftX,topLeftY,bottomRightX,bottomRightY)
  const hrstart = process.hrtime()
  topographyReader.getRectangle({x:topLeftX,y:topLeftY},{x:bottomRightX,y:bottomRightY},function(result){
    const hrend = process.hrtime(hrstart)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    res.header("Content-Type",'application/json');
    res.send({result:result})
  })

})

app.get('/binaryPoints/:tlx/:tly/:brx/:bry', function (req, res) {

  const topLeftX = req.params.tlx || 0
  const topLeftY = req.params.tly || 0
  const bottomRightX = req.params.brx || 1
  const bottomRightY = req.params.bry || 1
  console.log(topLeftX,topLeftY,bottomRightX,bottomRightY)
  const hrstart = process.hrtime()
  topographyReader.getRectangle_2({x:topLeftX,y:topLeftY},{x:bottomRightX,y:bottomRightY},function(result){
    const hrend = process.hrtime(hrstart)
    console.info('Execution time (hr): %ds %dms', hrend[0], hrend[1] / 1000000)
    res.header("Content-Type",'application/octet-stream');

    const outBuf = Buffer.from(result.buffer, 'binary')

    console.log(result)
    console.log(outBuf)
    console.log(outBuf.length)
    res.send(outBuf)
  })

})

app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))
