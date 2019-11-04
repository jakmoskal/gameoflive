import React, { useState, useEffect } from 'react';
import { Graphics } from 'pixi.js';
import { PixiComponent, Stage, useTick } from '@inlet/react-pixi';
import './App.css';

const Rectangle = PixiComponent('Rectangle', {
  create: props => new Graphics(),
  applyProps: (instance, _, props) => {
    const { x, y, val } = props;

    const fill = val ? '0xff6666' : '0x6666ff'

    instance.clear();
    instance.beginFill(fill);
    instance.drawRect(x+1, y+1, 8, 8);
    instance.endFill();
  },
});

const height = 100
const width = 100

let counter = 0

const getNeibour = (arr, i, j) => {
  const neibour = []

  if(i > 0) neibour.push(arr[i-1][j])
  if(i < arr.length - 1) neibour.push(arr[i+1][j])
  if(j > 0) neibour.push(arr[i][j-1])
  if(j < arr[i].length - 1) neibour.push(arr[i][j+1])

  return neibour
}

const calcArr = (arr) => {
  const newArr = new Array(height)
  for(let i = 0; i < arr.length; i++) {
    newArr[i] = new Array(width)

    for(let j = 0; j < arr[i].length; j++) {
      const neibour = getNeibour(arr, i, j).filter(el=>el)
      if(arr[i][j]) {
        if(neibour.length === 3 || neibour.length === 2) {
          newArr[i][j] = 1
        } else {
          newArr[i][j] = 0
        }
      } else if(neibour.length === 3) {
        newArr[i][j] = 1
      } else {
        newArr[i][j] = 0
      }

    }
  }
  return newArr
}

function App() {
  const [arr, setArr] = useState([])
  const [play, setPlay] = useState(false)

  useEffect(() => {
    const array = new Array(height)
    for(let i = 0; i < array.length; i++) {
      array[i] = new Array(width)

      for(let j = 0; j < array[i].length; j++) {
        array[i][j] = Math.floor((Math.random()*10))%2
      }
    }
    setArr(array)
  }, [])

  useTick((delta) => {
    if(counter > 30) {
      counter = 0
      play && setArr(calcArr(arr))
    } else {
      counter += delta
    }
  })

  console.log('a', arr)

  return (
    <div className="App">
      <Stage width={1500} height={800}>
        {
          arr.map((el, i) => {
            return el.map((e, j) => <Rectangle key={i+'-'+j} x={i*10} y={j*10} val={e} />)
          })
        }
      </Stage>
      <button onClick={() => setPlay(state => !state)}>Start</button>
    </div>
  );
}

export default App;
