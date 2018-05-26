import { FILE_TYPE_MAP_EXTENSION } from './config'

const isImg = ({ type, extension }) => {
    type = type ? type.toLowerCase() : null
    extension = extension ? extension.toLowerCase() : null
    const imgTypes = ['png', 'jpg', 'bmp']
    if (type && imgTypes.indexOf(type) >= 0) {
        return true
    } 
    let imgExtensions = []
    imgTypes.forEach(t => {
        const a = FILE_TYPE_MAP_EXTENSION[t]
        if (a) {
            imgExtensions = [ ...imgExtensions, ...a ]
        }
    })
    if (extension && imgExtensions.indexOf(extension) >= 0) {
        return true
    }
    return false
}

const getFileTypeByExtension = (extension) => {
    let type = null 
    Object.keys(FILE_TYPE_MAP_EXTENSION).forEach(key => {
        if (FILE_TYPE_MAP_EXTENSION[key].indexOf(extension.toLowerCase()) >= 0) {
            type = key
        }
    })
    return type
}


export default {
    isImg,
    getFileTypeByExtension,
}