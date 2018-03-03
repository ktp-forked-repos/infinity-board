import React from 'react';
import PropTypes from 'prop-types';

class DraggableBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draggable: false,
      downX: 0,
      downY: 0,
      resizing: false,

      mouseX: 0,
      mouseY: 0,
      mouseMoved: 'false',
    };
  }

  componentDidMount() {
    // We have to add document listeners so it will update pos even when
    document.addEventListener('mousemove', this.mouseMove);
    document.addEventListener('mouseup', this.mouseUp);
  }

  /*
  Gives the CSS styling for the given box.
  @return boxStyle - the JS object containing the correct styling for the box.
  */
  getBoxStyle = () => {
    const boxStyle = {
      backgroundColor: this.props.color,
      left: `${this.props.renderX}px`,
      top: `${this.props.renderY}px`,
      width: `${this.props.w - (2 * this.props.padding)}px`,
      height: `${this.props.h - (2 * this.props.padding)}px`,
      cursor: this.getCursor(),
      padding: `${this.props.padding}px`,
      zIndex: this.props.z,
      visibility: this.props.style.visibility,
    };
    return boxStyle;
  };

  /*
  Handles the resizing of the given box.
  @param mouseVal: the position value (x or y) for the mouse
  @param elemVal: the position value for the element
  @param min: the minimum width or height of the box
  @return the resulting width or height value
  */
  getResize = (mouseVal, elemVal, min) => {
    const newSize = mouseVal - elemVal;
    if (newSize >= min) {
      return newSize;
    }
    return min;
  };

  /*
  Returns the correct cursor given the state of the box.
  @return the css property name for the cursor
  */
  getCursor = () => {
    if (this.state.draggable) {
      return 'move';
    } else if (this.state.resizing || this.cursorInDraggingPosition()) {
      return 'se-resize';
    }
    return 'default';
  };

  /*
  Handles mouse movement events. Updates the size or position of the box based on
  whether we're resizing or dragging.
  */
  mouseMove = (e) => {
    e.preventDefault();
    // Fix this, the box should be less state-y
    this.setState({
      mouseX: e.clientX,
      mouseY: e.clientY,
      mouseMoved: true,
    });
    const id = this.props.uid; // Get the UUID of the current board
    if (this.state.resizing) {
      const width = this.getResize(e.clientX, this.props.renderX, this.props.minX); // Get new width
      let heightVal = 0;
      if (this.props.aspect !== 0) { // If the box has a defined aspect ratio, keep it to that ratio
        heightVal = width / this.props.aspect;
      } else {
        heightVal = this.getResize(e.clientY, this.props.renderY, this.props.minY);
      }

      this.props.callback(id, {
        w: width,
        h: heightVal,
      });
    } else if (this.state.draggable) {
      this.props.callback(id, {
        x: e.screenX + this.state.downX,
        y: e.screenY + this.state.downY,
      });
    }
  };

  /*
  Handles mouse press events. Updates zIndex, and state values to detect mouse movement.
  */
  mouseDown = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.button === 0) { // Check to make sure it's left mouse click
      this.setState({
        mouseMoved: false,
        downX: this.props.x - e.screenX,
        downY: this.props.y - e.screenY,
      });
      this.props.callback(this.props.uid, { // Update z-index
        z: this.props.clickCallback(),
      });
      if (this.cursorInDraggingPosition(e)) { // If we're resizing the box
        this.setState({ resizing: true });
      } else {
        this.setState({ draggable: true });
      }
    }
  };

  /*
  Handles mouse up events. Stops everything from being dragged or resized.
  */
  mouseUp = (e) => {
    e.preventDefault();
    this.setState({ draggable: false, resizing: false });
    if (!this.state.mouseMoved) {
      this.props.textCallback();
    }
  };

  /*
  Determines whether the mouse is in dragging position.
  @return a bool indicating whether the mouse is in dragging position
  */
  cursorInDraggingPosition = () => {
    const cornerX = (this.state.mouseX - this.props.renderX - this.props.w) ** 2;
    const cornerY = (this.state.mouseY - this.props.renderY - this.props.h) ** 2;
    const dist = Math.sqrt(cornerX + cornerY);
    return (dist < 20);
  };

  render() {
    return (
      // eslint-disable-next-line
      <div onMouseDown={this.mouseDown} className="Box" style={this.getBoxStyle()}>
        {this.props.children}
        <div className="pull-tab" />

      </div>
    );
  }
}

DraggableBox.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
  padding: PropTypes.number,
  minX: PropTypes.number,
  minY: PropTypes.number,
  // eslint-disable-next-line react/no-unused-prop-types
  defaultWidth: PropTypes.number,
  // eslint-disable-next-line react/no-unused-prop-types
  defaultHeight: PropTypes.number,
  x: PropTypes.number,
  y: PropTypes.number,
  renderX: PropTypes.number,
  renderY: PropTypes.number,
  w: PropTypes.number,
  h: PropTypes.number,
  z: PropTypes.number,
  color: PropTypes.string,
  callback: PropTypes.func.isRequired,
  uid: PropTypes.string.isRequired,
  aspect: PropTypes.number,
  // eslint-disable-next-line
  style: PropTypes.object,
  textCallback: PropTypes.func,
  clickCallback: PropTypes.func,
};

DraggableBox.defaultProps = {
  padding: 20,
  minX: 200,
  minY: 200,
  defaultWidth: 200,
  defaultHeight: 200,
  x: 0,
  y: 0,
  renderX: 0,
  renderY: 0,
  w: 200,
  h: 200,
  color: '#ff0000',
  aspect: 0,
  style: { visibility: 'visible' },
  textCallback: () => {},
  clickCallback: () => {},
  z: 1,
};

export default DraggableBox;
