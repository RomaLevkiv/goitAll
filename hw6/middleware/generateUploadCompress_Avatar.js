const multer = require( 'multer')
const  path = require( 'path')
const  fs = require ('fs')
const Jimp = require( 'jimp')
const { promises: fsPromises } = fs
const Avatar = require('avatar-builder')


class UploadAndCompressImage {

  async generateAvatar(req, res, next) {
    const avatar = Avatar.male8bitBuilder(128)
    const img = `img${Date.now()}`
    const file = `${img}.png`
    const pathFilename = path.join(process.env.GENERATE_IMAGE_FOLDER, file)

    avatar.create(img)
      .then(buffer => {
        fs.writeFileSync(pathFilename, buffer)
        req.body.avatarURL = 
          `${process.env.AVATAR_URL_PATH}/${file}`
        next()
      })  
    
  }
  
  
    uploadByMulter() {      
      const storage = multer.diskStorage({
        destination: function (req, file, cb) {
          cb(null, process.env.MULTER_IMAGE_STORE)
        },
        filename: function (req, file, cb) {
          const { ext } = path.parse(file.originalname)
          cb(null, `${Date.now()}${ext}`)
        },
      })
  
      return multer({ storage });
    }
  
    async compressImage(req, res, next) {
      const { path: outPathImg } = req.file
      let { name, ext } = path.parse(req.file.filename)
      if (ext === ".gif") {
        ext = ".jpg"
      }
      const inPath = path.join(process.env.GENERATE_IMAGE_FOLDER, `${name}${ext}`)
      const img = await Jimp.read(outPathImg)
      img.resize(256, 256)
        .quality(60)
        .greyscale()
        .write(inPath)
      req.file.path = inPath
      await fsPromises.unlink(outPathImg)
      next()
    }  
  }
  
 const generate_upload = new UploadAndCompressImage()

 export {generate_upload}