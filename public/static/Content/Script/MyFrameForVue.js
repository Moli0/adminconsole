/**
 * 设置表格的上下左右键控制光标
 * @param e 按下时触发的事件e
 * @param maxRow 最大行索引
*/
function SetKeyDown (e, maxRow) {
  if (e.keyCode >= 37 && e.keyCode <= 40) {
    var firstRowIndex = 1;  //起始行索引
    var lastRowIndex = maxRow;   //终止行索引
    var firstCellIndex = 1;  //起始列索引
    var lastCellIndex = e.target.parentNode.cells.length - 1;   //终止列索引
    var rowIndex = e.target.parentNode.rowIndex;    //当前行索引
    var cellIndex = e.target.cellIndex;     //当前列索引

    var tb = e.target.parentNode.parentNode;

    //因为含有排序列，因此cellIndex最小值应该是1（0为排序列，不可编辑）
    if (e.keyCode == 37) {
      //方向左键
      if (cellIndex == firstCellIndex) {
        //如果是第一个
        if (rowIndex > firstRowIndex) {
          //如果不是第一行则转到上一行最后一个
          tb.rows[rowIndex - 1].cells[lastCellIndex].focus();
        }
      } else {
        //如果不是第一个，则转到上一个
        tb.rows[rowIndex].cells[cellIndex - 1].focus();
      }
    } else if (e.keyCode == 38) {
      //方向上键
      if (rowIndex > firstRowIndex) {
        //如果不是第一行，则转到上一行
        tb.rows[rowIndex - 1].cells[cellIndex].focus();
      }
    } else if (e.keyCode == 39) {
      //方向右键
      if (cellIndex == lastCellIndex) {
        //如果是最后一个
        if (rowIndex < lastRowIndex) {
          //如果不是第最后一行则转到下一行第一个
          tb.rows[rowIndex + 1].cells[firstCellIndex].focus();
        }
      } else {
        //如果不是最后一个，则转到下一个
        tb.rows[rowIndex].cells[cellIndex + 1].focus();
      }
    } else if (e.keyCode == 40) {
      //方向下键
      if (rowIndex < lastRowIndex) {
        //如果不是最后一行，则转到下一行
        tb.rows[rowIndex + 1].cells[cellIndex].focus();
      }
    }
  }
}




