const FILE_TYPES = ['word', 'excel', 'ppt', 'pdf', 'txt', 'zip', 'rar', 'png', 'jpg', 'bmp']
const FILE_TYPE_MAP_EXTENSION = {
  word: ['doc', 'docx'], 
  excel: ['xls', 'xlsx'], 
  ppt: ['ppt', 'pptx'], 
  pdf: ['pdf'], 
  txt: ['txt'], 
  zip: ['zip'], 
  rar: ['rar'], 
  png: ['png'], 
  jpg: ['jpg', 'jpeg'], 
  bmp: ['bmp'], 
}
let FILE_EXTENSIONS = []
Object.values(FILE_TYPE_MAP_EXTENSION).forEach(exs => {
    FILE_EXTENSIONS = [...FILE_EXTENSIONS, ...exs]
})

export default {
    FILE_TYPES,
    FILE_EXTENSIONS,
    FILE_TYPE_MAP_EXTENSION,
}