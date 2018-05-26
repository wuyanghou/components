const getBlob = (url) => {
  return new Promise(resolve => {
    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.responseType = 'blob'
    xhr.onload = () => {
      if (xhr.status === 200) {
        resolve(xhr.response)
      }
    }

    xhr.send()
  })
}

const saveAs = (blob, filename) => {
  const link = document.createElement('a')
  const body = document.querySelector('body')

  link.href = window.URL.createObjectURL(blob)
  link.download = filename

  // fix Firefox
  link.style.display = 'none'
  body.appendChild(link)
  
  link.click()
  body.removeChild(link)

  window.URL.revokeObjectURL(link.href)
}

const download = (url, filename) => {
  getBlob(url).then(blob => {
    saveAs(blob, filename)
  })
}

export default download