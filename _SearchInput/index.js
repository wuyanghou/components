import React from 'react'

class SearchInput extends React.Component {

  state = {
    val: this.props.value,
  }

  searchKeyChangable = true

  componentWillReceiveProps = nextProps => {
    this.setState({ val: nextProps.value })
  }

  onCompositionstart = () => {
    this.searchKeyChangable = false
  }

  onCompositionend = () => {
    this.searchKeyChangable = true
    this.onChange()
  }

  onChange = (e) => {
    let val = this.state.val
    if (e) {
      val = e.target.value
      this.setState({ val })
    }
    if (this.searchKeyChangable) {
      this.props.onChange(val)
    }
  }

  getInputInstance = () => {
    return this.inputRef
  }

  render() {
    const { val } = this.state
    const { onChange, onKeyDown, className, placeholder } = this.props
    return (
      <input
        autoComplete="off"
        onKeyDown={onKeyDown}
        className={className}
        placeholder={placeholder}
        value={val}
        onCompositionStart={this.onCompositionstart}
        onCompositionEnd={this.onCompositionend}
        onInput={this.onChange}
        ref={c => this.inputRef = c}
      />
    )
  }
}

export default SearchInput
