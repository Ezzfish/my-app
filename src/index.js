import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

//在项目文件夹下执行 npm start 命令，然后在浏览器访问 http://localhost:3000
//无序列表（Unordered List）中项目的顺序并不重要，就像购物列表。用一个 <ul> 元素包围。
//有序列表（Ordered List）中项目的顺序很重要，就像烹调指南。用一个 <ol> 元素包围。

/*class Square extends React.Component {
    render() {
      return (
            <button 
              className="square" 
              onClick={ () => this.props.onClick()}
            >
              {this.props.value}
            </button>
      );
    }
}
*/
//如果你想写的组件只包含一个 render 方法，并且不包含 state
//那么使用函数组件就会更简单
function Square(props) {
    return(
        <button className="square" onClick={props.onClick}>
         {props.value}
        </button>
    );
}

class Board extends React.Component {
    /*constructor(props){
        super(props)
        this.state={
            squares: Array(9).fill(null),
            xIsNext: true,
        }
    }
    */

    /*handleClick(i){
        const squares = this.state.squares.slice();
        if(calculateWinner(squares)||squares[i]){
            return
        }
        squares[i]= this.state.xIsNext ?'X':'O';
        this.setState({
            squares:squares,
            xIsNext: !this.state.xIsNext,
        })
    }
    */

    renderSquare(i) {
        return (
          <Square
            value={this.props.squares[i]} 
            onClick={()=> this.props.onClick(i)}
          />
        )        
    }
    //render 方法的返回值描述了你希望在屏幕上看到的内容
    render() {

        return (
            //语法 <div /> 会被编译成 React.createElement('div')
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {

    //在 React 应用中，数据通过 props 的传递，从父组件流向子组件
    constructor(props){
        super(props)
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                coordinate: '#',
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    handleClick(i) {
        /*slice() 方法提取某个字符串的一部分，
        并返回一个新的字符串，且不会改动原字符串
        slice() 提取的新字符串包括beginIndex但不包括 endIndex
        str.slice(beginIndex[, endIndex])
        */
        const history = this.state.history.slice(0, this.state.stepNumber 
      + 1)//提取当前步数之前的棋盘
        const current = history[history.length - 1]
        const squares = current.squares.slice()
        let coordinate = current.coordinate.slice()

        if (calculateWinner(squares) || squares[i]) {return}

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        switch(i){
            case 0: coordinate = ' (1.1)'; break
            case 1: coordinate = ' (2.1)'; break
            case 2: coordinate = ' (3.1)'; break
            case 3: coordinate = ' (1.2)'; break
            case 4: coordinate = ' (2.2)'; break
            case 5: coordinate = ' (3.2)'; break
            case 6: coordinate = ' (1.3)'; break
            case 7: coordinate = ' (2.3)'; break
            case 8: coordinate = ' (3.3)'; break
        }
        
        this.setState({
            history: history.concat([{
                squares: squares,
                coordinate: coordinate,
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        })
    }

    

    jumpTo(step){
        this.setState({
            stepNumber:step,
            xIsNext:(step % 2)===0
        })
    }

    render() {
        const history = this.state.history
        const current = history[this.state.stepNumber]
        const winner = calculateWinner(current.squares)
        /*map() 方法创建一个新数组，
        其结果是该数组中的每个元素都调用一次提供的函数后的返回值。
        const moves = history.map (function callback(step,move){})
        */
        const moves = history.map((step,move)=>{
            const desc = move ?
            'Go to move #' + move + history[move].coordinate:
            'Go to game start'; 
            return(
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner:' + winner;
        } else {
            status = 'Next player:' + (this.state.xIsNext ? 'X' : 'O');
        }  

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                      squares={current.squares}
                      onClick={(i) => this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    };
}

// ========================================
ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
}

/*
在游戏历史记录列表显示每一步棋的坐标，格式为(列号, 行号) 。
1）在每个history中记录这一步的coordinate，按钮的序号对应坐标。
2）在生成撤销按钮后输出每一个history的coordinate。

在历史记录列表中加粗显示当前选择的项目。
1）棋盘根据current = history[this.state.stepNumber]显示当前的squares数组

2）让当前stepNubmer的按钮显示的字符加粗

使用两个循环来渲染出棋盘的格子，而不是在代码里写死（hardcode）。

添加一个可以升序或降序显示历史记录的按钮。

每当有人获胜时，高亮显示连成一线的 3 颗棋子。

当无人获胜时，显示一个平局的消息。
*/