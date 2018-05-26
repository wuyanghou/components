import React from 'react';
import './styles.less';
import {uuid} from '../utils/basic/str';

const UE = window.UE;

class Ueditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editorId: uuid(),
      editor: null,
      title: '',
      usedNum: 0
    };
  }

  componentDidMount() {
    this.initEditor()
  }

  componentWillUnmount() {
    // 组件卸载后，清除放入库的id
    UE.delEditor(this.state.editorId);
  }

  initEditor() {
    const {editorId} = this.state;
    const {ueConfig} = this.props;
    const defaultConfig = {
      toolbars: [
        ['bold', 'italic', 'underline', '|', 'subtitle', 'blockquote', 'insertorderedlist', 'insertunorderedlist', '|',
          'indent', 'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', '|', 'link', 'simpleupload', 'horizontal', 'removeformat', '|'
        ]
      ],
      initialContent: '请在此处输入正文内容',
      autoClearinitialContent: true,
      focus: false,
      autoHeightEnabled: false,
      scaleEnabled: false,
      // imagePopup: false,
      imageScaleEnabled: false,
      enableContextMenu: false
    };
    const ueEditor = UE.getEditor(editorId, {...defaultConfig, ...(ueConfig || {})});
    const self = this;
    ueEditor.ready((ueditor) => {
      if (!ueditor) {
        UE.delEditor(editorId);
        self.initEditor();
      }
    });
    this.setState({editor: ueEditor});
  }

  getContent = () => {
    const defaultContent = this.props.ueConfig.initialContent || '请在此处输入正文内容';
    return this.state.editor.getContentTxt() === defaultContent ? '' : this.state.editor.getContent();
  }
  setContent = (content) => {
    this.state.editor.setContent(content);
  }
  getTitle = () => {
    return this.state.title === null ? '' : this.state.title;
  }
  setTitle = (title) => {
    this.setState({
      title: title,
      usedNum: title.length
    });
  }
  setContent = (content) => {
    const {editorId} = this.state;
    const {ueConfig} = this.props;
    const defaultConfig = {
      toolbars: [
        ['bold', 'italic', 'underline', '|', 'subtitle', 'blockquote', 'insertorderedlist', 'insertunorderedlist', '|',
          'indent', 'justifyleft', 'justifyright', 'justifycenter', 'justifyjustify', '|', 'link', 'simpleupload', 'horizontal', 'removeformat', '|'
        ]
      ],
      initialContent: '请在此处输入正文内容',
      autoClearinitialContent: true,
      focus: false,
      autoHeightEnabled: false,
      scaleEnabled: false,
      // imagePopup: false,
      imageScaleEnabled: false,
      enableContextMenu: false
    };
    const ueEditor = UE.getEditor(editorId, {...defaultConfig, ...(ueConfig || {})});
    const self = this;
    ueEditor.ready((ueditor) => {
      self.state.editor.setContent(content);
    });
  }
  initTitle = (title) => {
    let $title = document.querySelector('#title');
    $title.value = title;
    this.setState({usedNum: title.length, title});
  }

  render() {
    const {editorId} = this.state;
    // const {width = 753, height = 536, hasTitle = false, titleNum = 12, title} = this.props;
    const {width = 753, height = 536, hasTitle = false, titleNum = 12} = this.props;
    let {title} = this.state;
    const classnames = 'XEditor ' + (hasTitle ? 'withTitle' : '');
    return (
      <div id={editorId} name="content" style={{width: width, height: height}} type="text/plain" className={classnames}>
        {hasTitle &&
        <div className='title-input'>
          <input type="text" placeholder="请在这里输入标题" spellCheck='false' maxLength={titleNum} value={title}
                 onChange={e => this.setTitle(e.target.value)} id='title'/>
          &nbsp;{/* react jsx会合并空白 为使text-align:justify起效添加*/}
          <span>{this.state.usedNum}/{titleNum}</span>
        </div>
        }
      </div>
    )
  }
}

export default Ueditor;
