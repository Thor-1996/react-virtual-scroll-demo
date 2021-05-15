import React from "react";
import PropTypes from "prop-types";
import style from "./index.module.css";

function throttle(fn, ms) {
  let flag = true;

  return (e) => {
    if (!flag) return;
    flag = false;
    fn(e);
    setTimeout(() => {
      flag = true;
    }, ms);
  };
}

const listContainer = React.createRef();
const scrollyItem = React.createRef();
const listWrapInstance = React.createRef();

class VirtualScroll extends React.Component {
  constructor(props) {
    super(props);

    this.throttleScroll = throttle(this.handleScroll, 6);

    this.state = {
      currentList: [],
    };
  }

  componentDidMount() {
    this.initCurrentList();
    this.initComponentHeight();
  }

  handleScroll = (e) => {
    const { scrollTop, scrollHeight } = e.target;
    const { length } = this.props.list;
    const rate = scrollTop / scrollHeight;
    const start = parseInt(rate * length);
    const currentList = this.props.list.slice(start, start + this.props.rowCount);

    this.setState({
      currentList,
    });
    listWrapInstance.current.style.marginTop = scrollTop + "px";
  };

  initComponentHeight() {
    let height = +this.props.rowHeight;

    if (typeof this.props.rowHeight === "string" && this.props.rowHeight.indexOf("px") !== -1) {
      height = +this.props.rowHeight.replace(/px/g, "");
    }

    scrollyItem.current.style.height = this.props.list.length * height + "px";
    listContainer.current.style.height = this.props.rowCount * height + "px";
  }

  initCurrentList() {
    const currentList = [];
    for (let i = 0; i < this.props.list.length; i++) {
      if (i < this.props.rowCount) {
        currentList.push(this.props.list[i]);
      } else {
        break;
      }
    }

    this.setState({
      currentList,
    });
  }

  render() {
    const { renderList } = this.props;

    return (
      <div className={style.listContainer} ref={listContainer} onScroll={this.throttleScroll}>
        <div style={{ float: "left" }} ref={scrollyItem}></div>
        <div ref={listWrapInstance}>{renderList(this.state.currentList)}</div>
      </div>
    );
  }
}

VirtualScroll.defaultProps = {
  list: [],
  rowHeight: 40,
  rowCount: 10,
};

VirtualScroll.propTypes = {
  list: PropTypes.array.isRequired,
  rowHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  rowCount: PropTypes.number,
};

export default VirtualScroll;
