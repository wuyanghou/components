import React from 'react'
import {Icon} from 'antd'
import IconButton from 'COMPONENT/IconButton';
import styles from './index.less'


const showNum = 6;//列表展示多少个
let rotateTag=0;
export default class Test extends React.Component {
  constructor(props) {
    super(props);
    this.round=0;
    this.state = {
      activeIndex: 0,
      startIndex: null,
      imgArray: [],
      rotate:0
    }
  }

  componentDidMount() {

    this.getStartIndex();

    this.addEvent(this.$img, 'mousedown', (ev) => {
      let oEvent = this.prEvent(ev);
      let oParent = this.$img.parentNode;
      let disX = oEvent.clientX - this.$img.offsetLeft;
      let disY = oEvent.clientY - this.$img.offsetTop;
      let tag = true;
      let startMove = (ev) => {
        if (tag) {
          let oEvent = ev || window.event,
            l = oEvent.clientX - disX,
            t = oEvent.clientY - disY;
          this.$img.style.left = l + 'px';
          this.$img.style.top = t + 'px';
          oParent.onselectstart = () => {
            return false;
          }
        }
      }
      let endMove = (ev) => {
        tag = false;
        oParent.onselectstart = null;
        this.removeEvent(oParent, 'mousemove', startMove);
        this.removeEvent(oParent, 'mouseup', endMove);
      };
      this.addEvent(oParent, 'mouseout', endMove);
      this.addEvent(oParent, 'mousemove', startMove);
      this.addEvent(oParent, 'mouseup', endMove);
      return false;
    });

    /*以鼠标位置为中心的滑轮放大功能*/
    let self = this;
    this.addWheelEvent(this.$img, function (delta) {
      let offsetLeft = self.$img.offsetLeft;
      let offsetTop = self.$img.offsetTop;
      let boundingClientRect = self.$img.getBoundingClientRect();
      let ratioL = (this.clientX - boundingClientRect.left) / self.$img.offsetWidth;
      let ratioT = (this.clientY - boundingClientRect.top) / self.$img.offsetHeight;
      let ratioDelta = !delta ? 1 + 0.1 : 1 - 0.1;
      let w = parseInt(self.$img.offsetWidth * ratioDelta);
      let h = parseInt(self.$img.offsetHeight * ratioDelta);
      let l = Math.round(this.clientX - (boundingClientRect.left - offsetLeft) - (w * ratioL));
      let t = Math.round(this.clientY - (boundingClientRect.top - offsetTop) - (h * ratioT));
      self.$img.style.width = w + 'px';
      self.$img.style.height = h + 'px';
      self.$img.style.left = l + 'px';
      self.$img.style.top = t + 'px';
    });
  }

  componentWillReceiveProps(nextProps) {
    // let {startIndex} = this.state;
    // if (!startIndex) {
    //   this.getStartIndex();
    // }
    if(this.props.activeSrc !==nextProps.activeSrc){
      this.setState({currentSrc:nextProps.activeSrc});
    }
  }

  getStartIndex = () => {
    let {activeSrc, list = []} = this.props;
    let index = list.findIndex((v, k) => {
      return v === activeSrc;
    })
    let sliceList = list.slice(index, showNum + index);
    this.setState({startIndex: index, imgArray: sliceList,currentSrc:activeSrc});
  }


  addEvent = (obj, sType, fn) => {
    if (obj.addEventListener) {
      obj.addEventListener(sType, fn, false);
    } else {
      obj.attachEvent('on' + sType, fn);
    }
  };
  removeEvent = (obj, sType, fn) => {
    obj.removeEventListener(sType, fn, false);
  }
  prEvent = (ev) => {
    let oEvent = ev || window.event;
    if (oEvent.preventDefault) {
      oEvent.preventDefault();
    }
    return oEvent;
  }


  addWheelEvent = (obj, callback) => {
    let wheel = (ev) => {
      let oEvent = this.prEvent(ev),
        delta = oEvent.detail ? oEvent.detail > 0 : oEvent.wheelDelta < 0;
      callback && callback.call(oEvent, delta);
      return false;
    }
    this.addEvent(obj, 'mousewheel', wheel);
  }

  selectImg = (index) => {
    let {imgArray}=this.state;
    this.setState({activeIndex: index,currentSrc:imgArray[index]});
    this.changeRotate('reset');
  }
  changeRotate=(key)=>{
    this.resetPosition();
    rotateTag=key?0:++rotateTag;
    this.setState({rotate:rotateTag%4})
  }
  resetPosition = () => {
    this.$img.style.width = null;
    this.$img.style.height = null;
    this.$img.style.top = null;
    this.$img.style.left = null;
  }
  next = () => {
    let {activeIndex, imgArray, startIndex = 0} = this.state;
    let {list = []} = this.props;
    let len = imgArray.length;
    this.changeRotate('reset');
    if (activeIndex < len - 1) {
      activeIndex++;
      this.setState({activeIndex,currentSrc:imgArray[activeIndex]});
    } else {
      let sliceList = list.slice(showNum * (this.round + 1) + startIndex, showNum * (this.round + 2) + startIndex);
      if (sliceList.length > 0) {
        this.round++;
        this.setState({imgArray: sliceList, activeIndex: 0,currentSrc:sliceList[0]});
      }
    }
  }
  prev = () => {
    let {activeIndex, startIndex = 0,imgArray} = this.state;
    let {list = []} = this.props;
    this.changeRotate('reset');
    if (activeIndex > 0) {
      activeIndex--;
      this.setState({activeIndex,currentSrc:imgArray[activeIndex]});
    } else {
      let sliceList;
      if (this.round === 0) {
        sliceList = list.slice(0, showNum);
        this.setState({startIndex:showNum});
        this.round--;
        let firstIndex=sliceList.findIndex((v,k)=>{return v===imgArray[0]});
        let len=sliceList.length;
        let activeIndex=firstIndex===-1? len-1:firstIndex-1
        this.setState({imgArray: sliceList, activeIndex,currentSrc:sliceList[activeIndex]});
      }
      else if (this.round > 0) {
        sliceList = list.slice(showNum * (this.round - 1) + startIndex, showNum * (this.round) + startIndex);
        this.round--;
        let len=sliceList.length;
        this.setState({imgArray: sliceList, activeIndex:len-1,currentSrc:sliceList[len-1]});
      }
    }
  }

  render() {
    const {activeIndex, imgArray,rotate,currentSrc} = this.state;
    let {Thumbnail,showThumbnail=true,activeSrc}=this.props;
    Thumbnail=Thumbnail?Thumbnail:imgArray.map((v, k) => {
      return (
        <div key={k}>
          {activeIndex === k &&
          <div className={styles.mask}></div>
          }
          <img src={v} alt="" onClick={e => this.selectImg(k)}/>
        </div>
      )
    })
  return (
      <div className={styles.wrap}>
        <div className={styles.bigImg}>
          <img src={currentSrc} style={{position: 'absolute',transform:`rotate(${rotate * 90}deg)`}} alt="" ref={e => this.$img = e}/>
          <div style={{zIndex:1}}>
            <IconButton type={'left'} size={40} style={{position:'absolute',left:10}} onClick={this.prev}/>
            <IconButton type={'right'} size={40} style={{position:'absolute',right:10}} onClick={this.next}/>
          </div>
          <div className={styles.handle}>
            <IconButton type={'rotate_left'} size={24} style={{position:'absolute',right:10,top:10,color:'white'}} onClick={e=>this.changeRotate()}/>
          </div>
        </div>
        {showThumbnail &&
          <div className={styles.list}>
            <Icon type="left" onClick={this.prev}/>
            <div className={styles.content}>
              {Thumbnail}
            </div>
            <Icon type="right" onClick={this.next}/>
          </div>
        }

      </div>
    )
  }
}
