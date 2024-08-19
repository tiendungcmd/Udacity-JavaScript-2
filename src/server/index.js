require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')
const path = require('path')

const app = express()
const port = 3000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/', express.static(path.join(__dirname, '../public')))
//https://mars.nasa.gov/msl-raw-images/proj/msl/redops/ods/surface/sol/01000/opgs/edr/fcam/FLB_486265257EDR_F0481570FHAZ00323M_.JPG
// your API calls https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/photos?sol=1000&page=2&api_key=bZQnYkImzjxtWDhlae0gjnf1sT8flsAbgD0862Xe
app.get('/state/:name', async (req, res) => {
    try{
        const name = req.params.name.toLocaleLowerCase();
        let url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?sol=1000&page=2&api_key=${process.env.API_KEY}`;
        if (name == 'opportunity'){
            url = `https://api.nasa.gov/mars-photos/api/v1/rovers/${name}/photos?earth_date=2015-6-3&api_key=9drRoynCDMn10EHW3hGQvN65n3twcwrd9feyrRBE` 
        }
        
        let image = await fetch(url)
                .then(res => res.json())
            res.send({ image })
    } catch (err){
        console.log('error:', err);
    }
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))