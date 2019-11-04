import React, { useState, useEffect } from 'react';
import { Graphics } from 'pixi.js';
import { PixiComponent, Stage, useTick } from '@inlet/react-pixi';
import './App.css';

const Rectangle = PixiComponent('Rectangle', {
  create: props => new Graphics(),
  applyProps: (instance, _, props) => {
    const { x, y, val, onClick } = props;

    const fill = val ? '0xff6666' : '0x6666ff'

    instance.clear();
    instance.beginFill(fill);
    instance.drawRect(x+1, y+1, 9, 9);
    instance.endFill();
    instance.interactive = true;

    instance.click = onClick
  },
});

const height = 90
const width = 90

let counter = 0

const tmp = [
  [0,0,0,0,0],
  [0,0,0,0,0],
  [0,1,1,1,0],
  [0,0,0,0,0],
  [0,0,0,0,0],
]

const getNeibour = (arr, i, j) => {
  let neibourCount = 0

  if(arr[i-1]) {
    arr[i-1][j+1] && neibourCount++
    arr[i-1][j] && neibourCount++
    arr[i-1][j-1] && neibourCount++
  }

  if(arr[i+1]) {
    arr[i+1][j+1] && neibourCount++
    arr[i+1][j] && neibourCount++
    arr[i+1][j-1] && neibourCount++
  }

  arr[i][j-1] && neibourCount++
  arr[i][j+1] && neibourCount++

  return neibourCount
}

const calcArr = (arr) => {
  const newArr = new Array(height)
  for(let i = 0; i < arr.length; i++) {
    newArr[i] = new Array(width)

    for(let j = 0; j < arr[i].length; j++) {
      const neibour = getNeibour(arr, i, j)
      if(arr[i][j]) {
        if(neibour === 3 || neibour === 2) {
          newArr[i][j] = 1
        } else {
          newArr[i][j] = 0
        }
      } else if(neibour === 3) {
        newArr[i][j] = 1
      } else {
        newArr[i][j] = 0
      }

    }
  }
  return newArr
}

const generateArr = (generator) => {
  const array = new Array(height)
  for(let i = 0; i < array.length; i++) {
    array[i] = new Array(width)

    for(let j = 0; j < array[i].length; j++) {
      array[i][j] = generator()
        //Math.floor((Math.random()*10))%2
    }
  }
  return array
}

function App() {
  const [arr, setArr] = useState([])
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const array = generateArr(() => 0)
    setArr(array)
  }, [])


  useTick((delta) => {
    if(counter > 30) {
      counter = 0
      play && (() => {
        setArr(calcArr(arr))
        // setPlay(false)
      } )()
    } else {
      counter += delta
    }
  })

  const foo = (i, j) => {
    if(play) return
    arr[i][j] = arr[i][j] ? 0 : 1
    setArr([...arr])
  }

  const clear = () => {
    if(play) return
    const array = generateArr(() => 0)
    setArr(array)
  }

  const random = () => {
    if(play) return
    const array = generateArr(() => Math.floor((Math.random()*10))%2)
    setArr(array)
  }

  // console.log('a', arr)

  return (
    <div className="App">
      <Stage width={1000} height={1000}>
        {
          arr.map((el, i) => {
            return el.map((e, j) => <Rectangle onClick={() => foo(i, j)} key={i+'-'+j} x={j*10} y={i*10} val={e} />)
          })
        }
      </Stage>
      <button onClick={() => setPlay(state => !state)}>Start</button>
      <button onClick={() => clear()}>Clear</button>
      <button onClick={() => random()}>Random</button>
    </div>
  );
}

export default App;
