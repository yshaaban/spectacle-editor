// Code contained in this file is adapted from https://github.com/gaearon/react-dnd
import React, { Component, PropTypes } from "react";
import { findDOMNode } from "react-dom";
import { DraggableTypes } from "../../constants";
import { DragSource, DropTarget } from "react-dnd";

const slideSource = {
  beginDrag(props) {
    console.log(props.index);
    return {
      id: props.id,
      index: props.index,
      originalIndex: props.index
    };
  },
  // Go back to original index if dropped outside
  endDrag(props, monitor) {
    const { index, originalIndex } = monitor.getItem();
    const didDrop = monitor.didDrop();

    if (!didDrop) {
      console.log("HERE");
      props.onMoveSlide(index, originalIndex);
    }
  }
};

const slideTarget = {
  drop(props, monitor) {
    console.log("drop", monitor.getItem().originalIndex, props.index);
    props.onDropSlide(monitor.getItem().originalIndex, props.index);
  },
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    // Subtract 40px to make reordering occur faster
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY - 40) {
      return;
    }

    // Dragging upwards
    // Add 40px to make reordering occur faster
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY + 40) {
      return;
    }

    // Time to actually perform the action
    props.onMoveSlide(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

@DropTarget(DraggableTypes.SLIDE, slideTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))
@DragSource(DraggableTypes.SLIDE, slideSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Slide extends Component {
  render() {
    const { isDragging, connectDragSource, connectDropTarget, children, ...rest } = this.props;
    const opacity = isDragging ? 0 : 1;

    return connectDragSource(connectDropTarget(
      <div {...rest}>
        {children}
      </div>
    ));
  }
}

Slide.propTypes = {
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
  index: PropTypes.number.isRequired,
  isDragging: PropTypes.bool.isRequired,
  id: PropTypes.any.isRequired,
  onMoveSlide: PropTypes.func.isRequired,
  children: PropTypes.any
};
