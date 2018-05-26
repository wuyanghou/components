
import ReactDOM from 'react-dom'
import ConfirmComp from './ConfirmComp'

const confirm = (config) => {
  let div = document.createElement('div')
  document.body.appendChild(div)

  const close = () => {
    const unmountResult = ReactDOM.unmountComponentAtNode(div)
    if (unmountResult && div.parentNode) {
      div.parentNode.removeChild(div)
    }
  }

  const render = (props) => {
    ReactDOM.render(<ConfirmComp {...props} />, div)
  }

  render({ ...config, close })

  return {
    close,
  }
}

export default confirm